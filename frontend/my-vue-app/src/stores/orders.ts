import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from './products'
import type { CartItem } from './cart'

export interface OrderItem {
  id: string
  product: Product
  quantity: number
  price: number // Price at the time of order
  selectedSize?: string
  selectedColor?: string
}

export interface ShippingAddress {
  id?: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  country: string
  city: string
  address: string
  postalCode: string
  isDefault?: boolean
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'cash' | 'online'
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  isDefault?: boolean
}

export interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  items: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  subtotal: number
  discount: number
  shipping: number
  total: number
  promoCode?: string
  estimatedDelivery?: string
  trackingNumber?: string
  createdAt: string
  updatedAt: string
  notes?: string
}

export interface CreateOrderData {
  items: CartItem[]
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  promoCode?: string
  notes?: string
}

export const useOrdersStore = defineStore('orders', () => {
  // State
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const shippingAddresses = ref<ShippingAddress[]>([])
  const paymentMethods = ref<PaymentMethod[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeOrders = computed(() => 
    orders.value.filter(order => 
      !['delivered', 'cancelled', 'returned'].includes(order.status)
    )
  )

  const completedOrders = computed(() => 
    orders.value.filter(order => order.status === 'delivered')
  )

  const cancelledOrders = computed(() => 
    orders.value.filter(order => 
      ['cancelled', 'returned'].includes(order.status)
    )
  )

  const ordersByStatus = computed(() => {
    const grouped: Record<string, Order[]> = {}
    orders.value.forEach(order => {
      if (!grouped[order.status]) {
        grouped[order.status] = []
      }
      grouped[order.status].push(order)
    })
    return grouped
  })

  const totalOrdersValue = computed(() => 
    orders.value.reduce((sum, order) => sum + order.total, 0)
  )

  const defaultShippingAddress = computed(() => 
    shippingAddresses.value.find(addr => addr.isDefault)
  )

  const defaultPaymentMethod = computed(() => 
    paymentMethods.value.find(method => method.isDefault)
  )

  // Status labels in Russian
  const getStatusLabel = (status: Order['status']): string => {
    const labels: Record<Order['status'], string> = {
      pending: 'Ожидает подтверждения',
      confirmed: 'Подтвержден',
      processing: 'Обрабатывается',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменен',
      returned: 'Возвращен'
    }
    return labels[status]
  }

  // Actions
  const fetchOrders = async () => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Ошибка загрузки заказов')
      }

      const data: Order[] = await response.json()
      orders.value = data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки заказов'
    } finally {
      isLoading.value = false
    }
  }

  const fetchOrderById = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Заказ не найден')
      }

      const order: Order = await response.json()
      currentOrder.value = order

      return order
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки заказа'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createOrder = async (orderData: CreateOrderData) => {
    isLoading.value = true
    error.value = null

    try {
      const orderItems: OrderItem[] = orderData.items.map(item => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        price: item.product.discountPrice || item.product.price,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor
      }))

      const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const shipping = subtotal >= 3000 ? 0 : 300
      
      const newOrder: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'> = {
        status: 'pending',
        items: orderItems,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        subtotal,
        discount: 0, // TODO: Calculate discount from promo code
        shipping,
        total: subtotal + shipping,
        promoCode: orderData.promoCode,
        notes: orderData.notes
      }

      // TODO: Replace with actual API call
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newOrder),
      })

      if (!response.ok) {
        throw new Error('Ошибка создания заказа')
      }

      const createdOrder: Order = await response.json()
      orders.value.unshift(createdOrder)
      currentOrder.value = createdOrder

      return { success: true, order: createdOrder }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка создания заказа'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const cancelOrder = async (orderId: string, reason?: string) => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ reason }),
      })

      if (!response.ok) {
        throw new Error('Ошибка отмены заказа')
      }

      const updatedOrder: Order = await response.json()
      const index = orders.value.findIndex(order => order.id === orderId)
      if (index !== -1) {
        orders.value[index] = updatedOrder
      }

      if (currentOrder.value?.id === orderId) {
        currentOrder.value = updatedOrder
      }

      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка отмены заказа'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const trackOrder = async (orderId: string) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/orders/${orderId}/tracking`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Ошибка отслеживания заказа')
      }

      const trackingInfo = await response.json()
      return trackingInfo
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка отслеживания заказа'
      throw err
    }
  }

  // Shipping addresses
  const fetchShippingAddresses = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/user/addresses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Ошибка загрузки адресов')
      }

      const addresses: ShippingAddress[] = await response.json()
      shippingAddresses.value = addresses
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки адресов'
    }
  }

  const addShippingAddress = async (address: Omit<ShippingAddress, 'id'>) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(address),
      })

      if (!response.ok) {
        throw new Error('Ошибка добавления адреса')
      }

      const newAddress: ShippingAddress = await response.json()
      shippingAddresses.value.push(newAddress)

      return { success: true, address: newAddress }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка добавления адреса'
      return { success: false, error: error.value }
    }
  }

  // Payment methods
  const fetchPaymentMethods = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/user/payment-methods', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Ошибка загрузки способов оплаты')
      }

      const methods: PaymentMethod[] = await response.json()
      paymentMethods.value = methods
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка загрузки способов оплаты'
    }
  }

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id'>) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/user/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(method),
      })

      if (!response.ok) {
        throw new Error('Ошибка добавления способа оплаты')
      }

      const newMethod: PaymentMethod = await response.json()
      paymentMethods.value.push(newMethod)

      return { success: true, method: newMethod }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка добавления способа оплаты'
      return { success: false, error: error.value }
    }
  }

  const clearCurrentOrder = () => {
    currentOrder.value = null
  }

  // Mock data for development
  const loadMockData = () => {
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'AI-2024-001',
        status: 'shipped',
        items: [
          {
            id: '1',
            product: {
              id: '1',
              name: 'iPhone 15 Pro 128GB',
              description: 'Новейший смартфон Apple',
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
              specifications: {},
              createdAt: '2024-01-15T10:00:00Z',
              updatedAt: '2024-01-15T10:00:00Z'
            },
            quantity: 1,
            price: 110000
          }
        ],
        shippingAddress: {
          firstName: 'Иван',
          lastName: 'Петров',
          phone: '+7 999 123-45-67',
          country: 'Россия',
          city: 'Москва',
          address: 'ул. Тверская, д. 1',
          postalCode: '101000'
        },
        paymentMethod: {
          id: '1',
          type: 'card',
          cardNumber: '•••• 1234',
          isDefault: true
        },
        subtotal: 110000,
        discount: 0,
        shipping: 0,
        total: 110000,
        trackingNumber: 'AI123456789',
        estimatedDelivery: '2024-01-25',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-22T14:30:00Z'
      }
    ]

    orders.value = mockOrders
  }

  return {
    // State
    orders,
    currentOrder,
    shippingAddresses,
    paymentMethods,
    isLoading,
    error,

    // Getters
    activeOrders,
    completedOrders,
    cancelledOrders,
    ordersByStatus,
    totalOrdersValue,
    defaultShippingAddress,
    defaultPaymentMethod,

    // Actions
    fetchOrders,
    fetchOrderById,
    createOrder,
    cancelOrder,
    trackOrder,
    fetchShippingAddresses,
    addShippingAddress,
    fetchPaymentMethods,
    addPaymentMethod,
    clearCurrentOrder,
    getStatusLabel,
    loadMockData,
  }
}) 