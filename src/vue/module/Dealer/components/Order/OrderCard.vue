<template>
    <div
            @click="$emit('click', order)"
            :class="['tw-relative tw-bg-white dark:tw-bg-gray-800 tw-rounded-3xl tw-shadow-sm tw-border tw-transition-all tw-duration-300 tw-cursor-pointer tw-overflow-hidden tw-group tw-animate-in tw-fade-in tw-zoom-in-95', isDelivered ? 'tw-border-gray-100 dark:tw-border-gray-700 tw-opacity-90 hover:tw-opacity-100' : isCancelled ? 'tw-border-red-100 dark:tw-border-red-900/30 tw-opacity-80' : isPending ? 'tw-border-rose-200 tw-ring-2 tw-ring-rose-500/20 hover:tw-shadow-lg hover:tw-shadow-rose-500/20' : 'tw-border-gray-100 dark:tw-border-gray-700 hover:tw-shadow-md hover:tw--translate-y-1']"
    >
        <div v-if="!isDelivered && !isCancelled" class="tw-h-1.5 tw-w-full tw-bg-gray-100 dark:tw-bg-gray-700">
            <div :class="['tw-h-full tw-transition-all tw-duration-1000 tw-ease-out', getStatusColor(order.status)]" :style="{ width: `${progress || 5}%` }"></div>
        </div>

        <div class="tw-p-5">
            <div class="tw-flex tw-justify-between tw-items-start tw-mb-4">
                <div class="tw-flex tw-items-center tw-gap-3">
                    <div :class="['tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-white tw-font-bold tw-text-sm tw-shadow-sm tw-transition-transform group-hover:tw-scale-110', isDelivered ? 'tw-bg-gray-100 tw-text-gray-400 dark:tw-bg-gray-700' : getStatusColor(order.status), isPending ? 'tw-animate-pulse' : '']">
                        <component :is="order.status === 'picking_up' ? LucideIcons.Bike : order.status === 'delivering' ? LucideIcons.Navigation : isDelivered ? LucideIcons.CheckCircle2 : isCancelled ? LucideIcons.XCircle : isPending ? LucideIcons.Bell : LucideIcons.Package" :size="18" :class="{ 'tw-animate-swing': isPending }" />
                    </div>
                    <div>
                        <h3 :class="['tw-font-black tw-text-base tw-leading-tight', isDelivered || isCancelled ? 'tw-text-gray-600 dark:tw-text-gray-400' : 'tw-text-gray-800 dark:tw-text-white']">
                            {{ order.client }}
                        </h3>
                        <div class="tw-flex tw-items-center tw-gap-1 tw-mt-1">
                            <Badge v-if="order.paymentStatus === 'paid'" type="success">PAGADO</Badge>
                            <Badge v-else type="danger">COBRAR</Badge>
                            <span class="tw-text-[10px] tw-font-semibold tw-text-gray-400">• #{{ order.id.split('-')[1] }}</span>
                        </div>
                    </div>
                </div>

                <div class="tw-flex tw-flex-col tw-items-end">
                    <span :class="['tw-text-lg tw-font-black', isDelivered || isCancelled ? 'tw-text-gray-600 dark:tw-text-gray-400' : 'tw-text-[#1abc9c]']">${{ order.total.toLocaleString() }}</span>
                    <span v-if="isDelivered || isCancelled" class="tw-text-[10px] tw-font-bold tw-text-gray-400 tw-mt-1">
                                    {{ isCancelled ? formatTime(order.assignedAt) : formatTime(order.deliveredAt) }}
                                </span>
                    <span v-else class="tw-text-[10px] tw-font-bold tw-px-2 tw-py-0.5 tw-bg-gray-100 dark:tw-bg-gray-700 tw-rounded-full tw-text-gray-500 tw-mt-1 tw-flex tw-items-center tw-gap-1 tw-animate-pulse">
                                    <component :is="LucideIcons.Clock" :size="10" /> {{ elapsed }}
                                </span>
                </div>
            </div>
            <div class="tw-bg-gray-50 dark:tw-bg-gray-700/50 tw-rounded-xl tw-p-3 tw-flex tw-justify-between tw-items-center">
                <div class="tw-flex tw-items-center tw-gap-2 tw-overflow-hidden">
                    <component :is="LucideIcons.MapPin" :size="14" class="tw-text-gray-400 tw-shrink-0" />
                    <p class="tw-text-xs tw-text-gray-600 dark:tw-text-gray-300 tw-font-medium tw-truncate tw-pr-2">{{ order.address }}</p>
                </div>
                <Badge :type="isDelivered ? 'neutral' : isCancelled ? 'cancelled' : isPending ? 'danger' : 'brand'" :className="isDelivered ? '' : isPending ? '!tw-bg-rose-100 !tw-text-rose-600 !tw-border-rose-200' : '!tw-bg-[#1abc9c] !tw-text-white !tw-border-0'">
                    {{ getStatusLabel(order.status) }}
                </Badge>
            </div>
            <div v-if="showTimeDetails && isDelivered" class="tw-mt-3 tw-pt-3 tw-border-t tw-border-gray-100 dark:tw-border-gray-700 tw-grid tw-grid-cols-2 tw-gap-2">
                <div class="tw-text-[10px] tw-text-gray-500"><span class="tw-font-bold">Inicio:</span> {{ formatTime(order.assignedAt) }}</div>
                <div class="tw-text-[10px] tw-text-gray-500 tw-text-right"><span class="tw-font-bold">Duración:</span> {{ calculateDuration(order.assignedAt, order.deliveredAt) }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import * as LucideIcons from 'lucide-vue-next';

const props = defineProps({
    order: Object, showTimeDetails: Boolean
})
const emit = defineEmits(['click']);


// COMPONENTS
import Badge from '../helpers/Badge.vue'


const isDelivered = computed(() => props.order.status === 'delivered');
const isCancelled = computed(() => props.order.status === 'cancelled' || props.order.status === 'rejected');
const isPending = computed(() => props.order.status === 'pending_acceptance');

const steps = ['pending_acceptance', 'assigned', 'picking_up', 'delivering', 'delivered'];
const progress = computed(() => (steps.indexOf(props.order.status) / (steps.length - 1)) * 100);

const elapsed = ref('');
let intervalId = null;

const calculate = () => {
    const now = new Date();
    const start = new Date(props.order.assignedAt);
    const diffMins = Math.floor((now - start) / 60000);
    elapsed.value = `${diffMins} min`;
};

onMounted(() => {
    if (isDelivered.value || isCancelled.value) return;
    calculate();
    intervalId = setInterval(calculate, 60000);
});

onUnmounted(() => {
    if(intervalId) clearInterval(intervalId);
});

const getStatusColor = (status) => {
    if (status === 'pending_acceptance') return 'tw-bg-rose-500';
    if (status === 'assigned') return 'tw-bg-sky-500';
    if (status === 'picking_up') return 'tw-bg-amber-500';
    if (status === 'delivering') return 'tw-bg-[#1abc9c]';
    if (status === 'rejected' || status === 'cancelled') return 'tw-bg-red-500';
    return 'tw-bg-gray-400';
};

const getStatusLabel = (status) => {
    if (status === 'pending_acceptance') return 'Solicitud';
    if (status === 'assigned') return 'Asignado';
    if (status === 'picking_up') return 'Recogiendo';
    if (status === 'delivering') return 'En Camino';
    if (status === 'rejected') return 'Rechazado';
    if (status === 'cancelled') return 'Cancelado';
    return 'Entregado';
};
</script>