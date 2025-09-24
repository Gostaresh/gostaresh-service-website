<template>
  <div class="relative">
    <div
      class="group flex items-center gap-10 overflow-x-auto no-scrollbar rounded-3xl bg-white/90 backdrop-blur ring-1 ring-slate-200 px-6 py-5 shadow-sm"
      aria-label="برندهای تحت پوشش"
    >
      <template v-if="brands.length">
        <a
          v-for="b in brands"
          :key="b.name"
          :href="`/warranty/policies?brand=${encodeURIComponent(b.name)}`"
          :title="`شرایط گارانتی ${b.name}`"
          class="shrink-0 grid place-items-center h-16"
        >
          <img
            :src="b.logo"
            :alt="b.name"
            class="h-10 w-auto opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition-[filter,opacity] duration-300"
            @error="onImgError($event, b.name)"
          />
        </a>
      </template>

      <div v-else class="text-slate-400 text-sm px-2">
        لوگوی برندی موجود نیست.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Brand = { name: string; logo: string };

let brands: Brand[] = [];
try {
  brands = (await $fetch<Brand[]>("/data/brands.json")) ?? [];
} catch {
  try {
    brands = (await import("@/public/data/brands.json")).default as Brand[];
  } catch {}
}

const onImgError = (e: Event, name: string) => {
  const img = e.target as HTMLImageElement;
  img.replaceWith(
    Object.assign(document.createElement("div"), {
      className:
        "h-10 px-3 flex items-center justify-center rounded bg-slate-100 text-slate-500 text-xs",
      textContent: name,
    })
  );
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  justify-content: center;
}
</style>
