const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let db;
(async () => {
  db = await open({
    filename: 'db/database.db',
    driver: sqlite3.Database
  })
})();

const queryDb = (table, data = null, columns = null, values = null) => {
  const getManyRows = async() => {
    const result = await db.all(`SELECT ${columns || '*'} FROM ${table} ${data ? 'WHERE ' + data :''}`)
      .then((res) => res)
      .catch((err) => err);
    return result;
  };

  const getOneRow = async() => {
    const result = await db.get(`SELECT ${columns || '*'} FROM ${table} ${data ? 'WHERE ' + data :''}`)
      .then((res) => res)
      .catch((err) => err);
    return result;
  };

  const setOneRow = async() => {
    const result = await db.run(`INSERT INTO ${table} (${columns}) VALUES (${data}) `)
    return result;
  };

  const updateOneRow = async() => {
    let updateString = '';
    for (let c = 0; c < columns.length; c ++) {
      updateString += columns[c] + ' = "' + values[c] + '"';
      if (c < columns.length - 1) updateString += ',';
    }
    const result = await db.run(`UPDATE ${table} SET ${updateString} WHERE ${data} `)
      .then((res) => res)
      .catch((err) => err);
    return result;
  };

  queryDb.getManyRows = getManyRows;
  queryDb.getOneRow = getOneRow;
  queryDb.setOneRow = setOneRow;
  queryDb.updateOneRow = updateOneRow;
};

module.exports = queryDb;