module.exports = async (guild, connection) => {
  let [rows] = await connection.execute(`SELECT pk FROM guilds WHERE guild=${guild.id}`);

  if (rows.length === 0) {
    await connection.execute(`INSERT INTO guilds VALUES(0,${guild.id},"{}","{}")`);
  }
};