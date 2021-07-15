const ErrorEmbed = require(`${__dirname}/../classes/errorEmbed`);

function makeError() {
  let embed = new ErrorEmbed();
  embed.addField("Error", "User does not exist or bot is missing permissions");

  return embed;
}

module.exports = async (message, id) => {
  let member;
  try {
    member = await message.guild.members.fetch(id);
  } catch (e) {
    if (e instanceof DiscordAPIError) {
      return message.channel.send(makeError());
    }
  }
  if (member === undefined) {
    return message.channel.send(makeError());
  }


  return member;
}