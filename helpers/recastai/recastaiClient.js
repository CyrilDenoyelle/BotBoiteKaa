var recastai = require('recastai').default
var client = new recastai(process.env.RECAST_AI);


const replyMessage = message => {
  // Get text from message received
  const text = message.content
  console.log('I receive: ', text)

  return client.request.analyseText(text)
    .then(nlp => {
      let reply = 'I\'m sorry but I don\'t understand what you are talking about.'
      const intent = nlp.intent()

      if (intent) {
        reply = `I understand that you talk about ${intent.slug}.`
      }

      message.addReply({ type: 'text', content: reply })

      return message.reply().then(p => p.body)
    })
}

const reply = (request, response) => {
  return client.connect.handleMessage(request, response, replyMessage)
}

const talk = (text) => {

  const request = new recastai.request(process.env.RECAST_AI, 'en')
  request.analyseText(text)
    .then(function (res) {
      console.log(res.raw);
    });
}

module.exports = {
  reply,
  talk
}
