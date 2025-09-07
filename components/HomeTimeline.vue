<template>
  <section aria-labelledby="howitworks" dir="rtl" class="pt-4">
    <div class="flex items-center justify-between mb-5">
      <h2 id="howitworks" class="text-lg font-bold">چطور کار می‌کند؟</h2>
    </div>

    <ol class="relative grid gap-8 md:grid-cols-4">
      <li v-for="(s, i) in steps" :key="s.title" class="text-center px-4">
        <!-- خط اتصال -->
        <div
          class="hidden md:block absolute top-7 h-[2px] bg-slate-200 z-10"
          :style="{
            right: i === 0 ? '12.5%' : undefined,
            left: i === steps.length - 1 ? '12.5%' : undefined,
            insetInlineStart: i === 0 ? '12.5%' : undefined,
            width: i === 0 || i === steps.length - 1 ? '75%' : undefined,
          }"
        ></div>

        <!-- عدد -->
        <div
          class="mx-auto size-14 rounded-full grid place-items-center ring-2 ring-sky-300 text-sky-600 bg-white"
        >
          <span class="font-bold">{{ i + 1 }}</span>
        </div>

        <!-- عنوان/متن -->
        <h3 class="mt-3 font-semibold">{{ s.title }}</h3>
        <p class="mt-1 text-slate-600 text-sm leading-7" v-html="s.desc"></p>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: "شماره سریال / IMEI را وارد کنید",
    desc: "برای اعلان تغییر وضعیت، می‌توانید شماره موبایل را هم اضافه کنید.",
  },
  {
    title: "نتیجه و وضعیت را ببینید",
    desc: "برند، مدل، تاریخ خرید و پایان گارانتی (شمسی) و برچسب فعال/منقضی.",
  },
  {
    title: "روند رسیدگی را دنبال کنید",
    desc: "از ثبت و دریافت تا عیب‌یابی، تعمیر، کنترل کیفیت و تحویل.",
  },
  {
    title: "شرایط گارانتی برند را بررسی کنید",
    desc: "مدت گارانتی، استثناها و نکات هر برند/سری در یک نگاه.",
  },
];
</script>
