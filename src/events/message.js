const ErrorEmbed = require(`${__dirname}/../classes/errorEmbed`);
const SuccessEmbed = require(`${__dirname}/../classes/successEmbed`);
const LogEmbed = require(`${__dirname}/../classes/logEmbed`);

async function runCommand(savedCommand, message, args, command, connection) {
  try {
    await savedCommand(message, args, connection);
  } catch (error) {
    let [commandSelectionRows] = await connection.execute(`SELECT command FROM commands WHERE JSON_CONTAINS(aliases,'"${command}"')`);
    let commandReal;

    if (commandSelectionRows.length === 0) {
      commandReal = command;
    } else {
      commandReal = commandSelectionRows[0].command
    }

    let embed = new ErrorEmbed();

    embed.setTitle("Please contact shnopy#2525 and send a picture of this message");

    embed.addFields([
      { name: "Error type", value: error.name, inline: true },
      { name: "Error message", value: error.message, inline: true },
      { name: "Error origin", value: commandReal }
    ]);

    message.channel.send(embed);
    message.client.users.cache.get("158556326371262464").send(error.stack);
  }
}

module.exports = async (message, connection) => {
  let [prefixSelectionRows] = await connection.execute("SELECT value FROM settings WHERE setting='prefix'");
  let prefix = prefixSelectionRows[0].value;

  if (message.channel.type !== "dm" && !message.author.bot) {
    if (message.content.toLowerCase().includes("battered")) {
      message.reply("https://tenor.com/view/batter-cooking-mixing-blending-milk-gif-15382191");
      return;
    }

    if (message.content.startsWith(prefix)) {
      let args = message.content.slice(prefix.length).split(/\s/g);
      let command = args.shift().toLowerCase();
      let commandReal;

      let [commandSelectionRows] = await connection.execute(`SELECT command FROM commands WHERE JSON_CONTAINS(aliases,'"${command}"')`);

      if (commandSelectionRows.length === 0) {
        commandReal = command;
      } else {
        commandReal = commandSelectionRows[0].command
      }

      let savedCommand = message.client.commands.get(commandReal);

      if (savedCommand) {
        let [commandSelectionRows] = await connection.execute(`SELECT * FROM commands WHERE command='${commandReal}'`);
        let commandInfo = commandSelectionRows[0];

        if (message.member.hasPermission(JSON.parse(commandInfo.permissions), { checkAdmin: false, checkOwner: true }) && (commandInfo.userlock === message.author.id || commandInfo.userlock === null)) {
          await runCommand(savedCommand, message, args, command, connection);

          if (commandInfo.log) {
            let embed = new LogEmbed();

            embed.addFields([
              { name: "Command", value: `${prefix}${commandReal}`, inline: true },
              { name: "Run by", value: `${message.author.username}#${message.author.discriminator}`, inline: true },
              { name: "Run at", value: new Date(Date.now()).toTimeString() }
            ]);

            let logsChannel = message.guild.channels.cache.find(channel => channel.name.toLowerCase() === "logs");

            if (!logsChannel) {
              message.guild.channels.create("logs", { reason: `${message.client.user.username} required a log channel` })
                .then((channel) => {
                  console.log(`Created logs channel in ${message.guild.id}`);

                  channel.send(embed);
                });
            } else {
              logsChannel.send(embed).catch(() => {
                let embed = new ErrorEmbed();

                embed.addField("Can't log 🤔", "An error occurred when attempting to post a command log\n\nDo I have permission?");

                return message.channel.send(embed);
              });
            }
          }
        } else {
          let embed = new ErrorEmbed();

          embed.addField("No permissions", `You lack permissions to run ${prefix}${commandReal}`);
          message.channel.send(embed);
        }
      } else {
        let embed = new ErrorEmbed();

        embed.addField("Unknown command", `${prefix}${command} is not a valid command`);
        message.channel.send(embed);
      }
    }
  }
};