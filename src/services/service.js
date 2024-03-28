import axios from "axios";
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

// hosted zone apis

export async function getHostedZonesAPI() {
  const axiosoptions = {
    url: `${API_ENDPOINT}/api/getAllHostedZones`,
    method: "GET",
  };

  const response = await axios(axiosoptions);
  return response.data;
}

export async function createHostedZoneAPI(body) {
  const axiosoptions = {
    url: `${API_ENDPOINT}/api/createHostedZone`,
    method: "POST",
    data: body,
  };

  const response = await axios(axiosoptions);
  return response.data;
}

export async function deleteHostedZoneAPI(body) {
  const axiosoptions = {
    url: `${API_ENDPOINT}/api/deleteHostedZone`,
    method: "POST",
    data: body,
  };

  const response = await axios(axiosoptions);
  return response.data;
}

// dns record apis

export async function getDNSRecordsAPI(body) {
  const axiosoptions = {
    url: `${API_ENDPOINT}/api/getAllDNSRecords`,
    method: "POST",
    data: body,
  };

  const response = await axios(axiosoptions);
  return response.data;
}

export async function createDNSRecordAPI(body) {
  const axiosoptions = {
    url: `${API_ENDPOINT}/api/createDNSRecord`,
    method: "POST",
    data: body,
  };

  const response = await axios(axiosoptions);
  return response.data;
}

export async function deleteDNSRecordAPI(body) {
  const axiosoptions = {
    url: `${API_ENDPOINT}/api/deleteDNSRecord`,
    method: "POST",
    data: body,
  };

  const response = await axios(axiosoptions);
  return response.data;
}

export async function updateDNSRecordAPI(body) {
  const axiosoptions = {
    url: `${API_ENDPOINT}/api/updateDNSRecord`,
    method: "POST",
    data: body,
  };

  const response = await axios(axiosoptions);
  return response.data;
}
