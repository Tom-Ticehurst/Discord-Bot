const { MessageEmbed } = require("discord.js");

class SuccessEmbed extends MessageEmbed {
  constructor() {
    super();

    this.color = "#00FF00";
    this.title = "Success!";

    this.setTitle = (title) => {
      this.title = `${this.title} | ${title}`;
    };
    this.setColor = () => { };
  }
}

module.exports = SuccessEmbed;