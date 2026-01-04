<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import {
  useProductStore,
  useOrderStore,
  type OptionItem,
  type Product,
} from "@/stores";
import PrimaryButton from "@/components/common/buttons/PrimaryButton.vue";
import SecondaryButton from "@/components/common/buttons/SecondaryButton.vue";
import router from "@/router";
import { useToast } from "@/composables/useToast";

const route = useRoute();
const productStore = useProductStore();
const orderStore = useOrderStore();
const { showToast } = useToast();

const productId = Number(route.params.id);

const safeId = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-_]/g, "-");

const addToOrder = () => {
  const product = productStore.getProductById(productId);
  if (!product) return;

  const isEditing = orderStore.editingProductIndex !== null;
  orderStore.addProduct(product);
  productStore.resetProductOptions(productId);

  const message = isEditing
    ? "Edição salva com sucesso!"
    : "Item adicionado ao carrinho!";
  const routeName = isEditing ? "order" : "home";
  showToast(message, "success");
  router.push({ name: routeName });
};

const product = computed<Product | undefined>(() => {
  const prod = productStore.getProductById(productId);
  prod?.options.forEach((category) => {
    category.items.forEach((item) => {
      if (item.type === "checkbox" && item.obrigatory) item.checked = true;
      else if (item.type === "quantity") item.quantity = item.quantity ?? 0;
    });
  });
  return prod;
});

const increase = (item: OptionItem) => {
  if (item.type === "quantity" && (!item.max || item.quantity < item.max))
    item.quantity++;
};

const decrease = (item: OptionItem) => {
  if (item.type === "quantity" && item.quantity > 0) item.quantity--;
};

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const goBack = () => {
  const isEditing = orderStore.editingProductIndex !== null;
  orderStore.cancelEdit();
  productStore.resetProductOptions(productId);
  router.push({ name: isEditing ? "order" : "home" });
};
</script>

<template>
  <div id="cardapio">
    <div
      v-for="(category, cIndex) in product?.options || []"
      :key="cIndex"
      id="listar"
    >
      <div class="dotted-line">
        <hr />
        <span id="textDividers"> « {{ category.categoryName }} » </span>
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
            :disabled="Boolean(item.max && item.quantity === item.max)"
          >
            +
          </button>
        </div>

        <!-- 🔹 ITEM COM CHECKBOX -->
        <div v-else-if="item.type === 'checkbox'">
          <input
            type="checkbox"
            v-model="item.checked"
            :disabled="item.obrigatory"
            :id="`${safeId(category.categoryName)}-${safeId(item.name)}`"
          />
        </div>

        <!-- 🔹 NOME -->
        <label
          :for="`${safeId(category.categoryName)}-${safeId(item.name)}`"
          id="nomeItem"
        >
          {{ item.name }}
        </label>

        <!-- 🔹 PREÇO -->
        <label id="preco"> R$: {{ formatPrice(item.price) }} </label>

        <br />
      </div>
    </div>

    <br />

    <PrimaryButton @click="addToOrder" label="Salvar" />
    <SecondaryButton @click="goBack()" label="Voltar" />
  </div>
</template>

<style>
.item-row input[type="checkbox"] {
  width: 25px !important;
  height: 25px !important;
  cursor: pointer;
  accent-color: #fdd426;
}

#cardapio {
  max-width: 420px;
  margin: 0 auto;
  padding: 16px;
  background-color: #fff;
}

#listar {
  margin-top: 30px;
}

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

.item-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed #f0f0f03a;
}

.item-row > div {
  display: flex;
  align-items: center;
}

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

#quantidadeDiv {
  margin: 0 8px;
  min-width: 16px;
  text-align: center;
  font-weight: bold;
  color: #fff;
}

#nomeItem {
  flex: 1;
  margin-left: 12px;
  font-size: 14px;
  color: #ffffff;
}

#preco {
  font-size: 14px;
  color: #4caf50;
}

hr {
  border: none;
  border-top: 1px solid #f0f0f03a;
}
</style>
