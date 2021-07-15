const SuccessEmbed = require(`${__dirname}/../classes/successEmbed`);
const ErrorEmbed = require(`${__dirname}/../classes/errorEmbed`);

const { DiscordAPIError } = require("discord.js");

const deathReasons = [
  "Fell out of the world",
  "Shot with a bow",
  "Pummelled by a karen 👱🏽‍♀️",
  "Drowned",
  "Blew up",
  "Hit the ground when skydiving",
  "Forgot to use their parachute while skydiving",
  "Was hit by a chair",
  "Fell off a ladder",
  "Fell off some vines",
  "Fell off scaffolding",
  "Fell while climbing a tree",
  "Fell while climbing a mountain"
];

function makeError() {
  let embed = new ErrorEmbed();
  embed.addField("No user to kill", "Please provide a valid user id of who you would like to kill");

  return embed;
}

module.exports = async (message, args) => {
  if (!args[0]) {
    return message.channel.send(makeError());
  }

  let member;
  try {
    member = await message.guild.members.fetch(args[0]);
  } catch (e) {
    // eslint-disable-next-line no-undef
    if (e instanceof DiscordAPIError) {
      return message.channel.send(makeError());
    }
  }
  if (member === undefined) {
    return message.channel.send(makeError());
  }

  let embed = new SuccessEmbed();

  embed.addFields([
    { name: "User killed", value: `${member.user.username}#${member.user.discriminator}` },
    { name: "Killed by", value: `${message.author.username}#${message.author.discriminator}` },
    { name: "Death reason", value: deathReasons[Math.floor(Math.random() * deathReasons.length)] }
  ]);

  message.channel.send(embed);

};