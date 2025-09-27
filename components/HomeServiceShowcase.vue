<template>
  <section class="container mx-auto px-4 py-12">
    <div class="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
      <div class="space-y-4">
        <header class="space-y-2">
          <span
            class="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-600"
          >
            خدمات ویژه نمایندگی‌ها
          </span>
          <h2 class="text-2xl font-bold text-slate-900">
            راهکارهای هوشمند برای مدیریت خدمات پس از فروش
          </h2>
          <p class="text-sm leading-7 text-slate-500 md:text-base">
            مسیرهای پیشنهادی زیر را دنبال کنید تا تجربه مشتری و تیم فنی خود را بهینه کنید. تصاویر را می‌توانید با نمونه‌های برند خود جایگزین کنید.
          </p>
        </header>

        <div class="space-y-3">
          <article
            v-for="item in cards"
            :key="item.title"
            class="group flex flex-col gap-3 rounded-3xl border border-slate-200/70 bg-white/80 px-5 py-4 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:bg-sky-50/70 hover:shadow-md"
          >
            <div class="flex items-center gap-3">
              <span
                class="grid size-11 place-items-center rounded-2xl bg-sky-500/10 text-sky-600 transition group-hover:bg-sky-500/15 group-hover:text-sky-600"
              >
                <Icon :name="item.icon" size="22" />
              </span>
              <div class="space-y-1">
                <h3 class="text-base font-semibold text-slate-800 group-hover:text-sky-600">
                  {{ item.title }}
                </h3>
                <p class="text-xs font-medium text-sky-500" v-if="item.tag">
                  {{ item.tag }}
                </p>
              </div>
            </div>
            <p class="text-sm leading-6 text-slate-500">
              {{ item.description }}
            </p>
            <NuxtLink
              :to="item.link"
              class="inline-flex items-center gap-1 text-xs font-medium text-sky-600 transition group-hover:text-sky-700"
            >
              {{ item.linkLabel }}
              <Icon name="ph:arrow-left-duotone" size="14" />
            </NuxtLink>
          </article>
        </div>
      </div>

      <div class="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-sky-100 via-white to-emerald-50 shadow-lg">
        <img
          :src="image"
          alt="نمایش بصری خدمات"
          class="h-full w-full object-cover"
          loading="lazy"
          @error="onImgError"
        />
        <div
          ref="fallbackRef"
          class="absolute inset-0 hidden place-items-center bg-gradient-to-tr from-sky-200 via-white to-sky-100 text-sky-700"
        >
          <div class="space-y-1 text-center">
            <p class="text-sm font-semibold">محل قرارگیری تصویر خدمات</p>
            <p class="text-xs text-slate-500">
              این بخش را با تصویر دلخواه خود جایگزین کنید.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{
  cards: {
    title: string;
    description: string;
    link: string;
    linkLabel: string;
    icon: string;
    tag?: string;
  }[];
  image: string;
}>();

const fallbackRef = ref<HTMLElement | null>(null);

const onImgError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.classList.add('hidden');
  fallbackRef.value?.classList.remove('hidden');
};
</script>

