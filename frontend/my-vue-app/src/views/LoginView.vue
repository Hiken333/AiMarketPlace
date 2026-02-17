<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()

// Form data
const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

// State
const isLoading = ref(false)
const showPassword = ref(false)

// Validation rules
const emailRules = [
  (val: string) => !!val || 'Email обязателен',
  (val: string) => /.+@.+\..+/.test(val) || 'Введите корректный email'
]

const passwordRules = [
  (val: string) => !!val || 'Пароль обязателен',
  (val: string) => val.length >= 6 || 'Пароль должен содержать минимум 6 символов'
]

// Methods
const handleSubmit = async () => {
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // For demo purposes, accept any email/password
    if (form.value.email && form.value.password) {
      console.log('✅ Successful login:', form.value.email)
      
      // Update user store
      userStore.setUser({
        id: '1',
        name: 'Пользователь',
        email: form.value.email,
        isAuthenticated: true
      })
      
      // Redirect to home
      router.push('/')
    }
  } catch (error) {
    console.error('❌ Login error:', error)
  } finally {
    isLoading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <q-page class="login-page">
    <div class="login-container">

      <!-- Main login card -->
      <div class="login-card-container">
        <q-card flat class="login-card">
          <q-card-section class="login-header text-center">
            <div class="login-icon q-mb-md">
              <q-icon name="login" size="4rem" color="primary" />
            </div>
            <div class="text-h3 text-weight-bold text-primary q-mb-sm">
              Добро пожаловать!
            </div>
            <div class="text-h6 text-grey-9">
              Войдите в свой аккаунт
            </div>
          </q-card-section>

          <q-card-section class="login-form">
            <q-form @submit="handleSubmit" class="q-gutter-md">
              <!-- Email field -->
              <q-input
                v-model="form.email"
                type="email"
                label="Email"
                :rules="emailRules"
                outlined
                rounded
                standout
                color="primary"
                class="login-input"
                lazy-rules
              >
                <template v-slot:prepend>
                  <q-icon name="email" color="primary" />
                </template>
              </q-input>

              <!-- Password field -->
              <q-input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                label="Пароль"
                :rules="passwordRules"
                outlined
                rounded
                standout
                color="primary"
                class="login-input"
                lazy-rules
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="primary" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    color="primary"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <!-- Remember me checkbox -->
              <div class="row items-center justify-between">
                <q-checkbox
                  v-model="form.rememberMe"
                  label="Запомнить меня"
                  color="primary"
                  class="remember-checkbox"
                />
                <q-btn
                  flat
                  no-caps
                  color="primary"
                  label="Забыли пароль?"
                  class="forgot-password-btn"
                />
              </div>

              <!-- Submit button -->
              <q-btn
                type="submit"
                :loading="isLoading"
                unelevated
                rounded
                size="lg"
                color="primary"
                label="Войти"
                class="full-width login-submit-btn q-mt-lg"
                :disable="!form.email || !form.password"
              >
                <template v-slot:loading>
                  <q-spinner-hourglass class="on-left" />
                  Выполняется вход...
                </template>
              </q-btn>
            </q-form>
          </q-card-section>

          <!-- Social login -->
          <q-card-section class="social-login">
            <div class="text-center text-grey-8 q-mb-md">
              или войдите через
            </div>
            <div class="row q-gutter-sm">
              <q-btn
                unelevated
                rounded
                color="red"
                text-color="white"
                icon="fab fa-google"
                label="Google"
                class="col social-btn"
              />
              <q-btn
                unelevated
                rounded
                color="blue"
                text-color="white"
                icon="fab fa-facebook"
                label="Facebook"
                class="col social-btn"
              />
            </div>
          </q-card-section>

          <!-- Register link -->
          <q-card-section class="register-link text-center">
            <div class="text-grey-8">
              Нет аккаунта?
              <q-btn
                flat
                no-caps
                color="primary"
                label="Зарегистрироваться"
                class="register-btn"
                @click="goToRegister"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
/* Page Background */
.login-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* Background Decoration - Removed for better UX */

/* Login Container */
.login-container {
  position: relative;
  width: 100%;
  max-width: 450px;
  padding: 20px;
}

/* Login Card */
.login-card-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
}

.login-card-container:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 35px 70px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}

.login-card {
  background: transparent;
}

/* Header */
.login-header {
  padding: 40px 30px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
}

.login-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px;
  padding: 20px;
  display: inline-block;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.login-icon .q-icon {
  color: white !important;
}

/* Form */
.login-form {
  padding: 30px;
}

.login-input {
  margin-bottom: 10px;
}

.login-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.login-input :deep(.q-field__control):hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.login-input :deep(.q-field--focused .q-field__control) {
  background: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.remember-checkbox {
  font-size: 14px;
}

.forgot-password-btn {
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.forgot-password-btn:hover {
  text-decoration: underline;
}

/* Submit Button */
.login-submit-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  font-weight: 600;
  font-size: 16px;
  padding: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.login-submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
}

.login-submit-btn:disabled {
  opacity: 0.6;
  transform: none;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
}

/* Social Login */
.social-login {
  padding: 20px 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.social-btn {
  font-weight: 600;
  padding: 12px;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Register Link */
.register-link {
  padding: 20px 30px;
  background: rgba(102, 126, 234, 0.05);
}

.register-btn {
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.register-btn:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }
  
  .login-header {
    padding: 30px 20px 15px;
  }
  
  .login-form,
  .social-login,
  .register-link {
    padding-left: 20px;
    padding-right: 20px;
  }
  

}
</style> 