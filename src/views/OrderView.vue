<script setup lang="ts">
import { computed, ref } from "vue";
import { useOrderStore } from "@/stores";
import { useRouter } from "vue-router";
import PrimaryButton from "@/components/common/buttons/PrimaryButton.vue";
import SecondaryButton from "@/components/common/buttons/SecondaryButton.vue";

const orderStore = useOrderStore();
const router = useRouter();

const orderItems = computed(() => orderStore.items);
const orderTotal = computed(() =>
  orderItems.value.reduce(
    (total, product) =>
      total +
      product.options.reduce(
        (sum: number, opt: any) => sum + opt.totalPrice,
        0
      ),
    0
  )
);

const showRemoveModal = ref(false);
const productIndexToRemove = ref<number | null>(null);

const editProduct = (index: number) => {
  const id = orderStore.editProduct(index);
  if (id) router.push({ name: "product", params: { id } });
};

const openRemoveModal = (index: number) => {
  productIndexToRemove.value = index;
  showRemoveModal.value = true;
};

const cancelRemove = () => {
  showRemoveModal.value = false;
  productIndexToRemove.value = null;
};

const confirmRemove = () => {
  if (productIndexToRemove.value !== null)
    orderStore.removeProduct(productIndexToRemove.value);
  cancelRemove();
};

const getProductTotal = (product: any) => {
  return product.options.reduce(
    (sum: number, opt: any) => sum + opt.totalPrice,
    0
  );
};
</script>

<template>
  <!-- REMOVE MODAL -->
  <div v-if="showRemoveModal" class="modal-overlay">
    <div class="modal">
      <h3>Remover item</h3>
      <p>Deseja remover este item do pedido?</p>

      <div class="modal-actions">
        <SecondaryButton label="Cancelar" @click="cancelRemove" />
        <PrimaryButton label="Remover" @click="confirmRemove" />
      </div>
    </div>
  </div>

  <div class="order-page">
    <header class="header">
      <span class="subtitle">Confira os itens antes de finalizar</span>
    </header>

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
      <div class="product-total">
        <span>Subtotal</span>
        <strong>R$ {{ getProductTotal(product).toFixed(2) }}</strong>
      </div>
      <div class="product-actions">
        <PrimaryButton label="Editar" @click="editProduct(pIndex)" />
        <SecondaryButton label="Remover" @click="openRemoveModal(pIndex)" />
      </div>
    </div>

    <!-- FOOTER -->
    <footer v-if="orderItems.length" class="footer">
      <div class="total">
        <span>Total</span>
        <strong>R$ {{ orderTotal.toFixed(2) }}</strong>
      </div>

      <div class="actions">
        <PrimaryButton
          @click="() => router.push({ name: 'checkout' })"
          label="Finalizar Pedido"
        />
      </div>
    </footer>
    <SecondaryButton
      label="Voltar"
      @click="() => router.push({ name: 'home' })"
    />
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: #1e1e1e;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 360px;
  text-align: center;
  border: 1px solid #2a2a2a;
}

.modal h3 {
  color: #ffffff;
  margin-bottom: 10px;
}
.modal p {
  color: #bdbdbd;
  font-size: 14px;
  margin-bottom: 20px;
}
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.order-page {
  max-width: 720px;
  margin: auto;
  padding: 0 0 120px;
  color: #e0e0e0;
}

.back-home-btn {
  background: #ffd600;
  color: #000000;
  border: none;
  font-size: 15px;
  border-radius: 25px;
  padding: 10px 22px;
  cursor: pointer;
}

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
.product-actions {
  display: flex;
  gap: 10px;
}

.product-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 14px 16px;
  border-top: 1px dashed #2c2c2c;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.08) 0%,
    rgba(76, 175, 80, 0.04) 100%
  );
  font-size: 16px;
  color: #ffffff;
}

.product-total span {
  font-weight: 500;
  color: #b0b0b0;
  letter-spacing: 0.5px;
}

.product-total strong {
  color: #4caf50;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.3px;
}

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

.footer {
  padding: 16px 0px 10px;
  border-top: 1px solid #2a2a2a;
  backdrop-filter: blur(6px);
  max-width: 720px;
  margin: auto;
}

.total {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  margin-bottom: 14px;
}
.total span,
.total strong {
  color: #ffffff;
}
.actions {
  display: flex;
  gap: 14px;
}
</style>
