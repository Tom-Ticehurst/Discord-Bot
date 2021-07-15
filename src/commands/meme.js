const axios = require("axios").default;

const ErrorEmbed = require(`${__dirname}/../classes/errorEmbed`);
const SuccessEmbed = require(`${__dirname}/../classes/successEmbed`);

module.exports = (message, args) => {
  axios.get("https://meme-api.herokuapp.com/gimme").then((response) => {
    let data = response.data;

    let embed = new SuccessEmbed();
    embed.setTitle(`Posted by: ${data.author}`);
    embed.setURL(data.postLink);

    embed.setImage(data.url || "https://i.imgur.com/jKBOLjz.jpg");

    message.channel.send(embed);
  }).catch((error) => {
    let embed = new ErrorEmbed();

    embed.addField("Error", error);

    message.channel.send(embed);
  });
};