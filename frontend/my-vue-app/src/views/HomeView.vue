<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { useProductsStore, useCartStore } from '@/stores'
import { initializeMockData } from '@/utils/mock-data'

// Stores
const productsStore = useProductsStore()
const cartStore = useCartStore()

// Local state
const slide = ref(1)
const isLoading = ref(false)

// Computed properties from stores
const featuredProducts = computed(() => productsStore.featuredProducts)
const categories = computed(() => productsStore.categories)

// Local banners data
const banners = ref([
  {
    id: 1,
    title: 'Супер скидки до 70%',
    subtitle: 'На электронику и гаджеты',
    gradient: '#6A1B9A, #8E24AA, #AB47BC',
    icon: 'local_offer',
    link: '/sales'
  },
  {
    id: 2,
    title: 'Новая коллекция весна 2024',
    subtitle: 'Одежда и аксессуары',
    gradient: '#E91E63, #F06292, #F48FB1',
    icon: 'style',
    link: '/new'
  },
  {
    id: 3,
    title: 'Бесплатная доставка',
    subtitle: 'При заказе от 2000 рублей',
    gradient: '#4CAF50, #66BB6A, #81C784',
    icon: 'local_shipping',
    link: '/delivery'
  }
])

// Methods
const addToCart = (product: any) => {
  const result = cartStore.addToCart(product)
  if (result.success) {
    console.log(`✅ Товар "${product.name}" добавлен в корзину (${cartStore.itemsCount} товаров)`)
  } else {
    console.error(`❌ Ошибка: ${result.error}`)
  }
}

const loadHomeData = async () => {
  isLoading.value = true

  try {
    // Initialize all mock data
    initializeMockData()

    // Simulate loading time
    setTimeout(() => {
      isLoading.value = false
      console.log('🏠 Homepage loaded with stores integration')
      console.log('📱 Featured products:', featuredProducts.value.length)
      console.log('📂 Categories:', categories.value.length)
      console.log('🛒 Cart items:', cartStore.itemsCount)
    }, 1000)

  } catch (error) {
    console.error('Error loading home data:', error)
    isLoading.value = false
  }
}

onMounted(() => {
  loadHomeData()
})
</script>

<template>
  <q-page class="homepage">
    <!-- Hero Banners -->
    <section class="hero-section q-pa-lg">
      <q-carousel
        v-model="slide"
        swipeable
        animated
        arrows
        infinite
        :autoplay="5000"
        height="450px"
        class="hero-carousel rounded-borders shadow-10"
      >
        <q-carousel-slide
          v-for="banner in banners"
          :key="banner.id"
          :name="banner.id"
          class="column no-wrap flex-center hero-slide"
          :style="`background: linear-gradient(135deg, ${banner.gradient}); position: relative;`"
        >
          <div class="hero-content text-center text-white relative-position">
            <div class="hero-title text-h2 text-weight-bold q-mb-md">{{ banner.title }}</div>
            <div class="hero-subtitle text-h5 q-mb-xl opacity-90">{{ banner.subtitle }}</div>
            <q-btn
              color="white"
              text-color="primary"
              size="xl"
              label="Смотреть товары"
              rounded
              unelevated
              class="hero-btn"
              @click="$router.push(banner.link)"
            />
          </div>
          <div class="hero-decoration">
            <q-icon :name="banner.icon" size="120px" class="hero-icon" />
          </div>
        </q-carousel-slide>
      </q-carousel>
    </section>

    <!-- Categories -->
    <section class="categories-section q-pa-lg">
      <div class="section-header text-center q-mb-xl">
        <div class="text-h3 text-weight-bold q-mb-md">Популярные категории</div>
        <div class="text-h6 text-grey-9">Выберите категорию и найдите всё что нужно</div>
      </div>
      <div class="row q-col-gutter-lg">
        <div
          v-for="category in categories"
          :key="category.id"
          class="col-lg-2 col-md-3 col-sm-4 col-6"
        >
          <q-card
            flat
            class="category-card cursor-pointer"
            @click="$router.push(`/catalog/${category.id}`)"
          >
            <div class="category-image-container">
              <div
                class="category-background"
                :style="`background: ${category.gradient}`"
              ></div>
              <div class="category-content flex flex-center">
                <q-icon :name="category.icon" size="3rem" color="white" />
              </div>
            </div>
            <q-card-section class="text-center q-pa-md">
              <div class="text-subtitle1 text-weight-bold text-black">{{ category.name }}</div>
              <div class="text-caption text-grey-9 text-weight-medium">{{ category.productsCount }} товаров</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="products-section q-pa-lg">
      <div class="section-header text-center q-mb-xl">
        <div class="text-h3 text-weight-bold q-mb-md">Рекомендуемые товары</div>
        <div class="text-h6 text-grey-9">Специально подобранные для вас товары</div>
      </div>

      <q-inner-loading :showing="isLoading" class="products-loading">
        <div class="loading-content">
          <q-spinner-ios size="60px" color="primary" />
          <div class="text-h6 q-mt-md text-primary">Загружаем товары...</div>
        </div>
      </q-inner-loading>

      <div class="products-grid" v-if="!isLoading">
        <div
          v-for="product in featuredProducts"
          :key="product.id"
          class="product-item"
        >
          <ProductCard :product="product" />
        </div>
      </div>

      <div class="text-center q-mt-xl">
        <q-btn
          color="primary"
          unelevated
          size="lg"
          label="Посмотреть все товары"
          icon-right="arrow_forward"
          class="view-all-btn"
          @click="$router.push('/catalog')"
        />
      </div>
    </section>

    <!-- Special Offers -->
    <section class="special-offers-section q-pa-lg">
      <div class="section-header text-center q-mb-xl">
        <div class="text-h3 text-weight-bold q-mb-md">Специальные предложения</div>
        <div class="text-h6 text-grey-9">Лучшие предложения только для вас</div>
      </div>
      <div class="row q-col-gutter-xl">
        <div class="col-md-4 col-12">
          <q-card class="offer-card" flat>
            <div class="offer-content" style="background: linear-gradient(135deg, #6A1B9A, #8E24AA);">
              <div class="offer-icon">
                <q-icon name="local_offer" size="3rem" color="white" />
              </div>
              <div class="offer-text text-white">
                <div class="text-h5 text-weight-bold">Скидки до 50%</div>
                <div class="text-subtitle2 opacity-90">На смартфоны и планшеты</div>
              </div>
            </div>
          </q-card>
        </div>
        <div class="col-md-4 col-12">
          <q-card class="offer-card" flat>
            <div class="offer-content" style="background: linear-gradient(135deg, #4CAF50, #66BB6A);">
              <div class="offer-icon">
                <q-icon name="local_shipping" size="3rem" color="white" />
              </div>
              <div class="offer-text text-white">
                <div class="text-h5 text-weight-bold">Бесплатная доставка</div>
                <div class="text-subtitle2 opacity-90">При заказе от 2000 ₽</div>
              </div>
            </div>
          </q-card>
        </div>
        <div class="col-md-4 col-12">
          <q-card class="offer-card" flat>
            <div class="offer-content" style="background: linear-gradient(135deg, #FF5722, #FF7043);">
              <div class="offer-icon">
                <q-icon name="assignment_return" size="3rem" color="white" />
              </div>
              <div class="offer-text text-white">
                <div class="text-h5 text-weight-bold">Легкий возврат</div>
                <div class="text-subtitle2 opacity-90">В течение 14 дней</div>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </section>

    <!-- Advantages -->
    <section class="q-pa-lg">
      <div class="text-h4 text-weight-bold q-mb-lg text-center text-black">Почему выбирают нас</div>
      <div class="row q-col-gutter-lg">
        <div class="col-md-3 col-sm-6 col-12">
          <div class="text-center">
            <q-icon name="local_shipping" size="3rem" color="primary" class="q-mb-md" />
            <div class="text-h6 q-mb-sm text-black">Быстрая доставка</div>
            <div class="text-grey-9">Доставим ваш заказ в течение дня</div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 col-12">
          <div class="text-center">
            <q-icon name="verified_user" size="3rem" color="primary" class="q-mb-md" />
            <div class="text-h6 q-mb-sm text-black">Гарантия качества</div>
            <div class="text-grey-9">Все товары сертифицированы</div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 col-12">
          <div class="text-center">
            <q-icon name="support_agent" size="3rem" color="primary" class="q-mb-md" />
            <div class="text-h6 q-mb-sm text-black">Поддержка 24/7</div>
            <div class="text-grey-9">Круглосуточная помощь клиентам</div>
          </div>
        </div>
        <div class="col-md-3 col-sm-6 col-12">
          <div class="text-center">
            <q-icon name="assignment_return" size="3rem" color="primary" class="q-mb-md" />
            <div class="text-h6 q-mb-sm text-black">Легкий возврат</div>
            <div class="text-grey-9">Вернем деньги в течение 14 дней</div>
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<style scoped>
/* Page Background */
.homepage {
  background: linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%);
  min-height: 100%;
  min-width: 100%;

}

/* Hero Section */
.hero-section {
  background: transparent;
}

.hero-carousel {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(106, 27, 154, 0.2);
}

.hero-slide {
  border-radius: 20px;
  overflow: hidden;
}

.hero-content {
  z-index: 2;
  max-width: 600px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  text-shadow: 0 2px 20px rgba(0,0,0,0.3);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.4rem;
  font-weight: 400;
  text-shadow: 0 1px 10px rgba(0,0,0,0.2);
}

.hero-btn {
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(255,255,255,0.3);
  transition: all 0.3s ease;
}

.hero-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(255,255,255,0.4);
}

.hero-decoration {
  position: absolute;
  top: 20px;
  right: 40px;
  opacity: 0.3;
  z-index: 1;
}

.hero-icon {
  filter: drop-shadow(0 4px 20px rgba(255,255,255,0.2));
}

/* Section Headers */
.section-header {
  margin-bottom: 60px;
}

.section-header .text-h3 {
  color: #1a1a1a;
  font-weight: 700;
}

/* Categories Section */
.categories-section {
  background: transparent;
  padding: 80px 32px;
}

.category-card {
  transition: all 0.4s ease;
  border-radius: 20px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.category-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.category-image-container {
  position: relative;
  height: 140px;
  overflow: hidden;
}

.category-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: transform 0.4s ease;
}

.category-card:hover .category-background {
  transform: scale(1.1);
}

.category-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}

/* Products Section */
.products-section {
  background: white;
  padding: 80px 32px;
  margin: 40px 0;
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  position: relative;
}

.products-loading {
  border-radius: 20px;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.product-item {
  display: flex;
}

.view-all-btn {
  background: linear-gradient(135deg, #6A1B9A, #8E24AA);
  color: white;
  border-radius: 15px;
  padding: 16px 32px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-transform: none;
  box-shadow: 0 8px 25px rgba(106, 27, 154, 0.2);
}

.view-all-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(106, 27, 154, 0.3);
}

/* Special Offers */
.special-offers-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 80px 32px;
  margin: 40px 0;
  border-radius: 30px;
}

.offer-card {
  transition: all 0.4s ease;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
}

.offer-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.offer-content {
  padding: 40px 30px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 140px;
  position: relative;
  overflow: hidden;
}

.offer-content::before {
  content: '';
  position: absolute;
  top: 0;
  right: -20px;
  width: 100px;
  height: 100px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  transform: translate(20px, -20px);
}

.offer-icon {
  flex-shrink: 0;
  background: rgba(255,255,255,0.2);
  border-radius: 15px;
  padding: 15px;
  backdrop-filter: blur(10px);
}

.offer-text {
  flex: 1;
}

/* Advantages Section */
.q-pa-lg:last-child {
  background: white;
  padding: 80px 32px;
  border-radius: 30px 30px 0 0;
}

.q-pa-lg:last-child .text-center {
  padding: 30px 20px;
  border-radius: 15px;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}

.q-pa-lg:last-child .text-center:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.15);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-decoration {
    display: none;
  }

  .offer-content {
    padding: 30px 20px;
    min-height: 120px;
  }

  .offer-icon {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .categories-section,
  .special-offers-section {
    padding: 60px 20px;
  }
}
</style>
