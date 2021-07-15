const { titleCase } = require("title-case");
const fs = require("fs");

const ErrorEmbed = require(`${__dirname}/../classes/errorEmbed`);
const SuccessEmbed = require(`${__dirname}/../classes/successEmbed`);

const commandDirectory = fs.readdirSync(__dirname);
const separator = ", ";

module.exports = async (message, args, connection) => {
  let embed = new SuccessEmbed();

  embed.setTitle("Help command");

  if (!args[0]) {
    let commands = commandDirectory.map((command) => {
      return titleCase(command.split(".").shift());
    });

    if (commands.length <= 25) {
      for (let index in commands) {
        let command = commands[index];
        let [aliasSelectionRows] = await connection.execute("SELECT aliases FROM hydrogen_services.commands WHERE command=?", [command.toLowerCase()]);
        embed.addField(command, JSON.parse(aliasSelectionRows[0].aliases).join(separator) || "No aliases");
      }
    }
  } else {
    let [commandSelectionRows] = await connection.execute("SELECT command FROM commands WHERE JSON_CONTAINS(aliases,JSON_QUOTE(?))", [args[0].toLowerCase()]);
    let commandReal;

    if (commandSelectionRows.length === 0) {
      commandReal = args[0];
    } else {
      commandReal = commandSelectionRows[0].command;
    }

    if (!fs.existsSync(`${__dirname}/${commandReal}.js`)) {
      let embed = new ErrorEmbed();
      embed.addField("Unknown command", `${commandReal} is not a valid command`);

      return message.channel.send(embed);
    }

    embed.setTitle(`Help command for ${titleCase(commandReal)}`);
    embed.setFooter("<...> = Required || [...] = Optional");

    let [prefixSelectionRows] = await connection.execute("SELECT value FROM hydrogen_services.settings WHERE setting='prefix'");
    let [commandRealSelectionRows] = await connection.execute("SELECT * FROM hydrogen_services.commands WHERE command=?", [commandReal]);

    let usage = "No usage information";
    if (commandRealSelectionRows[0].usage) {
      usage = `\`${prefixSelectionRows[0].value}${commandReal} ${commandRealSelectionRows[0].usage}\``;
    }

    embed.addFields([
      { name: `${titleCase(commandReal)} Command aliases`, value: JSON.parse(commandRealSelectionRows[0].aliases).join(separator) || "No aliases" },
      { name: `${titleCase(commandReal)} Command description`, value: commandRealSelectionRows[0].description || "No description provided" },
      { name: `${titleCase(commandReal)} Command usage`, value: usage }
    ]);

  }

  message.channel.send(embed);
};

