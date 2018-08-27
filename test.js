const fetch = require("node-fetch");
const url = "https://api.groupme.com/v3/bots/post"
const botID = process.env.BOT_ID;

const availableCommands = [
  "hello"
]




const postMessage = async (url, id, message) => {

  data = {
    'bot_id': id,
    'text' : message
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })

    if (response.ok) {
      console.log(`${response.status} ${response.statusText} : ${url}`);
      console.log(`Bot replied with message: ${message}`);
      return response.status;
      // try {
      //     const jsonResponse = await response.json();
      //     console.log(jsonResponse);
      //     return jsonResponse;
      // } catch (error) {
      //   console.log(`No JSON response from site: ${url}`);
      // }
    }
    throw new Error('Request Failed!');
  } catch (error) {
    console.log("Error: " + error);
  }

}


const checkIfCommand = async incoming => {
  try {
    let message = incoming.toLowerCase();
    if (message.charAt(0) === '/') {
      let command = message.substr(1, message.length);
      if (availableCommands.includes(command)) {
        console.log(`User issued \"${command}\" command`);
        return command;
      } else {
        console.log(`Command ${command} unavailable`);
        return false;
      }
    }
  } catch (error) {
    console.log("Must provide string to function");
    return -1;
  }
}


const genMessage =  async (command, user) => {
  //todo parse incoming text, to respond correctly
  let message;
  if (command === 'hello') {
    message = `Hello, ${user}!`;
  } else {
    message = `Command \"${command}\" not found, sorry ${user}`;
  }

  return message;
}

const respondFirst = () => {
  let request = JSON.parse(this.req.chunks[0]);
  if (request.sender_type === 'bot') {
    console.log("Ignoring bot message");
  } else {
    respond(request);
  }
}


const respond = async (serverMessage) => {
    let user = serverMessage.name;
    let text = serverMessage.text;
    console.log(`User: ${user}`);
    console.log(`Message: ${text}`);


    try {
      let command = await checkIfCommand(text);

      if (command) {
        var message = await genMessage(command, user);
      } else {
        var message = await genMessage(text, user);
      }

      console.log("Attempting to send message");
      let send = await postMessage(url, botID, message);
      if (send === 202) {
        console.log("reply successful");
      }
    } catch (error) {
      console.log(error);
    }
  }
}

exports.respond = respondFirst;
