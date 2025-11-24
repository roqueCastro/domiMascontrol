<template>
    <div class="tw-bg-[#1abc9c] tw-rounded-3xl tw-p-6 tw-text-white tw-shadow-lg tw-shadow-[#1abc9c]/30 tw-mb-6 tw-relative tw-overflow-hidden tw-animate-in tw-slide-in-from-top tw-duration-500">
        <div class="tw-absolute tw-right-0 tw-top-0 tw-p-6 tw-opacity-10 tw-animate-pulse">
            <component :is="LucideIcons.Bike" :size="100"/>
        </div>
        <p class="tw-text-xs tw-font-bold tw-uppercase tw-tracking-wider tw-opacity-90 tw-mb-1">
            Por Cobrar en Ruta
        </p>
        <h2 class="tw-text-4xl tw-font-black tw-mb-4 tw-tracking-tight">
            ${{ cash.toLocaleString() }}
        </h2>
        <div class="tw-flex tw-gap-4 tw-text-sm tw-font-bold">
            <span class="tw-bg-white/20 tw-px-3 tw-py-1 tw-rounded-lg tw-backdrop-blur-sm tw-flex tw-items-center tw-gap-2">
                <component :is="LucideIcons.Package" :size="14"/> {{ activeCount }} Activos
            </span>
            <span v-if="pendingCount > 0"
                  class="tw-bg-white tw-text-rose-600 tw-px-3 tw-py-1 tw-rounded-lg tw-shadow-md tw-flex tw-items-center tw-gap-2 tw-animate-pulse">
                <component :is="LucideIcons.Bell" :size="14"/> {{ pendingCount }} Nuevos
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import * as LucideIcons from 'lucide-vue-next';

const props = defineProps({
    orders: Array
});

const cash = computed(() => props.orders.filter(o => !['delivered', 'cancelled', 'rejected', 'pending_acceptance']
        .includes(o.status) && o.paymentType === 'cash')
        .reduce((s, o) => s + o.total, 0));

const activeCount = computed(() => props.orders.filter(o => ['assigned', 'picking_up', 'delivering']
        .includes(o.status))
        .length);

const pendingCount = computed(() => props.orders.filter(o => o.status === 'pending_acceptance').length);
</script>
