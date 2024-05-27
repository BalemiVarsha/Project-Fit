const {uploadToS3,retrieveFromS3}=require('../middlewares/aws_s3')
const PDFParser = require('pdf-parse');
const fs = require('fs');


// Function to calculate cosine similarity between two text documents
function cosineSimilarity(textA, textB) {
  // Tokenize the text into words
  const wordsA = textA.toLowerCase().match(/\b\w+\b/g);
  const wordsB = textB.toLowerCase().match(/\b\w+\b/g);
  // Count term frequencies
  const tfA = calculateTermFrequency(wordsA);
  const tfB = calculateTermFrequency(wordsB);
  // Calculate dot product
  let dotProduct = 0;
  for (const term in tfA) {
    if (term in tfB) {
      dotProduct += tfA[term] * tfB[term];
    }
  }
  // Calculate magnitudes
  const magnitudeA = calculateMagnitude(tfA);
  const magnitudeB = calculateMagnitude(tfB);
  // Calculate cosine similarity
  const similarity = dotProduct / (magnitudeA * magnitudeB);
  return similarity;
}

// Function to calculate term frequency
function calculateTermFrequency(words) {
  const termFrequency = {};
  const totalWords = words.length;
  for (const word of words) {
    termFrequency[word] = (termFrequency[word] || 0) + (1 / totalWords);
  }
  return termFrequency;
}

// Function to calculate magnitude of term frequency
function calculateMagnitude(termFrequency) {
  let sumOfSquares = 0;
  for (const term in termFrequency) {
    sumOfSquares += Math.pow(termFrequency[term], 2);
  }
  return Math.sqrt(sumOfSquares);
}

// Function to calculate similarity score using cosine similarity
async function euclideanDistance(pdfContent1, pdfContent2) {
  // const textA= await retrieveFromS3(projectId);
  // console.log(textA);
 const textA = fs.readFileSync(pdfContent1, 'utf-8');
 const textB = fs.readFileSync(pdfContent2, 'utf-8');
  const similarity = cosineSimilarity(textA, textB);
  const euclideanDistance = Math.sqrt(2 * (1 - similarity));
  // Convert Euclidean distance to similarity percentage
  const similarityPercentage = ((1 - euclideanDistance) * 100).toFixed(2);
  return similarityPercentage;
}

module.exports = { euclideanDistance };



// const PDFParser = require('pdf-parse');
// const fs = require('fs');
// const natural = require('natural');

// // Create a tokenizer and stemmer
// const tokenizer = new natural.WordTokenizer();
// const stemmer = natural.PorterStemmer;

// // Function to preprocess text
// function preprocess(text) {
//   // Tokenize the text into words
//   const words = tokenizer.tokenize(text.toLowerCase());
//   // Remove stop words
//   const stopWords = new Set(['the', 'and', 'of', 'a', 'in', 'to', 'is', 'that', 'it', 'on', 'for', 'with', 'as']);
//   const filteredWords = words.filter(word => !stopWords.has(word));
//   // Stem the words
//   const stemmedWords = filteredWords.map(word => stemmer.stem(word));
//   // Join the words back into a single string
//   return stemmedWords.join(' ');
// }

// // Function to calculate similarity percentage using Euclidean distance
// async function euclideanDistance(pdfContent1, pdfContent2) {
//   // Read the contents of the PDF files
//   const textA = preprocess(fs.readFileSync(pdfContent1, 'utf-8'));
//   const textB = preprocess(fs.readFileSync(pdfContent2, 'utf-8'));

//   // Calculate Euclidean distance between preprocessed texts
//   const distance = euclidean(textA, textB);

//   // Convert Euclidean distance to similarity percentage
//   const similarityPercentage = (1 / (1 + distance)) * 100;
//   return similarityPercentage.toFixed(2); // Round to 2 decimal places
// }

// // Function to calculate Euclidean distance between two vectors
// function euclidean(vec1, vec2) {
//   let sumSquaredDiff = 0;
//   const vec1Words = vec1.split(' ');
//   const vec2Words = vec2.split(' ');

//   // Create a set of all unique words
//   const allWords = new Set([...vec1Words, ...vec2Words]);

//   // Calculate squared differences for each word
//   for (const word of allWords) {
//     const countVec1 = vec1Words.filter(w => w === word).length;
//     const countVec2 = vec2Words.filter(w => w === word).length;
//     sumSquaredDiff += Math.pow(countVec1 - countVec2, 2);
//   }

//   // Calculate the Euclidean distance
//   return Math.sqrt(sumSquaredDiff);
// }

// module.exports = { euclideanDistance };

//try 2


// Function to calculate similarity score using cosine similarity

// async function euclideanDistance(projectId, employeeResumePath) {
//   try {
//     // Retrieve PDF content from AWS S3
//     const projectFileContent = await retrieveFromS3(projectId);
//     const employeeFileContent = await retrieveFromS3(employeeResumePath);

//     // Calculate cosine similarity
//     const similarity = cosineSimilarity(projectFileContent, employeeFileContent);
//     const euclideanDistance = Math.sqrt(2 * (1 - similarity));

//     // Convert Euclidean distance to similarity percentage
//     const similarityPercentage = ((1 - euclideanDistance) * 100).toFixed(2);
//     return similarityPercentage;
//   } catch (error) {
//     console.error('Error calculating similarity score:', error);
//     throw error;
//   }
// }

// module.exports = { euclideanDistance };



























































































