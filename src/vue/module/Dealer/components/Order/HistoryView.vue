
<template>
    <div class="tw-space-y-6 tw-animate-in tw-fade-in tw-slide-in-from-bottom-4 tw-duration-500">
        <div class="tw-bg-white dark:tw-bg-gray-800 tw-p-3 tw-rounded-2xl tw-shadow-sm tw-flex tw-items-center tw-gap-3 tw-overflow-x-auto">
            <div class="tw-flex tw-bg-gray-100 dark:tw-bg-gray-700 tw-p-1 tw-rounded-xl tw-shrink-0">
                <button @click="filterMode = 'day'" :class="['tw-px-3 tw-py-1.5 tw-rounded-lg tw-text-xs tw-font-bold tw-transition-colors', filterMode === 'day' ? 'tw-bg-white dark:tw-bg-gray-600 tw-text-[#1abc9c] tw-shadow-sm' : 'tw-text-gray-500']">Dia</button>
                <button @click="filterMode = 'month'" :class="['tw-px-3 tw-py-1.5 tw-rounded-lg tw-text-xs tw-font-bold tw-transition-colors', filterMode === 'month' ? 'tw-bg-white dark:tw-bg-gray-600 tw-text-[#1abc9c] tw-shadow-sm' : 'tw-text-gray-500']">Mes</button>
            </div>
            <input v-if="filterMode === 'day'" type="date" v-model="selectedDate" class="tw-bg-gray-50 dark:tw-bg-gray-700 tw-border-none tw-text-sm tw-font-bold tw-text-gray-700 dark:tw-text-white tw-rounded-xl tw-px-3 tw-py-2 tw-outline-none focus:tw-ring-2 focus:tw-ring-[#1abc9c]"/>
            <input v-else type="month" v-model="selectedMonth" class="tw-bg-gray-50 dark:tw-bg-gray-700 tw-border-none tw-text-sm tw-font-bold tw-text-gray-700 dark:tw-text-white tw-rounded-xl tw-px-3 tw-py-2 tw-outline-none focus:tw-ring-2 focus:tw-ring-[#1abc9c]"/>
        </div>

        <div class="tw-flex tw-items-center tw-justify-between tw-px-2">
            <label class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-text-gray-500 tw-font-bold tw-cursor-pointer">
                <input type="checkbox" v-model="showRejected" class="tw-rounded tw-text-[#1abc9c] focus:tw-ring-[#1abc9c]"/>
                Mostrar Rechazados/Cancelados
            </label>
        </div>

        <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-3xl tw-p-5 tw-shadow-sm tw-border tw-border-gray-100 dark:tw-border-gray-700 tw-relative tw-overflow-hidden">
            <div class="tw-absolute tw-right-0 tw-top-0 tw-p-4 tw-opacity-5 tw-text-[#1abc9c]"><component :is="LucideIcons.TrendingUp" :size="80" /></div>
            <div class="tw-flex tw-items-center tw-gap-2 tw-mb-4 tw-relative tw-z-10">
                <div class="tw-bg-emerald-100 dark:tw-bg-emerald-900/30 tw-p-2 tw-rounded-lg tw-text-emerald-600"><component :is="LucideIcons.TrendingUp" :size="20" /></div>
                <h3 class="tw-font-black tw-text-gray-800 dark:tw-text-white tw-text-lg">{{ filterMode === 'day' ? 'Cierre del Día' : 'Cierre Mensual' }}</h3>
            </div>
            <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-4 tw-relative tw-z-10">
                <div class="tw-bg-gray-50 dark:tw-bg-gray-700/50 tw-p-4 tw-rounded-2xl tw-border tw-border-gray-100 dark:tw-border-gray-700">
                    <p class="tw-text-[10px] tw-text-gray-400 tw-font-bold tw-uppercase tw-flex tw-items-center tw-gap-1"><component :is="LucideIcons.Banknote" :size="12"/> Efectivo</p>
                    <p class="tw-text-lg tw-font-black tw-text-gray-800 dark:tw-text-white">\${{ totalCash.toLocaleString() }}</p>
                </div>
                <div class="tw-bg-gray-50 dark:tw-bg-gray-700/50 tw-p-4 tw-rounded-2xl tw-border tw-border-gray-100 dark:tw-border-gray-700">
                    <p class="tw-text-[10px] tw-text-gray-400 tw-font-bold tw-uppercase tw-flex tw-items-center tw-gap-1"><component :is="LucideIcons.CreditCard" :size="12"/> Digital</p>
                    <p class="tw-text-lg tw-font-black tw-text-gray-800 dark:tw-text-white">\${{ totalTransfer.toLocaleString() }}</p>
                </div>
            </div>
            <div class="tw-pt-4 tw-border-t tw-border-gray-100 dark:tw-border-gray-700 tw-flex tw-justify-between tw-items-center tw-relative tw-z-10">
                <span class="tw-text-sm tw-font-bold tw-text-gray-500">Total Recaudado</span>
                <span class="tw-text-xl tw-font-black tw-text-[#1abc9c]">\${{ totalHistory.toLocaleString() }}</span>
            </div>
        </div>
        <div class="tw-space-y-3">
            <template v-if="filteredHistory.length > 0">
                <OrderCard v-for="order in filteredHistory" :key="order.id" :order="order" @click="$emit('select', order)" :showTimeDetails="true" />
            </template>
            <div v-else class="tw-text-center tw-py-12 tw-opacity-50"><p class="tw-text-gray-400 tw-font-medium">No hay registros para esta fecha.</p></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";

const props = defineProps({
    orders: Array
});

const emit = defineEmits(['select']);


//COMPONENTS
import OrderCard from "./OrderCard.vue";
import * as LucideIcons from 'lucide-vue-next';

const filterMode = ref('day');
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const selectedMonth = ref(new Date().toISOString().slice(0, 7));
const showRejected = ref(false);

const filteredHistory = computed(() => {
    return props.orders.filter(order => {
        if (order.status !== 'delivered' && order.status !== 'rejected' && order.status !== 'cancelled') return false;
        if (!showRejected.value && (order.status === 'rejected' || order.status === 'cancelled')) return false;

        const dateToCheck = order.status === 'delivered' ? order.deliveredAt : order.assignedAt;
        const orderDate = dateToCheck.split('T')[0];
        const orderMonth = dateToCheck.slice(0, 7);
        if (filterMode.value === 'day') return orderDate === selectedDate.value;
        if (filterMode.value === 'month') return orderMonth === selectedMonth.value;
        return true;
    });
});

const totalHistory = computed(() => filteredHistory.value.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.total, 0));
const totalCash = computed(() => filteredHistory.value.filter(o => o.status === 'delivered' && o.paymentType === 'cash').reduce((acc, o) => acc + o.total, 0));
const totalTransfer = computed(() => filteredHistory.value.filter(o => o.status === 'delivered' && o.paymentType === 'transfer').reduce((acc, o) => acc + o.total, 0));

</script>
