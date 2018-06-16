//import google client library for NLP
const language = require('@google-cloud/language')

const client = new language.LanguageServiceClient()

module.exports = async function getSentimentFromText(text) {
  const document = {
    content: text,
    type: 'PLAIN_TEXT'
  }

  const results = await client.analyzeSentiment({document: document})
  const sentiment = results[0].documentSentiment

  return sentiment
}

//this works if you only have function to export
// module.exports
