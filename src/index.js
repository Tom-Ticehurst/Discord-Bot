require("dotenv").config();

const discord = require("discord.js");
const fs = require("fs");
const mysql2 = require("mysql2/promise");

const client = new discord.Client();
client.commands = new discord.Collection();

const commandsPath = `${__dirname}/commands`;
const eventsPath = `${__dirname}/events`;

const commands = fs.readdirSync(commandsPath);
const events = fs.readdirSync(eventsPath);

const connection = mysql2.createPool({
  host: "localhost",
  user: "hydrogen-services",
  database: "hydrogen_services",
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

client.login(process.env.TOKEN)
  .then(async () => {
    commands.forEach(async (commandFile) => {
      let commandFileNoExtension = commandFile.split(".")[0];

      let [commandSelectionRows] = await connection.execute("SELECT pk FROM commands WHERE command=?", [commandFileNoExtension]);
      if (commandSelectionRows.length === 0) {
        await connection.execute("INSERT INTO commands VALUES(0,?,'[]',null,'[]',null,null,0)", [commandFileNoExtension]);
      }

      client.commands.set(commandFileNoExtension, require(`${commandsPath}/${commandFile}`));
    });

    let [commandSelectionRows] = await connection.execute("SELECT command FROM commands");
    commandSelectionRows.forEach(async (commandRow) => {
      let command = commandRow.command;
      if (!fs.existsSync(`${commandsPath}/${command}.js`)) {
        await connection.execute("DELETE FROM commands WHERE command=?", [command]);
      }
    });

    events.forEach((file) => {
      console.log(`Found event: ${file}`);

      client.on(file.split(".")[0], (...args) => {
        require(`${eventsPath}/${file}`)(...args, connection);
      });
    });

    let [statusRow] = await connection.execute("SELECT value FROM settings WHERE setting='status'");
    client.user.setActivity(`Your commands! -- ${statusRow[0].value}`, { type: "LISTENING" })
      .then((setTo) => {
        console.log(`Set activity for bot client to: ${setTo.activities[0].name}`);
      });

    let guildIds = client.guilds.cache.map((guild) => {
      return guild.id;
    });

    guildIds.forEach(async (guildId) => {
      let [guildSelectionRows] = await connection.execute("SELECT pk FROM guilds WHERE guild=?", [guildId]);

      if (guildSelectionRows.length === 0) {
        await connection.execute("INSERT INTO guilds VALUES(0,?,'{}','{}')", [guildId]);
      }
    });

    console.log(`Bot login - ${new Date(Date.now()).toTimeString()}`);

  });


