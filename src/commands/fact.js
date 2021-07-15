const axios = require("axios").default;

const ErrorEmbed = require(`${__dirname}/../classes/errorEmbed`);
const SuccessEmbed = require(`${__dirname}/../classes/successEmbed`);

module.exports = (message, args) => {
  axios.get("https://useless-facts.sameerkumar.website/api").then((response) => {
    let embed = new SuccessEmbed();

    embed.setTitle("Random useless fact");

    embed.addField("Fact", response.data.data);

    message.channel.send(embed);
  }).catch((error) => {
    let embed = new ErrorEmbed();

    embed.addField("Error", error);

    message.channel.send(embed);
  });
};