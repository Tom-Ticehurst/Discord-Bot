const { MessageEmbed } = require("discord.js");

class ErrorEmbed extends MessageEmbed {
  constructor() {
    super();

    this.color = "#FF0000";
    this.title = "Error!";

    this.setTitle = (title) => {
      this.title = `${this.title} | ${title}`;
    };
    this.setColor = () => { };
  }
}

module.exports = ErrorEmbed;