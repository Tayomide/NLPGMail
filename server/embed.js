// Gmail body sometimes contains html. Below module gets the text from html
const htp = require('html2plaintext');
const { initialize, generateEmbeddingsWrapper } = require("./embedService")
let generateEmbeddings;

// Function for splitting text into chunks with some overlap
const sliding_window = (text, chunkLength = 250, overlap = 10) => {
  // I splitted by words. Does anyone know how to split by token?
  const textList = text.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').split(" ");
  const chunks = [];

  let startIdx = overlap;
  while(startIdx === overlap || startIdx < textList.length){
    startIdx -= overlap;
    chunks.push(textList.slice(startIdx, startIdx + chunkLength).join(" "));
    startIdx += chunkLength;
  }
  return chunks;
}

// Main function
const embed = async (req, res) => {
  if(!generateEmbeddings) {
    await initialize();
  }
  generateEmbeddings = await generateEmbeddingsWrapper()
  // Get parameters
  let { text, chunkLength, overlap } = req.body;
  
  // Remove excess whitespace from text
  // Parse text
  text = htp(text);

  // Create chunks
  const chunks = sliding_window(text, chunkLength, overlap);

  let embeddings = [];

  // Generate embedding for individual chunk
  for(const chunk of chunks){
    let embedding = await generateEmbeddings(chunk, {
      pooling: 'mean',
      normalize: true,
    });
    embedding = Object.values(embedding.data);
    embeddings.push(embedding);
  }
  
  // Return embeddings and parsed text
  res.json({ embeddings, text });
};

module.exports = embed;