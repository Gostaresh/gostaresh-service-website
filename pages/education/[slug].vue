<template>
  <div class="container mx-auto px-4 py-12" dir="rtl" v-if="post">
    <NuxtLink
      to="/education"
      class="mb-6 inline-flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700"
    >
      <Icon name="ph:arrow-right" size="16" />
      بازگشت به همه مطالب
    </NuxtLink>

    <article
      class="mx-auto max-w-3xl rounded-3xl bg-white/90 backdrop-blur px-6 py-8 shadow"
    >
      <header class="mb-6 text-center">
        <div
          class="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500"
        >
          <span class="rounded-full bg-slate-100 px-3 py-1">
            {{ formatDate(post.date) }}
          </span>
          <span>{{ post.readMinutes }} دقیقه مطالعه</span>
        </div>
        <h1 class="text-3xl font-bold text-slate-800 leading-tight">
          {{ post.title }}
        </h1>
      </header>

      <div v-if="post.cover" class="mb-8 overflow-hidden rounded-2xl">
        <img :src="post.cover" :alt="post.title" class="w-full object-cover" />
      </div>

      <div
        v-if="post.content"
        class="prose prose-slate max-w-none text-slate-700 leading-8"
        v-html="post.content"
      ></div>


      <div v-if="post.tags.length" class="mt-8 flex flex-wrap items-center gap-3 text-xs md:text-sm text-slate-600">
        <span class="flex items-center gap-2 font-medium">
          <Icon name="ph:tag" size="16" class="text-slate-400" />
          برچسب‌ها:
        </span>
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-600"
        >
          {{ tag }}
        </span>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { createError } from "h3";
import type { BlogPost } from "@/types/blog";

const route = useRoute();

const posts = (await import("@/public/data/blogs.json")).default as BlogPost[];

const slug = computed(() => route.params.slug as string);

const post = computed(() => posts.find((item) => item.slug === slug.value));

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "مطلب موردنظر پیدا نشد",
  });
}

const coverImage = computed(() => post.value?.cover || undefined);

useSeoMeta({
  title: () => post.value?.title ?? "آموزش",
  description: () => post.value?.excerpt ?? "مطلب آموزشی گسترش سرویس",
  ogTitle: () => post.value?.title ?? undefined,
  ogDescription: () => post.value?.excerpt ?? undefined,
  ogImage: () => coverImage.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => post.value?.title ?? undefined,
  twitterDescription: () => post.value?.excerpt ?? undefined,
  twitterImage: () => coverImage.value,
});

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
  }).format(new Date(iso));
</script>
