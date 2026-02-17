<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header class="modern-header bg-white text-dark">
      <q-toolbar class="q-px-lg modern-toolbar">
        <!-- Logo -->
        <q-toolbar-title>
          <router-link to="/" class="logo-link">
            <div class="logo-container">
              <q-icon name="shopping_bag" size="28px" class="logo-icon" />
              <span class="logo-text">AI Market</span>
            </div>
          </router-link>
        </q-toolbar-title>

        <!-- Search Bar -->
        <div class="search-container">
          <q-input 
            v-model="searchQuery"
            placeholder="Найти товары, бренды и категории..."
            class="modern-search"
            borderless
            @keyup.enter="handleSearch"
          >
            <template v-slot:prepend>
              <q-icon name="search" class="search-icon" />
            </template>
            <template v-slot:append>
              <q-btn 
                flat 
                round
                dense 
                icon="tune" 
                @click="showFilters = !showFilters"
                class="filter-btn"
              />
            </template>
          </q-input>
        </div>

        <!-- User Actions -->
        <div class="user-actions">
          <!-- Favorites -->
          <q-btn 
            flat 
            round
            icon="favorite_border" 
            class="action-btn"
            @click="$router.push('/favorites')"
          >
            <q-badge v-if="favoritesCount" color="negative" floating class="modern-badge">
              {{ favoritesCount }}
            </q-badge>
            <q-tooltip>Избранное</q-tooltip>
          </q-btn>

          <!-- Cart -->
          <q-btn 
            flat 
            round
            icon="shopping_cart" 
            class="action-btn"
            @click="$router.push('/cart')"
          >
            <q-badge v-if="cartCount" color="negative" floating class="modern-badge">
              {{ cartCount }}
            </q-badge>
            <q-tooltip>Корзина</q-tooltip>
          </q-btn>

          <!-- User Profile -->
          <q-btn 
            flat 
            round
            icon="person" 
            class="action-btn user-profile-btn"
            @click="$router.push('/profile')"
          >
            <q-tooltip>Профиль</q-tooltip>
          </q-btn>

        </div>
      </q-toolbar>

      <!-- Categories Navigation -->
      <q-toolbar class="categories-toolbar q-px-lg">
        <q-btn 
          flat 
          icon="menu"
          label="Каталог" 
          class="catalog-btn"
          @click="showCatalog = !showCatalog"
        />
        
        <q-separator vertical class="q-mx-lg" />
        
        <q-breadcrumbs 
          separator=">" 
          class="text-grey-8 breadcrumbs-nav"
          v-if="breadcrumbs.length > 0"
        >
          <q-breadcrumbs-el 
            v-for="crumb in breadcrumbs" 
            :key="crumb.path"
            :label="crumb.label" 
            :to="crumb.path"
            class="breadcrumb-item"
          />
        </q-breadcrumbs>

        <q-space />

        <!-- Quick Links -->
        <div class="row q-gutter-lg">
          <router-link 
            v-for="link in quickLinks" 
            :key="link.path"
            :to="link.path" 
            class="quick-link"
          >
            {{ link.label }}
          </router-link>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Left Drawer - Catalog -->
    <q-drawer
      v-model="showCatalog"
      show-if-above
      :width="280"
      :breakpoint="400"
      bordered
      class="bg-grey-1"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item-label header class="text-weight-bold text-dark text-h6">
            Категории товаров
          </q-item-label>
          
          <q-item 
            v-for="category in categories" 
            :key="category.id"
            clickable 
            v-ripple
            @click="navigateToCategory(category)"
          >
            <q-item-section avatar>
              <q-icon :name="category.icon" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium text-dark">{{ category.name }}</q-item-label>
              <q-item-label caption class="text-grey-7 text-weight-medium">{{ category.productsCount }} товаров</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" color="grey-6" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <q-page>
        <slot />
      </q-page>
    </q-page-container>

    <!-- Footer -->
    <footer class="bg-grey-9 text-white footer-section">
      <div class="q-px-lg q-py-lg">
        <div class="row full-width q-col-gutter-lg">
          <!-- Company Info -->
          <div class="col-md-3 col-12">
            <div class="text-h6 q-mb-sm text-weight-bold">AI Market</div>
            <p class="text-grey-4 compact-text">
              Современная платформа для покупки товаров с поддержкой ИИ
            </p>
          </div>

          <!-- Quick Links -->
          <div class="col-md-3 col-6">
            <div class="text-subtitle1 q-mb-sm text-weight-bold">Покупателям</div>
            <q-list dense class="compact-list">
              <q-item 
                v-for="link in footerLinks.buyers" 
                :key="link.path"
                clickable
                @click="$router.push(link.path)"
                class="text-grey-4 compact-item"
              >
                <q-item-section>{{ link.label }}</q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Support -->
          <div class="col-md-3 col-6">
            <div class="text-subtitle1 q-mb-sm text-weight-bold">Поддержка</div>
            <q-list dense class="compact-list">
              <q-item 
                v-for="link in footerLinks.support" 
                :key="link.path"
                clickable
                @click="$router.push(link.path)"
                class="text-grey-4 compact-item"
              >
                <q-item-section>{{ link.label }}</q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Contact -->
          <div class="col-md-3 col-12">
            <div class="text-subtitle1 q-mb-sm text-weight-bold">Контакты</div>
            <div class="text-grey-4 compact-contacts">
              <div class="contact-item">
                <q-icon name="phone" class="contact-icon" />
                8-800-555-35-35
              </div>
              <div class="contact-item">
                <q-icon name="email" class="contact-icon" />
                support@aimarket.ru
              </div>
              <div class="contact-item">
                <q-icon name="schedule" class="contact-icon" />
                Круглосуточно
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Search
const searchQuery = ref('')
const showFilters = ref(false)

// Navigation
const showCatalog = ref(false)

// Mock data for demonstration
const cartCount = ref(3)
const favoritesCount = ref(7)

const breadcrumbs = ref([
  { label: 'Главная', path: '/' },
  { label: 'Электроника', path: '/catalog/electronics' }
])

const quickLinks = ref([
  { label: 'Акции', path: '/sales' },
  { label: 'Новинки', path: '/new' },
  { label: 'Бренды', path: '/brands' },
  { label: 'Доставка', path: '/delivery' }
])

const categories = ref([
  { id: 1, name: 'Электроника', icon: 'smartphone', productsCount: 1245 },
  { id: 2, name: 'Одежда и обувь', icon: 'checkroom', productsCount: 3567 },
  { id: 3, name: 'Дом и сад', icon: 'home', productsCount: 892 },
  { id: 4, name: 'Красота и здоровье', icon: 'spa', productsCount: 1789 },
  { id: 5, name: 'Спорт и отдых', icon: 'fitness_center', productsCount: 654 },
  { id: 6, name: 'Детские товары', icon: 'child_care', productsCount: 1234 },
  { id: 7, name: 'Автотовары', icon: 'directions_car', productsCount: 567 },
  { id: 8, name: 'Книги', icon: 'menu_book', productsCount: 2345 }
])

const footerLinks = ref({
  buyers: [
    { label: 'Как заказать', path: '/help/order' },
    { label: 'Способы оплаты', path: '/help/payment' },
    { label: 'Доставка', path: '/help/delivery' },
    { label: 'Возврат товара', path: '/help/return' }
  ],
  support: [
    { label: 'Служба поддержки', path: '/support' },
    { label: 'Часто задаваемые вопросы', path: '/faq' },
    { label: 'Обратная связь', path: '/feedback' },
    { label: 'Пользовательское соглашение', path: '/terms' }
  ]
})

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

const navigateToCategory = (category: any) => {
  router.push(`/catalog/${category.id}`)
  showCatalog.value = false
}

const handleLogout = () => {
  // TODO: Implement logout logic
  console.log('Logout')
}
</script>

<style scoped>
/* Modern Header */
.modern-header {
  box-shadow: 0 2px 20px rgba(0,0,0,0.08);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(106, 27, 154, 0.1);
}

.modern-toolbar {
  min-height: 70px;
  padding: 0 32px;
  gap: 32px;
}

/* Logo */
.logo-link {
  text-decoration: none;
  color: inherit;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.logo-icon {
  color: #6A1B9A;
  background: linear-gradient(135deg, rgba(106, 27, 154, 0.1), rgba(142, 36, 170, 0.1));
  border-radius: 12px;
  padding: 8px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6A1B9A, #8E24AA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Search */
.search-container {
  flex: 1;
  max-width: 500px;
  margin: 0 24px;
}

.modern-search {
  background: rgba(106, 27, 154, 0.05);
  border-radius: 25px;
  padding: 4px 20px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.modern-search:hover {
  background: rgba(106, 27, 154, 0.08);
  border-color: rgba(106, 27, 154, 0.2);
}

.modern-search.q-field--focused {
  background: white;
  border-color: #6A1B9A;
  box-shadow: 0 8px 25px rgba(106, 27, 154, 0.15);
}

.search-icon {
  color: #6A1B9A;
  font-size: 1.2rem;
}

.filter-btn {
  color: #6A1B9A;
  background: rgba(106, 27, 154, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: rgba(106, 27, 154, 0.2);
  transform: scale(1.1);
}

/* User Actions */
.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 8px;
  margin-right: 8px;
}

.action-btn {
  color: #6A1B9A;
  background: rgba(106, 27, 154, 0.08);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: relative;
}

.action-btn:hover {
  background: rgba(106, 27, 154, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(106, 27, 154, 0.2);
}

/* User Profile Button */
.user-profile-btn {
  background: linear-gradient(135deg, #6A1B9A, #8E24AA) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(106, 27, 154, 0.3);
}

.user-profile-btn:hover {
  background: linear-gradient(135deg, #4A148C, #6A1B9A) !important;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(106, 27, 154, 0.4);
}

.modern-badge {
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  background: linear-gradient(135deg, #F44336, #E57373);
  border-radius: 50%;
  position: absolute;
  top: -2px;
  right: -2px;
}

/* Categories Toolbar */
.categories-toolbar {
  background: linear-gradient(135deg, rgba(106, 27, 154, 0.03), rgba(248, 249, 255, 0.8));
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(106, 27, 154, 0.1);
  min-height: 56px;
}

.catalog-btn {
  background: linear-gradient(135deg, #6A1B9A, #8E24AA);
  color: white;
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-transform: none;
}

.catalog-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(106, 27, 154, 0.3);
}

/* Breadcrumbs */
.breadcrumbs-nav {
  flex-grow: 1;
}

.breadcrumb-item a {
  color: #666 !important;
  font-weight: 500;
  transition: color 0.3s ease;
  text-decoration: none;
}

.breadcrumb-item a:hover {
  color: #6A1B9A !important;
  background: none !important;
}

/* Quick Links */
.quick-link {
  color: #666;
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.quick-link:hover {
  color: #6A1B9A;
  background: rgba(106, 27, 154, 0.08);
  transform: translateY(-1px);
}

.quick-link:before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: #6A1B9A;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.quick-link:hover:before {
  width: 80%;
}

/* Drawer */
.q-drawer {
  background: linear-gradient(180deg, white 0%, #f8f9ff 100%);
}

.q-drawer .q-list {
  padding: 20px 0;
}

.q-drawer .q-item {
  border-radius: 12px;
  margin: 4px 16px;
  transition: all 0.3s ease;
}

.q-drawer .q-item:hover {
  background: rgba(106, 27, 154, 0.1);
  transform: translateX(8px);
}

.q-drawer .q-item:hover .q-item-label:not([caption]) {
  color: #6A1B9A;
  font-weight: 700;
}

.q-drawer .q-item-label:not([caption]) {
  font-weight: 600;
  color: #1a1a1a;
}

.q-drawer .q-item-label[caption] {
  font-weight: 500;
  color: #666;
}

/* Footer */
.footer-section {
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
  width: 100%;
  margin-top: auto;
}

.footer-section .q-item {
  padding: 4px 0;
  border-radius: 6px;
  transition: all 0.3s ease;
  min-height: auto;
}

.footer-section .q-item:hover {
  background: rgba(255,255,255,0.08);
  transform: translateX(4px);
}

.footer-section .q-item-section {
  padding: 2px 0;
  font-size: 0.9rem;
}

.compact-list {
  padding: 0;
}

.compact-item {
  padding: 8px 16px;
  margin: 4px 0;
  border-radius: 6px;
  font-size: 0.9rem;
  max-width: fit-content;
  display: block;
  width: auto;
}

.compact-item:hover {
  background: rgba(106, 27, 154, 0.1);
  transform: translateX(4px);
  color: #AB47BC;
  padding-left: 24px;
  padding-right: 24px;
}

.compact-text {
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

.compact-contacts {
  font-size: 0.9rem;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 4px 0;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.contact-item:hover {
  background: rgba(255,255,255,0.05);
  padding-left: 8px;
}

.contact-icon {
  margin-right: 8px;
  font-size: 1rem;
  color: #AB47BC;
}

/* Responsive */
@media (max-width: 1024px) {
  .modern-toolbar {
    padding: 0 20px;
    gap: 16px;
  }
  
  .search-container {
    margin: 0 16px;
  }
}

@media (max-width: 768px) {
  .modern-toolbar {
    min-height: 60px;
    padding: 0 16px;
    gap: 12px;
  }
  
  .logo-text {
    font-size: 1.3rem;
  }
  
  .search-container {
    flex: 1;
    margin: 0 12px;
  }
  
  .user-actions {
    gap: 8px;
    margin-left: 8px;
  }
  
  .action-btn {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
  }
  
  .user-profile-btn {
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    min-height: 40px !important;
  }

}

@media (max-width: 600px) {
  .categories-toolbar {
    padding: 0 16px;
  }
  
  .footer-section {
    padding: 2rem 1rem;
  }
}
</style> 