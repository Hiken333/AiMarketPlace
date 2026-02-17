import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, ProductFilters } from './products'

export interface SearchSuggestion {
  id: string
  text: string
  type: 'query' | 'category' | 'brand' | 'product'
  count?: number
  category?: string
}

export interface SearchResult {
  query: string
  products: Product[]
  total: number
  suggestions: SearchSuggestion[]
  filters: {
    categories: Array<{ id: string, name: string, count: number }>
    brands: Array<{ name: string, count: number }>
    priceRange: { min: number, max: number }
    avgRating: number
  }
  searchTime: number
  timestamp: string
}

export interface SearchHistory {
  id: string
  query: string
  timestamp: string
  resultsCount: number
}

export interface TrendingSearch {
  query: string
  count: number
  trend: 'up' | 'down' | 'stable'
}

export const useSearchStore = defineStore('search', () => {
  // State
  const currentQuery = ref('')
  const searchResults = ref<SearchResult | null>(null)
  const suggestions = ref<SearchSuggestion[]>([])
  const searchHistory = ref<SearchHistory[]>([])
  const trendingSearches = ref<TrendingSearch[]>([])
  const isLoading = ref(false)
  const isLoadingSuggestions = ref(false)
  const error = ref<string | null>(null)
  const recentSearches = ref<string[]>([])

  // Constants
  const MAX_HISTORY_ITEMS = 50
  const MAX_RECENT_SEARCHES = 10

  // Load search history from localStorage
  const loadSearchHistory = () => {
    try {
      const saved = localStorage.getItem('searchHistory')
      if (saved) {
        searchHistory.value = JSON.parse(saved)
      }
      
      const savedRecent = localStorage.getItem('recentSearches')
      if (savedRecent) {
        recentSearches.value = JSON.parse(savedRecent)
      }
    } catch (err) {
      console.error('Ошибка загрузки истории поиска:', err)
    }
  }

  // Save search history to localStorage
  const saveSearchHistory = () => {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
    } catch (err) {
      console.error('Ошибка сохранения истории поиска:', err)
    }
  }

  // Getters
  const hasResults = computed(() => 
    searchResults.value && searchResults.value.products.length > 0
  )

  const resultsCount = computed(() => 
    searchResults.value?.total || 0
  )

  const popularCategories = computed(() => 
    searchResults.value?.filters.categories.slice(0, 5) || []
  )

  const topBrands = computed(() => 
    searchResults.value?.filters.brands.slice(0, 10) || []
  )

  const searchSummary = computed(() => {
    if (!searchResults.value) return null
    
    return {
      query: searchResults.value.query,
      total: searchResults.value.total,
      searchTime: searchResults.value.searchTime,
      hasFilters: searchResults.value.filters.categories.length > 0
    }
  })

  const filteredSuggestions = computed(() => {
    if (!currentQuery.value) return []
    
    return suggestions.value.filter(suggestion =>
      suggestion.text.toLowerCase().includes(currentQuery.value.toLowerCase())
    ).slice(0, 8)
  })

  // Actions
  const search = async (query: string, filters: ProductFilters = {}) => {
    if (!query.trim()) return
    
    isLoading.value = true
    error.value = null
    currentQuery.value = query.trim()
    
    try {
      const startTime = Date.now()
      
      // Build search params
      const params = new URLSearchParams()
      params.append('q', query)
      
      if (filters.categoryId) params.append('categoryId', filters.categoryId)
      if (filters.priceMin) params.append('priceMin', filters.priceMin.toString())
      if (filters.priceMax) params.append('priceMax', filters.priceMax.toString())
      if (filters.brands?.length) params.append('brands', filters.brands.join(','))
      if (filters.inStock !== undefined) params.append('inStock', filters.inStock.toString())
      if (filters.rating) params.append('rating', filters.rating.toString())
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      
      // TODO: Replace with actual API call
      const response = await fetch(`/api/search?${params}`)
      
      if (!response.ok) {
        throw new Error('Ошибка поиска')
      }
      
      const data = await response.json()
      const searchTime = Date.now() - startTime
      
      const result: SearchResult = {
        query,
        products: data.products || [],
        total: data.total || 0,
        suggestions: data.suggestions || [],
        filters: data.filters || {
          categories: [],
          brands: [],
          priceRange: { min: 0, max: 0 },
          avgRating: 0
        },
        searchTime,
        timestamp: new Date().toISOString()
      }
      
      searchResults.value = result
      
      // Add to search history
      addToHistory(query, result.total)
      
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка поиска'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const getSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      suggestions.value = []
      return
    }
    
    isLoadingSuggestions.value = true
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`)
      
      if (!response.ok) {
        throw new Error('Ошибка получения подсказок')
      }
      
      const data: SearchSuggestion[] = await response.json()
      suggestions.value = data
      
    } catch (err) {
      console.error('Ошибка получения подсказок:', err)
      // Fallback to mock suggestions
      generateMockSuggestions(query)
    } finally {
      isLoadingSuggestions.value = false
    }
  }

  const addToHistory = (query: string, resultsCount: number) => {
    const historyItem: SearchHistory = {
      id: Date.now().toString(),
      query,
      timestamp: new Date().toISOString(),
      resultsCount
    }
    
    // Remove duplicate
    searchHistory.value = searchHistory.value.filter(item => item.query !== query)
    
    // Add to beginning
    searchHistory.value.unshift(historyItem)
    
    // Limit history size
    if (searchHistory.value.length > MAX_HISTORY_ITEMS) {
      searchHistory.value = searchHistory.value.slice(0, MAX_HISTORY_ITEMS)
    }
    
    // Update recent searches
    recentSearches.value = recentSearches.value.filter(q => q !== query)
    recentSearches.value.unshift(query)
    
    if (recentSearches.value.length > MAX_RECENT_SEARCHES) {
      recentSearches.value = recentSearches.value.slice(0, MAX_RECENT_SEARCHES)
    }
    
    saveSearchHistory()
  }

  const removeFromHistory = (id: string) => {
    searchHistory.value = searchHistory.value.filter(item => item.id !== id)
    saveSearchHistory()
  }

  const clearHistory = () => {
    searchHistory.value = []
    recentSearches.value = []
    saveSearchHistory()
  }

  const clearResults = () => {
    searchResults.value = null
    currentQuery.value = ''
    error.value = null
  }

  const fetchTrendingSearches = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/search/trending')
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки популярных запросов')
      }
      
      const data: TrendingSearch[] = await response.json()
      trendingSearches.value = data
      
    } catch (err) {
      console.error('Ошибка загрузки популярных запросов:', err)
      // Load mock data
      loadMockTrendingSearches()
    }
  }

  // Mock data functions
  const generateMockSuggestions = (query: string) => {
    const mockSuggestions: SearchSuggestion[] = [
      { id: '1', text: `${query} apple`, type: 'query' as const, count: 150 },
      { id: '2', text: `${query} samsung`, type: 'query' as const, count: 120 },
      { id: '3', text: `${query} телефон`, type: 'query' as const, count: 200 },
      { id: '4', text: 'iPhone', type: 'product' as const, category: 'electronics' },
      { id: '5', text: 'Электроника', type: 'category' as const, count: 500 },
      { id: '6', text: 'Apple', type: 'brand' as const, count: 80 }
    ].filter(suggestion => 
      suggestion.text.toLowerCase().includes(query.toLowerCase())
    )
    
    suggestions.value = mockSuggestions
  }

  const loadMockTrendingSearches = () => {
    trendingSearches.value = [
      { query: 'iPhone 15', count: 1500, trend: 'up' },
      { query: 'MacBook Air', count: 1200, trend: 'stable' },
      { query: 'Samsung Galaxy', count: 1000, trend: 'down' },
      { query: 'AirPods', count: 900, trend: 'up' },
      { query: 'iPad', count: 800, trend: 'stable' },
      { query: 'Xiaomi', count: 700, trend: 'up' },
      { query: 'PlayStation 5', count: 600, trend: 'down' },
      { query: 'Nintendo Switch', count: 500, trend: 'stable' }
    ]
  }

  const loadMockData = () => {
    loadMockTrendingSearches()
    
    // Mock recent searches
    recentSearches.value = [
      'iPhone 15 Pro',
      'MacBook Air M3',
      'AirPods Pro',
      'iPad',
      'Samsung Galaxy S24'
    ]
    
    // Mock search history
    searchHistory.value = [
      {
        id: '1',
        query: 'iPhone 15 Pro',
        timestamp: '2024-01-20T10:00:00Z',
        resultsCount: 25
      },
      {
        id: '2',
        query: 'MacBook Air M3',
        timestamp: '2024-01-19T15:30:00Z',
        resultsCount: 12
      },
      {
        id: '3',
        query: 'AirPods Pro',
        timestamp: '2024-01-18T09:15:00Z',
        resultsCount: 18
      }
    ]
  }

  // Quick search for common queries
  const quickSearch = async (query: string) => {
    currentQuery.value = query
    return await search(query)
  }

  // Search by category
  const searchByCategory = async (categoryId: string, categoryName: string) => {
    currentQuery.value = categoryName
    return await search(categoryName, { categoryId })
  }

  // Search by brand
  const searchByBrand = async (brand: string) => {
    currentQuery.value = brand
    return await search(brand, { brands: [brand] })
  }

  // Initialize
  loadSearchHistory()

  return {
    // State
    currentQuery,
    searchResults,
    suggestions,
    searchHistory,
    trendingSearches,
    recentSearches,
    isLoading,
    isLoadingSuggestions,
    error,
    
    // Getters
    hasResults,
    resultsCount,
    popularCategories,
    topBrands,
    searchSummary,
    filteredSuggestions,
    
    // Actions
    search,
    getSuggestions,
    addToHistory,
    removeFromHistory,
    clearHistory,
    clearResults,
    fetchTrendingSearches,
    quickSearch,
    searchByCategory,
    searchByBrand,
    loadMockData,
  }
}) 