const fs = require('fs');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const junit = require('junit');
const it = junit();

const app = require('../app');

const {
  testApiDrones,
  testApiDronesAvailable,
  testApiDronesDrone,
  testApiDronesBattery,
  testApiDronesAdd,
  testApiDronesAddEmptyData,
  testApiDronesAddWrongDataFormat
} = require('./testApiDrones');
const {
  testApiMedications,
  testApiMedicationsAdd,
  testApiMedicationsAddEmptyData,
  testApiMedicationsWrongDataFormat
} = require('./testApiMedications');
const {
  testApiLoader,
  testApiLoadAddStatus,
  testApiLoadAddStatusNoDrone,
  testApiLoadAddResp,
  testApiLoadAddRespNoDrone,
  testApiLoadAddStatusLowBat,
  testApiLoadAddRespLowBat,
  testApiLoadAddStatusNotIdle,
  testApiLoadAddRespNotIdle,
  testApiLoadAddStatusNoMed,
  testApiLoadAddRespNotMed,
  testApiLoadAddStatusMweightLimit,
  testApiLoadAddRespNotWeightLimit
} = require('./testApiLoader');

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
        ("10006", "BA-X 9090", 500, 56, "LOADED"),
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

    await res.exec(`
      INSERT INTO loadInformation (droneSerial, medCode, units, medWeight)
      VALUES
        ("10001", "GWC_1000", 3, 300),
        ("10009", "GWS_10", 17, 170)
    `);

    console.log('Done.\n');
    return res;
  })
  .catch((err) => console.log(err));

  return db;
};

const apiTests = async() => {
  fs.unlink('db/database.db', async(err) => {
    const dbInstance = await setDatabase();
    const runServer = app();
  
    await it("GET: /drones", async() => testApiDrones(it));
    await it("GET: /drones/available", async() => testApiDronesAvailable(it));
    await it("GET: /drone/:serial", async() => testApiDronesDrone(it));
    await it("GET: /drone/battery/:serial", async() => testApiDronesBattery(it));
    await it("POST: /drones", async() => testApiDronesAdd(it));
    await it("POST: /drones [Empty data fields]", async() => testApiDronesAddEmptyData(it));
    await it("POST: /drones [Data fields wrong format]", async() => testApiDronesAddWrongDataFormat(it));
  
    await it("GET: /medications", async() => testApiMedications(it));
    await it("POST: /medications", async() => testApiMedicationsAdd(it));
    await it("POST: /medications [Empty data fields]", async() => testApiMedicationsAddEmptyData(it));
    await it("POST: /medications [Data fields wrong format]", async() => testApiMedicationsWrongDataFormat(it));
  
    await it("GET: /loader/:droneId [loaded medications on a drone]", async() => testApiLoader(it));
    await it("POST: /loader [request status - correct data]", async() => testApiLoadAddStatus(it));
    await it("POST: /loader [response data - correct data]", async() => testApiLoadAddResp(it));
    await it("POST: /loader [request status - unexisting drone]", async() => testApiLoadAddStatusNoDrone(it));
    await it("POST: /loader [response data - unexisting drone]", async() => testApiLoadAddRespNoDrone(it));
    await it("POST: /loader [request status - drone battery low]", async() => testApiLoadAddStatusLowBat(it));
    await it("POST: /loader [response data - drone battery low]", async() => testApiLoadAddRespLowBat(it));
    await it("POST: /loader [request status - drone not idle]", async() => testApiLoadAddStatusNotIdle(it));
    await it("POST: /loader [response data - drone not idle]", async() => testApiLoadAddRespNotIdle(it));
    await it("POST: /loader [request status - medication not in database]", async() => testApiLoadAddStatusNoMed(it));
    await it("POST: /loader [response data - medication not in database]", async() => testApiLoadAddRespNotMed(it));
    await it("POST: /loader [request status - weight limit exceeded]", async() => testApiLoadAddStatusMweightLimit(it));
    await it("POST: /loader [response data - weight limit exceeded]", async() => testApiLoadAddRespNotWeightLimit(it));

    await it.run();
    await runServer.close();
    await dbInstance.close();
    process.exit();
  });
};

apiTests();
