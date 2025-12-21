<template>
  <button class="btn-secondary">
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<style scoped>
.btn-secondary {
  margin-top: 15px;
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  border-radius: 25px;
  font-family: Arial, sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.15s ease;

  background: none;
  color: #ffffff;
  border: 1px solid #fdd426;
}
</style>
