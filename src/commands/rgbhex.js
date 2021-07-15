const rgbhex = require("rgb-hex");

const ErrorEmbed = require(`${__dirname}/../classes/errorEmbed`);
const SuccessEmbed = require(`${__dirname}/../classes/successEmbed`);

module.exports = (message, args) => {
  let rgbValue = args.join("").split(",").map((value) => {
    if (value < 0) return 0;
    else return value;
  });

  if (!rgbValue || rgbValue.length < 3 || rgbValue.length > 3) {
    let embed = new ErrorEmbed();
    embed.addField("No valid RGB value", "Please enter a valid rgb value");

    return message.channel.send(embed);
  } else {
    rgbValue = rgbValue.join(",");
  }

  let result;
  try {
    result = rgbhex(rgbValue);
  } catch {
    let embed = new ErrorEmbed();
    embed.addField("No valid RGB value", `${rgbValue} is not a valid RGB value`);

    return message.channel.send(embed);
  }

  let embed = new SuccessEmbed();
  embed.setTitle(`Conversion of: ${rgbValue}`);
  embed.setColor("#00FF00");

  embed.addFields([
    { name: "RGB Value", value: rgbValue },
    { name: "Hex Value", value: result.toUpperCase() }
  ]);

  message.channel.send(embed);
};