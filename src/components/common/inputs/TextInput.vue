<script setup lang="ts">
defineProps<{
  label?: string;
  modelValue: string | number;
  type?: string;
  placeholder?: string;
}>();

defineEmits<{
  "update:modelValue": [value: string | number];
}>();
</script>

<template>
  <div class="input-wrapper">
    <div v-if="label" class="info">
      <h3>{{ label }}</h3>
    </div>
    <div class="input-field">
      <input
        :value="modelValue"
        :type="type || 'text'"
        :placeholder="placeholder"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
    </div>
  </div>
</template>

<style scoped>
.input-wrapper {
  width: 100%;
}

.info h3 {
  font-size: 14px;
  font-weight: 600;
  color: #d1d5db;
  margin: 0 0 6px;
}

.input-field {
  width: 100%;
  display: flex;
}

.input-field input {
  width: 100%;
  min-width: 0;
  padding: 12px 14px;
  background: #0f0f0f;
  border-radius: 10px;
  border: 1px solid #2a2a2a;
  color: #ffffff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.input-field input::placeholder {
  color: #6b7280;
}

.input-field input:focus {
  border-color: #ffd600;
}
</style>
