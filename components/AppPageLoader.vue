<template>
  <Transition name="page-loader-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[2000] flex items-center justify-center bg-white/60 backdrop-blur-sm"
    >
      <div
        class="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl"
      >
        <NSpin size="large" />
        <span class="text-sm font-medium text-slate-600">در حال بارگذاری صفحه…</span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NSpin } from "naive-ui";

const loading = useState("page-loading", () => false);

const visible = computed(() => loading.value);
</script>

<style scoped>
.page-loader-fade-enter-active,
.page-loader-fade-leave-active {
  transition: opacity 0.2s ease;
}
.page-loader-fade-enter-from,
.page-loader-fade-leave-to {
  opacity: 0;
}
</style>

