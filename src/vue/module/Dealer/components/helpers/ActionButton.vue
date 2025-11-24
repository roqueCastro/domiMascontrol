<template>

  <button :class="classes" @click="onClick"
          >
    <component  :is="icon" v-if="icon" :size="20" :stroke-width="2.5" class="tw-shrink-0" />
    <span class="tw-truncate"></span>
    <slot/>
  </button>

</template>

<script >
import { defineComponent } from 'vue'

const baseStyles = "tw-relative tw-overflow-hidden tw-transition-all tw-duration-200 active:tw-scale-[0.96] tw-flex tw-items-center tw-justify-center tw-gap-3 tw-font-bold tw-py-4 tw-px-4 tw-rounded-2xl tw-shadow-sm tw-select-none";
const variants = {
  primary: `tw-bg-[#1abc9c] hover:tw-bg-[#16a085] tw-text-white tw-shadow-[0_4px_14px_0_rgba(26,188,156,0.39)]`,
  secondary: `tw-bg-white dark:tw-bg-gray-800 tw-text-gray-700 dark:tw-text-gray-200 tw-border tw-border-gray-200 dark:tw-border-gray-700 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700`,
  danger: `tw-bg-white dark:tw-bg-gray-800 tw-text-red-500 tw-border tw-border-red-100 dark:tw-border-red-900/50 hover:tw-bg-red-50 dark:hover:tw-bg-red-900/20`,
  success: `tw-bg-emerald-500 hover:tw-bg-emerald-600 tw-text-white tw-shadow-emerald-500/30`,
  ghost: `tw-bg-gray-100 dark:tw-bg-gray-800 tw-text-gray-500 hover:tw-bg-gray-200 dark:hover:tw-bg-gray-700`,
};


export default defineComponent({
  name: 'ActionButton',
  props: {
    variant: {
      type: String,
      default: 'primary'
    },
    className: {
      type: String,
      default: ''
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    icon: {
      type: [Object, Function],
      default: null
    }
  },
  emits: ['click'],
  computed: {
    classes() {
      return [
        baseStyles,
        variants[this.variant] || variants.primary,
        this.fullWidth ? 'tw-w-full' : '',
        this.className
      ].join(' ')
    }
  },
  methods: {
    onClick(e) {
      this.$emit('click', e)
    }
  }
})

</script>