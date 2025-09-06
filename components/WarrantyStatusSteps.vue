<template>
  <n-steps :current="current" size="small">
    <n-step
      v-for="(s, i) in steps"
      :key="s.key"
      :title="s.label"
      :description="i <= current ? '✓' : ''"
    />
  </n-steps>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NSteps, NStep } from "naive-ui";

const props = defineProps<{ status: string }>();
const map = {
  registered: 0,
  received: 1,
  in_queue: 2,
  diagnosis: 3,
  repairing: 4,
  awaiting_parts: 5,
  qa: 6,
  ready_for_pickup: 7,
  shipped: 8,
  closed: 9,
  rejected: 9,
} as const;
const steps = [
  { key: "registered", label: "ثبت" },
  { key: "received", label: "دریافت" },
  { key: "in_queue", label: "در صف" },
  { key: "diagnosis", label: "عیب‌یابی" },
  { key: "repairing", label: "تعمیر" },
  { key: "awaiting_parts", label: "انتظار قطعه" },
  { key: "qa", label: "کنترل کیفیت" },
  { key: "ready_for_pickup", label: "آماده تحویل" },
  { key: "shipped", label: "ارسال شد" },
  { key: "closed", label: "بسته شد" },
];
const current = computed(() => (map as any)[props.status] ?? 0);
</script>
