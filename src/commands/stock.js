const yahooFinance = require("yahoo-finance2").default;

const SuccessEmbed = require(`${__dirname}/../classes/successEmbed`);
const ErrorEmbed = require(`${__dirname}/../classes/errorEmbed`);

async function checkStock(stock) {
  let results;
  try {
    results = await yahooFinance.quoteSummary(stock);
  } catch {
    return false;
  }

  if (results.summaryDetail && results.price) {
    return results;
  } else {
    return false;
  }
}

module.exports = async (message, args) => {
  let chosenStock = args[0];
  if (!chosenStock) {
    let embed = new ErrorEmbed();

    embed.addField("Invalid stock", `${chosenStock ? `${chosenStock} is not a valid stock symbol` : "Please provide a stock symbol"}`);
    return message.channel.send(embed);
  } else {
    chosenStock = chosenStock.toUpperCase();
  }


  let results = await checkStock(chosenStock);

  if (results) {
    let embed = new SuccessEmbed();
    embed.setTitle(`Stats for stock symbol ${chosenStock}`);

    embed.addFields([
      { name: `${chosenStock} Day High`, value: results.summaryDetail.dayHigh, inline: true },
      { name: `${chosenStock} Day Low`, value: results.summaryDetail.dayLow, inline: true },
      { name: `${chosenStock} Current Price`, value: results.price.regularMarketPrice },
      { name: `${chosenStock} Currency`, value: `${results.price.currency} (${results.price.currencySymbol})` }
    ]);


    message.channel.send(embed);
  } else {
    let embed = new ErrorEmbed();

    embed.addField("Invalid stock", `${chosenStock} does not exist`);
    return message.channel.send(embed);
  }

};