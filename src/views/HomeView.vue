<script setup>
import { computed, reactive, onMounted, ref } from "vue";
import ProductForm from "@/components/ProductForm.vue";
import axios from "axios";

const search = ref("");
const isPopupOpen = ref(false);
const sortBy = ref("price-low");

const state = reactive({
  products: [],
});

const openPopup = () => {
  isPopupOpen.value = true;
};

const closePopup = () => {
  isPopupOpen.value = false;
};

const sortProducts = () => {
  if (sortBy.value === "price-low") {
    return state.products.sort((a, b) => a.price - b.price);
  }
  if (sortBy.value === "price-high") {
    return state.products.sort((a, b) => b.price - a.price);
  }
  if (sortBy.value === "name-az") {
    return state.products.sort((a, b) => a.title.localeCompare(b.title));
  }
  if (sortBy.value === "name-za") {
    return state.products.sort((a, b) => b.title.localeCompare(a.title));
  }
};

const fetchProducts = async () => {
  try {
    const res = await axios.get("/api/products");
    state.products = res.data;

    sortProducts();
  } catch (error) {
    console.error("Error fetching products: ", error);
  }
};

const handleNewProduct = async (product) => {
  try {
    await axios.post("/api/products", product);
    console.log("Product created successfully");
  } catch (error) {
    console.error("Product was not created:", error);
  }
};

const updateItem = async (productId) => {
  const updatedProduct = {
    title: form.title,
    category: form.category,
    price: form.price,
    description: form.description,
    image: form.uploadedImage,
  };
  try {
    await axios.put(`/api/products/${productId}`, updatedProduct);
    state.products = state.products.filter((p) => p.id !== productId);
    console.log("Product updated successfully");
  } catch (error) {
    console.error("Error updating product: ", error);
  }
};

const deleteItem = async (productId) => {
  try {
    const confirm = window.confirm("Delete this product?");
    if (confirm) {
      await axios.delete(`/api/products/${productId}`);
      state.products = state.products.filter((p) => p.id !== productId);
      console.log("Product deleted successfully");
    }
  } catch (error) {
    console.error("Error deleting product: ", error);
  }
};

const filterProducts = computed(() => {
  if (!search.value) return state.products;

  return state.products.filter((product) => {
    return product.title?.toLowerCase().includes(search.value.toLowerCase());
  });
});

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <ProductForm
    :is-open="isPopupOpen"
    :as-popup="true"
    @close="closePopup"
    @submit="handleNewProduct"
  />

  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header Section -->
    <header class="mb-8"></header>

    <!-- Search and Controls Bar -->
    <div
      class="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between"
    >
      <!-- Search Bar -->
      <div class="w-full sm:w-96">
        <div class="relative">
          <input
            type="text"
            placeholder="Search"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none"
            id="search"
            name="search"
            v-model="search"
          />
          <!-- <i class="pi pi-search"></i> -->
        </div>
      </div>

      <!-- Sort and Sell Button -->
      <div class="flex gap-3 w-full sm:w-auto">
        <!-- Sort Dropdown -->
        <div class="flex-1 sm:flex-initial">
          <select
            @change="sortProducts"
            v-model="sortBy"
            class="w-full sm:w-auto px-4 py-3 border-2 border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:outline-none cursor-pointer"
          >
            <option value="name-az">A - Z</option>
            <option value="name-za">Z - A</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <!-- Sell Item Button -->
        <button
          @click="openPopup"
          class="px-6 py-3 bg-green-200 hover:bg-green-300 text-gray-800 font-medium rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer"
        >
          <i class="pi pi-plus"></i>
          Add item
        </button>
      </div>
    </div>

    <div v-if="filterProducts.length === 0" class="py-6">
      <p class="text-gray-400 text-center">No Products Found</p>
    </div>
    <!-- Product Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
    >
      <!-- Product Card -->
      <div
        v-for="product in filterProducts"
        :key="product.id"
        class="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="relative aspect-[3/4] bg-gray-200">
          <img
            :src="product.image"
            :alt="product.title"
            class="w-full h-full object-cover"
          />
          <button
            @click="updateItem(product.id)"
            class="absolute top-2 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-green-300 hover:text-white transition-all shadow-md"
          >
            <i class="pi pi-pencil text-sm"></i>
          </button>
        </div>
        <div class="p-4">
          <h3 class="text-gray-800 font-medium mb-2">{{ product?.title }}</h3>
          <p class="text-xl font-semibold text-gray-900 mb-3">
            £{{ product.price }}
          </p>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600">{{ product.category }}</span>
            </div>
            <!-- Action Buttons -->
            <div class="flex items-center gap-2">
              <button
                class="text-gray-600 hover:text-blue-600"
                title="Add to cart"
              >
                <i class="pi pi-cart-plus text-lg"></i>
              </button>
              <button
                @click="deleteItem(product.id)"
                class="text-gray-600 hover:text-red-600"
                title="Delete"
              >
                <i class="pi pi-trash text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <!-- Pagination Container -->
    <nav
      class="flex items-center justify-between w-full"
      aria-label="Pagination"
    >
      <!-- Previous Button -->
      <button
        class="flex items-center gap-2 text-gray-500 font-medium text-base hover:text-gray-700"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Previous</span>
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-2">
        <!-- Page 1 -->
        <button
          class="w-10 h-10 flex items-center justify-center rounded border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
        >
          1
        </button>

        <!-- Page 2 -->
        <button
          class="w-10 h-10 flex items-center justify-center rounded border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
        >
          2
        </button>

        <!-- Page 3 -->
        <button
          class="w-10 h-10 flex items-center justify-center rounded border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
        >
          3
        </button>

        <!-- Page 4 -->
        <button
          class="w-10 h-10 flex items-center justify-center rounded border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
        >
          4
        </button>
      </div>

      <!-- Next Button -->
      <button
        class="flex items-center gap-2 text-gray-500 font-medium text-base hover:text-gray-700"
      >
        <span>Next</span>
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </nav>
  </div>
</template>
