<template>
  <div
    :class="[
      'relative flex w-full flex-col items-center select-none',
      hasMultiple ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : '',
    ]"
    dir="rtl"
    :style="{ touchAction: 'pan-y' }"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerCancel"
    @pointerleave="onPointerLeave"
    @wheel="onWheel"
  >
    <div class="relative w-full" style="perspective: 1600px">
      <div class="relative h-[380px] sm:h-[440px]">
        <div
          v-for="(slide, index) in slideConfigs"
          :key="slide.center.id"
          class="absolute bottom-0 left-1/2 flex -translate-x-1/2 justify-center transition-all duration-500 ease-out will-change-transform"
          :style="slide.style"
        >
          <div
            class="w-[260px] sm:w-[460px]"
            @click="handleCardClick(index, $event)"
          >
            <ServiceCenterCard :center="slide.center" size="lg" />
          </div>
        </div>
      </div>

      <button
        v-if="hasMultiple"
        type="button"
        class="absolute z-40 right-[-12px] top-1/2 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white/85 p-3 text-slate-600 shadow-sm transition hover:bg-white hover:text-sky-600 sm:flex"
        @click="goPrev"
        aria-label="نمایش قبلی"
      >
        <Icon name="ph:caret-right-duotone" size="24" />
      </button>
      <button
        v-if="hasMultiple"
        type="button"
        class="absolute z-40 left-[-12px] top-1/2 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white/85 p-3 text-slate-600 shadow-sm transition hover:bg-white hover:text-sky-600 sm:flex"
        @click="goNext"
        aria-label="نمایش بعدی"
      >
        <Icon name="ph:caret-left-duotone" size="24" />
      </button>
    </div>

    <div v-if="hasMultiple" class="mt-8 flex items-center gap-2">
      <button
        v-for="(center, index) in centersList"
        :key="center.id"
        type="button"
        class="h-2.5 rounded-full transition-all"
        :class="
          index === current
            ? 'w-7 bg-sky-500'
            : 'w-2.5 bg-slate-300 hover:bg-slate-400'
        "
        @click="goTo(index)"
        :aria-label="`نمایش اسلاید ${index + 1}`"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import ServiceCenterCard from "@/components/ServiceCenterCard.vue";
import type { ServiceCenter } from "@/types/service-center";

const props = defineProps<{
  centers: ServiceCenter[];
  autoplay?: boolean;
  autoplayInterval?: number;
}>();

const centersList = computed(() => props.centers ?? []);
const hasMultiple = computed(() => centersList.value.length > 1);
const autoplayEnabled = computed(() => props.autoplay !== false);
const intervalMs = computed(() => props.autoplayInterval ?? 6000);

const current = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const dragStartX = ref(0);
const dragDelta = ref(0);
const isDragging = ref(false);
const activePointerId = ref<number | null>(null);

const mod = (value: number, length: number) =>
  ((value % length) + length) % length;

const goTo = (index: number) => {
  const total = centersList.value.length;
  if (!total) return;
  current.value = mod(index, total);
  if (autoplayEnabled.value) {
    startAutoplay();
  }
};

const goNext = () => {
  goTo(current.value + 1);
};

const goPrev = () => {
  goTo(current.value - 1);
};

const stopAutoplay = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const startAutoplay = () => {
  stopAutoplay();
  if (!autoplayEnabled.value || centersList.value.length <= 1) return;
  timer = setInterval(goNext, intervalMs.value);
};

const getRelativePosition = (index: number) => {
  const total = centersList.value.length;
  if (!total) return 0;
  const diff = index - current.value;
  const normalized = mod(diff, total);
  const half = Math.floor(total / 2);
  return normalized <= half ? normalized : normalized - total;
};

const slideConfigs = computed(() => {
  const CARD_OFFSET = 280;
  const FAR_OFFSET = 560;
  return centersList.value.map((center, index) => {
    const position = getRelativePosition(index);
    let translateX = 0;
    let translateY = 0;
    let rotateY = 0;
    let scale = 1;
    let opacity = 0.15;
    let zIndex = 5;
    let pointerEvents: "auto" | "none" = "auto";
    let filter = "brightness(0.9)";

    if (position === 0) {
      translateX = 0;
      translateY = 0;
      rotateY = 0;
      scale = 1.05;
      opacity = 1;
      zIndex = 40;
      filter = "brightness(1)";
    } else if (position === -1 || position === 1) {
      translateX = (position === -1 ? -1 : 1) * CARD_OFFSET;
      translateY = 22;
      rotateY = position === -1 ? 18 : -18;
      scale = 0.92;
      opacity = 0.85;
      zIndex = 25;
    } else {
      translateX = (position < 0 ? -1 : 1) * FAR_OFFSET;
      translateY = 48;
      rotateY = position < 0 ? 24 : -24;
      scale = 0.82;
      opacity = 0.35;
      zIndex = 10;
    }

    const transforms = [
      "translateX(-50%)",
      `translateX(${translateX}px)`,
      `translateY(${translateY}px)`,
      `scale(${scale})`,
      `rotateY(${rotateY}deg)`,
    ].join(" ");

    return {
      center,
      style: {
        transform: transforms,
        opacity: opacity.toString(),
        zIndex: zIndex.toString(),
        filter,
        pointerEvents,
        transformStyle: "preserve-3d",
      } as Record<string, string>,
    };
  });
});

const handleCardClick = (index: number, event: MouseEvent) => {
  if (isDragging.value || Math.abs(dragDelta.value) > 10) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  if (index !== current.value) {
    event.preventDefault();
    event.stopPropagation();
    goTo(index);
  }
};

const onPointerDown = (event: PointerEvent) => {
  if (!hasMultiple.value) return;
  isDragging.value = true;
  dragDelta.value = 0;
  dragStartX.value = event.clientX;
  activePointerId.value = event.pointerId;
  stopAutoplay();
  (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
};

const onPointerMove = (event: PointerEvent) => {
  if (!isDragging.value) return;
  dragDelta.value = event.clientX - dragStartX.value;
  event.preventDefault();
};

const finishDrag = () => {
  if (!isDragging.value) return;
  const delta = dragDelta.value;
  isDragging.value = false;
  dragDelta.value = 0;
  if (Math.abs(delta) < 40) {
    startAutoplay();
    return;
  }
  if (delta > 0) {
    goPrev();
  } else {
    goNext();
  }
};

const onPointerUp = (event: PointerEvent) => {
  if (activePointerId.value === event.pointerId) {
    (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
    activePointerId.value = null;
  }
  finishDrag();
};

const onPointerCancel = (event: PointerEvent) => {
  if (activePointerId.value === event.pointerId) {
    (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
    activePointerId.value = null;
  }
  isDragging.value = false;
  dragDelta.value = 0;
  startAutoplay();
};

const onPointerLeave = (event: PointerEvent) => {
  if (!isDragging.value) return;
  if (activePointerId.value === event.pointerId) {
    (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
    activePointerId.value = null;
  }
  finishDrag();
};

const onWheel = (event: WheelEvent) => {
  if (!hasMultiple.value) return;
  const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
  const dominant = horizontal ? event.deltaX : event.deltaY;
  if (Math.abs(dominant) < 10) return;
  if (!horizontal && Math.abs(event.deltaY) < 30) return;
  event.preventDefault();
  stopAutoplay();
  if (dominant > 0) {
    goNext();
  } else {
    goPrev();
  }
};

watch(
  [centersList, autoplayEnabled, intervalMs],
  () => {
    const total = centersList.value.length;
    if (!total) {
      current.value = 0;
      stopAutoplay();
      return;
    }
    if (current.value >= total) {
      current.value = 0;
    }
    startAutoplay();
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  stopAutoplay();
});
</script>
