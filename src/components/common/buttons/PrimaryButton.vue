<template>
  <button class="btn-primary">
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<style scoped>
.btn-primary {
  margin-top: 20px;
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  border-radius: 14px;
  font-family: Arial, sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.15s ease;

  background: #fdd426;
  color: #000;
  border: none;

  box-shadow: 0 6px 0 #c6a000, 0 0px 20px rgba(0, 0, 0, 0.25);
}

.btn-primary:hover {
  filter: brightness(1.05);
}

.btn-primary:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #c6a000, 0 5px 10px rgba(0, 0, 0, 0.25);
}
</style>
