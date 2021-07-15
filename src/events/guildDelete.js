module.exports = (guild, connection) => {
  let [rows] = await connection.execute(`SELECT pk FROM hydrogen_services.guilds WHERE guild=${guild.id}`);

  if (rows.length >= 1) {
    await connection.execute(`DELETE FROM hydrogen_services.guilds WHERE GUILD=${guild.id}`);
  }
};