import api from "./api";

export const getSweets = async () => {
  const response = await api.get("/sweets");
  return response.data;
};

export const searchSweets = async (query) => {
  const response = await api.get(`/sweets/search?query=${query}`);
  return response.data;
};

// We will add purchase/restock functions here later in Step 4
// ... existing getSweets and searchSweets ...

export const addSweet = async (sweetData) => {
  const response = await api.post("/sweets", sweetData);
  return response.data;
};

export const restockSweet = async (id, quantity) => {
  const response = await api.post(`/sweets/${id}/restock`, { quantity });
  return response.data;
};

// ... existing exports

export const purchaseSweet = async (id) => {
  // We buy 1 quantity by default
  const response = await api.post(`/sweets/${id}/purchase`, { quantity: 1 });
  return response.data;
};
