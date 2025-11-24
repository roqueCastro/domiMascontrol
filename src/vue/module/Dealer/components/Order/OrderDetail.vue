<template>
    <div v-if="order" class="tw-fixed tw-inset-0 tw-bg-[#f4f6f7] dark:tw-bg-gray-900 tw-z-50
        tw-animate-in tw-slide-in-from-right tw-duration-300">

        <!-- Header -->
        <div class="tw-bg-white dark:tw-bg-gray-800 tw-shadow-sm tw-px-4 tw-py-3 tw-flex tw-items-center tw-gap-3 tw-z-20 tw-sticky tw-top-0">
            <button @click="$emit('back')" class="tw-p-2 tw-rounded-full hover:tw-bg-gray-100 dark:hover:tw-bg-gray-700 tw-text-gray-600 dark:tw-text-gray-300 tw-transition-colors">
                <component :is="LucideIcons.ChevronLeft" :size="28" />
            </button>
            <div class="tw-flex-1 tw-text-center tw-mr-10">
                <h3 class="tw-font-black tw-text-gray-800 dark:tw-text-white tw-text-lg tw-tracking-tight">
                    {{ isDelivered ? 'COMPROBANTE' : isCancelled ? 'CANCELADO' : `ORDEN #${order.id.split('-')[1]}` }}
                </h3>
                <p :class="['tw-text-xs tw-font-medium tw-uppercase tw-tracking-wider', isCancelled ? 'tw-text-red-500' : 'tw-text-[#1abc9c]']">
                    {{ isDelivered ? `Entregado: ${formatTime(order.deliveredAt)}` : isCancelled ? 'Anulado' : 'En Curso' }}
                </p>
            </div>
            <button v-if="!isPendingAcceptance" @click="showProblemMenu = !showProblemMenu" class="tw-absolute tw-right-4 tw-p-2 tw-text-gray-400 hover:tw-text-gray-600 dark:hover:tw-text-gray-200">
                <component :is="LucideIcons.AlertTriangle" :size="20" />
            </button>
        </div>

        <!-- MENU DE PROBLEMAS -->
        <div v-if="showProblemMenu" class="tw-absolute tw-top-[60px] tw-left-4 tw-right-4 tw-z-50">
            <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-2xl tw-shadow-2xl tw-border tw-border-gray-100 dark:tw-border-gray-700 tw-p-1 tw-animate-in tw-slide-in-from-top-2 tw-overflow-hidden">
                <div class="tw-px-4 tw-py-2 tw-bg-gray-50 dark:tw-bg-gray-700/50 tw-border-b tw-border-gray-100 dark:tw-border-gray-700">
                    <h4 class="tw-text-xs tw-font-bold tw-uppercase tw-text-gray-500 tw-flex tw-items-center tw-gap-2">Gestión de Problemas</h4>
                </div>
                <button @click="$emit('revert', order.id); showProblemMenu = false;" class="tw-w-full tw-text-left tw-p-4 tw-flex tw-items-center tw-gap-3 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700 tw-transition-colors tw-border-b tw-border-gray-100 dark:tw-border-gray-700">
                    <div class="tw-bg-amber-100 tw-text-amber-600 tw-p-2 tw-rounded-lg"><component :is="LucideIcons.Undo2" :size="18"/></div>
                    <div>
                        <p class="tw-font-bold tw-text-gray-800 dark:tw-text-white tw-text-sm">Revertir Estado</p>
                        <p class="tw-text-xs tw-text-gray-500">{{ isCancelled ? 'Recuperar pedido' : 'Regresar al paso anterior' }}</p>
                    </div>
                    <component :is="LucideIcons.ChevronRight" :size="16" class="tw-ml-auto tw-text-gray-300"/>
                </button>
                <button v-if="!isCancelled" @click="$emit('reject', order.id, 'cancelled'); showProblemMenu = false; $emit('back');" class="tw-w-full tw-text-left tw-p-4 tw-flex tw-items-center tw-gap-3 hover:tw-bg-red-50 dark:hover:tw-bg-red-900/20 tw-transition-colors">
                    <div class="tw-bg-red-100 tw-text-red-600 tw-p-2 tw-rounded-lg"><component :is="LucideIcons.XCircle" :size="18"/></div>
                    <div>
                        <p class="tw-font-bold tw-text-red-600 dark:tw-text-red-400 tw-text-sm">Cancelar Pedido</p>
                        <p class="tw-text-xs tw-text-red-400/70">Marcar como anulado</p>
                    </div>
                </button>
            </div>
            <div class="tw-fixed tw-inset-0 tw--z-10" @click="showProblemMenu = false"></div>
        </div>

        <div class="tw-flex tw-max-w-7xl tw-mx-auto tw-h-screen tw-overflow-auto tw-pb-40">
            <div class="tw-flex-1 tw-overflow-y-auto tw-p-4 tw-space-y-4">

                <!-- HEADER DE EMPRESA UNIFICADO -->
                <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-3xl tw-p-5 tw-shadow-sm tw-border tw-border-gray-100 dark:tw-border-gray-700 tw-relative tw-overflow-hidden">
                    <div class="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-h-1 tw-bg-gradient-to-r tw-from-transparent tw-via-[#1abc9c] tw-to-transparent"></div>
                    <div class="tw-flex tw-flex-col tw-items-center tw-text-center">
                        <div class="tw-w-14 tw-h-14 tw-bg-orange-100 tw-text-orange-600 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-mb-3 tw-shadow-sm">
                            <component :is="LucideIcons.Store" :size="28" />
                        </div>
                        <h2 class="tw-text-xl tw-font-black tw-text-gray-800 dark:tw-text-white tw-leading-tight tw-mb-1">
                            {{ user?.name ? `Hola ${user.name.split(' ')[0]},` : "Hola," }}
                        </h2>
                        <p class="tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-3">
                            <span class="tw-font-black tw-text-gray-800 dark:tw-text-white">La Mía Pizza</span> te mandó un pedido.
                        </p>
                        <div class="tw-inline-flex tw-items-center tw-gap-2 tw-bg-gray-50 dark:tw-bg-gray-700/50 tw-px-4 tw-py-2 tw-rounded-xl tw-text-xs tw-font-bold tw-text-gray-500 dark:tw-text-gray-300 tw-border tw-border-gray-100 dark:tw-border-gray-700">
                            <component :is="LucideIcons.MapPin" :size="14" class="tw-text-[#1abc9c]" />
                            Calle 12 Sur # 5-40
                        </div>
                    </div>
                </div>

                <!-- Card Cliente -->
                <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-3xl tw-p-5 tw-shadow-sm tw-border tw-border-gray-100 dark:tw-border-gray-700 tw-relative tw-overflow-hidden tw-animate-in tw-slide-in-from-bottom tw-duration-500 tw-delay-100">
                    <div v-if="isDelivered" class="tw-absolute tw-top-0 tw-right-0 tw-p-4 tw-opacity-10"><component :is="LucideIcons.CheckCircle2" :size="100" class="tw-text-[#1abc9c]" /></div>
                    <div v-if="isCancelled" class="tw-absolute tw-top-0 tw-right-0 tw-p-4 tw-opacity-10"><component :is="LucideIcons.XCircle" :size="100" class="tw-text-red-500" /></div>
                    <div class="tw-flex tw-items-start tw-gap-4 tw-mb-6 tw-relative tw-z-10">
                        <div :class="['tw-p-3 tw-rounded-2xl', isDelivered ? 'tw-bg-gray-100 dark:tw-bg-gray-700 tw-text-gray-400' : isCancelled ? 'tw-bg-red-100 tw-text-red-500' : 'tw-bg-[#1abc9c]/10 tw-text-[#1abc9c]']">
                            <component :is="LucideIcons.User" :size="24" />
                        </div>
                        <div>
                            <h2 class="tw-text-xl tw-font-black tw-text-gray-800 dark:tw-text-white tw-leading-tight">{{ order.client }}</h2>
                            <p class="tw-text-gray-500 dark:tw-text-gray-400 tw-text-sm tw-font-medium tw-mt-1 tw-flex tw-items-center tw-gap-1">
                                <component :is="LucideIcons.MapPin" :size="14" /> {{ order.address }}
                            </p>
                        </div>
                    </div>
                    <div v-if="!isDelivered && !isPendingAcceptance && !isCancelled" class="tw-grid tw-grid-cols-2 tw-gap-3">
                        <ActionButton variant="secondary" :icon="LucideIcons.Phone" class="tw-h-12 tw-text-sm">Llamar</ActionButton>
                        <ActionButton variant="secondary" :icon="LucideIcons.MessageCircle" class="tw-h-12 tw-text-sm">WhatsApp</ActionButton>
                    </div>
                </div>

                <!-- Notas -->
                <div v-if="order.note" class="tw-animate-in tw-slide-in-from-bottom tw-duration-500 tw-delay-150">
                    <div class="tw-relative tw-rounded-2xl tw-p-4 tw-border-l-4 tw-shadow-sm tw-bg-amber-50 tw-border-amber-400 dark:tw-bg-amber-900/20 dark:tw-border-amber-600">
                        <div class="tw-flex tw-justify-between tw-items-start">
                            <h4 class="tw-text-xs tw-font-bold tw-uppercase tw-mb-1 tw-flex tw-items-center tw-gap-2 tw-text-amber-600 dark:tw-text-amber-400">
                                <component :is="LucideIcons.StickyNote" :size="14" /> Instrucciones de la Empresa
                            </h4>
                        </div>
                        <p class="tw-text-sm tw-italic tw-leading-relaxed tw-text-gray-700 dark:tw-text-gray-300">
                            "{{ order.note }}"
                        </p>
                    </div>
                </div>

                <!-- Tiempos -->
                <div class="tw-bg-gray-50 dark:tw-bg-gray-800/50 tw-rounded-2xl tw-p-4 tw-flex tw-justify-between tw-items-center tw-text-sm tw-border tw-border-gray-100 dark:tw-border-gray-700 tw-animate-in tw-slide-in-from-bottom tw-duration-500 tw-delay-200">
                    <div class="tw-flex tw-flex-col">
                        <span class="tw-text-xs tw-text-gray-400 tw-font-bold tw-uppercase">Asignado</span>
                        <span class="tw-font-bold tw-text-gray-700 dark:tw-text-gray-200">{{ formatTime(order.assignedAt) }}</span>
                    </div>
                    <template v-if="isDelivered">
                        <div class="tw-h-8 tw-w-px tw-bg-gray-200 dark:tw-bg-gray-600 tw-mx-2"></div>
                        <div class="tw-flex tw-flex-col">
                            <span class="tw-text-xs tw-text-gray-400 tw-font-bold tw-uppercase">Entregado</span>
                            <span class="tw-font-bold tw-text-gray-700 dark:tw-text-gray-200">{{ formatTime(order.deliveredAt) }}</span>
                        </div>
                        <div class="tw-h-8 tw-w-px tw-bg-gray-200 dark:tw-bg-gray-600 tw-mx-2"></div>
                        <div class="tw-flex tw-flex-col">
                            <span class="tw-text-xs tw-text-gray-400 tw-font-bold tw-uppercase">Tiempo Total</span>
                            <span class="tw-font-bold tw-text-[#1abc9c]">{{ calculateDuration(order.assignedAt, order.deliveredAt) }}</span>
                        </div>
                    </template>
                    <div v-else :class="['tw-flex tw-items-center tw-gap-2 tw-font-bold tw-px-3 tw-py-1 tw-rounded-full tw-animate-pulse', isPendingAcceptance ? 'tw-bg-amber-100 tw-text-amber-600' : isCancelled ? 'tw-bg-red-100 tw-text-red-600' : 'tw-bg-[#1abc9c]/10 tw-text-[#1abc9c]']">
                        <component :is="LucideIcons.Clock" :size="16" /> {{ isPendingAcceptance ? 'Esperando respuesta...' : isCancelled ? 'Cancelado' : 'En curso' }}
                    </div>
                </div>

                <!-- Detalle Financiero -->
                <div :class="['tw-p-5 tw-rounded-3xl tw-border-2 tw-flex tw-justify-between tw-items-center tw-animate-in tw-slide-in-from-bottom tw-duration-500 tw-delay-300', order.paymentStatus === 'paid' ? 'tw-bg-emerald-50 tw-border-emerald-100 dark:tw-bg-emerald-900/10 dark:tw-border-emerald-800' : 'tw-bg-red-50 tw-border-red-100 dark:tw-bg-red-900/10 dark:tw-border-red-800']">
                    <div class="tw-flex tw-items-center tw-gap-3">
                        <div :class="['tw-p-2 tw-rounded-full', order.paymentStatus === 'paid' ? 'tw-bg-emerald-200 tw-text-emerald-700' : 'tw-bg-red-200 tw-text-red-700']">
                            <component :is="order.paymentStatus === 'paid' ? LucideIcons.CheckCircle2 : LucideIcons.DollarSign" :size="20"/>
                        </div>
                        <div>
                            <p :class="['tw-text-xs tw-font-black tw-uppercase', order.paymentStatus === 'paid' ? 'tw-text-emerald-700' : 'tw-text-red-700']">
                                {{ order.paymentStatus === 'paid' ? 'YA PAGADO' : 'COBRAR EN EFECTIVO' }}
                            </p>
                            <p class="tw-text-xs tw-text-gray-500 tw-font-medium">
                                {{ order.paymentType === 'transfer' ? 'Transferencia' : 'Efectivo' }}
                            </p>
                        </div>
                    </div>
                    <span class="tw-text-2xl tw-font-black tw-text-gray-800 dark:tw-text-white">${{ order.total.toLocaleString() }}</span>
                </div>

                <!-- Lista Productos -->
                <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-3xl tw-p-5 tw-shadow-sm tw-border tw-border-gray-100 dark:tw-border-gray-700 tw-animate-in tw-slide-in-from-bottom tw-duration-500 tw-delay-300">
                    <h4 class="tw-text-sm tw-font-bold tw-text-gray-400 tw-uppercase tw-mb-4 tw-flex tw-items-center tw-gap-2">
                        <component :is="LucideIcons.Package" :size="16" /> Productos
                    </h4>
                    <div class="tw-space-y-4">
                        <div v-for="(item, i) in order.items" :key="i" class="tw-flex tw-justify-between tw-items-center">
                            <div class="tw-flex tw-items-center tw-gap-3">
                                        <span class="tw-bg-gray-100 dark:tw-bg-gray-700 tw-text-gray-600 dark:tw-text-gray-300 tw-font-bold tw-px-2 tw-py-1 tw-rounded-md tw-text-xs tw-min-w-[2rem] tw-text-center">
                                            {{ item.qty }}x
                                        </span>
                                <span class="tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-200">{{ item.name }}</span>
                            </div>
                            <span class="tw-text-sm tw-text-gray-500 tw-font-medium">${{ (item.price * item.qty).toLocaleString() }}</span>
                        </div>
                    </div>
                    <div class="tw-mt-4 tw-pt-4 tw-border-t tw-border-gray-100 dark:tw-border-gray-700 tw-flex tw-justify-between">
                        <span class="tw-font-bold tw-text-gray-800 dark:tw-text-white">Total Final</span>
                        <span class="tw-font-bold tw-text-[#1abc9c]">${{ order.total.toLocaleString() }}</span>
                    </div>
                </div>
            </div>

            <!-- FOOTER ACTIONS -->
            <div v-if="!isCancelled" class="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-p-4 tw-bg-white/90 dark:tw-bg-gray-900/90 tw-backdrop-blur-xl tw-border-t tw-border-gray-200 dark:tw-border-gray-800 tw-z-20 tw-pb-6">
                <div v-if="isPendingAcceptance" class="tw-grid tw-grid-cols-2 tw-gap-4">
                    <ActionButton variant="danger" :icon="LucideIcons.ThumbsDown" @click="$emit('reject', order.id, 'rejected'); $emit('back');">Rechazar</ActionButton>
                    <ActionButton variant="success" :icon="LucideIcons.ThumbsUp" @click="handleMainAction">Aceptar</ActionButton>
                </div>
                <button
                        v-else-if="!isDelivered && action.next"
                        @click="$emit('updateStatus', order.id, action.next)"
                        :class="['tw-w-full tw-py-4 tw-rounded-2xl tw-shadow-lg tw-transform tw-transition-all active:tw-scale-[0.98] tw-flex tw-items-center tw-justify-between tw-px-6 tw-group', action.color === 'warning' ? 'tw-bg-amber-500 hover:tw-bg-amber-600 tw-text-white tw-shadow-amber-500/30' : action.color === 'success' ? 'tw-bg-emerald-500 hover:tw-bg-emerald-600 tw-text-white tw-shadow-emerald-500/30' : 'tw-bg-[#1abc9c] hover:tw-bg-[#16a085] tw-text-white tw-shadow-[#1abc9c]/30']"
                >
                    <div class="tw-flex tw-flex-col tw-items-start">
                        <span class="tw-text-lg tw-font-black tw-uppercase tw-tracking-wide">{{ action.label }}</span>
                        <span class="tw-text-xs tw-opacity-90 tw-font-medium">{{ action.subLabel }}</span>
                    </div>
                    <div class="tw-bg-white/20 tw-p-2 tw-rounded-full group-hover:tw-translate-x-1 tw-transition-transform">
                        <component :is="LucideIcons.ArrowRight" :size="24" />
                    </div>
                </button>
            </div>
        </div>
        <!-- Contenido -->

    </div>
</template>

<script setup>
import {computed, ref} from "vue";


const props = defineProps({
    order: Object,  user: Object
});

const emit = defineEmits(['back', 'updateStatus', 'reject', 'revert', 'requireAuth']);


//COMPONENTS
import * as LucideIcons from 'lucide-vue-next';
import ActionButton from '../helpers/ActionButton.vue'

const showProblemMenu = ref(false);

const isDelivered = computed(() => props.order.status === 'delivered');
const isPendingAcceptance = computed(() => props.order.status === 'pending_acceptance');
const isCancelled = computed(() => props.order.status === 'cancelled' || props.order.status === 'rejected');

const statusConfig = {
    pending_acceptance: { label: 'ACEPTAR PEDIDO', subLabel: 'Confirmar ahora', next: 'assigned', icon: LucideIcons.ThumbsUp, color: 'success' },
    assigned: { label: 'INICIAR RECOGIDA', subLabel: 'Voy al restaurante', next: 'picking_up', icon: LucideIcons.Bike, color: 'primary' },
    picking_up: { label: 'YA LO TENGO', subLabel: 'Iniciar ruta', next: 'delivering', icon: LucideIcons.Navigation, color: 'warning' },
    delivering: { label: 'CONFIRMAR ENTREGA', subLabel: 'Finalizar pedido', next: 'delivered', icon: LucideIcons.CheckCircle2, color: 'success' },
    delivered: { label: 'ENTREGADO', subLabel: 'Orden finalizada', next: null, icon: LucideIcons.CheckCircle2, color: 'secondary' },
    rejected: { label: 'RECHAZADO', subLabel: 'No tomado', next: null, icon: LucideIcons.XCircle, color: 'danger' },
    cancelled: { label: 'CANCELADO', subLabel: 'Operación anulada', next: null, icon: LucideIcons.XCircle, color: 'danger' }
};

const action = computed(() => statusConfig[props.order.status] || statusConfig.pending_acceptance);

const handleMainAction = () => {
    if (!props.user && props.order.status === 'pending_acceptance') {
        emit('requireAuth');
    } else {
        emit('updateStatus', props.order.id, action.value.next);
    }
};

</script>
