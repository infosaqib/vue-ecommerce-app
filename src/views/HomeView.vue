<script setup>
import { computed, reactive, onMounted, ref } from "vue";
import ProductForm from "@/components/ProductForm.vue";
import axios from "axios";
import { useToast } from "vue-toastification";
import { useFetchProducts, deleteItem, getData } from "@/composables/useAPIs";

const toast = useToast();
const search = ref("");
const isPopupOpen = ref(false);
const sortBy = ref("price-low");
const editingProduct = ref(null);
const isCartOpen = ref(false);

const state = reactive({
  products: [],
  cart: [],
  currentPage: 1,
  itemsLimit: 4,
});

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value;
};
const cartCount = computed(() => state.cart.length);

const openPopup = () => {
  isPopupOpen.value = true;
};

const closePopup = () => {
  isPopupOpen.value = false;
};

const totalPages = computed(() => {
  return Math.ceil(state.products.length / state.itemsLimit) || 1;
});

const pageNumbers = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1);
});

const sortProducts = () => {
  let sorted = [...state.products];
  if (sortBy.value === "price-low") sorted.sort((a, b) => a.price - b.price);
  if (sortBy.value === "price-high") sorted.sort((a, b) => b.price - a.price);
  if (sortBy.value === "name-az")
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  if (sortBy.value === "name-za")
    sorted.sort((a, b) => b.title.localeCompare(a.title));
  return sorted;
};
const handleSort = () => {
  state.products = sortProducts();
};

const OpenEditForm = async (product) => {
  editingProduct.value = product;

  openPopup();
};

const getCartItems = () => {
  const cart = getData("products") || [];
  console.log("cart", cart);
  state.cart = cart;
};

const addToCart = (product) => {
  const cartItems = getData("products") || [];
  if (cartItems.some((item) => item.id === product.id)) return;
  cartItems.push(product);
  localStorage.setItem("products", JSON.stringify(cartItems));
  state.cart = cartItems;
};

const removeFromCart = (productId) => {
  const cart = getData("products") || [];
  const updatedCart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("products", JSON.stringify(updatedCart));
  state.cart = updatedCart;
};

const handleSubmit = async (product) => {
  if (editingProduct.value) {
    try {
      await axios.put(`/api/products/${product.id}`, product);

      const index = state.products.findIndex((p) => p.id === product.id);

      if (index !== -1) {
        state.products[index] = product;
      }
      editingProduct.value = null;
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Product was not updated");
      console.error("Error updating product: ", error);
    }
  } else {
    try {
      await axios.post("/api/products", product);
      state.products.push(product);
      toast.success("Product created successfully");
    } catch (error) {
      toast.error("Product was not created");
      console.error("Error creating product: ", error);
    }
  }
};

const handleDelete = async (productId) => {
  await deleteItem(productId);
  state.products = state.products.filter((p) => p.id !== productId);
};

const currentPageProducts = computed(() => {
  const start = (state.currentPage - 1) * state.itemsLimit;
  const end = start + state.itemsLimit;
  return state.products.slice(start, end);
});

const paginatedProducts = computed(() => {
  if (!search.value) return currentPageProducts.value;

  return currentPageProducts.value.filter(
    (p) =>
      p.title.toLowerCase().includes(search.value.toLowerCase()) ||
      p.category.toLowerCase().includes(search.value.toLowerCase()),
  );
});

onMounted(async () => {
  const products = await useFetchProducts();
  state.products = products || [];
  handleSort();
  getCartItems();
});
</script>

<template>
  <ProductForm
    :is-open="isPopupOpen"
    :as-popup="true"
    :product="editingProduct"
    @close="closePopup"
    @submit="handleSubmit"
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
            class="w-full px-4 py-3 border-2 border-gray-200 rounded focus:outline-none"
            id="search"
            name="search"
            v-model="search"
          />
          <i class="pi pi-search absolute top-4 right-6"></i>
        </div>
      </div>

      <div class="relative">
        <!-- CART BUTTON -->
        <button
          id="myCartDropdownButton1"
          data-dropdown-toggle="myCartDropdown1"
          type="button"
          @click="toggleCart"
          class="relative inline-flex items-center gap-1 rounded-lg justify-center p-2 text-sm font-medium text-gray-800"
        >
          <span class="sr-only">Cart</span>

          <!-- Cart Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="w-6 h-6"
            viewBox="0 0 16 16"
          >
            <path
              d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"
            />
          </svg>

          <span
            v-if="cartCount > 0"
            class="absolute top-0 right-0 sm:inline bg-red-500 rounded-full min-w-4 h-4 px-1 text-white text-xs flex items-center justify-center"
          >
            {{ cartCount }}
          </span>

          <!-- <i class="pi pi-chevron-down text-xs ml-1"></i> -->
        </button>

        <!-- CART DROPDOWN -->
        <div
          v-if="isCartOpen"
          id="myCartDropdown1"
          class="absolute flex flex-col gap-4 top-12 z-20 w-80 rounded-xl bg-white p-4 shadow-lg border border-gray-200"
        >
          <!-- Cart Item -->
          <div
            v-for="cartProduct in state.cart"
            :key="cartProduct.id"
            class="flex items-center justify-between border-b pb-2"
          >
            <div>
              <p class="text-sm font-semibold text-gray-800">
                {{ cartProduct.title }}
              </p>

              <p class="text-xs text-gray-500">£{{ cartProduct.price }}</p>
            </div>

            <div class="flex items-center gap-3">
              <img
                :src="cartProduct.image"
                :alt="cartProduct.title"
                class="h-8 w-8 rounded-full"
              />
              <button
                @click="removeFromCart(cartProduct.id)"
                class="text-gray-500 hover:text-gray-600 transition"
              >
                <i class="pi pi-times-circle"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Sort and Sell Button -->
      <div class="flex gap-4 w-full sm:w-auto">
        <!-- Sort Dropdown -->
        <div class="flex flex-row items-center justify-center gap-3">
          <p class="font-lexend font-normal leading-[22px] tracking-normal">
            Sort by
          </p>
          <select
            @change="handleSort"
            v-model="sortBy"
            class="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none cursor-pointer font-lexend font-medium text-gray-700"
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

    <div v-if="paginatedProducts.length === 0" class="py-6">
      <p class="text-gray-400 text-center">No Products Found</p>
    </div>
    <!-- Product Grid -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8"
    >
      <!-- Product Card -->
      <div
        v-for="product in paginatedProducts"
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
            @click="OpenEditForm(product)"
            class="absolute top-2 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-green-300 hover:text-white transition-all shadow-md"
          >
            <i class="pi pi-pencil text-sm"></i>
          </button>
        </div>
        <div class="p-4">
          <h3
            class="text-[#171717] font-lexend font-light text-sm leading-[15px] tracking-normal"
          >
            {{ product?.title }}
          </h3>
          <p
            class="text-[#171717] font-lexend font-normal text-base leading-[2rem] tracking-normal mb-1"
          >
            £{{ product.price }}
          </p>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span
                class="text-neutral-900 font-lexend font-normal text-sm leading-5 tracking-normal"
                >{{ product.category }}</span
              >
            </div>
            <!-- Action Buttons -->
            <div class="flex items-center gap-2">
              <button
                :disabled="
                  state.cart.some((item) => item.title === product.title)
                "
                @click="addToCart(product)"
                class="w-9 h-9 text-black border border-[#E5E5E5] rounded p-2 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Add to cart"
              >
                <i class="pi pi-cart-plus text-lg"></i>
              </button>
              <button
                @click="handleDelete(product.id)"
                class="w-9 h-9 text-black border border-[#E5E5E5] rounded p-2 hover:text-red-600"
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
    <nav
      class="flex items-center justify-between w-full"
      aria-label="Pagination"
    >
      <!-- Previous -->
      <button
        @click="state.currentPage = Math.max(1, state.currentPage - 1)"
        :disabled="state.currentPage <= 1"
        class="flex items-center gap-2 text-black font-medium text-base disabled:opacity-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="h-5 w-5"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
          />
        </svg>
        <span>Previous</span>
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-2">
        <button
          v-for="page in pageNumbers"
          :key="page"
          @click="state.currentPage = page"
          :class="[
            'w-10 h-10 flex items-center justify-center rounded border text-sm font-medium',
            state.currentPage === page
              ? 'bg-gray-100 border-gray-400 text-gray-900'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50',
          ]"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next -->
      <button
        @click="state.currentPage = Math.min(totalPages, state.currentPage + 1)"
        :disabled="state.currentPage >= totalPages"
        class="flex items-center gap-2 text-black font-medium text-base disabled:opacity-50"
      >
        <span>Next</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="w-5 h-5"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
          />
        </svg>
      </button>
    </nav>
  </div>
</template>
