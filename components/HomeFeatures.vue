<template>
  <section aria-labelledby="features-title" class="space-y-4">
    <h2 id="features-title" class="sr-only">مزیت‌های گسترش سرویس</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <article
        v-for="f in features"
        :key="f.title"
        class="rounded-2xl bg-white/90 backdrop-blur ring-1 ring-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-center gap-3 mb-2">
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
        <p class="text-slate-600 text-sm">{{ f.desc }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  {
    title: "استعلام سریع",
    desc: "با سریال/IMEI، نتیجه ظرف چند ثانیه نمایش داده می‌شود.",
    icon: "ph:rocket-duotone",
    bg: "bg-sky-50",
    dot: "bg-sky-300",
  },
  {
    title: "شفافیت وضعیت",
    desc: "تایم‌لاین از ثبت تا تحویل: ثبت، دریافت، عیب‌یابی، تعمیر، QA و…",
    icon: "ph:list-checks-duotone",
    bg: "bg-emerald-50",
    dot: "bg-emerald-300",
  },
  {
    title: "قوانین روشن",
    desc: "مدت گارانتی و استثناهای هر برند یک‌جا و خوانا.",
    icon: "ph:book-open-text-duotone",
    bg: "bg-indigo-50",
    dot: "bg-indigo-300",
  },
];
</script>
