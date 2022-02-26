const axios = require('axios');
const baseUrl = 'http://localhost:4000';

const allData = [
  { code: "GWC_1000", name: "Get Well Capsules 1000mg", weight: 100, imageUrl: "https://..." },
  { code: "GWD_75", name: "Get Well Drink 75L", weight: 750, imageUrl: "https://..." },
  { code: "GWS_10", name: "Get Well Syrup 10mg", weight: 10, imageUrl: "https://..." },
  { code: "G_WE_300", name: "Get Well Women Essentails 300mg", weight: 300, imageUrl: "https://..." }
];

const testApiMedications = async(it) => {
  const response = await axios.get(`${baseUrl}/medications`)
    .then((res) => res.data)
    .catch((e) => console.log('`GET: /medications` request error!'));
   
    return it.eq(response.data, allData);
};

const testApiMedicationsAdd = async(it) => {
  const medData = {
    code: 'GBNGN-MAX',
    name: "GBOGBONISHE AKEREKORO",
    weight: 5,
    imageUrl: "https://..."
  };

  const response = await axios(`${baseUrl}/medications`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(medData)
    })
    .then((res) => res.data)
    .catch((e) => console.log('`POST: /medications` request error!'));
   
    medData.lastID = 5;
    return it.eq(medData, response.data);
};

const testApiMedicationsAddEmptyData = async(it) => {
  const medData = {};

  const errData = {
    errors: [
      {
        msg: { code: 'Field is required.' },
        param: 'code',
        location: 'body'
      },
      {
        msg: { name: 'Field is required.' },
        param: 'name',
        location: 'body'
      },
      {
        msg: { weight: 'Field must be a number.' },
        param: 'weight',
        location: 'body'
      },
      {
        msg: { imageUrl: 'Field is required.' },
        param: 'imageUrl',
        location: 'body'
      }
    ]
  };

  const response = await axios(`${baseUrl}/medications`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(medData)
    })
    .then((res) => res)
    .catch((e) => e.response);
   
    return it.eq(response.data, errData);
};

const testApiMedicationsWrongDataFormat = async(it) => {
  const medData = {
    code: 'GBNGN-MAX',
    name: "GBOGBONISHE AKEREKORO",
    weight: "Five",
    imageUrl: "https://..."
  };

  const errData = {
    errors: [
      {
        value: 'Five',
        msg: { weight: 'Field must be a number.' },
        param: 'weight',
        location: 'body'
      }
    ]
  };

  const response = await axios(`${baseUrl}/medications`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(medData)
    })
    .then((res) => res)
    .catch((e) => e.response);
   
    return it.eq(response.data, errData);
};

module.exports = {
  testApiMedications,
  testApiMedicationsAdd,
  testApiMedicationsAddEmptyData,
  testApiMedicationsWrongDataFormat
};