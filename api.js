import axios from 'axios';

const BASE_URL = 'https://rickandmortyapi.com/api';

export const fetchCharacters = async () => {
  const response = await axios.get(`${BASE_URL}/character`);
  return response.data.results;
};

export const fetchLocations = async () => {
  const response = await axios.get(`${BASE_URL}/location`);
  return response.data.results;
};

export const fetchEpisodes = async () => {
  const response = await axios.get(`${BASE_URL}/episode`);
  return response.data.results;
};
