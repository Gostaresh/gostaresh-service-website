<template>
  <span class="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 text-emerald-700 px-2.5 py-1 text-xs">
    <Icon name="ph:tag-duotone" />
    {{ text }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ text: string }>()
</script>

