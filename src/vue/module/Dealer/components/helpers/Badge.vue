<template>
  <span
      :class="[
      'tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-[10px] tw-uppercase tw-tracking-wider tw-font-bold tw-border',
      colors[type] || colors.neutral,
      className
    ]"
  >
    <slot />
  </span>
</template>


<script setup>

const props = defineProps({
  type: {
    type: String,
    default: 'neutral'
  },
  className: {
    type: String,
    default: ''
  }
})

const colors = {
  success:
      'tw-bg-emerald-100 tw-text-emerald-700 tw-border-emerald-200 dark:tw-bg-emerald-900/30 dark:tw-text-emerald-400 dark:tw-border-emerald-800',
  warning:
      'tw-bg-amber-100 tw-text-amber-700 tw-border-amber-200 dark:tw-bg-amber-900/30 dark:tw-text-amber-400 dark:tw-border-amber-800',
  neutral:
      'tw-bg-gray-100 tw-text-gray-600 tw-border-gray-200 dark:tw-bg-gray-800 dark:tw-text-gray-400 dark:tw-border-gray-700',
  brand:
      'tw-bg-[#1abc9c]/10 tw-text-[#16a085] tw-border-[#1abc9c]/20 dark:tw-bg-[#1abc9c]/20 dark:tw-text-[#1abc9c] dark:tw-border-[#1abc9c]/30',
  danger:
      'tw-bg-red-100 tw-text-red-700 tw-border-red-200 dark:tw-bg-red-900/30 dark:tw-text-red-400 dark:tw-border-red-800',
  cancelled:
      'tw-bg-gray-200 tw-text-gray-600 tw-border-gray-300 dark:tw-bg-gray-800 dark:tw-text-gray-400 dark:tw-border-gray-700'
}

</script>