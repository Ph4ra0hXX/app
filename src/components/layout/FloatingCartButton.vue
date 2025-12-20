<template>
  <div class="floating-cart-btn">
    <div class="cart-circle">
      <i class="fa-solid fa-basket-shopping"></i>
      <span class="cart-badge">{{ itemCount }}</span>
    </div>
    <div class="cart-price-btn">R$: {{ currency(total) }}</div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useOrderStore } from "@/stores/order/order.store";

const orderStore = useOrderStore();

const total = computed(() => {
  return orderStore.items.reduce((sum, item) => {
    return (
      sum +
      item.options.reduce(
        (optSum: any, opt: any) => optSum + (opt.totalPrice || 0),
        0
      )
    );
  }, 0);
});

const itemCount = computed(() => orderStore.items.length);

function currency(value: any) {
  return Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
</script>

<style scoped>
.fa-solid {
  font-size: 23px;
  color: #ffffff;
}

.floating-cart-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  align-items: end;
  z-index: 1000;
}
.cart-circle {
  position: relative;
  width: 45px;
  height: 45px;
  background: #181818;
  border: 2px solid #ffd600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-svg {
  width: 32px;
  height: 32px;
  color: #ffd600;
}
.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ffd600;
  color: #181818;
  font-weight: bold;
  font-size: 1rem;
  border-radius: 50%;
  padding: 2px 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  border: 2px solid #181818;
}
.cart-price-btn {
  background: #ffd600;
  color: #181818;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 15px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  margin-top: 4px;
}
</style>
