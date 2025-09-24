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

    <section class="container mx-auto -mt-12 px-4 md:-mt-8">
      <div
        class="rounded-3xl bg-white/95 px-6 py-8 shadow-xl ring-1 ring-slate-200 backdrop-blur md:px-10 md:py-10"
      >
        <div class="mb-6 space-y-3 text-center md:text-right">
          <h2 class="text-2xl font-semibold text-slate-800">
            مسیرهای سریع خدمات
          </h2>
          <p class="text-sm leading-7 text-slate-600 md:text-base">
            سه اقدام پرکاربرد همیشه در دسترس شماست. توضیحات هر مسیر را بخوانید و
            با یک کلیک وارد بخش موردنیاز شوید.
          </p>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <article
            v-for="action in actionCards"
            :key="action.to"
            class="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div class="flex items-center gap-3">
              <span
                class="grid size-10 place-items-center rounded-2xl bg-sky-50 text-sky-600"
              >
                <Icon :name="action.icon" size="20" />
              </span>
              <h3 class="text-lg font-semibold text-slate-800">
                {{ action.title }}
              </h3>
            </div>
            <p class="flex-1 text-sm leading-7 text-slate-600">
              {{ action.description }}
            </p>
            <NuxtLink
              :to="action.to"
              class="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition"
              :class="buttonClasses[action.variant]"
            >
              {{ action.buttonLabel }}
              <Icon name="ph:arrow-left" size="16" />
            </NuxtLink>
          </article>
        </div>
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

    <!-- ارتباط سریع -->
    <section class="container mx-auto px-4 pb-16">
      <div
        class="rounded-3xl bg-gradient-to-l from-sky-500 via-emerald-500 to-sky-400 px-6 py-8 text-white shadow-lg"
      >
        <div
          class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <div class="max-w-xl space-y-3">
            <h2 class="text-2xl font-semibold">پشتیبانی همیشه آماده است</h2>
            <p class="text-sm leading-7 text-white/90 md:text-base">
              اگر برای ارسال دستگاه یا بررسی شرایط گارانتی نیاز به راهنمایی
              دارید، تیم ما در تمام روزهای کاری کنار شماست. یکی از مسیرهای
              ارتباطی زیر را انتخاب کنید.
            </p>
          </div>
          <div
            class="flex flex-wrap items-center gap-3 text-sm font-medium text-white"
          >
            <a
              :href="`tel:${quickContact.phone}`"
              class="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 transition hover:bg-white/25"
            >
              <Icon name="ph:phone-duotone" size="18" />
              {{ quickContact.phone }}
            </a>
            <a
              :href="`https://wa.me/${quickContact.whatsapp}`"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 transition hover:bg-white/25"
            >
              <Icon name="ph:whatsapp-logo-duotone" size="18" />
              واتساپ
            </a>
            <a
              :href="`mailto:${quickContact.email}`"
              class="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 transition hover:bg-white/25"
            >
              <Icon name="ph:envelope-duotone" size="18" />
              {{ quickContact.email }}
            </a>
            <NuxtLink
              :to="quickContact.ticket"
              class="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2 transition hover:bg-white/25"
            >
              <Icon name="ph:chat-teardrop-text-duotone" size="18" />
              ثبت تیکت آنلاین
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import HomeTimeline from "@/components/HomeTimeline.vue";
import HomeBlogHighlights from "@/components/HomeBlogHighlights.vue";
import StatsStrip from "@/components/StatsStrip.vue";
import type { BlogPost } from "@/types/blog";

type QuickContact = {
  phone: string;
  whatsapp: string;
  email: string;
  ticket: string;
};

type ActionCard = {
  title: string;
  description: string;
  to: string;
  icon: string;
  buttonLabel: string;
  variant: "primary" | "secondary" | "outline";
};

useSeoMeta({
  title: "معرفی",
  description: "گسترش سرویس — سامانهٔ استعلام وضعیت و شرایط گارانتی برندها",
});

const blogData = (await import("@/public/data/blogs.json"))
  .default as BlogPost[];
const quickContact = (await import("@/public/data/quick-contacts.json"))
  .default as QuickContact;

const actionCards: ActionCard[] = [
  {
    title: "استعلام فوری گارانتی",
    description:
      "شماره سریال دستگاه را ثبت کنید و نتیجه استعلام را در لحظه مشاهده کنید.",
    to: "/warranty/check",
    icon: "ph:magnifying-glass-duotone",
    buttonLabel: "شروع استعلام",
    variant: "primary",
  },
  {
    title: "شرایط برندها",
    description:
      "مدت و شرایط گارانتی هر برند را به تفکیک دسته‌بندی و محصولات بررسی کنید.",
    to: "/warranty/policies",
    icon: "ph:clipboard-text-duotone",
    buttonLabel: "مشاهده شرایط",
    variant: "secondary",
  },
  {
    title: "آموزش و بلاگ",
    description:
      "نکات کاربردی برای ارسال دستگاه، نگهداری بهتر و تازه‌ترین اخبار خدمات را بخوانید.",
    to: "/education",
    icon: "ph:book-open-duotone",
    buttonLabel: "مطالعه مطالب",
    variant: "outline",
  },
];

const buttonClasses: Record<ActionCard["variant"], string> = {
  primary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm",
  secondary: "bg-sky-600 hover:bg-sky-700 text-white shadow-sm",
  outline: "bg-white text-sky-600 ring-1 ring-sky-100 hover:bg-sky-50",
};

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
