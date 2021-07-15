const { DiscordAPIError } = require("discord.js");

const getMember = require(`${__dirname}/../functions/getMember`);
const ErrorEmbed = require(`${__dirname}/../classes/errorEmbed`);
const SuccessEmbed = require(`${__dirname}/../classes/successEmbed`);


function makeError() {
  let embed = new ErrorEmbed();
  embed.addField("Error", "User does not exist or bot is missing permissions");

  return embed;
}


module.exports = async (message, args) => {
  let embed = new SuccessEmbed();

  embed.setColor("#00FF00");
  embed.setTitle("User banned!");

  if (!args[0]) {
    return message.channel.send(makeError());
  }

  let member = await getMember(message, args[0]);

  let modifiedArgs = args;
  modifiedArgs.shift();

  let muteReason = modifiedArgs.join(" ");
};