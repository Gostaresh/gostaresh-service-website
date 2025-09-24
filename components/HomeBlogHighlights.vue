<template>
  <section class="container mx-auto px-4 py-6">
    <div class="flex items-center justify-between mb-3" dir="rtl">
      <h2 class="text-lg font-bold">آموزش و بلاگ</h2>
      <NuxtLink
        to="/education"
        class="text-sky-600 hover:text-sky-700 text-sm inline-flex items-center gap-1"
      >
        مشاهده همه
        <Icon name="ph:arrow-left-duotone" size="16" />
      </NuxtLink>
    </div>

    <div
      v-if="highlightedPosts.length"
      class="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      dir="rtl"
    >
      <article
        v-for="post in highlightedPosts"
        :key="post.slug"
        class="group rounded-2xl border border-slate-200 bg-white/80 backdrop-blur shadow-sm hover:shadow-lg transition overflow-hidden"
      >
        <NuxtLink :to="`/education/${post.slug}`" class="flex h-full flex-col">
          <div class="relative">
            <div
              v-if="post.cover"
              class="h-40 w-full overflow-hidden"
            >
              <img
                :src="post.cover"
                :alt="post.title"
                class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div
              v-else
              class="h-40 w-full bg-gradient-to-br from-sky-200 via-emerald-200 to-slate-100"
            ></div>
            <span
              class="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs text-slate-600 shadow"
            >
              {{ formatDate(post.date) }}
            </span>
          </div>
          <div class="flex flex-1 flex-col gap-3 p-4">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-600"
                >{{ tag }}</span
              >
            </div>
            <h3 class="text-base font-semibold text-slate-800 leading-tight">
              {{ post.title }}
            </h3>
            <p class="text-sm text-slate-600 line-clamp-3">
              {{ post.excerpt }}
            </p>
            <div class="mt-auto flex items-center justify-between text-xs text-slate-500">
              <span>{{ post.readMinutes }} دقیقه مطالعه</span>
              <span class="inline-flex items-center gap-1 text-sky-600">
                مطالعه
                <Icon name="ph:arrow-left" size="14" />
              </span>
            </div>
          </div>
        </NuxtLink>
      </article>
    </div>

    <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center text-sm text-slate-500">
      هنوز محتوایی برای نمایش ثبت نشده است.
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { BlogPost } from "@/types/blog";

const props = defineProps<{ posts: BlogPost[] }>();

const highlightedPosts = computed(() => props.posts);

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
  }).format(new Date(iso));
</script>
