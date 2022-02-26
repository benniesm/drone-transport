const axios = require('axios');
const baseUrl = 'http://localhost:4000';

const allData = [
  { droneSerial: "10001", medCode: "GWC_1000", units: 3, medWeight: 300 },
  { droneSerial: "10009", medCode: "GWS_10", units: 17, medWeight: 170 }
];

const loadData = {
  medCode: 'GBNGN-MAX', 
  units: 5
};

const callApi = async(loadData, droneId) => {
  return await axios(`${baseUrl}/loader/${droneId}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(loadData)
  })
  .then((res) => {
    return {status: res.status, body: res.data};
  })
  .catch((e) => {
    return e.response;
  });
};

const testApiLoader = async(it) => {
  const response = await axios.get(`${baseUrl}/loader/10009`)
    .then((res) => res.data)
    .catch((e) => console.log('`GET: /loader` request error!'));
   
    return it.eq(response.data, [allData[1]]);
};

const testApiLoadAddStatus = async(it) => {
  const makeCall =  await callApi(loadData, "10002");
  return it.eq(makeCall?.status, 201);
};

const testApiLoadAddResp = async(it) => {
  let loaderData = loadData
  const makeCall =  await callApi(loadData, "10003");
  makeCall.lastID = 3;
  loaderData.droneId = "10003"
  loaderData.medWeight = 25;
  return it.eq(makeCall?.body?.data, loaderData);
};

const testApiLoadAddStatusNoDrone = async(it) => {
  const makeCall =  await callApi(loadData, "20002");
  return it.eq(makeCall?.status, 404);
};

const testApiLoadAddRespNoDrone = async(it) => {
  const makeCall =  await callApi(loadData, "30003");
  return it.eq(makeCall?.data, { error: 'Drone not found.' });
};

const testApiLoadAddStatusLowBat = async(it) => {
  const makeCall =  await callApi(loadData, "10009");
  return it.eq(makeCall?.status, 403);
};

const testApiLoadAddRespLowBat = async(it) => {
  const makeCall =  await callApi(loadData, "10009");
  return it.eq(makeCall?.data, { error: 'Low Battery.' });
};

const testApiLoadAddStatusNotIdle = async(it) => {
  const makeCall =  await callApi(loadData, "10006");
  return it.eq(makeCall?.status, 403);
};

const testApiLoadAddRespNotIdle = async(it) => {
  const makeCall =  await callApi(loadData, "10006");
  return it.eq(makeCall?.data, { error: 'Drone is not available.' });
};

const testApiLoadAddStatusNoMed = async(it) => {
  const makeCall =  await callApi({ medCode: 'AAAA', units: 5 }, "10001");
  return it.eq(makeCall?.status, 404);
};

const testApiLoadAddRespNotMed = async(it) => {
  const makeCall =  await callApi({ medCode: 'AAAA', units: 5 }, "10001");
  return it.eq(makeCall?.data, { error: 'Medication not found.' });
};

const testApiLoadAddStatusMweightLimit = async(it) => {
  const makeCall =  await callApi({ medCode: 'G_WE_300', units: 5 }, "10001");
  return it.eq(makeCall?.status, 403);
};

const testApiLoadAddRespNotWeightLimit = async(it) => {
  const makeCall =  await callApi({ medCode: 'G_WE_300', units: 5 }, "10001");
  return it.eq(makeCall?.data, { error: 'Weight Limit Exceeded.' });
};


module.exports = {
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
};