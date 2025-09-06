<template>
  <header class="bg-white/90 backdrop-blur border-b">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <img
          src="/brands/gs-warranty-logo.png"
          alt="گسترش سرویس"
          class="h-8 w-auto"
        />
        <div class="text-sm text-slate-500">
          گسترش سرویس — همیشه یک قدم جلوتر
        </div>
      </div>
      <nav class="flex items-center gap-4">
        <NuxtLink class="hover:text-sky-600" to="/">معرفی</NuxtLink>
        <NuxtLink class="hover:text-sky-600" to="/warranty/check"
          >استعلام</NuxtLink
        >
        <NuxtLink class="hover:text-sky-600" to="/warranty/policies"
          >شرایط گارانتی</NuxtLink
        >
      </nav>
    </div>
  </header>
</template>
