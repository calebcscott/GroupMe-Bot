const fetch = require("node-fetch");

const url = "https://api.groupme.com/v3/bots/post"
var botID = process.env.BOT_ID;

const postText = async (url, id) => {
  try {
    data = {
      'bot_id': id,
      'text' : "Sameple text"
    };

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });

    const json = await response.json();
    console.log(json)

}catch (error) {
    console.log(error);
  }

};

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
  botRegex = /^\/cool guy$/;

  if(request.text && botRegex.test(request.text)) {
    postText(url, botID);
  } else {
    console.log("don't care");
  }

}

exports.respond = respond;
