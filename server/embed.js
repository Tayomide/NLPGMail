// Gmail body sometimes contains html. Below module gets the text from html
const htp = require('html2plaintext');

// Function for splitting text into chunks with some overlap
const sliding_window = (text, chunkLength, overlap) => {
  // I splitted by words. Does anyone know how to split by token?
  const textList = text.replace(/\/[rs]/g, ' ').replace(/\s+/g, ' ').split(" ")
  const chunks = []

  let startIdx = overlap
  while(startIdx === overlap || startIdx < textList.length){
    startIdx -= overlap
    chunks.push(textList.slice(startIdx, startIdx + chunkLength).join(" "))
    startIdx += chunkLength
  }
  return chunks
}

// Main function
const embed = async (req, res) => {
  // Get parameters
  let { text, chunkLength, overlap } = req.body
  
  // Remove excess whitespace from text
  text = text.replace(/\s+/g, ' ')
  // Parse text
  text = htp(text);

  // Create chunks
  const chunks = sliding_window(text, chunkLength, overlap)

  let embeddings = []
  
  // Initialize transformer
  await import('@xenova/transformers').then(async ({ pipeline }) => {
    const generateEmbeddings = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );

    // Generate embedding for individual chunk
    for(const chunk of chunks){
      let embedding = await generateEmbeddings(chunk, {
        pooling: 'mean',
        normalize: true,
      });
      embedding = Object.values(embedding.data)
      embeddings.push(embedding)
    }
    
    // Return embeddings and parsed text
    res.json({ embeddings, text });
  }).catch(err => {
    res.status(500).json({"error": err})}
  )
};

module.exports = embed;