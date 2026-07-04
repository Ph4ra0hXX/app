<script setup lang="ts">
import { RouterLink } from "vue-router";

defineOptions({
  name: "logoUrl",
});

defineProps<{
  url: string;
  alt?: string;
}>();
</script>

<template>
  <div class="container">
    <RouterLink to="/" class="logo-link" aria-label="Ir para a pagina inicial">
      <img :src="url" :alt="alt ?? 'Logo'" class="logo" />
    </RouterLink>
  </div>
</template>

<style scoped>
.container {
  margin-top: 80px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-link {
  display: inline-flex;
  cursor: pointer;
}

.logo {
  max-width: 250px;
  max-height: 250px;
  width: auto;
  height: auto;
  object-fit: contain;
}
</style>
