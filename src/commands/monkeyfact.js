const axios = require("axios").default;

const ErrorEmbed = require(`${__dirname}/../classes/errorEmbed`);
const SuccessEmbed = require(`${__dirname}/../classes/successEmbed`);

module.exports = async (message, args) => {
  let monkeyImage;

  await axios.get("https://api.monkedev.com/attachments/monkey").then((response) => {
    monkeyImage = response.data.url;
  }).catch(() => {
    monkeyImage = "https://i.imgur.com/jKBOLjz.jpg";
  });

  axios.get("https://api.monkedev.com/facts/monkey").then((response) => {
    let embed = new SuccessEmbed();
    embed.setTitle("Here's a monkey fact");
    embed.setImage(monkeyImage);
    embed.setThumbnail(monkeyImage);

    embed.addField("Fact", response.data.fact);

    message.channel.send(embed);
  }).catch((error) => {
    let embed = new ErrorEmbed();

    embed.addField("Error", error);

    message.channel.send(embed);
  });
}