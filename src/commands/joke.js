const axios = require("axios").default;

const ErrorEmbed = require(`${__dirname}/../classes/errorEmbed`);
const SuccessEmbed = require(`${__dirname}/../classes/successEmbed`);

module.exports = (message, args) => {
  axios.get("https://official-joke-api.appspot.com/jokes/random").then((response) => {
    let data = response.data;

    let embed = new SuccessEmbed();
    embed.setTitle("Here's a random joke");

    embed.addField("Joke", `${data.setup}\n\n${data.punchline}`);

    message.channel.send(embed);
  }).catch((error) => {
    let embed = new ErrorEmbed();

    embed.addField("Error", error);

    message.channel.send(embed);
  });
};