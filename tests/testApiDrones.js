const axios = require('axios');
const baseUrl = 'http://localhost:4000';

const allData = [
  { serialNumber: "10001", model: "BA-1 PRO", weightLimit: 500, batteryCapacity: 100, state: "IDLE" },
  { serialNumber: "10002", model: "BA-1 PRO", weightLimit: 500, batteryCapacity: 99, state: "IDLE" },
  { serialNumber: "10003", model: "BA-1 PRO", weightLimit: 500, batteryCapacity: 25, state: "IDLE" },
  { serialNumber: "10004", model: "BA-1 PRO", weightLimit: 500, batteryCapacity: 48, state: "IDLE" },
  { serialNumber: "10005", model: "BA-X 9090", weightLimit: 500, batteryCapacity: 100, state: "IDLE" },
  { serialNumber: "10006", model: "BA-X 9090", weightLimit: 500, batteryCapacity: 56, state: "LOADED" },
  { serialNumber: "10007", model: "BA-X 9090", weightLimit: 500, batteryCapacity: 80, state: "IDLE" },
  { serialNumber: "10008", model: "BA-X 9090", weightLimit: 500, batteryCapacity: 32, state: "IDLE" },
  { serialNumber: "10009", model: "ALIEN-DRONE #00@2716--Z*", weightLimit: 500, batteryCapacity: 23, state: "IDLE" },
  { serialNumber: "10010", model: "ALIEN-DRONE #00@555D*", weightLimit: 500, batteryCapacity: 100, state: "IDLE" }
];

const testApiDrones = async(it) => {
  const response = await axios.get(`${baseUrl}/drones`)
    .then((res) => res.data)
    .catch((e) => console.log('`GET: /drones` request error!'));
   
    return it.eq(response.data, allData);
};

const testApiDronesAvailable = async(it) => {
  const response = await axios.get(`${baseUrl}/drones/available`)
    .then((res) => res.data)
    .catch((e) => console.log('`GET: /drones/available` request error!'));
    let allAvailable = allData;
    allAvailable.splice(5, 1);
   
    return it.eq(response.data, allAvailable);
};

const testApiDronesDrone = async(it) => {
  const response = await axios.get(`${baseUrl}/drones/drone/10001`)
    .then((res) => res.data)
    .catch((e) => console.log('`GET: /drones/drone` request error!'));
   
    return it.eq(response.data, allData[0]);
};

const testApiDronesBattery = async(it) => {
  const response = await axios.get(`${baseUrl}/drones/drone/battery/10005`)
    .then((res) => res.data)
    .catch((e) => console.log('`GET: /drones/drone/battery` request error!'));
   
    return it.eq(response.data, `${allData[4].batteryCapacity}%`);
};

const testApiDronesAdd = async(it) => {
  const droneData = {
    serialNumber: "10011",
    model: "Nubian N1",
    weightLimit: 500,
    batteryCapacity: 90,
    state: "IDLE"
  };

  const response = await axios(`${baseUrl}/drones`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(droneData)
    })
    .then((res) => res.data)
    .catch((e) => console.log('`POST: /drones` request error!'));
   
    droneData.lastID = 11;
    return it.eq(droneData, response.data);
};

const testApiDronesAddEmptyData = async(it) => {
  const droneData = {};

  const errData = {
    errors: [
      {
        msg: { serialNumber: 'Field is required.' },
        param: 'serialNumber',
        location: 'body'
      },
      {
        msg: { model: 'Field is required.' },
        param: 'model',
        location: 'body'
      },
      {
        msg: { weightLimit: 'Field must be a number.' },
        param: 'weightLimit',
        location: 'body'
      },
      {
        msg: { batteryCapacity: 'Field must be a number.' },
        param: 'batteryCapacity',
        location: 'body'
      },
      {
        msg: { state: 'Field is required.' },
        param: 'state',
        location: 'body'
      }
    ]
  };

  const response = await axios(`${baseUrl}/drones`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(droneData)
    })
    .then((res) => res)
    .catch((e) => e.response);
   
    return it.eq(response.data, errData);
};

const testApiDronesAddWrongDataFormat = async(it) => {
  const droneData = {
    serialNumber: "10011",
    model: "Nubian N1",
    weightLimit: "Five Hundred",
    batteryCapacity: "Ninety",
    state: "IDLE"
  };

  const errData = {
    errors: [
      {
        value: 'Five Hundred',
        msg: { weightLimit: 'Field must be a number.' },
        param: 'weightLimit',
        location: 'body'
      },
      {
        value: 'Ninety',
        msg: { batteryCapacity: 'Field must be a number.' },
        param: 'batteryCapacity',
        location: 'body'
      }
    ]
  };

  const response = await axios(`${baseUrl}/drones`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(droneData)
    })
    .then((res) => res)
    .catch((e) => e.response);
  
    return it.eq(response.data, errData);
};

module.exports = {
  testApiDrones,
  testApiDronesAvailable,
  testApiDronesDrone,
  testApiDronesBattery,
  testApiDronesAdd,
  testApiDronesAddEmptyData,
  testApiDronesAddWrongDataFormat
};