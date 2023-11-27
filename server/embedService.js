let generateEmbeddings;

async function initialize() {
  try {
    const { pipeline } = await import('@xenova/transformers');
    generateEmbeddings = await pipeline(
      'feature-extraction',
      'Xenova/all-mpnet-base-v2'
    );
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  initialize,
  async generateEmbeddingsWrapper() {
    // Ensure generateEmbeddings is initialized before using it
    if (!generateEmbeddings) {
      await initialize();
    }
    return generateEmbeddings;
  }
};