<template>
  <div class="tw-min-h-screen tw-bg-[#f4f6f7] dark:tw-bg-gray-900 tw-font-sans tw-transition-colors tw-duration-300 tw-pb-24">
    <div class="tw-bg-white dark:tw-bg-gray-800 tw-px-5 tw-py-4 tw-flex tw-justify-between tw-items-center tw-sticky tw-top-0 tw-z-10 tw-shadow-sm tw-mb-4">
      <div class="tw-flex tw-items-center tw-gap-3">
        <div class="tw-bg-[#1abc9c] tw-p-2 tw-rounded-xl tw-text-white tw-shadow-lg tw-shadow-[#1abc9c]/30">
          <component :is="LucideIcons.Bike" :size="24" :strokeWidth="2.5" />
        </div>
        <div>
          <h1 class="tw-font-black tw-text-xl tw-tracking-tight tw-text-gray-800 dark:tw-text-white">+Control</h1>
          <p class="tw-text-xs tw-font-bold tw-text-gray-400 tw-uppercase tw-tracking-widest">
              {{ user?.isGuest ? 'Modo Invitado' : (user?.name ? `Hola, ${user.name.split(' ')[0]}` : 'Domicilios') }}
          </p>
        </div>
      </div>
      <div class="tw-flex tw-gap-2">
        <button @click="darkMode = !darkMode" class="tw-p-2.5 tw-rounded-xl tw-bg-gray-100 dark:tw-bg-gray-700 tw-text-gray-600 dark:tw-text-gray-300 hover:tw-bg-gray-200 dark:hover:tw-bg-gray-600 tw-transition-colors">
          <component :is="darkMode ? LucideIcons.Sun : LucideIcons.Moon" :size="20" />
        </button>
        <button @click="showProfileModal = true" class="tw-rounded-full tw-w-11 tw-h-11 tw-bg-gray-100 dark:tw-bg-gray-700 tw-text-gray-600 dark:tw-text-gray-300 hover:tw-bg-gray-200 dark:hover:tw-bg-gray-600 tw-transition-colors tw-relative tw-overflow-hidden tw-border-2 tw-border-transparent hover:tw-border-[#1abc9c]">
          <img v-if="user?.photo" :src="user.photo" alt="Perfil" class="tw-w-full tw-h-full tw-object-cover" />
          <div v-else class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
              <component :is="LucideIcons.UserCircle" :size="24" />
          </div>
          <span v-if="!user" class="tw-absolute tw-top-2 tw-right-2 tw-w-2 tw-h-2 tw-bg-red-500 tw-rounded-full"></span>
        </button>
      </div>
    </div>

    <div class="tw-px-4 tw-max-w-7xl tw-mx-auto">
      <div class="tw-bg-white dark:tw-bg-gray-800 tw-p-1 tw-rounded-xl tw-flex tw-mb-6 tw-shadow-sm">
        <button @click="activeTab = 'active'" :class="['tw-flex-1 tw-py-2.5 tw-text-sm tw-font-bold tw-rounded-lg' +
         ' tw-transition-all tw-flex tw-items-center tw-justify-center tw-gap-2', activeTab === 'active' ?
          'tw-bg-[#f4f6f7] dark:tw-bg-gray-700 tw-text-gray-800 dark:tw-text-white tw-shadow-sm' :
           'tw-text-gray-400 hover:tw-text-gray-600']">
          <component :is="LucideIcons.Bike" :size="16" /> Activos ({{ activeOrders.length }})
        </button>
        <button @click="activeTab = 'history'" :class="['tw-flex-1 tw-py-2.5 tw-text-sm tw-font-bold tw-rounded-lg tw-transition-all tw-flex tw-items-center tw-justify-center tw-gap-2', activeTab === 'history' ? 'tw-bg-[#f4f6f7] dark:tw-bg-gray-700 tw-text-gray-800 dark:tw-text-white tw-shadow-sm' : 'tw-text-gray-400 hover:tw-text-gray-600']">
          <component :is="LucideIcons.History" :size="16" /> Historial
        </button>
      </div>

      <template v-if="activeTab === 'active'">
        <ActiveStats v-if="!user?.isGuest" :orders="orders" />
        <div class="tw-flex tw-flex-col tw-gap-3 tw-mb-6">
          <div class="tw-flex tw-justify-between tw-items-center">
            <h2 class="tw-font-black tw-text-lg tw-text-gray-800 dark:tw-text-white">En Curso</h2>
          </div>
          <div v-if="!user?.isGuest" class="tw-flex tw-gap-2 tw-overflow-x-auto tw-pb-2">
            <button @click="simulateNewOrder" class="tw-whitespace-nowrap tw-text-xs tw-font-bold tw-text-[#1abc9c] tw-bg-[#1abc9c]/10 tw-px-4 tw-py-3 tw-rounded-xl hover:tw-bg-[#1abc9c]/20 tw-transition-colors tw-flex tw-items-center tw-gap-2">+ Pedido (Logueado)</button>
            <button @click="simulateGuestLink" class="tw-whitespace-nowrap tw-text-xs tw-font-bold tw-text-gray-500 tw-bg-gray-100 dark:tw-bg-gray-800 tw-px-4 tw-py-3 tw-rounded-xl hover:tw-bg-gray-200 tw-transition-colors tw-flex tw-items-center tw-gap-2 tw-border tw-border-dashed tw-border-gray-300 dark:tw-border-gray-600">+ Simular Link (Visitante)</button>
          </div>
        </div>
        <div class="tw-space-y-4 tw-pb-10">
          <template v-if="activeOrders.length > 0">
            <OrderCard v-for="order in activeOrders" :key="order.id" :order="order" @click="selectedOrder = order" />
          </template>
          <div v-else class="tw-text-center tw-py-12">
            <div class="tw-bg-gray-100 dark:tw-bg-gray-800 tw-w-20 tw-h-20 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4 tw-text-gray-300 dark:tw-text-gray-600"><component :is="LucideIcons.CheckCircle2" :size="40" /></div>
            <h3 class="tw-text-gray-500 dark:tw-text-gray-400 tw-font-bold">Todo al día</h3>
            <p class="tw-text-sm tw-text-gray-400">No tienes pedidos pendientes.</p>
          </div>
        </div>
      </template>
      <HistoryView v-else :orders="orders" @select="o => selectedOrder = o" />
    </div>

    <OrderDetail
        v-if="selectedOrder"
        :order="selectedOrder"
        :user="user"
        @back="selectedOrder = null"
        @update-status="updateOrderStatus"
        @reject="rejectOrder"
        @revert="revertOrderStatus"
        @require-auth="showAuthModal = true"
    />

    <AuthModal :is-open="showAuthModal" @close="showAuthModal = false" @authenticate="handleAuth" @guest-access="handleGuestAccess"/>
    <ProfileModal :is-open="showProfileModal" @close="showProfileModal = false" :user="user" @update="user = $event" @logout="user = null; showProfileModal = false;" />
  </div>
</template>


<script setup>
import {ref, computed, watch, defineAsyncComponent} from 'vue';
import * as LucideIcons from 'lucide-vue-next';

//COMPONENTS
const ActiveStats = defineAsyncComponent(() => import('./Order/ActiveStats.vue'));
const OrderCard = defineAsyncComponent(() => import('./Order/OrderCard.vue'));

import HistoryView from './Order/HistoryView.vue';
import OrderDetail from './Order/OrderDetail.vue';


const AuthModal = defineAsyncComponent(() => import('./Auth/AuthModal.vue'));
const ProfileModal = defineAsyncComponent(() => import('./Profile/ProfileModal.vue'));

// --- CONFIGURACIÓN Y DATOS MOCK ---
const BRAND = {
    primary: '#1abc9c',
    primaryDark: '#16a085',
    secondary: '#2c3e50',
    bgLight: '#f4f6f7',
    bgDark: '#111827',
};


const formatTime = (dateString) => {
    if(!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate;
    const diffMins = Math.round(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    if(hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes} min`;
};

const NOW = new Date();
const INITIAL_ORDERS = [
    {
        id: 'ORD-999',
        client: 'Juan Cliente',
        phone: '3100000000',
        address: 'Calle 80 # 10-10, Norte',
        paymentType: 'cash',
        total: 18500,
        paymentStatus: 'pending',
        status: 'pending_acceptance',
        assignedAt: new Date().toISOString(),
        items: [
            { id: 1, name: 'Burrito Mexicano', qty: 1, price: 18500 }
        ],
        note: 'Ojo con la salsa picante aparte'
    },
    {
        id: 'ORD-767',
        client: 'Andres Murillo',
        phone: '3243591125',
        address: 'Calle 10 # 5-23, Garagoa',
        paymentType: 'cash',
        total: 73500,
        paymentStatus: 'pending',
        status: 'assigned',
        assignedAt: new Date(NOW.getTime() - 15 * 60000).toISOString(),
        items: [
            { id: 1, name: 'Churrasco de Res 300gr', qty: 1, price: 36000 },
            { id: 2, name: 'Mazorca Desgranada', qty: 1, price: 30000 },
            { id: 3, name: 'Gaseosa 1.5L', qty: 1, price: 5500 },
            { id: 4, name: 'Domicilio Zona 2', qty: 1, price: 2000 }
        ],
        note: 'Timbre dañado, golpear fuerte.'
    }
];


//----------------------------------------------------

const darkMode = ref(false);

const activeTab = ref('active');
const selectedOrder = ref(null);
const orders = ref(INITIAL_ORDERS);

const user = ref({ name: 'Andrés Driver', phone: '312000000', vehicle: 'Moto', photo: null });
const showAuthModal = ref(false);
const showProfileModal = ref(false);

watch(darkMode, (newVal) => {
    if (newVal) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
});

const createRandomOrder = () => {
    const newOrder = {
        id: `ORD-${Math.floor(Math.random() * 1000)}`,
        client: 'Cliente Nuevo',
        phone: '300000000',
        address: 'Calle Nueva # 1-23',
        paymentType: 'cash',
        total: 25000,
        paymentStatus: 'pending',
        status: 'pending_acceptance',
        assignedAt: new Date().toISOString(),
        items: [{ id: 1, name: 'Pizza Familiar', qty: 1, price: 25000 }],
        note: 'Entregar en portería'
    };
    orders.value = [newOrder, ...orders.value];
    return newOrder;
};

const simulateNewOrder = () => {
    createRandomOrder();
    if ("vibrate" in navigator) navigator.vibrate(500);
};

const simulateGuestLink = () => {
    user.value = null;
    const newOrder = createRandomOrder();
    selectedOrder.value = newOrder;
};

const updateOrderStatus = (orderId, newStatus) => {
    const now = new Date().toISOString();
    orders.value = orders.value.map(order => {
        if (order.id === orderId) {
            const updated = { ...order, status: newStatus };
            if (newStatus === 'delivered') updated.deliveredAt = now;
            if (selectedOrder.value && selectedOrder.value.id === orderId) selectedOrder.value = updated;
            return updated;
        }
        return order;
    });
};

const handleAuth = (userData) => {
    user.value = userData;
    showAuthModal.value = false;
    if(selectedOrder.value && selectedOrder.value.status === 'pending_acceptance') {
        updateOrderStatus(selectedOrder.value.id, 'assigned');
    }
};

const handleGuestAccess = () => {
    user.value = { name: 'Invitado', isGuest: true };
    showAuthModal.value = false;
    if(selectedOrder.value && selectedOrder.value.status === 'pending_acceptance') {
        updateOrderStatus(selectedOrder.value.id, 'assigned');
    }
};

const revertOrderStatus = (orderId) => {
    const statusFlow = ['pending_acceptance', 'assigned', 'picking_up', 'delivering', 'delivered'];
    orders.value = orders.value.map(order => {
        if(order.id === orderId) {
            if (['rejected', 'cancelled'].includes(order.status)) {
                const updated = { ...order, status: 'pending_acceptance' };
                if(selectedOrder.value && selectedOrder.value.id === orderId) selectedOrder.value = updated;
                return updated;
            }
            const currentIndex = statusFlow.indexOf(order.status);
            if(currentIndex > 0) {
                const prevStatus = statusFlow[currentIndex - 1];
                const updated = { ...order, status: prevStatus };
                if(selectedOrder.value && selectedOrder.value.id === orderId) selectedOrder.value = updated;
                return updated;
            }
        }
        return order;
    });
};

const rejectOrder = (orderId, status = 'cancelled') => {
    const now = new Date().toISOString();
    orders.value = orders.value.map(order => {
        if (order.id === orderId) {
            const updated = { ...order, status: status, deliveredAt: now };
            if (selectedOrder.value && selectedOrder.value.id === orderId) selectedOrder.value = null;
            return updated;
        }
        return order;
    });
};

const activeOrders = computed(() => {
    let filtered = orders.value.filter(o => !['delivered', 'cancelled', 'rejected'].includes(o.status));
    if (user.value?.isGuest) {
        if (selectedOrder.value) {
            return filtered.filter(o => o.id === selectedOrder.value.id);
        } else {
            return filtered.slice(0, 1);
        }
    }
    return filtered;
});

</script>