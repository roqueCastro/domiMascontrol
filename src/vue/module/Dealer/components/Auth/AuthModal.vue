<template>
  <div v-if="isOpen" class="tw-fixed tw-inset-0 tw-bg-black/60 tw-backdrop-blur-sm tw-z-[60] tw-flex tw-items-center tw-justify-center tw-p-4 tw-animate-in tw-fade-in tw-duration-200">
    <div class="tw-bg-white dark:tw-bg-gray-900 tw-w-full tw-max-w-sm tw-rounded-3xl tw-shadow-2xl tw-overflow-hidden tw-scale-100 tw-animate-in tw-zoom-in-95 tw-duration-200">
      <div class="tw-flex tw-border-b tw-border-gray-100 dark:tw-border-gray-800">
        <button @click="isLogin = true" :class="['tw-flex-1 tw-py-4 tw-text-sm tw-font-bold tw-transition-colors', isLogin ? 'tw-bg-white dark:tw-bg-gray-900 tw-text-[#1abc9c] tw-border-b-2 tw-border-[#1abc9c]' : 'tw-bg-gray-50 dark:tw-bg-gray-800 tw-text-gray-400']">INICIAR SESIÓN</button>
        <button @click="isLogin = false" :class="['tw-flex-1 tw-py-4 tw-text-sm tw-font-bold tw-transition-colors', !isLogin ? 'tw-bg-white dark:tw-bg-gray-900 tw-text-[#1abc9c] tw-border-b-2 tw-border-[#1abc9c]' : 'tw-bg-gray-50 dark:tw-bg-gray-800 tw-text-gray-400']">REGISTRARSE</button>
      </div>

      <div class="tw-p-6">
        <div class="tw-text-center tw-mb-6">
          <h2 class="tw-text-2xl tw-font-black tw-text-gray-800 dark:tw-text-white tw-mb-1">{{ isLogin ? '¡Hola de nuevo!' : 'Únete al equipo' }}</h2>
          <p class="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">{{ isLogin ? 'Tus pedidos te esperan.' : 'Regístrate y empieza a ganar.' }}</p>
        </div>

        <div class="tw-space-y-4">
          <div v-if="!isLogin" class="tw-relative">
            <component :is="LucideIcons.User" class="tw-absolute tw-left-3 tw-top-3.5 tw-text-gray-400" :size="18" />
            <input type="text" placeholder="Nombre Completo" class="tw-w-full tw-bg-gray-50 dark:tw-bg-gray-800 tw-border-none tw-rounded-xl tw-pl-10 tw-p-3.5 tw-text-gray-800 dark:tw-text-white tw-font-medium focus:tw-ring-2 focus:tw-ring-[#1abc9c]" v-model="formData.name" />
          </div>
          <div class="tw-relative">
            <component :is="LucideIcons.Smartphone" class="tw-absolute tw-left-3 tw-top-3.5 tw-text-gray-400" :size="18" />
            <input type="tel" placeholder="Celular / Usuario" class="tw-w-full tw-bg-gray-50 dark:tw-bg-gray-800 tw-border-none tw-rounded-xl tw-pl-10 tw-p-3.5 tw-text-gray-800 dark:tw-text-white tw-font-medium focus:tw-ring-2 focus:tw-ring-[#1abc9c]" v-model="formData.phone" />
          </div>
          <div class="tw-relative">
            <component :is="LucideIcons.Lock" class="tw-absolute tw-left-3 tw-top-3.5 tw-text-gray-400" :size="18" />
            <input type="password" placeholder="Contraseña" class="tw-w-full tw-bg-gray-50 dark:tw-bg-gray-800 tw-border-none tw-rounded-xl tw-pl-10 tw-p-3.5 tw-text-gray-800 dark:tw-text-white tw-font-medium focus:tw-ring-2 focus:tw-ring-[#1abc9c]" v-model="formData.password" />
          </div>
          <div v-if="!isLogin" class="tw-relative">
            <component :is="LucideIcons.Bike" class="tw-absolute tw-left-3 tw-top-3.5 tw-text-gray-400" :size="18" />
            <select class="tw-w-full tw-bg-gray-50 dark:tw-bg-gray-800 tw-border-none tw-rounded-xl tw-pl-10 tw-p-3.5 tw-text-gray-800 dark:tw-text-white tw-font-medium focus:tw-ring-2 focus:tw-ring-[#1abc9c] tw-appearance-none" v-model="formData.vehicle">
              <option value="Moto">Moto</option>
              <option value="Bici">Bicicleta</option>
              <option value="Carro">Carro</option>
            </select>
          </div>
        </div>

        <button @click="handleSubmit" :disabled="!isValid" class="tw-w-full tw-mt-6 tw-bg-[#1abc9c] hover:tw-bg-[#16a085] disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-text-white tw-py-4 tw-rounded-xl tw-font-black tw-text-lg tw-shadow-lg tw-transform active:tw-scale-[0.98] tw-transition-all">
          {{ isLogin ? 'INGRESAR Y ACEPTAR' : 'REGISTRAR Y ACEPTAR' }}
        </button>

        <div class="tw-mt-4 tw-pt-4 tw-border-t tw-border-gray-100 dark:tw-border-gray-800 tw-text-center">
          <p class="tw-text-xs tw-text-gray-400 tw-mb-2 tw-font-medium">¿Solo vas a hacer un pedido?</p>
          <button @click="$emit('guestAccess')" class="tw-w-full tw-flex tw-items-center tw-justify-center tw-gap-2 tw-text-gray-500 dark:tw-text-gray-400 tw-font-bold tw-bg-gray-100 dark:tw-bg-gray-800 tw-py-3 tw-rounded-xl hover:tw-bg-gray-200 dark:hover:tw-bg-gray-700 tw-transition-colors">
            <component :is="LucideIcons.Ghost" :size="18" /> Continuar como Invitado
          </button>
        </div>

        <button @click="$emit('close')" class="tw-w-full tw-mt-2 tw-text-xs tw-font-bold tw-text-gray-400 hover:tw-text-gray-600 tw-py-2">Cancelar Operación</button>
      </div>
    </div>
  </div>
</template>


<script setup>

import {computed, ref} from "vue";
import * as LucideIcons from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean
})
const emit = defineEmits(['close', 'authenticate', 'guestAccess'])


const isLogin = ref(true);
const formData = ref({ name: '', phone: '', password: '', vehicle: 'Moto' });

const isValid = computed(() => {
  return isLogin.value
      ? formData.value.phone && formData.value.password
      : formData.value.name && formData.value.phone && formData.value.password;
});

const handleSubmit = () => {
  if (isLogin.value) {
    emit('authenticate', {
      name: 'Andrés Driver',
      phone: formData.value.phone,
      vehicle: 'Moto',
      photo: null
    });
  } else {
    emit('authenticate', { ...formData.value });
  }
};

</script>