<script setup lang="ts">
import FloatingCartButton from "@/components/layout/FloatingCartButton.vue";
import Logo from "@/components/Logo.vue";
</script>

<template>
  <Logo url="https://golds-burger-app.vercel.app/logo.webp" alt="Logo" />
  <router-view />
  <FloatingCartButton />
</template>
