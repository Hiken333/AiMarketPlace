<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()

// Form data
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
  subscribeToNews: false
})

// State
const isLoading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Computed
const passwordsMatch = computed(() => {
  return form.value.password === form.value.confirmPassword
})

const isFormValid = computed(() => {
  return form.value.firstName && 
         form.value.lastName && 
         form.value.email && 
         form.value.password && 
         form.value.confirmPassword && 
         passwordsMatch.value && 
         form.value.agreeToTerms
})

// Validation rules
const nameRules = [
  (val: string) => !!val || 'Это поле обязательно'
]

const emailRules = [
  (val: string) => !!val || 'Email обязателен',
  (val: string) => /.+@.+\..+/.test(val) || 'Введите корректный email'
]

const phoneRules = [
  (val: string) => !val || /^[+]?[0-9\s\-\(\)]{10,}$/.test(val) || 'Введите корректный номер телефона'
]

const passwordRules = [
  (val: string) => !!val || 'Пароль обязателен',
  (val: string) => val.length >= 8 || 'Пароль должен содержать минимум 8 символов',
  (val: string) => /[A-Z]/.test(val) || 'Пароль должен содержать заглавную букву',
  (val: string) => /[0-9]/.test(val) || 'Пароль должен содержать цифру'
]

const confirmPasswordRules = [
  (val: string) => !!val || 'Подтвердите пароль',
  (val: string) => val === form.value.password || 'Пароли не совпадают'
]

// Methods
const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('✅ Successful registration:', form.value.email)
    
    // Update user store
    userStore.setUser({
      id: '1',
      name: `${form.value.firstName} ${form.value.lastName}`,
      email: form.value.email,
      isAuthenticated: true
    })
    
    // Show success and redirect
    console.log('🎉 Добро пожаловать в AI Marketplace!')
    router.push('/')
    
  } catch (error) {
    console.error('❌ Registration error:', error)
  } finally {
    isLoading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <q-page class="register-page">
    <div class="register-container">

      <!-- Main register card -->
      <div class="register-card-container">
        <q-card flat class="register-card">
          <q-card-section class="register-header text-center">
            <div class="register-icon q-mb-md">
              <q-icon name="person_add" size="4rem" color="primary" />
            </div>
            <div class="text-h3 text-weight-bold text-primary q-mb-sm">
              Создать аккаунт
            </div>
            <div class="text-h6 text-grey-9">
              Присоединяйтесь к AI Marketplace
            </div>
          </q-card-section>

          <q-card-section class="register-form">
            <q-form @submit="handleSubmit" class="q-gutter-md">
              <!-- Name fields -->
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <q-input
                    v-model="form.firstName"
                    label="Имя"
                    :rules="nameRules"
                    outlined
                    rounded
                    standout
                    color="primary"
                    class="register-input"
                    lazy-rules
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" color="primary" />
                    </template>
                  </q-input>
                </div>
                <div class="col-6">
                  <q-input
                    v-model="form.lastName"
                    label="Фамилия"
                    :rules="nameRules"
                    outlined
                    rounded
                    standout
                    color="primary"
                    class="register-input"
                    lazy-rules
                  >
                    <template v-slot:prepend>
                      <q-icon name="person_outline" color="primary" />
                    </template>
                  </q-input>
                </div>
              </div>

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
                class="register-input"
                lazy-rules
              >
                <template v-slot:prepend>
                  <q-icon name="email" color="primary" />
                </template>
              </q-input>

              <!-- Phone field -->
              <q-input
                v-model="form.phone"
                label="Телефон (опционально)"
                :rules="phoneRules"
                outlined
                rounded
                standout
                color="primary"
                class="register-input"
                lazy-rules
                hint="Для связи и уведомлений"
              >
                <template v-slot:prepend>
                  <q-icon name="phone" color="primary" />
                </template>
              </q-input>

              <!-- Password fields -->
              <div class="row q-col-gutter-md">
                <div class="col-6">
                  <q-input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    label="Пароль"
                    :rules="passwordRules"
                    outlined
                    rounded
                    standout
                    color="primary"
                    class="register-input"
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
                </div>
                <div class="col-6">
                  <q-input
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    label="Подтвердить пароль"
                    :rules="confirmPasswordRules"
                    outlined
                    rounded
                    standout
                    color="primary"
                    class="register-input"
                    lazy-rules
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock_outline" color="primary" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        color="primary"
                        @click="showConfirmPassword = !showConfirmPassword"
                      />
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- Password strength indicator -->
              <div class="password-strength" v-if="form.password">
                <div class="strength-label text-caption text-grey-8 q-mb-xs">
                  Надежность пароля:
                </div>
                <div class="strength-bars row q-col-gutter-xs">
                  <div 
                    v-for="i in 4" 
                    :key="i" 
                    class="col strength-bar"
                    :class="{
                      'strength-weak': form.password.length >= 6 && i <= 1,
                      'strength-medium': form.password.length >= 8 && /[A-Z]/.test(form.password) && i <= 2,
                      'strength-good': form.password.length >= 8 && /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) && i <= 3,
                      'strength-strong': form.password.length >= 10 && /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) && /[!@#$%^&*]/.test(form.password) && i <= 4
                    }"
                  ></div>
                </div>
              </div>

              <!-- Checkboxes -->
              <div class="checkboxes q-mt-lg">
                <q-checkbox
                  v-model="form.agreeToTerms"
                  color="primary"
                  class="terms-checkbox q-mb-md"
                >
                  <span class="checkbox-text">
                    Я соглашаюсь с 
                    <q-btn flat dense no-caps color="primary" label="условиями использования" />
                    и 
                    <q-btn flat dense no-caps color="primary" label="политикой конфиденциальности" />
                  </span>
                </q-checkbox>

                <q-checkbox
                  v-model="form.subscribeToNews"
                  color="primary"
                  class="news-checkbox"
                  label="Получать новости и специальные предложения"
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
                label="Создать аккаунт"
                class="full-width register-submit-btn q-mt-lg"
                :disable="!isFormValid"
              >
                <template v-slot:loading>
                  <q-spinner-hourglass class="on-left" />
                  Создаем аккаунт...
                </template>
              </q-btn>
            </q-form>
          </q-card-section>

          <!-- Social registration -->
          <q-card-section class="social-register">
            <div class="text-center text-grey-8 q-mb-md">
              или зарегистрируйтесь через
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

          <!-- Login link -->
          <q-card-section class="login-link text-center">
            <div class="text-grey-8">
              Уже есть аккаунт?
              <q-btn
                flat
                no-caps
                color="primary"
                label="Войти"
                class="login-btn"
                @click="goToLogin"
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
.register-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px 0;
}

/* Background Decoration - Removed for better UX */

/* Register Container */
.register-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  padding: 20px;
}

/* Register Card */
.register-card-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
}

.register-card-container:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 35px 70px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.3);
}

.register-card {
  background: transparent;
}

/* Header */
.register-header {
  padding: 40px 30px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
}

.register-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px;
  padding: 20px;
  display: inline-block;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.register-icon .q-icon {
  color: white !important;
}

/* Form */
.register-form {
  padding: 30px;
}

.register-input {
  margin-bottom: 10px;
}

.register-input :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.register-input :deep(.q-field__control):hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.register-input :deep(.q-field--focused .q-field__control) {
  background: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

/* Password Strength */
.password-strength {
  margin-bottom: 20px;
}

.strength-bars {
  height: 8px;
}

.strength-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.strength-bar.strength-weak {
  background: #f44336;
}

.strength-bar.strength-medium {
  background: #ff9800;
}

.strength-bar.strength-good {
  background: #2196f3;
}

.strength-bar.strength-strong {
  background: #4caf50;
}

/* Checkboxes */
.checkboxes {
  margin: 20px 0;
}

.checkbox-text {
  font-size: 14px;
  line-height: 1.4;
}

.terms-checkbox,
.news-checkbox {
  margin-bottom: 10px;
}

/* Submit Button */
.register-submit-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  font-weight: 600;
  font-size: 16px;
  padding: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.register-submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
}

.register-submit-btn:disabled {
  opacity: 0.6;
  transform: none;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
}

/* Social Registration */
.social-register {
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

/* Login Link */
.login-link {
  padding: 20px 30px;
  background: rgba(102, 126, 234, 0.05);
}

.login-btn {
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.login-btn:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .register-container {
    max-width: 500px;
  }
  
  .row.q-col-gutter-md > div {
    padding: 0 8px;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 10px;
  }
  
  .register-header {
    padding: 30px 20px 15px;
  }
  
  .register-form,
  .social-register,
  .login-link {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .row.q-col-gutter-md > .col-6 {
    width: 100%;
    padding: 0;
    margin-bottom: 10px;
  }
  

}
</style> 