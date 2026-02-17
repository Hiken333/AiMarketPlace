import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  discountPrice?: number
  currency: string
  images: string[]
  category: string
  brand: string
  rating: number
  reviewsCount: number
  inStock: boolean
  stockQuantity: number
  seller: {
    id: string
    name: string
    rating: number
  }
  badges: ('new' | 'hit' | 'discount')[]
  specifications: Record<string, string>
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  gradient?: string
  parentId?: string
  children?: Category[]
  productsCount: number
}

export interface ProductFilters {
  categoryId?: string
  priceMin?: number
  priceMax?: number
  brands?: string[]
  inStock?: boolean
  rating?: number
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'popularity' | 'newest'
  search?: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const featuredProducts = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentFilters = ref<ProductFilters>({})
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false
  })

  // Getters
  const discountedProducts = computed(() => 
    products.value.filter(p => p.discountPrice && p.discountPrice < p.price)
  )
  
  const newProducts = computed(() => 
    products.value.filter(p => p.badges.includes('new'))
  )
  
  const hitProducts = computed(() => 
    products.value.filter(p => p.badges.includes('hit'))
  )
  
  const topRatedProducts = computed(() => 
    products.value.filter(p => p.rating >= 4.5).sort((a, b) => b.rating - a.rating)
  )
  
  const brands = computed(() => {
    const brandSet = new Set(products.value.map(p => p.brand))
    return Array.from(brandSet).sort()
  })
  
  const priceRange = computed(() => {
    if (products.value.length === 0) return { min: 0, max: 0 }
    
    const prices = products.value.map(p => p.discountPrice || p.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  })

  // Actions
  const fetchProducts = async (filters: ProductFilters = {}, append = false) => {
    isLoading.value = true
    error.value = null
    
    try {
      const params = new URLSearchParams()
      params.append('page', pagination.value.page.toString())
      params.append('limit', pagination.value.limit.toString())
      
      if (filters.categoryId) params.append('categoryId', filters.categoryId)
      if (filters.search) params.append('search', filters.search)
      if (filters.priceMin) params.append('priceMin', filters.priceMin.toString())
      if (filters.priceMax) params.append('priceMax', filters.priceMax.toString())
      if (filters.brands?.length) params.append('brands', filters.brands.join(','))
      if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString())
      if (filters.rating) params.append('rating', filters.rating.toString())
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      
      // TODO: Replace with actual API call
      const response = await fetch(`/api/products?${params}`)
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки товаров')
      }
      
      const data: ProductsResponse = await response.json()
      
      if (append) {
        products.value.push(...data.products)
      } else {
        products.value = data.products
      }
      
      pagination.value = {
        page: data.page,
        limit: data.limit,
        total: data.total,
        hasMore: data.hasMore
      }
      
      currentFilters.value = filters
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки товаров'
    } finally {
      isLoading.value = false
    }
  }

  const fetchProductById = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/products/${id}`)
      
      if (!response.ok) {
        throw new Error('Товар не найден')
      }
      
      const product: Product = await response.json()
      currentProduct.value = product
      
      return product
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки товара'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchCategories = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/categories')
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки категорий')
      }
      
      const data: Category[] = await response.json()
      categories.value = data
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки категорий'
    }
  }

  const fetchFeaturedProducts = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/products/featured')
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки рекомендованных товаров')
      }
      
      const data: Product[] = await response.json()
      featuredProducts.value = data
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки рекомендованных товаров'
    }
  }

  const searchProducts = async (query: string) => {
    const filters: ProductFilters = {
      ...currentFilters.value,
      search: query
    }
    
    pagination.value.page = 1
    await fetchProducts(filters)
  }

  const applyFilters = async (filters: ProductFilters) => {
    pagination.value.page = 1
    await fetchProducts(filters)
  }

  const loadMore = async () => {
    if (!pagination.value.hasMore || isLoading.value) return
    
    pagination.value.page += 1
    await fetchProducts(currentFilters.value, true)
  }

  const resetFilters = async () => {
    currentFilters.value = {}
    pagination.value.page = 1
    await fetchProducts()
  }

  const clearCurrentProduct = () => {
    currentProduct.value = null
  }

  // Mock data for development
  const loadMockData = () => {
    // Mock categories
    categories.value = [
      { 
        id: '1', 
        name: 'Электроника', 
        slug: 'electronics', 
        productsCount: 150, 
        icon: 'smartphone',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      { 
        id: '2', 
        name: 'Одежда', 
        slug: 'clothing', 
        productsCount: 300, 
        icon: 'checkroom',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      },
      { 
        id: '3', 
        name: 'Дом и сад', 
        slug: 'home-garden', 
        productsCount: 200, 
        icon: 'home',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      },
      { 
        id: '4', 
        name: 'Спорт', 
        slug: 'sports', 
        productsCount: 100, 
        icon: 'fitness_center',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
      },
      { 
        id: '5', 
        name: 'Красота', 
        slug: 'beauty', 
        productsCount: 80, 
        icon: 'face_retouching_natural',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
      },
      { 
        id: '6', 
        name: 'Книги', 
        slug: 'books', 
        productsCount: 250, 
        icon: 'menu_book',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
      },
      { 
        id: '7', 
        name: 'Авто', 
        slug: 'auto', 
        productsCount: 180, 
        icon: 'directions_car',
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
      },
      { 
        id: '8', 
        name: 'Детские товары', 
        slug: 'kids', 
        productsCount: 220, 
        icon: 'child_care',
        gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
      }
    ]

    // Mock products
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'iPhone 15 Pro 128GB',
        description: 'Новейший смартфон Apple с передовыми технологиями',
        price: 120000,
        discountPrice: 110000,
        currency: 'RUB',
        images: ['/images/iphone15.jpg'],
        category: '1',
        brand: 'Apple',
        rating: 4.8,
        reviewsCount: 245,
        inStock: true,
        stockQuantity: 50,
        seller: { id: '1', name: 'Official Apple Store', rating: 4.9 },
        badges: ['hit', 'discount'],
        specifications: {
          'Экран': '6.1" OLED',
          'Память': '128GB',
          'Камера': '48MP',
          'Процессор': 'A17 Pro'
        },
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'MacBook Air M3',
        description: 'Ультрабук Apple на новом чипе M3',
        price: 150000,
        currency: 'RUB',
        images: ['/images/macbook-air.jpg'],
        category: '1',
        brand: 'Apple',
        rating: 4.7,
        reviewsCount: 123,
        inStock: true,
        stockQuantity: 25,
        seller: { id: '1', name: 'Official Apple Store', rating: 4.9 },
        badges: ['new'],
        specifications: {
          'Экран': '13.6"',
          'Память': '8GB RAM + 256GB SSD',
          'Процессор': 'Apple M3',
          'Вес': '1.24 кг'
        },
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      }
    ]

    products.value = mockProducts
    featuredProducts.value = mockProducts
  }

  return {
    // State
    products,
    categories,
    featuredProducts,
    currentProduct,
    isLoading,
    error,
    currentFilters,
    pagination,
    
    // Getters
    discountedProducts,
    newProducts,
    hitProducts,
    topRatedProducts,
    brands,
    priceRange,
    
    // Actions
    fetchProducts,
    fetchProductById,
    fetchCategories,
    fetchFeaturedProducts,
    searchProducts,
    applyFilters,
    loadMore,
    resetFilters,
    clearCurrentProduct,
    loadMockData,
  }
}) 