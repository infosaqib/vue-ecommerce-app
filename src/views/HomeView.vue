<script setup>
import { computed, reactive, onMounted, ref } from "vue";
import ProductForm from "@/components/ProductForm.vue";
import axios from "axios";

const state = reactive({
  products: [],
});

const search = ref("");
const isPopupOpen = ref(false);

// Fetch products from API
const fetchProducts = async () => {
  try {
    const res = await axios.get("/api/products");
    state.products = res.data;
    console.log("Successfully fetched products", state.products);
  } catch (error) {
    console.error("Error fetching products: ", error);
  }
};

// Delete product and refresh UI
const deleteItem = async (productId) => {
  try {
    const confirm = window.confirm("Delete this product?");
    if (confirm) {
      await axios.delete(`/api/products/${productId}`);
      // Remove the product from state
      state.products = state.products.filter((p) => p.id !== productId);
      console.log("Product deleted successfully");
    }
  } catch (error) {
    console.error("Error deleting product: ", error);
  }
};

// Load products on mount
onMounted(() => {
  fetchProducts();
});

const openPopup = () => {
  isPopupOpen.value = true;
};

const closePopup = () => {
  isPopupOpen.value = false;
};

// Refresh products after form submission
const handleSubmit = async () => {
  console.log("Form submitted");
  closePopup();
  // Fetch updated products list
  await fetchProducts();
};

const handlePhotoUpload = () => {
  console.log("Photo upload triggered");
  // Add your photo upload logic here
};

const filterProducts = computed(() => {
  if (!search.value) return state.products;  

  return state.products.filter((product) => {
    return product.title?.toLowerCase().includes(search.value.toLowerCase());
  });
});
</script>

<template>
  <ProductForm
    :is-open="isPopupOpen"
    :as-popup="true"
    @close="closePopup"
    @submit="handleSubmit"
    @upload-photo="handlePhotoUpload"
  />

  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header Section -->
    <header class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-800">
        Product listing - Sidebar Filter
      </h1>
    </header>

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
          <i class="pi pi-search"></i>
        </div>
      </div>

      <!-- Sort and Sell Button -->
      <div class="flex gap-3 w-full sm:w-auto">
        <!-- Sort Dropdown -->
        <div class="flex-1 sm:flex-initial relative">
          <button
            id="sortButton"
            class="w-full sm:w-auto px-4 py-3 border-2 border-gray-200 rounded-lg bg-white hover:bg-gray-50 flex items-center justify-between gap-8"
          >
            <span class="text-gray-700">
              <span class="font-medium">Sort by</span>
              <span class="ml-2" id="sortLabel">Price: Low to High</span>
            </span>
            <i class="fas fa-chevron-down text-gray-600 text-sm"></i>
          </button>

          <!-- Dropdown Menu -->
          <div
            id="sortDropdown"
            class="hidden absolute top-full mt-2 right-0 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]"
          >
            <ul class="py-1">
              <li>
                <button
                  class="w-full px-4 py-2 text-left hover:bg-blue-50 sort-option"
                  data-value="price-low"
                >
                  A - Z
                </button>
              </li>
              <li>
                <button
                  class="w-full px-4 py-2 text-left hover:bg-blue-50 sort-option"
                  data-value="price-high"
                >
                  Z - A
                </button>
              </li>
              <li>
                <button
                  class="w-full px-4 py-2 text-left hover:bg-blue-50 sort-option"
                  data-value="name-az"
                >
                  Price: Low to High
                </button>
              </li>
              <li>
                <button
                  class="w-full px-4 py-2 text-left hover:bg-blue-50 sort-option"
                  data-value="name-za"
                >
                  Price: High to Low
                </button>
              </li>
            </ul>
          </div>
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
