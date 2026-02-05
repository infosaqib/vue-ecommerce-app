<script setup>
import { defineProps, defineEmits, reactive, ref } from "vue";
import axios from "axios";

import { v4 as uuidv4 } from "uuid";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  asPopup: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close"]);

const handleClose = () => {
  emit("close");
};

const file = ref(null);

function triggerFileInput() {
  if (file.value instanceof HTMLInputElement) {
    file.value.click();
  } else {
    console.error("fileInput ref is not an input element:", file.value);
  }
}
// Handle file selection
async function handleFileUpload(event) {
  file.value = event.target.files[0];
  if (!file.value) return;

  const formData = new FormData();
  formData.append("file", file.value);
  formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);

  try {
    const cloudRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
      formData,
    );

    form.uploadedImage = cloudRes.data.secure_url; // store URL
    console.log("Uploaded Image URL:", form.uploadedImage);
  } catch (err) {
    console.error("Upload failed:", err);
  }
}

const form = reactive({
  title: "",
  category: "",
  price: "",
  description: "",
  uploadedImage: "",
});

const handleSubmit = async () => {
  if (!form.uploadedImage) {
    alert("Please upload an image first!");
    return;
  }

  const newProduct = {
    id: uuidv4(),
    title: form.title,
    category: form.category,
    price: form.price,
    description: form.description,
    image: form.uploadedImage,
  };

  try {
    await axios.post("/api/products", newProduct);
    console.log("Product created successfully");
  } catch (error) {
    console.error("Product was not created:", error);
  }
  handleClose();
};
</script>

<template>
  <!-- Component can be used as popup or inline -->
  <div
    v-if="asPopup && isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
  >
    <!-- Overlay - Independent -->
    <div
      class="absolute inset-0 bg-black bg-opacity-50"
      @click="handleClose"
    ></div>

    <!-- Modal Container -->
    <div
      class="relative bg-white rounded-lg w-full max-w-[700px] shadow-2xl z-10"
    >
      <!-- Close Button -->
      <button
        @click="handleClose"
        class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <i class="fas fa-times text-xl"></i>
      </button>

      <!-- Form Content -->
      <div class="p-8 h-[95vh] overflow-y-scroll">
        <div class="mb-6">
          <h2
            class="w-full px-4 py-3 text-xl font-medium text-gray-900 outline-none"
          >
            Add an Item
          </h2>
        </div>
        <form @submit.prevent="handleSubmit">
          <!-- Upload Photos Section -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Upload photos
            </label>

            <!-- Clickable upload box -->
            <div
              class="border-2 border-gray-200 rounded-lg p-12 flex items-center justify-center bg-white cursor-pointer relative"
              @click="triggerFileInput"
            >
              <!-- Show "Upload photo" text only if no image -->
              <p
                v-if="!form.uploadedImage"
                class="p-4 border border-gray-100 rounded text-gray-700"
              >
                Upload photo
              </p>

              <!-- Show preview when file selected -->
              <img
                v-if="form.uploadedImage"
                :src="form.uploadedImage"
                alt="Preview"
                class="absolute inset-0 w-full h-full object-contain rounded"
              />

              <!-- Hidden actual file input -->
              <input
                ref="file"
                type="file"
                class="hidden"
                accept="image/*"
                @change="handleFileUpload"
              />
            </div>
          </div>

          <!-- Title Input -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Title</label
            >
            <input
              v-model="form.title"
              id="title"
              name="title"
              type="text"
              placeholder=""
              class="w-full px-4 py-3 border-2 border-blue-400 rounded text-gray-900 outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <!-- Description Textarea -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Describe your item</label
            >
            <textarea
              rows="4"
              placeholder=""
              v-model="form.description"
              name="description"
              id="description"
              class="w-full px-4 py-3 border-2 border-blue-400 rounded text-gray-900 outline-none focus:border-blue-500 transition-colors resize-none"
            ></textarea>
          </div>

          <!-- Category Select -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Category</label
            >
            <div class="relative">
              <select
                v-model="form.category"
                name="category"
                id="category"
                class="w-full px-4 py-3 border-2 border-blue-400 rounded text-gray-400 outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none bg-white"
              >
                <option value="">Select</option>
                <option value="clothing">Clothing</option>
                <option value="electronics">Electronics</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports & Outdoors</option>
                <option value="books">Books & Media</option>
                <option value="toys">Toys & Games</option>
                <option value="other">Other</option>
              </select>
              <div
                class="absolute inset-y-0 right-4 flex items-center pointer-events-none"
              >
                <svg
                  class="w-3 h-3 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path d="M6 9L1 4h10z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Item Price -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Item price</label
            >
            <div class="relative">
              <span
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-medium"
                >£</span
              >
              <input
                type="text"
                v-model="form.price"
                id="price"
                name="price"
                placeholder="00.00"
                class="w-full pl-8 pr-4 py-3 border-2 border-blue-400 rounded text-gray-400 text-right outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <input
            type="submit"
            value="Upload item"
            class="w-full py-3 rounded font-medium bg-green-300 hover:bg-green-400 text-gray-800 border-2 border-blue-400 transition-colors"
          />
        </form>
      </div>
    </div>
  </div>
</template>
