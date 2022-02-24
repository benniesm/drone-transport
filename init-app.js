const fs = require('fs');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

console.log('Database will now reset...');
fs.unlink('db/database.db', async(err) => {
  console.log('Done.\n');
  await setDatabase();
});

const setDatabase = async () => {
  console.log('Preloading required data...');
  const db = await open({
    filename: 'db/database.db',
    driver: sqlite3.Database
  })
  .then(async(res) => {
    // Create tables
    await res.exec('CREATE TABLE IF NOT EXISTS drones ( `serialNumber` VARCHAR(100) NOT NULL , `model` TEXT NOT NULL , `weightLimit` INT NOT NULL , `batteryCapacity` INT NOT NULL , `state` TEXT NOT NULL , UNIQUE (`serialNumber`) )');
    await res.exec('CREATE TABLE IF NOT EXISTS medications ( `code` VARCHAR(100) NOT NULL , `name` TEXT NOT NULL , `weight` INT NOT NULL , `imageUrl` VARCHAR(100) NOT NULL , UNIQUE (`code`) )');
    await res.exec('CREATE TABLE IF NOT EXISTS loadInformation ( `droneSerial` VARCHAR(100) NOT NULL , `medCode` VARCHAR(100) NOT NULL , `units` INT NOT NULL , `medWeight` INT NOT NULL )');
    
    // Populate tables with sample data
    await res.exec(`
      INSERT INTO drones (serialNumber, model, weightLimit, batteryCapacity, state)
      VALUES
        ("10001", "BA-1 PRO", 500, 100, "IDLE"),
        ("10002", "BA-1 PRO", 500, 99, "IDLE"),
        ("10003", "BA-1 PRO", 500, 25, "IDLE"),
        ("10004", "BA-1 PRO", 500, 48, "IDLE"),
        ("10005", "BA-X 9090", 500, 100, "IDLE"),
        ("10006", "BA-X 9090", 500, 56, "IDLE"),
        ("10007", "BA-X 9090", 500, 80, "IDLE"),
        ("10008", "BA-X 9090", 500, 32, "IDLE"),
        ("10009", "ALIEN-DRONE #00@2716--Z*", 500, 23, "IDLE"),
        ("10010", "ALIEN-DRONE #00@555D*", 500, 100, "IDLE")
    `);

    await res.exec(`
      INSERT INTO medications (code, name, weight, imageUrl)
      VALUES
        ("GWC_1000", "Get Well Capsules 1000mg", 100, "https://..."),
        ("GWD_75", "Get Well Drink 75L", 750, "https://..."),
        ("GWS_10", "Get Well Syrup 10mg", 10, "https://..."),
        ("G_WE_300", "Get Well Women Essentails 300mg", 300, "https://...")
    `);
    console.log('Done.\n');
  })
  .catch((err) => console.log(err));
};