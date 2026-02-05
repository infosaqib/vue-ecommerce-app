<script setup>

</script>
<template>
 <div class="container mx-auto px-4 py-8 max-w-7xl">
        <!-- Header Section -->
        <header class="mb-8">
            <h1 class="text-2xl text-red-500 font-semibold text-gray-800">Product listing - Sidebar Filter</h1>
        </header>

        <!-- Search and Controls Bar -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
            <!-- Search Bar -->
            <div class="w-full sm:w-96">
                <div class="relative">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        class="w-full px-4 py-3 border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        id="searchInput"
                    >
                    <button class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>

            <!-- Sort and Sell Button -->
            <div class="flex gap-3 w-full sm:w-auto">
                <!-- Sort Dropdown -->
                <div class="flex-1 sm:flex-initial relative">
                    <button 
                        id="sortButton"
                        class="w-full sm:w-auto px-4 py-3 border-2 border-blue-400 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-between gap-8"
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
                        class="hidden absolute top-full mt-2 right-0 bg-white border-2 border-blue-400 rounded-lg shadow-lg z-10 min-w-[200px]"
                    >
                        <ul class="py-1">
                            <li>
                                <button 
                                    class="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors sort-option"
                                    data-value="price-low"
                                >
                                    A - Z
                                </button>
                            </li>
                            <li>
                                <button 
                                    class="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors sort-option"
                                    data-value="price-high"
                                >
                                    Z - A
                                </button>
                            </li>
                            <li>
                                <button 
                                    class="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors sort-option"
                                    data-value="name-az"
                                >
                                    Price: Low to High
                                </button>
                            </li>
                            <li>
                                <button 
                                    class="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors sort-option"
                                    data-value="name-za"
                                >
                                    Price: High to Low
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Sell Item Button -->
                <button class="px-6 py-3 bg-green-400 hover:bg-green-500 text-gray-800 font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap">
                    <i class="fas fa-plus"></i>
                    Sell item
                </button>
            </div>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <!-- Product Card 1 -->
            <div class="bg-white rounded-lg overflow-hidden border-2 border-blue-400 hover:shadow-lg transition-shadow">
                <div class="relative aspect-[3/4] bg-gray-200">
                    <img 
                        src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=533&fit=crop" 
                        alt="Product" 
                        class="w-full h-full object-cover"
                    >
                </div>
                <div class="p-4">
                    <h3 class="text-gray-800 font-medium mb-2">Product name</h3>
                    <p class="text-xl font-semibold text-gray-900 mb-3">£30.00</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <img 
                                src="https://i.pravatar.cc/40?img=1" 
                                alt="Josie Parker" 
                                class="w-6 h-6 rounded-full"
                            >
                            <span class="text-sm text-gray-600">Josie Parker</span>
                        </div>
                        <button class="text-gray-400 hover:text-red-500 transition-colors">
                            <i class="far fa-heart text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Product Card 2 -->
            <div class="bg-white rounded-lg overflow-hidden border-2 border-blue-400 hover:shadow-lg transition-shadow">
                <div class="relative aspect-[3/4] bg-gray-200">
                    <img 
                        src="https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=533&fit=crop" 
                        alt="Product" 
                        class="w-full h-full object-cover"
                    >
                </div>
                <div class="p-4">
                    <h3 class="text-gray-800 font-medium mb-2">Product name</h3>
                    <p class="text-xl font-semibold text-gray-900 mb-3">£30.00</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <img 
                                src="https://i.pravatar.cc/40?img=2" 
                                alt="Josie Parker" 
                                class="w-6 h-6 rounded-full"
                            >
                            <span class="text-sm text-gray-600">Josie Parker</span>
                        </div>
                        <button class="text-gray-400 hover:text-red-500 transition-colors">
                            <i class="far fa-heart text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Product Card 3 -->
            <div class="bg-white rounded-lg overflow-hidden border-2 border-blue-400 hover:shadow-lg transition-shadow">
                <div class="relative aspect-[3/4] bg-gray-200">
                    <img 
                        src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=533&fit=crop" 
                        alt="Product" 
                        class="w-full h-full object-cover"
                    >
                </div>
                <div class="p-4">
                    <h3 class="text-gray-800 font-medium mb-2">Product name</h3>
                    <p class="text-xl font-semibold text-gray-900 mb-3">£30.00</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <img 
                                src="https://i.pravatar.cc/40?img=3" 
                                alt="Josie Parker" 
                                class="w-6 h-6 rounded-full"
                            >
                            <span class="text-sm text-gray-600">Josie Parker</span>
                        </div>
                        <button class="text-gray-400 hover:text-red-500 transition-colors">
                            <i class="far fa-heart text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Product Card 4 -->
            <div class="bg-white rounded-lg overflow-hidden border-2 border-blue-400 hover:shadow-lg transition-shadow">
                <div class="relative aspect-[3/4] bg-gray-200">
                    <img 
                        src="https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=400&h=533&fit=crop" 
                        alt="Product" 
                        class="w-full h-full object-cover"
                    >
                </div>
                <div class="p-4">
                    <h3 class="text-gray-800 font-medium mb-2">Product name</h3>
                    <p class="text-xl font-semibold text-gray-900 mb-3">£30.00</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <img 
                                src="https://i.pravatar.cc/40?img=4" 
                                alt="Josie Parker" 
                                class="w-6 h-6 rounded-full"
                            >
                            <span class="text-sm text-gray-600">Josie Parker</span>
                        </div>
                        <button class="text-gray-400 hover:text-red-500 transition-colors">
                            <i class="far fa-heart text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <nav class="flex items-center justify-center gap-2" aria-label="Pagination">
            <button class="px-4 py-2 border-2 border-blue-400 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 text-gray-700 font-medium">
                <i class="fas fa-arrow-left"></i>
                Previous
            </button>
            
            <div class="flex gap-2">
                <button class="w-10 h-10 rounded-lg border-2 border-blue-400 hover:bg-blue-50 transition-colors text-gray-700">1</button>
                <button class="w-10 h-10 rounded-lg border-2 border-blue-400 hover:bg-blue-50 transition-colors text-gray-700">2</button>
                <button class="w-10 h-10 rounded-lg border-2 border-blue-400 bg-blue-400 text-gray-800 font-semibold">3</button>
                <span class="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
                <button class="w-10 h-10 rounded-lg border-2 border-blue-400 hover:bg-blue-50 transition-colors text-gray-700">8</button>
                <button class="w-10 h-10 rounded-lg border-2 border-blue-400 hover:bg-blue-50 transition-colors text-gray-700">9</button>
                <button class="w-10 h-10 rounded-lg border-2 border-blue-400 hover:bg-blue-50 transition-colors text-gray-700">10</button>
            </div>
            
            <button class="px-4 py-2 border-2 border-blue-400 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 text-gray-700 font-medium">
                Next
                <i class="fas fa-arrow-right"></i>
            </button>
        </nav>
    </div>
</template>