import axios from "axios";
import { useToast } from "vue-toastification";
const toast = useToast();

export async function useFetchProducts() {
  try {
    const res = await axios.get("/api/products");
    return res.data;
  } catch (error) {
    console.error("Error fetching products: ", error);
  }
}

export const deleteItem = async (productId) => {
  try {
    const confirm = window.confirm("Delete this product?");
    if (confirm) {
      await axios.delete(`/api/products/${productId}`);
      toast.success("Product deleted successfully");
    }
  } catch (error) {
    toast.error("Product was not deleted");
    console.error("Error deleting product: ", error);
  }
};

export const getData = (val) => {
  const raw = localStorage.getItem(val);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    return parsed || [];
  } catch (error) {
    console.error("Invlaid response detected: ", error);
  }
};
