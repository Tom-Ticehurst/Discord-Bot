const axios = require("axios").default;

const ErrorEmbed = require(`${__dirname}/../classes/errorEmbed`);
const SuccessEmbed = require(`${__dirname}/../classes/successEmbed`);

module.exports = async (message, args) => {
  let gif;
  let embed = new SuccessEmbed();

  await axios.get(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_API_KEY}`).then((response) => {
    gif = response.data.data.image_url;
  }).catch((error) => {
    gif = "https://i.imgur.com/jKBOLjz.jpg";
    embed.addField("Reason for no image", error);
  });


  embed.setTitle("Here's a random gif");
  embed.setImage(gif);

  message.channel.send(embed);
}