const axios = require("axios").default;

const ErrorEmbed = require(`${__dirname}/../classes/errorEmbed`);
const SuccessEmbed = require(`${__dirname}/../classes/successEmbed`);

module.exports = (message, args) => {
  let question = args.join(" ");
  if (!question) {
    let embed = new ErrorEmbed();

    embed.addField("Error", "You must provide a question!");

    return message.channel.send(embed);
  }
  axios.get("https://api.monkedev.com/fun/8ball").then((response) => {
    let embed = new SuccessEmbed();

    embed.addFields([
      { name: "Question", value: question, inline: true },
      { name: "Response", value: response.data.answer, inline: true }
    ]);

    message.channel.send(embed);
  }).catch((error) => {
    let embed = new ErrorEmbed();

    embed.addField("Error", error);

    message.channel.send(embed);
  });
};