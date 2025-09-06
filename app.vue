<template>
  <NConfigProvider :rtl-enabled="true">
    <NMessageProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
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
import "@/assets/css/main.css";
</script>
