<template>
  <q-card 
    flat 
    bordered 
    class="product-card cursor-pointer q-hoverable"
    @click="navigateToProduct"
  >
    <!-- Product Image -->
    <div class="image-container relative-position">
      <q-img
        :src="product.images?.[0] || 'https://via.placeholder.com/300x300/6A1B9A/FFFFFF?text=' + encodeURIComponent(product.name)"
        :ratio="1"
        class="rounded-borders-top"
        loading="lazy"
      >
        <template v-slot:error>
          <div class="absolute-full flex flex-center bg-grey-3">
            <q-icon name="broken_image" size="3rem" color="grey-5" />
          </div>
        </template>
      </q-img>

      <!-- Badge -->
      <q-badge 
        v-if="product.badges?.length" 
        :color="getBadgeColor(product.badges[0])"
        class="badge absolute-top-left q-ma-sm"
      >
        {{ product.badges[0].toUpperCase() }}
      </q-badge>

      <!-- Favorite Button -->
      <q-btn
        :icon="isFavorite ? 'favorite' : 'favorite_border'"
        :color="isFavorite ? 'negative' : 'grey-6'"
        flat
        round
        dense
        class="favorite-btn absolute-top-right q-ma-sm"
        @click.stop="toggleFavorite"
      />
    </div>

    <!-- Product Info -->
    <q-card-section class="product-info q-pa-md">
      <!-- Rating -->
      <div class="rating-section row items-center q-mb-sm">
        <q-rating
          :model-value="product.rating"
          readonly
          size="sm"
          color="warning"
          icon="star"
          icon-half="star_half"
        />
        <span class="text-grey-8 text-caption q-ml-xs">
          ({{ product.reviewsCount }})
        </span>
      </div>

      <!-- Product Name -->
      <div class="product-name text-body1 q-mb-sm text-weight-medium">
        {{ product.name }}
      </div>

      <!-- Price Section -->
      <div class="price-section">
        <div class="row items-baseline">
          <div class="text-h6 text-weight-bold text-primary">
            {{ formatPrice(product.discountPrice || product.price) }} ₽
          </div>
          <div 
            v-if="product.discountPrice" 
            class="text-caption text-grey-8 text-strike q-ml-sm"
          >
            {{ formatPrice(product.price) }} ₽
          </div>
        </div>
        
        <!-- Discount Badge -->
        <div v-if="product.discountPrice" class="discount-badge q-mt-xs">
          <q-badge color="negative" class="text-caption">
            -{{ getDiscountPercent() }}%
          </q-badge>
        </div>
      </div>

      <!-- Stock Status -->
      <div class="stock-status q-mt-sm">
        <q-chip
          :color="getStockColor()"
          :text-color="getStockTextColor()"
          size="sm"
          dense
        >
          {{ getStockText() }}
        </q-chip>
      </div>
    </q-card-section>

    <!-- Action Buttons -->
    <q-card-actions class="q-px-md q-pb-md">
      <q-btn
        color="primary"
        :label="isInCart ? 'В корзине' : 'В корзину'"
        :icon="isInCart ? 'shopping_cart' : 'add_shopping_cart'"
        :outline="isInCart"
        no-caps
        class="full-width"
        @click.stop="toggleCart"
        :disable="!product.inStock"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores'
import type { Product } from '@/stores'

interface Props {
  product: Product
}

const props = defineProps<Props>()
const router = useRouter()
const cartStore = useCartStore()

// Reactive state
const isFavorite = ref(false)

// Computed
const isInCart = computed(() => cartStore.hasProduct(props.product.id))
const cartQuantity = computed(() => cartStore.getItemQuantity(props.product.id))

// Methods
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU').format(price)
}

const getBadgeColor = (badge: string): string => {
  const colors: Record<string, string> = {
    'hit': 'negative',
    'new': 'info',
    'discount': 'warning',
    'ХИТ': 'negative',
    'НОВИНКА': 'info',
    'СКИДКА': 'warning',
    'SALE': 'negative'
  }
  return colors[badge.toLowerCase()] || 'primary'
}

const getDiscountPercent = (): number => {
  if (!props.product.discountPrice) return 0
  return Math.round(((props.product.price - props.product.discountPrice) / props.product.price) * 100)
}

const getStockColor = (): string => {
  return props.product.inStock !== false ? 'positive' : 'negative'
}

const getStockTextColor = (): string => {
  return 'white'
}

const getStockText = (): string => {
  return props.product.inStock !== false ? 'В наличии' : 'Нет в наличии'
}

const navigateToProduct = () => {
  router.push(`/product/${props.product.id}`)
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  // TODO: Add to favorites store
  console.log(`${isFavorite.value ? '❤️' : '💔'} Favorites toggled for ${props.product.name}`)
}

const toggleCart = () => {
  if (!props.product.inStock) return
  
  if (isInCart.value) {
    // Remove from cart - for simplicity, we'll remove all quantities
    const cartItems = cartStore.items.filter(item => item.product.id === props.product.id)
    cartItems.forEach(item => cartStore.removeFromCart(item.id))
    console.log(`🗑️ Removed ${props.product.name} from cart`)
  } else {
    // Add to cart
    const result = cartStore.addToCart(props.product)
    if (result.success) {
      console.log(`🛒 Added ${props.product.name} to cart (${cartStore.itemsCount} items)`)
    } else {
      console.error(`❌ Error: ${result.error}`)
    }
  }
}
</script>

<style scoped>
.product-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  border-radius: 16px;
  background: white;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  border: none;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(106, 27, 154, 0.15);
}

.image-container {
  overflow: hidden;
  position: relative;
  border-radius: 16px 16px 0 0;
  background: linear-gradient(135deg, #f8f9ff, #ffffff);
}

.badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.favorite-btn {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.favorite-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.product-info {
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-section .q-rating {
  font-size: 0.9rem;
}

.product-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  min-height: 2.8em;
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.95rem;
}

.price-section {
  min-height: 60px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price-section .row {
  align-items: baseline;
  gap: 8px;
}

.price-section .text-h6 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #6A1B9A;
}

.text-strike {
  text-decoration: line-through;
  opacity: 0.7;
}

.discount-badge .q-badge {
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 12px;
  padding: 4px 8px;
}

.stock-status {
  min-height: 30px;
  display: flex;
  align-items: center;
}

.stock-status .q-chip {
  border-radius: 16px;
  font-weight: 600;
  font-size: 0.75rem;
}

.q-card-actions {
  padding: 0 20px 20px 20px;
  margin-top: auto;
}

.q-card-actions .q-btn {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-transform: none;
}

.q-card-actions .q-btn:not([outline]) {
  background: linear-gradient(135deg, #6A1B9A, #8E24AA);
  color: white;
  box-shadow: 0 4px 15px rgba(106, 27, 154, 0.3);
}

.q-card-actions .q-btn:not([outline]):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(106, 27, 154, 0.4);
}

.q-card-actions .q-btn[outline] {
  border: 2px solid #6A1B9A;
  color: #6A1B9A;
  background: rgba(106, 27, 154, 0.05);
}

.q-card-actions .q-btn[outline]:hover {
  background: rgba(106, 27, 154, 0.1);
  transform: translateY(-2px);
}

.q-card-actions .q-btn:disabled {
  opacity: 0.5;
  transform: none !important;
  box-shadow: none !important;
}

/* Badge Colors */
.q-badge.bg-negative {
  background: linear-gradient(135deg, #F44336, #E57373) !important;
}

.q-badge.bg-info {
  background: linear-gradient(135deg, #2196F3, #64B5F6) !important;
}

.q-badge.bg-warning {
  background: linear-gradient(135deg, #FF9800, #FFB74D) !important;
}

.q-badge.bg-primary {
  background: linear-gradient(135deg, #6A1B9A, #AB47BC) !important;
}

/* Hover animations for image */
.product-card:hover .q-img {
  transform: scale(1.05);
  transition: transform 0.4s ease;
}

.q-img {
  transition: transform 0.4s ease;
}

/* Mobile optimizations */
@media (max-width: 600px) {
  .product-info {
    padding: 16px;
    gap: 10px;
  }
  
  .product-name {
    font-size: 0.9rem;
    min-height: 2.4em;
  }
  
  .price-section .text-h6 {
    font-size: 1.1rem;
  }
  
  .q-card-actions {
    padding: 0 16px 16px 16px;
  }
  
  .q-card-actions .q-btn {
    padding: 10px 20px;
    font-size: 0.85rem;
  }
}
</style> 