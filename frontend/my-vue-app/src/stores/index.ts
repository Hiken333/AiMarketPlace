// Export all stores for easy importing
export { useUserStore } from './user'
export { useProductsStore } from './products'
export { useCartStore } from './cart'
export { useOrdersStore } from './orders'
export { useSearchStore } from './search'

// Export types
export type { User, LoginCredentials, RegisterData } from './user'
export type { Product, Category, ProductFilters } from './products'
export type { CartItem, PromoCode, CartSummary } from './cart'
export type { Order, OrderItem, ShippingAddress, PaymentMethod, CreateOrderData } from './orders'
export type { SearchSuggestion, SearchResult, SearchHistory, TrendingSearch } from './search' 