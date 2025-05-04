import axios from "axios";

const BASE_URL = "https://api.jikan.moe/v4";

export const searchAnime = async (query, page = 1) => {
  const res = await axios.get(`${BASE_URL}/anime`, {
    params: { q: query, page, limit: 12 },
  });
  return res.data;
};

export const getAnimeById = async (id) => {
  const res = await axios.get(`${BASE_URL}/anime/${id}`);
  return res.data;
};