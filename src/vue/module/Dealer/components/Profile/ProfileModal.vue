<template>
    <div v-if="isOpen"
         class="tw-fixed tw-inset-0 tw-bg-black/30 tw-backdrop-blur-sm tw-z-[60] tw-flex tw-items-end sm:tw-items-center tw-justify-center tw-animate-in tw-fade-in tw-duration-200">
        <div class="tw-bg-white dark:tw-bg-gray-900 tw-w-full tw-max-w-sm sm:tw-rounded-3xl tw-rounded-t-3xl tw-p-6 tw-shadow-2xl tw-animate-in tw-slide-in-from-bottom tw-duration-300">
            <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
                <h3 class="tw-text-xl tw-font-black tw-text-gray-800 dark:tw-text-white">Mi Perfil</h3>
                <button @click="$emit('close')" class="tw-p-2 tw-bg-gray-100 dark:tw-bg-gray-800 tw-rounded-full">
                    <component :is="LucideIcons.X" :size="20"/>
                </button>
            </div>

            <div class="tw-flex tw-flex-col tw-items-center tw-gap-4 tw-mb-8">
                <div class="tw-relative tw-group">
                    <div class="tw-w-24 tw-h-24 tw-rounded-full tw-overflow-hidden tw-bg-gray-200 dark:tw-bg-gray-800
          tw-border-4 tw-border-white dark:tw-border-gray-700 tw-shadow-lg">
                        <img v-if="editData.photo" :src="editData.photo" alt="Perfil"
                             class="tw-w-full tw-h-full tw-object-cover"/>
                        <div v-else
                             class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center tw-text-gray-400">
                            <component :is="LucideIcons.User" :size="48"/>
                        </div>
                    </div>
                    <button @click="fileInputRef.click()" class="tw-absolute tw-bottom-0 tw-right-0
          tw-bg-[#1abc9c] tw-text-white tw-p-2 tw-rounded-full tw-shadow-md hover:tw-bg-[#16a085]
          tw-transition-transform active:tw-scale-90">
                        <component :is="LucideIcons.Camera" :size="16"/>
                    </button>
                    <input type="file" ref="fileInputRef" class="tw-hidden" accept="image/*"
                           @change="handlePhotoUpload"/>
                </div>

                <div class="tw-text-center tw-w-full">
                    <input v-if="isEditing"
                           class="tw-bg-gray-50 dark:tw-bg-gray-800 tw-border-none tw-rounded-lg tw-px-3 tw-py-2 tw-font-bold tw-text-lg tw-w-full tw-text-center tw-mb-2"
                           v-model="editData.name" placeholder="Tu nombre"/>
                    <h2 v-else class="tw-text-2xl tw-font-black tw-text-gray-800 dark:tw-text-white">
                        {{ user?.name || 'Invitado' }}</h2>
                    <p class="tw-text-gray-500 tw-font-medium">
                        {{ user?.isGuest ? 'Cuenta de Invitado' : (user?.phone || 'Sin celular') }}</p>
                </div>
            </div>

            <div v-if="user?.isGuest"
                 class="tw-bg-amber-50 tw-text-amber-700 tw-p-4 tw-rounded-xl tw-mb-4 tw-text-sm tw-font-medium tw-text-center">
                Estás en modo invitado. Regístrate para guardar tu historial.
            </div>
            <div v-else-if="isEditing" class="tw-space-y-3 tw-mb-6">
                <input class="tw-w-full tw-bg-gray-50 dark:tw-bg-gray-800 tw-border-none tw-rounded-xl tw-p-3.5 tw-font-medium"
                       placeholder="Celular" v-model="editData.phone"/>
                <button @click="handleSave"
                        class="tw-w-full tw-bg-[#1abc9c] tw-text-white tw-font-bold tw-py-3.5 tw-rounded-xl tw-shadow-md">
                    Guardar Cambios
                </button>
            </div>
            <button v-else @click="isEditing = true"
                    class="tw-w-full tw-mb-4 tw-bg-gray-100 dark:tw-bg-gray-800 tw-text-gray-700 dark:tw-text-gray-200 tw-font-bold tw-py-3.5 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-gap-2">
                <component :is="LucideIcons.Edit3" :size="18"/>
                Editar Datos
            </button>

            <button @click="$emit('close')"
                    class="tw-w-full tw-flex tw-items-center tw-justify-center tw-gap-2 tw-text-gray-500 tw-font-bold tw-py-3 tw-rounded-xl hover:tw-bg-gray-50 dark:hover:tw-bg-gray-800 tw-transition-colors">
                Cerrar Ventana
            </button>
            <button @click="$emit('logout')"
                    class="tw-w-full tw-flex tw-items-center tw-justify-center tw-gap-2 tw-text-red-500 tw-font-bold tw-bg-red-50 dark:tw-bg-red-900/10 tw-py-4 tw-rounded-xl hover:tw-bg-red-100 tw-transition-colors tw-mt-2">
                <component :is="LucideIcons.LogOut" :size="20"/>
                {{ user?.isGuest ? 'Salir de Invitado' : 'Cerrar Sesión' }}
            </button>
        </div>
    </div>
</template>

<script setup>
import {ref, watch} from "vue";
import * as LucideIcons from 'lucide-vue-next';

const props = defineProps({
    isOpen: Boolean, user: Object
})
const emit = defineEmits(['close', 'update', 'logout'])

const editData = ref({name: '', phone: '', vehicle: '', photo: null});
const isEditing = ref(false);
const fileInputRef = ref(null);

watch(() => props.user, (newUser) => {
    if (newUser) editData.value = {...newUser};
    else editData.value = {name: '', phone: '', vehicle: '', photo: null};
}, {immediate: true});

const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            editData.value.photo = reader.result;
        };
        reader.readAsDataURL(file);
    }
};

const handleSave = () => {
    emit('update', {...editData.value});
    isEditing.value = false;
};


</script>