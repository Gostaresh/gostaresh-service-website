<template>
  <div class="space-y-2">
    <div class="aspect-[4/3] w-full rounded-2xl bg-slate-100 overflow-hidden">
      <img v-if="active" :src="active" class="h-full w-full object-cover" />
    </div>
    <div class="flex gap-2 overflow-auto">
      <button
        v-for="(img, i) in images"
        :key="i"
        type="button"
        class="size-16 rounded-xl overflow-hidden ring-2"
        :class="i === index ? 'ring-sky-300' : 'ring-transparent'"
        @click="index = i"
      >
        <img :src="img" class="h-full w-full object-cover" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{ images: string[] }>()
const index = ref(0)
const active = computed(() => props.images?.[index.value])
watch(
  () => props.images,
  () => {
    index.value = 0
  }
)
</script>

