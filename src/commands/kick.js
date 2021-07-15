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
  embed.setTitle("User kicked!");

  if (!args[0]) {
    return message.channel.send(makeError());
  }

  let member = await getMember(message, args[0]);

  let modifiedArgs = args;
  modifiedArgs.shift();

  let kickReason = modifiedArgs.join(" ");

  member
    .kick({ reason: kickReason || "No reason given" })
    .then((user) => {
      embed.addFields([
        { name: "User kicked", value: `${user.user.username}#${user.user.discriminator}` },
        { name: "Kicked by", value: `${message.author.username}#${message.author.discriminator}` },
        { name: "Kick reason", value: kickReason || "No reason given" }
      ]);
      message.channel.send(embed)
    }).catch((e) => {
      if (e instanceof DiscordAPIError) {
        return message.channel.send(makeError());
      } else {
        console.log(`Error occurred in kick command:\n${e.stack}`);
      }
    });
}