const axios = require("axios").default;
const { titleCase } = require("title-case");

const ErrorEmbed = require(`${__dirname}/../classes/errorEmbed`);
const SuccessEmbed = require(`${__dirname}/../classes/successEmbed`);

module.exports = (message, args) => {
  let category = args[0];
  args.shift();
  let search = args.join(" ");

  if (!category || !search) {
    let embed = new ErrorEmbed();

    embed.addField("Missing arguments", `You are missing: ${!category ? "`Category`" : ""} ${!search ? "`Search`" : ""}`);

    message.channel.send(embed);
  } else {
    axios.get(`https://swapi.dev/api/${category}/?search=${search}`).then((response) => {
      let data = response.data;
      let embed = new SuccessEmbed();

      if (data.count <= 0) {
        embed = new ErrorEmbed();
        embed.addField("No results", `There were no results for "${search}" in "${category}"`);
      } else if (data.count === 1) {
        let result = data.results[0];
        embed.setTitle(`${result.name} Information`);

        Object.keys(result).forEach((key) => {
          if (typeof (result[key]) === "string") {
            embed.addField(titleCase(key.replace(/_/g, " ")), titleCase(result[key]), true);
          }
        });
      } else {
        embed.addField("Amount", `Your search of "${search}" had ${data.count} results`);

        if (data.count <= 24) {
          data.results.forEach((result, index) => {
            console.log(result, index);
            embed.addField(`Result ${index}`, result.name || result.title, true)
          });
        }
      }

      message.channel.send(embed);
    }).catch((error) => {
      let embed = new ErrorEmbed();
      embed.setTitle("Check your arguments");

      embed.addField(error, `Category: "${category}"\nSearch: "${search}"`);

      message.channel.send(embed);
    });
  }
}