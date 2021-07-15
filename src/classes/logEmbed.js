const { MessageEmbed } = require("discord.js");

class LogEmbed extends MessageEmbed {
  constructor() {
    super();

    this.color = "#0394fc";
    this.title = "Command log!";

    this.setTitle = (title) => {
      this.title = `${this.title} | ${title}`;
    };
    this.setColor = () => { };
  }
}

module.exports = LogEmbed;