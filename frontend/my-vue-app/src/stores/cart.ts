import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from './products'

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
  addedAt: string
}

export interface PromoCode {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
  minAmount?: number
  maxDiscount?: number
}

export interface CartSummary {
  subtotal: number
  discount: number
  shipping: number
  total: number
  itemsCount: number
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  const appliedPromoCode = ref<PromoCode | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Constants
  const FREE_SHIPPING_THRESHOLD = 3000
  const SHIPPING_COST = 300

  // Load cart from localStorage on init
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        items.value = JSON.parse(savedCart)
      }
    } catch (err) {
      console.error('Ошибка загрузки корзины из localStorage:', err)
    }
  }

  // Save cart to localStorage
  const saveCartToStorage = () => {
    try {
      localStorage.setItem('cart', JSON.stringify(items.value))
    } catch (err) {
      console.error('Ошибка сохранения корзины в localStorage:', err)
    }
  }

  // Getters
  const itemsCount = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const subtotal = computed(() => 
    items.value.reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.price
      return sum + (price * item.quantity)
    }, 0)
  )

  const discount = computed(() => {
    if (!appliedPromoCode.value) return 0
    
    const promo = appliedPromoCode.value
    let discountAmount = 0
    
    if (promo.type === 'percentage') {
      discountAmount = subtotal.value * (promo.discount / 100)
      if (promo.maxDiscount) {
        discountAmount = Math.min(discountAmount, promo.maxDiscount)
      }
    } else {
      discountAmount = promo.discount
    }
    
    return Math.min(discountAmount, subtotal.value)
  })

  const shipping = computed(() => {
    if (subtotal.value >= FREE_SHIPPING_THRESHOLD) return 0
    if (items.value.length === 0) return 0
    return SHIPPING_COST
  })

  const total = computed(() => 
    Math.max(0, subtotal.value - discount.value + shipping.value)
  )

  const cartSummary = computed((): CartSummary => ({
    subtotal: subtotal.value,
    discount: discount.value,
    shipping: shipping.value,
    total: total.value,
    itemsCount: itemsCount.value
  }))

  const isEmpty = computed(() => items.value.length === 0)

  const hasProduct = (productId: string): boolean => {
    return items.value.some(item => item.product.id === productId)
  }

  const getItemQuantity = (productId: string): number => {
    const item = items.value.find(item => item.product.id === productId)
    return item?.quantity || 0
  }

  // Actions
  const addToCart = (product: Product, quantity = 1, options?: { size?: string, color?: string }) => {
    error.value = null
    
    try {
      const existingItemIndex = items.value.findIndex(item => 
        item.product.id === product.id && 
        item.selectedSize === options?.size &&
        item.selectedColor === options?.color
      )

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const newQuantity = items.value[existingItemIndex].quantity + quantity
        if (newQuantity <= product.stockQuantity) {
          items.value[existingItemIndex].quantity = newQuantity
        } else {
          throw new Error(`Недостаточно товара на складе. Доступно: ${product.stockQuantity}`)
        }
      } else {
        // Add new item
        if (quantity <= product.stockQuantity) {
          const cartItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            product,
            quantity,
            selectedSize: options?.size,
            selectedColor: options?.color,
            addedAt: new Date().toISOString()
          }
          items.value.push(cartItem)
        } else {
          throw new Error(`Недостаточно товара на складе. Доступно: ${product.stockQuantity}`)
        }
      }
      
      saveCartToStorage()
      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка добавления в корзину'
      return { success: false, error: error.value }
    }
  }

  const removeFromCart = (itemId: string) => {
    const index = items.value.findIndex(item => item.id === itemId)
    if (index !== -1) {
      items.value.splice(index, 1)
      saveCartToStorage()
    }
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    const item = items.value.find(item => item.id === itemId)
    if (!item) return
    
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    
    if (quantity <= item.product.stockQuantity) {
      item.quantity = quantity
      saveCartToStorage()
    } else {
      error.value = `Недостаточно товара на складе. Доступно: ${item.product.stockQuantity}`
    }
  }

  const clearCart = () => {
    items.value = []
    appliedPromoCode.value = null
    saveCartToStorage()
    localStorage.removeItem('appliedPromoCode')
  }

  const applyPromoCode = async (code: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, amount: subtotal.value }),
      })
      
      if (!response.ok) {
        throw new Error('Промокод недействителен или истек')
      }
      
      const promoCode: PromoCode = await response.json()
      
      if (promoCode.minAmount && subtotal.value < promoCode.minAmount) {
        throw new Error(`Минимальная сумма заказа для применения промокода: ${promoCode.minAmount} ₽`)
      }
      
      appliedPromoCode.value = promoCode
      localStorage.setItem('appliedPromoCode', JSON.stringify(promoCode))
      
      return { success: true, promoCode }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка применения промокода'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const removePromoCode = () => {
    appliedPromoCode.value = null
    localStorage.removeItem('appliedPromoCode')
  }

  const syncWithServer = async () => {
    // TODO: Sync cart with server for logged in users
    console.log('Синхронизация корзины с сервером...')
  }

  // Mock promo codes for development
  const mockPromoCodes: PromoCode[] = [
    { code: 'WELCOME10', discount: 10, type: 'percentage', maxDiscount: 1000 },
    { code: 'SAVE500', discount: 500, type: 'fixed', minAmount: 2000 },
    { code: 'FREESHIP', discount: 300, type: 'fixed' }
  ]

  const validateMockPromoCode = (code: string): PromoCode | null => {
    return mockPromoCodes.find(promo => promo.code === code) || null
  }

  // Load saved promo code
  const loadSavedPromoCode = () => {
    try {
      const savedPromo = localStorage.getItem('appliedPromoCode')
      if (savedPromo) {
        appliedPromoCode.value = JSON.parse(savedPromo)
      }
    } catch (err) {
      console.error('Ошибка загрузки промокода:', err)
    }
  }

  // Initialize cart
  loadCartFromStorage()
  loadSavedPromoCode()

  return {
    // State
    items,
    appliedPromoCode,
    isLoading,
    error,
    
    // Getters
    itemsCount,
    subtotal,
    discount,
    shipping,
    total,
    cartSummary,
    isEmpty,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
    hasProduct,
    getItemQuantity,
    syncWithServer,
    validateMockPromoCode,
  }
}) 