<template>
  <div class="relative" dir="rtl">
    <!-- HERO -->
    <section
      class="relative isolate mx-[calc(50%-50vw)] w-screen overflow-hidden"
      dir="rtl"
    >
      <div class="hero-pano" role="img" aria-label="بنر خدمات گسترش سرویس">
        <div class="hero-pano-track">
          <div class="hero-pano-slide"></div>
          <div class="hero-pano-slide" aria-hidden="true"></div>
        </div>
        <div class="pointer-events-none absolute inset-0 z-10"></div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="relative z-20 container mx-auto -mt-24 px-4 md:-mt-12">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="action in actionCards"
          :key="action.to"
          :to="action.to"
          class="group flex flex-row-reverse items-center justify-between gap-5 rounded-[28px] bg-white px-7 py-6 text-right shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-1 hover:bg-sky-50 hover:shadow-lg hover:ring-sky-200"
        >
          <span
            class="grid size-14 place-items-center rounded-3xl bg-sky-500/10 text-sky-500 transition-colors duration-200 group-hover:bg-sky-500/15 group-hover:text-sky-600"
          >
            <Icon :name="action.icon" size="30" />
          </span>
          <div class="flex-1 space-y-1.5 transition-colors duration-200">
            <h3
              class="text-lg font-semibold text-sky-600 transition-colors duration-200 group-hover:text-sky-700"
            >
              {{ action.title }}
            </h3>
            <p
              class="text-sm leading-6 text-slate-500 transition-colors duration-200 group-hover:text-slate-600"
            >
              {{ action.description }}
            </p>
            <span
              class="inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors duration-200 group-hover:text-sky-600"
            >
              {{ action.buttonLabel }}
              <Icon name="ph:arrow-left-duotone" size="16" />
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <StatsStrip />

    <!-- برندها -->
    <section class="container mx-auto px-4 py-8">
      <div
        class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <h2 class="text-xl font-bold text-slate-800">برندهای تحت پوشش</h2>
          <p class="text-sm text-slate-500">
            از لوازم دیجیتال تا لوازم خانگی؛ گسترش سرویس شریک رسمی ده‌ها برند
            مطرح در سراسر کشور است.
          </p>
        </div>
        <NuxtLink
          to="/warranty/policies"
          class="inline-flex items-center gap-1 text-sm font-medium text-sky-600 transition hover:text-sky-700"
        >
          مشاهده شرایط کامل
          <Icon name="ph:arrow-left-duotone" size="16" />
        </NuxtLink>
      </div>
      <div class="mt-4">
        <BrandRail />
      </div>
    </section>

    <HomeServiceShowcase :cards="showcaseCards" :image="showcaseHeroImage" />
    <!-- مزیت‌ها -->
    <section class="container mx-auto px-4 py-10">
      <div class="mb-6 flex flex-col gap-2 text-center md:text-right">
        <h2 class="text-xl font-bold text-slate-800">چرا گسترش سرویس؟</h2>
        <p class="text-sm text-slate-500">
          با امکانات هوشمند ما، فرآیند خدمات پس از فروش برای مشتری و نمایندگی
          ساده و قابل پیگیری می‌شود.
        </p>
      </div>
      <HomeFeatures />
    </section>

    <!-- آموزش -->
    <section class="bg-slate-50/70 py-10">
      <HomeBlogHighlights :posts="hotBlogs" />
    </section>

    <!-- تایم‌لاین -->
    <section class="container mx-auto px-4 py-10">
      <div class="mb-6 flex flex-col gap-2 text-center md:text-right">
        <h2 class="text-xl font-bold text-slate-800">مسیر خدمات چگونه است؟</h2>
        <p class="text-sm text-slate-500">
          از ثبت درخواست تا تحویل دستگاه، مراحل دقیق و شفاف در دسترس شماست.
        </p>
      </div>
      <HomeTimeline />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import HomeTimeline from "@/components/HomeTimeline.vue";
import HomeServiceShowcase from "@/components/HomeServiceShowcase.vue";
import HomeBlogHighlights from "@/components/HomeBlogHighlights.vue";
import StatsStrip from "@/components/StatsStrip.vue";
import type { BlogPost } from "@/types/blog";

type ActionCard = {
  title: string;
  description: string;
  to: string;
  icon: string;
  buttonLabel: string;
};

useSeoMeta({
  title: "معرفی",
  description: "گسترش سرویس — سامانهٔ استعلام وضعیت و شرایط گارانتی برندها",
});

const blogData = (await import("@/public/data/blogs.json"))
  .default as BlogPost[];

const actionCards: ActionCard[] = [
  {
    title: "استعلام فوری گارانتی",
    description:
      "شماره سریال دستگاه را ثبت کنید و نتیجه استعلام را در لحظه مشاهده کنید.",
    to: "/warranty/check",
    icon: "ph:magnifying-glass-duotone",
    buttonLabel: "شروع استعلام",
  },
  {
    title: "شرایط برندها",
    description:
      "مدت و شرایط گارانتی هر برند را به تفکیک دسته‌بندی و محصولات بررسی کنید.",
    to: "/warranty/policies",
    icon: "ph:clipboard-text-duotone",
    buttonLabel: "مشاهده شرایط",
  },
  {
    title: "آموزش و بلاگ",
    description:
      "نکات کاربردی برای ارسال دستگاه، نگهداری بهتر و تازه‌ترین اخبار خدمات را بخوانید.",
    to: "/education",
    icon: "ph:book-open-duotone",
    buttonLabel: "مطالعه مطالب",
  },
];

const showcaseCards = [
  {
    title: "پیشخوان نمایندگی",
    description:
      "دریافت تیکت‌های جدید، مدیریت قطعات و مشاهده وضعیت هر سفارش در یک داشبورد متمرکز.",
    link: "/representatives/dashboard",
    linkLabel: "ورود به پنل",
    icon: "ph:layout-duotone",
    tag: "ویژه نمایندگان",
  },
  {
    title: "اتوماسیون تعمیرگاه",
    description:
      "ثبت فرآیند پذیرش تا مرجوعی دستگاه با فرم‌های هوشمند و اطلاع‌رسانی خودکار به مشتری.",
    link: "/solutions/automation",
    linkLabel: "جزئیات راهکار",
    icon: "ph:gear-six-duotone",
  },
  {
    title: "گزارش‌های تحلیلی",
    description:
      "روند خرابی محصولات، قطعات پرتکرار و عملکرد تیم‌های خدمات را با نمودارهای داینامیک ببینید.",
    link: "/insights/reports",
    linkLabel: "مشاهده گزارش‌ها",
    icon: "ph:trend-up-duotone",
  },
];
const showcaseHeroImage =
  "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1200&q=80";

const hotBlogs = computed(() =>
  blogData.filter((post) => post.hot).slice(0, 3)
);
</script>

<style scoped>
.hero-pano {
  --panorama-aspect: 6.6667;
  --hero-height: 50vh;
  --pan-duration: 50s;
  --panorama-width: calc(var(--panorama-aspect) * var(--hero-height));
  position: relative;
  width: 100%;
  height: var(--hero-height);
  overflow: hidden;
  background-color: #000;
}

.hero-pano-track {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  height: 100%;
  width: calc(var(--panorama-width) * 2);
  animation: hero-pano-scroll var(--pan-duration) linear infinite;
  will-change: transform;
}

.hero-pano-slide {
  flex: 0 0 auto;
  width: var(--panorama-width);
  height: 100%;
  background-image: url("/images/banners/banner.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}

.hero-pano:hover .hero-pano-track {
  /* animation-play-state: paused; */
}

@media (max-width: 640px) {
  .hero-pano {
    --hero-height: 40vh;
    --pan-duration: 45s;
  }
}

@keyframes hero-pano-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-1 * var(--panorama-width)));
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-pano-track {
    animation: none;
    transform: translateX(0);
  }
}
</style>
