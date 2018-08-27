const fetch = require("node-fetch");

//url to post to groupme does not change, hence the use of const
const url = "https://api.groupme.com/v3/bots/post"

//bot ID stored in environment variable on heroku app
const botID = process.env.BOT_ID;


//list of available commands that can be handled
const availableCommands = [
  "hello"
]

const listCommands = async() => {
  let message = "Possible commands:\n" + availableCommands.join("\n");
  postMessage(url, botID, message);
}

const postMessage = async (url, id, message) => {
  //setting up data block for id, and message to give to server
  data = {
    'bot_id': id,
    'text' : message
  };

  //setting up try catch for async fetch
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })

    if (response.ok) {
      console.log(`${response.status} ${response.statusText} : ${url}`);
      console.log(`Bot replied with message: ${message}`);
      return response.status;
    }
    //if no response from server throw Error
    throw new Error('Request Failed!');
  } catch (error) {
    console.log("Error: " + error);
  }

}


const checkIfCommand = async incoming => {
  //determine if user text is viable command and if
  //command is in availableCommands list
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
  //reads command, then returns message to be used for postMessage funciton
  let message;
  if (command === 'hello') {
    message = `Hello, ${user}!`;
  } else {
    message = `Command \"${command}\" not found, sorry ${user}`;
    listCommands();
  }

  return message;
}

function respondFirst() {
  //initilize request by parsing to JSON
  //if last message was bot: ignore user: reply in some fashion
  var request = JSON.parse(this.req.chunks[0]);
  if (request.sender_type === 'bot') {
    console.log("Ignoring bot message");
  } else {
    respond(request);
  }
}


const respond = async (serverMessage) => {
    //JSON request passed to funciton then relevant information stored in variables
    let user = serverMessage.name;
    let text = serverMessage.text;
    console.log(`User: ${user}`);
    console.log(`Message: ${text}`);


    try {
      //cannot run postMessage funciton until all async functions finish
      let command = await checkIfCommand(text);

      //if block to handle if command function successful or not
      //if user entered command incorrectly just pass their input to genMessage function
      if (command) {
        var message = await genMessage(command, user);
      } else {
        var message = await genMessage(text, user);
      }

      console.log("Attempting to send message");
      let send = await postMessage(url, botID, message);
      //determine if reply successful
      if (send === 202) {
        console.log("reply successful");
      }
    } catch (error) {
      console.log(error);
    }
  }


//exporting respondFirst function which activates respond function
exports.respondFirst = respondFirst;
