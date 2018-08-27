const fetch = require("node-fetch");

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
    logIncoming(error);
  }

};

const logIncoming = incoming => {
  console.log(incoming);
};

function respond() {
  logIncoming("Message recieved\nDetermining if bot should responsd");
  var request = JSON.parse(this.req.chunks[0]),
  botRegex = /^\/cool guy$/;

  logIncoming(request);

  if(request.text && botRegex.test(request.text)) {
    //postText(url, botID);
    logIncoming("Seinding Response");
  } else {
    console.log("don't care");
  }

}

exports.respond = respond;
exports.url = url;
