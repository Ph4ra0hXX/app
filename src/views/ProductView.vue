<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useProductStore } from "@/stores/product/product.store";
import type { Product } from "@/stores/product/product.types";
import PrimaryButton from "@/components/common/buttons/PrimaryButton.vue";
import SecondaryButton from "@/components/common/buttons/SecondaryButton.vue";
const route = useRoute();
const productStore = useProductStore();

const productId = Number(route.params.id);

const product: Product = computed(() => productStore.getProductById(productId));

function increase(item) {
  if (item.max && item.quantity >= item.max) return;
  item.quantity++;
}

function decrease(item) {
  if (item.quantity > 0) {
    item.quantity--;
  }
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function goBack() {
  window.history.back();
}
</script>

<template>
  <div id="cardapio">
    <div
      v-for="(category, cIndex) in product.options"
      :key="cIndex"
      id="listar"
    >
      <div class="dotted-line">
        <hr />
        <span id="textDividers">« {{ category.categoryName }} »</span>
        <hr />
      </div>

      <div
        v-for="(item, index) in category.items"
        :key="index"
        class="item-row"
      >
        <!-- 🔹 ITEM COM QUANTIDADE -->
        <div v-if="item.type === 'quantity'">
          <button @click="decrease(item)" :disabled="item.quantity === 0">
            -
          </button>

          <span id="quantidadeDiv">{{ item.quantity }}</span>

          <button
            @click="increase(item)"
            :disabled="item.max && item.quantity === item.max"
          >
            +
          </button>
        </div>

        <!-- 🔹 ITEM COM CHECKBOX -->
        <div v-else-if="item.type === 'checkbox'">
          <input
            name="item.name"
            type="checkbox"
            v-model="item.checked"
            :id="`${category.categoryName}-${item.name}`"
          />
        </div>

        <!-- 🔹 NOME E PREÇO (COMUM AOS DOIS) -->
        <label :for="`${category.categoryName}-${item.name}`" id="nomeItem">
          {{ item.name }}
        </label>

        <label id="preco">R$: {{ formatPrice(item.price) }}</label>

        <br />
      </div>
    </div>
    <br />
    <PrimaryButton label="Adicionar" />
    <SecondaryButton @click="goBack()" label="Voltar" />
  </div>
</template>

<style>
* {
  font-family: Arial, sans-serif;
  font-weight: bold;
}

.item-row input[type="checkbox"] {
  width: 25px !important;
  height: 25px !important;
  cursor: pointer;
  accent-color: #fdd426; /* amarelo */
}
/* ===== CONTAINER PRINCIPAL ===== */

#cardapio {
  max-width: 420px;
  margin: 0 auto;
  padding: 16px;
  background-color: #fff;
}

/* ===== LISTAGEM ===== */
#listar {
  margin-top: 30px;
}

/* ===== DIVISOR DE CATEGORIA ===== */
.dotted-line {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.dotted-line hr {
  flex: 1;
  border: none;
  border-top: 1px dashed #ccc;
}

#textDividers {
  font-family: Great-Vibes;
  margin: 0 8px;
  font-weight: bold;
  color: #fdd426;
  font-size: 30px;
  letter-spacing: 2px;
}

/* ===== ITEM ===== */
.item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed #f0f0f03a;
}

/* ===== CONTROLES (+ / - / checkbox) ===== */
.item-row > div {
  display: flex;
  align-items: center;
}

/* Botões + e - */
.item-row button {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: #fdd426;
  font-size: 18px;
  cursor: pointer;
}

.item-row button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Quantidade */
#quantidadeDiv {
  margin: 0 8px;
  min-width: 16px;
  text-align: center;
  font-weight: bold;
  color: #fff;
}

/* Checkbox */
.item-row input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* ===== NOME E PREÇO ===== */
#nomeItem {
  flex: 1;
  margin-left: 12px;
  font-size: 14px;
  color: #ffffff;
}

#preco {
  font-size: 14px;
  color: #ffffff;
}

/* ===== BOTÕES FINAIS ===== */
#butOpcoes {
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  background-color: #e53935;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

#butOpcoes:hover {
  background-color: #d32f2f;
}

#butOpcoes2 {
  width: 100%;
  margin-top: 8px;
  padding: 12px;
  background-color: #f5f5f5;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

#butOpcoes2:hover {
  background-color: #eee;
}

hr {
  border: none;
  border-top: 1px solid #f0f0f03a !important ;
}
</style>
