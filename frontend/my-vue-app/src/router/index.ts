import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Главная страница
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    
    // Каталог и категории
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('../views/CatalogView.vue'),
    },
    {
      path: '/category/:id',
      name: 'category',
      component: () => import('../views/CategoryView.vue'),
      props: true,
    },
    
    // Товары
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('../views/ProductView.vue'),
      props: true,
    },
    
    // Поиск
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
      props: (route: any) => ({ q: route.query.q }),
    },
    
    // Корзина и покупки
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/payment',
      name: 'payment',
      component: () => import('../views/PaymentView.vue'),
      meta: { requiresAuth: true },
    },
    
    // Заказы
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/order/:id',
      name: 'order-details',
      component: () => import('../views/OrderDetailsView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    
    // Пользователь
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/FavoritesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    
    // Чат и поддержка
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/support',
      name: 'support',
      component: () => import('../views/SupportView.vue'),
    },
    
    // Отзывы
    {
      path: '/reviews',
      name: 'reviews',
      component: () => import('../views/ReviewsView.vue'),
    },
    {
      path: '/product/:id/reviews',
      name: 'product-reviews',
      component: () => import('../views/ProductReviewsView.vue'),
      props: true,
    },
    
    // Уведомления
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/NotificationsView.vue'),
      meta: { requiresAuth: true },
    },
    
    // Продавцы
    {
      path: '/seller/:id',
      name: 'seller',
      component: () => import('../views/SellerView.vue'),
      props: true,
    },
    {
      path: '/sales',
      name: 'sales',
      component: () => import('../views/SalesView.vue'),
      meta: { requiresAuth: true },
    },
    
    // Бренды
    {
      path: '/brands',
      name: 'brands',
      component: () => import('../views/BrandsView.vue'),
    },
    {
      path: '/brand/:slug',
      name: 'brand',
      component: () => import('../views/BrandView.vue'),
      props: true,
    },
    
    // Статические страницы
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/delivery',
      name: 'delivery',
      component: () => import('../views/DeliveryView.vue'),
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/TermsView.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyView.vue'),
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/HelpView.vue'),
    },
    
    // Акции и специальные предложения
    {
      path: '/deals',
      name: 'deals',
      component: () => import('../views/DealsView.vue'),
    },
    {
      path: '/new',
      name: 'new-products',
      component: () => import('../views/NewProductsView.vue'),
    },
    
    // AI и модели
    {
      path: '/ai-models',
      name: 'ai-models',
      component: () => import('../views/AIModelsView.vue'),
    },
    {
      path: '/ai-model/:id',
      name: 'ai-model',
      component: () => import('../views/AIModelView.vue'),
      props: true,
    },
    {
      path: '/model-execution',
      name: 'model-execution',
      component: () => import('../views/ModelExecutionView.vue'),
      meta: { requiresAuth: true },
    },
    
    // Управление файлами
    {
      path: '/files',
      name: 'files',
      component: () => import('../views/FilesView.vue'),
      meta: { requiresAuth: true },
    },
    
    // Аналитика (для продавцов)
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('../views/AnalyticsView.vue'),
      meta: { requiresAuth: true, requiresSeller: true },
    },
    
    // Ошибки
    {
      path: '/404',
      name: '404',
      component: () => import('../views/NotFoundView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404',
    },
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // TODO: Implement authentication logic
  // For now, just allow all routes
  next()
})

export default router
