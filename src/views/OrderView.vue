<script setup lang="ts">
import { computed } from "vue";
import { useOrderStore } from "@/stores/order/order.store";
import { useRouter } from "vue-router";
import PrimaryButton from "@/components/common/buttons/PrimaryButton.vue";
import SecondaryButton from "@/components/common/buttons/SecondaryButton.vue";

const orderStore = useOrderStore();
const router = useRouter();

const orderItems = computed(() => orderStore.items);

const orderTotal = computed(() =>
  orderItems.value.reduce((total, product) => {
    return (
      total +
      product.options.reduce((sum: number, opt: any) => sum + opt.totalPrice, 0)
    );
  }, 0)
);

function editProduct(productIndex: number) {
  const productId = orderStore.editProduct(productIndex);
  if (productId) {
    router.push({ name: "product", params: { id: productId } });
  }
}

function goToHome() {
  router.push({ name: "home" });
}
</script>

<template>
  <div class="order-page">
    <header class="header">
      <button class="back-home-btn" @click="goToHome">
        <i class="fa-solid fa-arrow-left"></i> Voltar
      </button>
      <h1><i class="fa-solid fa-basket-shopping"></i> Meu Pedido</h1>
      <span class="subtitle">Confira os itens antes de finalizar</span>
    </header>

    <!-- EMPTY STATE -->
    <div v-if="!orderItems.length" class="empty-state">
      <p>Seu carrinho está vazio 😢</p>
      <small>Adicione itens do cardápio</small>
    </div>

    <!-- PRODUCTS -->
    <div
      v-for="(product, pIndex) in orderItems"
      :key="pIndex"
      class="product-card"
    >
      <h2 class="product-title">
        {{ product.productName }}
      </h2>

      <div
        v-for="(option, oIndex) in product.options"
        :key="oIndex"
        class="option-row"
      >
        <div class="option-info">
          <strong class="item-name">{{ option.itemName }}</strong>
        </div>

        <div class="option-values">
          <span class="quantity">x{{ option.quantity }}</span>
          <span class="price"> R$ {{ option.totalPrice.toFixed(2) }} </span>
        </div>
      </div>

      <div class="product-actions">
        <SecondaryButton label="Editar" @click="editProduct(pIndex)" />
      </div>
    </div>

    <!-- FOOTER -->
    <footer v-if="orderItems.length" class="footer">
      <div class="total">
        <span>Total</span>
        <strong>R$ {{ orderTotal.toFixed(2) }}</strong>
      </div>

      <div class="actions">
        <SecondaryButton label="Limpar" @click="orderStore.clearOrder" />
        <PrimaryButton label="Finalizar Pedido" />
      </div>
    </footer>
  </div>
</template>

<style scoped>
.order-page {
  max-width: 720px;
  margin: auto;
  padding: 24px 0px 120px;
  color: #e0e0e0;
}

.back-home-btn {
  align-items: center;
  background: #ffd600;
  color: #000000;
  border: none;
  font-size: 15px;
  border-radius: 25px;
  padding: 10px 22px;
  margin-bottom: 18px;
  text-align: center;
}

/* HEADER */
.header {
  text-align: center;
  margin-bottom: 32px;
}

.header h1 {
  color: #ffffff;
  font-size: 26px;
  letter-spacing: 0.5px;
}

.subtitle {
  color: #9e9e9e;
  font-size: 14px;
}

/* EMPTY */
.empty-state {
  text-align: center;
  margin-top: 80px;
  color: #8a8a8a;
}

.empty-state p {
  font-size: 16px;
}

.empty-state small {
  font-size: 13px;
  color: #6f6f6f;
}

/* PRODUCT CARD */
.product-card {
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 20px;
  border: 1px solid #2a2a2a;
  position: relative;
}

.product-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 16px;
  bottom: 16px;
  width: 3px;
  border-radius: 2px;
  opacity: 0.7;
}

.product-title {
  margin-bottom: 16px;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
}

/* PRODUCT ACTIONS */
.product-actions {
  display: flex;
  gap: 10px;
}

/* OPTION ROW */
.option-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px dashed #2c2c2c;
}

.option-row:last-child {
  border-bottom: none;
}

.option-info {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 14px;
  color: #e0e0e0;
}

/* VALUES */
.option-values {
  display: flex;
  align-items: center;
  gap: 14px;
}

.quantity {
  font-size: 12px;
  color: #bdbdbd;
  border: 1px solid #3a3a3a;
  padding: 2px 10px;
  border-radius: 999px;
}

.price {
  font-weight: 600;
  color: #4caf50;
  min-width: 70px;
  text-align: right;
}

/* FOOTER */
.footer {
  padding: 16px 20px 20px;
  border-top: 1px solid #2a2a2a;
  backdrop-filter: blur(6px);
}

.footer > div {
  max-width: 720px;
  margin: auto;
}

.total {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  margin-bottom: 14px;
}

.total span {
  color: #bdbdbd;
}

.total strong {
  color: #ffffff;
}

/* ACTIONS */
.actions {
  display: flex;
  gap: 14px;
}
</style>
