<script setup lang="ts">
import FloatingCartButton from "@/components/layout/FloatingCartButton.vue";
import Toast from "./components/common/Toast.vue";
import { useToast } from "@/composables/useToast";

// @ts-ignore
const { toastRef } = useToast();
</script>

<template>
  <router-view />
  <FloatingCartButton />
  <Toast ref="toastRef" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
