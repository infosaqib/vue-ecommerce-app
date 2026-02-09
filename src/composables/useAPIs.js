import axios from "axios";

export async function useFetchProducts() {
  try {
    const res = await axios.get("/api/products");
    return res.data;
  } catch (error) {
    console.error("Error fetching products: ", error);
  }
}
