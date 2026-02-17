import { useProductsStore, useSearchStore, useOrdersStore } from '@/stores'

// Initialize all mock data for demonstration
export const initializeMockData = () => {
  const productsStore = useProductsStore()
  const searchStore = useSearchStore()
  const ordersStore = useOrdersStore()

  // Load mock data for all stores
  productsStore.loadMockData()
  searchStore.loadMockData()
  ordersStore.loadMockData()

  console.log('🎉 Mock data loaded successfully!')
  console.log('📱 Available products:', productsStore.products.length)
  console.log('📂 Available categories:', productsStore.categories.length)
  console.log('🔍 Trending searches:', searchStore.trendingSearches.length)
  console.log('📦 Mock orders:', ordersStore.orders.length)
}

// Helper function to demonstrate store functionality
export const demonstrateStores = async () => {
  console.log('\n🧪 Demonstrating store functionality...\n')
  
  const productsStore = useProductsStore()
  const searchStore = useSearchStore()
  
  try {
    // Demonstrate search functionality
    console.log('🔍 Testing search functionality...')
    await searchStore.search('iPhone')
    console.log(`Found ${searchStore.resultsCount} results for "iPhone"`)
    
    // Demonstrate product fetching
    console.log('📱 Testing product fetching...')
    await productsStore.fetchFeaturedProducts()
    console.log(`Featured products: ${productsStore.featuredProducts.length}`)
    
    console.log('\n✅ All stores are working correctly!')
  } catch (error) {
    console.error('❌ Error testing stores:', error)
  }
} 