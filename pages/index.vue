<template>
  <div class="relative" dir="rtl">
    <!-- HERO: بنر + محتوای رو بنر -->
    <section
      class="relative isolate mx-[calc(50%-50vw)] w-screen overflow-hidden"
      dir="rtl"
    >
      <!-- ارتفاع بنر -->
      <div class="h-[320px] md:h-[480px] xl:h-[560px]">
        <!-- تصویر بنر: لبه‌به‌لبه -->
        <img
          src="/images/banners/banner.jpg"
          alt=""
          class="absolute inset-0 z-0 h-full w-full object-cover object-[70%_40%]"
        />

        <!-- لایهٔ خوانایی -->
        <div
          class="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/25 via-black/15 to-transparent md:bg-gradient-to-l md:from-black/35 md:via-black/20 md:to-transparent"
        ></div>

        <!-- محتوا: وسطِ بنر، پهنای کنترل‌شده -->
        <!-- <div class="relative z-20 h-full flex items-center justify-center">
          <div class="w-full max-w-screen-xl px-4 md:px-8">
            <div class="w-full max-w-5xl">
              <div
                class="grid gap-4 grid-flow-row md:grid-flow-col md:grid-rows-3 items-center justify-items-center text-center"
              >
                <div class="md:row-span-3 flex items-center justify-center">
                  <img
                    src="/images/brands/gs-warranty-logo.png"
                    alt="گسترش سرویس"
                    class="size-24 md:size-40 drop-shadow"
                  />
                </div>

                <div class="md:col-span-2">
                  <h1
                    class="text-3xl md:text-5xl font-extrabold leading-[1.15] text-white"
                  >
                    <span
                      class="bg-clip-text text-transparent bg-gradient-to-l from-emerald-400 to-sky-400"
                    >
                      گسترش سرویس
                    </span>
                    — همیشه یک قدم جلوتر
                  </h1>
                </div>

                <div class="md:col-span-2 md:row-span-2">
                  <p class="max-w-2xl md:mt-2 text-white/90">
                    سامانهٔ استعلام وضعیت گارانتی و مشاهدهٔ شرایط برندها؛ سریع،
                    شفاف و همیشه در دسترس.
                  </p>
                </div>
              </div>

              <div class="mt-6 flex flex-wrap gap-3 justify-center">
                <NuxtLink
                  to="/warranty/check"
                  class="inline-flex items-center gap-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 shadow-sm transition"
                >
                  <Icon name="ph:magnifying-glass-duotone" size="18" />
                  استعلام وضعیت گارانتی
                </NuxtLink>

                <NuxtLink
                  to="/warranty/policies"
                  class="inline-flex items-center gap-2 rounded-2xl bg-white/85 hover:bg-white text-slate-800 px-5 py-2.5 ring-1 ring-slate-200 backdrop-blur transition"
                >
                  <Icon name="ph:clipboard-text-duotone" size="18" />
                  شرایط گارانتی برندها
                </NuxtLink>
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </section>
    <!-- برندها -->
    <section class="container mx-auto px-4 py-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-bold">برندهای تحت پوشش</h2>
        <NuxtLink
          to="/warranty/policies"
          class="text-sky-600 hover:text-sky-700 text-sm"
        >
          مشاهده شرایط
        </NuxtLink>
      </div>
      <BrandRail />
    </section>

    <!-- مزیت‌ها -->
    <section class="container mx-auto px-4 py-6">
      <HomeFeatures />
    </section>

    <!-- آموزش -->
    <HomeBlogHighlights :posts="hotBlogs" />

    <!-- تایم‌لاین -->
    <section class="container mx-auto px-4 pb-10">
      <HomeTimeline />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import HomeTimeline from "@/components/HomeTimeline.vue";
import HomeBlogHighlights from "@/components/HomeBlogHighlights.vue";
import type { BlogPost } from "@/types/blog";

useSeoMeta({
  title: "معرفی",
  description: "گسترش سرویس — سامانهٔ استعلام وضعیت و شرایط گارانتی برندها",
});

const blogData = (await import("@/public/data/blogs.json")).default as BlogPost[];

const hotBlogs = computed(() =>
  blogData
    .filter((post) => post.hot)
    .slice(0, 3)
);
</script>
