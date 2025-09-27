<template>
  <NConfigProvider :rtl-enabled="true">
    <NMessageProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
          <ClientOnly>
            <AppPageLoader />
          </ClientOnly>
        </NNotificationProvider>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
} from "naive-ui";
import AppPageLoader from "@/components/AppPageLoader.vue";
import "@/assets/css/main.css";
</script>
