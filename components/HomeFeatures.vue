<template>
  <section aria-labelledby="features-title" class="space-y-6">
    <h2 id="features-title" class="sr-only">مزیت‌های گسترش سرویس</h2>

    <div
      class="header-layout grid gap-6 items-start md:items-center md:grid-cols-2 xl:grid-cols-2"
    >
      <div
        class="header-title max-w-2xl space-y-3 text-center md:justify-self-start md:text-right md:col-span-1"
      >
        <slot name="title">
          <h2 class="text-2xl font-bold text-slate-900 md:text-3xl">
            چرا گسترش سرویس؟
          </h2>
          <p class="text-base text-slate-500">
            با امکانات هوشمند ما، فرآیند خدمات پس از فروش برای مشتری و نمایندگی
            ساده و قابل پیگیری می‌شود.
          </p>
        </slot>
      </div>
      <div class="header-visual md:col-span-1 place-self-center">
        <ClientOnly>
          <div class="aspect-square w-64 md:w-80 mx-auto">
            <lottie-player
              :src="lottieSrc"
              background="transparent"
              speed="1"
              autoplay
              loop
              class="h-full w-full"
            ></lottie-player>
          </div>
          <template #fallback>
            <div
              class="aspect-square w-64 md:w-80 rounded-2xl bg-slate-100 mx-auto"
            ></div>
          </template>
        </ClientOnly>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <article
        v-for="f in features"
        :key="f.title"
        class="rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
      >
        <div class="mb-2 flex items-center gap-3">
          <div class="rounded-xl p-2" :class="f.bg">
            <Icon :name="f.icon" size="22" />
          </div>
          <h3 class="font-semibold">{{ f.title }}</h3>
          <span
            class="ms-auto h-2 w-2 rounded-full"
            :class="f.dot"
            aria-hidden="true"
          ></span>
        </div>
        <p class="text-sm text-slate-600">{{ f.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
type Feature = {
  title: string;
  desc: string;
  icon: string;
  bg: string;
  dot: string;
};

const lottieSrc = "/lottie/Question.json";

useHead({
  script: [
    {
      src: "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js",
      defer: true,
    },
  ],
});

const features = (await import("@/public/data/home-features.json"))
  .default as Feature[];
</script>

<style scoped>
.header-title :deep(h2) {
  @apply text-2xl font-bold leading-tight md:text-3xl;
}

.header-title :deep(p) {
  @apply text-base text-slate-500;
}
</style>
