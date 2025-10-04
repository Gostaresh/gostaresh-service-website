<template>
  <div class="space-y-12" dir="rtl" v-if="center">
    <section class="rounded-3xl bg-sky-600 px-6 py-10 text-white shadow-lg">
      <div class="flex flex-col gap-4">
        <nav class="text-xs text-white/70">
          <NuxtLink to="/" class="hover:text-white">خانه</NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink to="/representatives" class="hover:text-white"
            >نمایندگی‌ها</NuxtLink
          >
          <span class="mx-2">/</span>
          <span>{{ center.title }}</span>
        </nav>
        <div class="space-y-3">
          <h1 class="text-2xl font-bold md:text-3xl">
            اطلاعات دفتر {{ center.title }} گارانتی گسترش سرویس
          </h1>
          <p class="max-w-3xl text-sm leading-7 text-white/85">
            {{ center.summary }}
          </p>
        </div>
      </div>
    </section>

    <section class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <article
        class="relative overflow-hidden rounded-[36px] bg-slate-100 shadow-lg"
      >
        <div
          class="absolute inset-0 bg-cover bg-center"
          :style="{
            backgroundImage: `linear-gradient(135deg, rgba(14, 116, 144, 0.25), rgba(255,255,255,0.85)), url(${center.image})`,
          }"
          aria-hidden="true"
        ></div>
        <div
          class="relative z-10 flex min-h-[320px] flex-col items-start justify-between gap-6 p-8 text-right text-slate-800"
        >
          <div class="flex w-full items-start justify-between">
            <div class="flex flex-col items-start gap-1">
              <span class="text-2xl font-bold text-sky-700">{{
                center.title
              }}</span>
              <span class="text-sm text-slate-600">{{ center.tagline }}</span>
            </div>
            <span
              class="rounded-full bg-white/80 px-4 py-1 text-xs text-slate-500 backdrop-blur"
              >{{ center.city }}</span
            >
          </div>
          <p class="text-sm leading-7 text-slate-600">
            {{ center.summary }}
          </p>
          <div class="flex flex-wrap gap-2 self-start">
            <span
              class="rounded-full bg-white/80 px-4 py-1 text-xs text-slate-600"
              v-for="service in center.services"
              :key="service"
            >
              {{ service }}
            </span>
          </div>
        </div>
      </article>

      <div class="space-y-6">
        <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 class="mb-5 text-lg font-semibold text-slate-800">
            شعبه {{ center.title }}
          </h2>
          <ul class="space-y-4 text-sm text-slate-600">
            <li class="flex items-start gap-3">
              <span
                class="grid size-10 place-items-center rounded-2xl bg-sky-500/10 text-sky-600"
              >
                <Icon name="ph:map-pin-duotone" size="22" />
              </span>
              <div class="space-y-1">
                <span class="font-semibold text-slate-700">آدرس</span>
                <p class="leading-6">{{ center.contact.address }}</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span
                class="grid size-10 place-items-center rounded-2xl bg-sky-500/10 text-sky-600"
              >
                <Icon name="ph:clock-duotone" size="22" />
              </span>
              <div class="space-y-1">
                <span class="font-semibold text-slate-700">ساعت کاری</span>
                <ul class="space-y-1">
                  <li v-for="(row, index) in center.contact.hours" :key="index">
                    {{ row }}
                  </li>
                </ul>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span
                class="grid size-10 place-items-center rounded-2xl bg-sky-500/10 text-sky-600"
              >
                <Icon name="ph:phone-duotone" size="22" />
              </span>
              <div class="space-y-1">
                <span class="font-semibold text-slate-700">شماره تماس</span>
                <ul class="space-y-1">
                  <li v-for="phone in center.contact.phones" :key="phone">
                    <a
                      :href="`tel:${phone}`"
                      class="text-sky-600 transition hover:text-sky-700"
                      >{{ phone }}</a
                    >
                  </li>
                </ul>
              </div>
            </li>
            <li v-if="center.contact.email" class="flex items-start gap-3">
              <span
                class="grid size-10 place-items-center rounded-2xl bg-sky-500/10 text-sky-600"
              >
                <Icon name="ph:envelope-simple-duotone" size="22" />
              </span>
              <div class="space-y-1">
                <span class="font-semibold text-slate-700">ایمیل پشتیبانی</span>
                <a
                  :href="`mailto:${center.contact.email}`"
                  class="line-clamp-3 text-sky-600 transition hover:text-sky-700"
                  >{{ center.contact.email }}</a
                >
              </div>
            </li>
          </ul>
          <div v-if="center.contact.mapLink" class="mt-6">
            <a
              :href="center.contact.mapLink"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2 text-white transition hover:bg-sky-700"
            >
              مشاهده در نقشه
              <Icon name="ph:arrow-up-right" size="18" />
            </a>
          </div>
        </div>

        <div class="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200">
          <h2 class="mb-4 text-lg font-semibold text-slate-800">
            خدمات ویژه این شعبه
          </h2>
          <ul class="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <li
              v-for="service in center.services"
              :key="service"
              class="flex items-start gap-2 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-slate-200"
            >
              <Icon
                name="ph:check-circle-duotone"
                class="mt-0.5 text-sky-500"
                size="18"
              />
              <span>{{ service }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { findServiceCenter } from "@/utils/service-centers";
import type { ServiceCenter } from "@/types/service-center";

const route = useRoute();
const slug = computed(() => route.params.slug as string);

const center = (await findServiceCenter(slug.value)) as
  | ServiceCenter
  | undefined;

if (!center) {
  throw createError({
    statusCode: 404,
    statusMessage: "این نمایندگی پیدا نشد",
  });
}

useSeoMeta({
  title: `نمایندگی ${center.title}`,
  description: center.summary,
});
</script>
