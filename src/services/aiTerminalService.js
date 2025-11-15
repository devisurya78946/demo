/**
 * AI Terminal Service
 * Implements lightweight semantic matching using embeddings and cosine similarity
 * to match user queries to terminal command outputs
 */

/**
 * Simple text preprocessing
 */
function preprocessText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Generate a simple term frequency vector (bag of words)
 * This is a lightweight alternative to embeddings
 */
function generateVector(text) {
  const words = preprocessText(text).split(' ')
  const vector = {}
  
  words.forEach(word => {
    if (word.length > 2) { // ignore very short words
      vector[word] = (vector[word] || 0) + 1
    }
  })
  
  return vector
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vec1, vec2) {
  const allKeys = new Set([...Object.keys(vec1), ...Object.keys(vec2)])
  
  let dotProduct = 0
  let mag1 = 0
  let mag2 = 0
  
  allKeys.forEach(key => {
    const v1 = vec1[key] || 0
    const v2 = vec2[key] || 0
    dotProduct += v1 * v2
    mag1 += v1 * v1
    mag2 += v2 * v2
  })
  
  if (mag1 === 0 || mag2 === 0) return 0
  
  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2))
}

/**
 * Main AI query function
 * @param {string} userMessage - The user's input query
 * @param {object} commandOutputs - The available command outputs to match against
 * @returns {string} - The matched command output or warning message
 */
export async function runAIQuery(userMessage, commandOutputs) {
  const threshold = 0.55
  const warningMessage = "⚠️ This question is outside the scope of this system."
  
  // Generate vector for user query
  const queryVector = generateVector(userMessage)
  
  // Calculate similarity scores for all commands
  let bestMatch = null
  let bestScore = 0
  
  Object.entries(commandOutputs).forEach(([command, output]) => {
    const outputVector = generateVector(output)
    const score = cosineSimilarity(queryVector, outputVector)
    
    if (score > bestScore) {
      bestScore = score
      bestMatch = command
    }
  })
  
  // Check if best match exceeds threshold
  if (bestScore >= threshold && bestMatch) {
    return commandOutputs[bestMatch]
  }
  
  return warningMessage
}
