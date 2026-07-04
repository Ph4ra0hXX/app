<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  hasSelectedOptions,
  isOptionItemEnabled,
  useProductStore,
  useOrderStore,
  type OptionItem,
  type ProductOption,
} from "@/stores";
import AppButton from "@/components/AppButton.vue";
import { useToast } from "@/useToast";
import { formatCurrency } from "@/formatCurrency";

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const orderStore = useOrderStore();
const { showToast } = useToast();

const productId = Number(route.params.id);
if (orderStore.editingProductIndex === null) {
  productStore.resetProductOptions(productId);
}

const safeId = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-_]/g, "-");

const addToOrder = () => {
  const product = productStore.getProductById(productId);
  if (!product) return;

  if (!product.enabled && orderStore.editingProductIndex === null) {
    showToast("Este item está desabilitado no cardápio.", "error");
    router.push({ name: "home" });
    return;
  }

  if (!hasSelectedOptions(product)) {
    showToast("Selecione pelo menos um item para continuar.", "error");
    return;
  }

  const isEditing = orderStore.editingProductIndex !== null;
  const saved = orderStore.addProduct(product);
  if (!saved) return;

  productStore.resetProductOptions(productId);

  const message = isEditing
    ? "Edição salva com sucesso!"
    : "Item adicionado ao carrinho!";
  const routeName = isEditing ? "order" : "home";
  showToast(message, "success");
  router.push({ name: routeName });
};

const product = computed(() => {
  const currentProduct = productStore.getProductById(productId);

  if (
    currentProduct &&
    !currentProduct.enabled &&
    orderStore.editingProductIndex === null
  ) {
    return undefined;
  }

  return currentProduct;
});

const visibleCategories = computed(() =>
  (product.value?.options || [])
    .map((category) => ({
      ...category,
      items: category.items.filter(isOptionItemEnabled),
    }))
    .filter((category) => category.items.length > 0)
);

const unavailableMessage = computed(() => {
  const currentProduct = productStore.getProductById(productId);

  if (!currentProduct) return "Este item não foi encontrado.";
  if (!currentProduct.enabled) return "Este item está desabilitado no cardápio.";

  return "Este item está sem opções habilitadas no cardápio.";
});

const getSelectedItemsCount = (category: ProductOption) =>
  category.items.reduce((count, item) => {
    if (!isOptionItemEnabled(item)) return count;

    if (item.type === "checkbox") {
      return count + Number(item.checked || item.obrigatory);
    }

    return count + item.quantity;
  }, 0);

const hasReachedCategoryLimit = (category: ProductOption) =>
  category.maxItems !== undefined &&
  getSelectedItemsCount(category) >= category.maxItems;

const hasObrigatoryCheckbox = (category: ProductOption) =>
  category.items.some(
    (item) =>
      isOptionItemEnabled(item) && item.type === "checkbox" && item.obrigatory
  );

const isCheckboxDisabled = (item: OptionItem, category: ProductOption) =>
  item.type !== "checkbox" ||
  !isOptionItemEnabled(item) ||
  item.obrigatory ||
  (!item.checked &&
    hasReachedCategoryLimit(category) &&
    (category.maxItems !== 1 || hasObrigatoryCheckbox(category)));

const isQuantityIncreaseDisabled = (
  item: OptionItem,
  category: ProductOption
) =>
  item.type !== "quantity" ||
  !isOptionItemEnabled(item) ||
  Boolean(item.max && item.quantity >= item.max) ||
  hasReachedCategoryLimit(category);

const toggleCheckbox = (
  item: OptionItem,
  category: ProductOption,
  event: Event
) => {
  if (item.type !== "checkbox" || item.obrigatory || !isOptionItemEnabled(item))
    return;

  const checkbox = event.target as HTMLInputElement;

  if (!checkbox.checked) {
    item.checked = false;
    return;
  }

  if (category.maxItems === 1) {
    category.items.forEach((categoryItem) => {
      if (
        categoryItem.type === "checkbox" &&
        !categoryItem.obrigatory &&
        categoryItem !== item
      ) {
        categoryItem.checked = false;
      }
    });

    if (hasReachedCategoryLimit(category)) {
      checkbox.checked = false;
      showToast(
        `Você só pode selecionar 1 item em ${category.categoryName}.`,
        "error"
      );
      return;
    }

    item.checked = true;
    return;
  }

  if (hasReachedCategoryLimit(category)) {
    checkbox.checked = false;
    showToast(
      `Você só pode selecionar ${category.maxItems} itens em ${category.categoryName}.`,
      "error"
    );
    return;
  }

  item.checked = true;
};

const increase = (item: OptionItem, category: ProductOption) => {
  if (item.type === "quantity" && !isQuantityIncreaseDisabled(item, category))
    item.quantity++;
};

const decrease = (item: OptionItem) => {
  if (item.type === "quantity" && item.quantity > 0) item.quantity--;
};

const goBack = () => {
  const isEditing = orderStore.editingProductIndex !== null;
  orderStore.cancelEdit();
  productStore.resetProductOptions(productId);
  router.push({ name: isEditing ? "order" : "home" });
};
</script>

<template>
  <div v-if="product && visibleCategories.length > 0" id="cardapio">
    <div
      v-for="category in visibleCategories"
      :key="category.categoryName"
      id="listar"
    >
      <div class="dotted-line">
        <hr />
        <span id="textDividers"> « {{ category.categoryName }} » </span>
        <hr />
      </div>

      <div
        v-for="(item, index) in category.items"
        :key="`${category.categoryName}-${item.name}-${index}`"
        class="item-row"
      >
        <div v-if="item.type === 'quantity'">
          <button @click="decrease(item)" :disabled="item.quantity === 0">
            -
          </button>

          <span id="quantidadeDiv">{{ item.quantity }}</span>

          <button
            @click="increase(item, category)"
            :disabled="isQuantityIncreaseDisabled(item, category)"
          >
            +
          </button>
        </div>

        <div v-else-if="item.type === 'checkbox'">
          <input
            type="checkbox"
            :checked="item.checked"
            @change="toggleCheckbox(item, category, $event)"
            :disabled="isCheckboxDisabled(item, category)"
            :id="`${safeId(category.categoryName)}-${safeId(item.name)}`"
          />
        </div>

        <label
          :for="`${safeId(category.categoryName)}-${safeId(item.name)}`"
          id="nomeItem"
        >
          {{ item.name }}
        </label>

        <label id="preco">{{ formatCurrency(item.price) }}</label>

        <br />
      </div>
    </div>

    <br />

    <AppButton @click="addToOrder" label="Salvar" />
    <AppButton @click="goBack" label="Voltar" variant="secondary" />
  </div>

  <div v-else class="unavailable-item">
    <h1>Item indisponível</h1>
    <p>{{ unavailableMessage }}</p>
    <AppButton @click="goBack" label="Voltar" variant="secondary" />
  </div>
</template>

<style>
.unavailable-item {
  max-width: 420px;
  margin: 0 auto;
  padding: 24px;
  color: #ffffff;
  text-align: center;
}

.unavailable-item h1 {
  margin: 0 0 10px;
  font-size: 24px;
}

.unavailable-item p {
  margin: 0 0 18px;
  color: #bdbdbd;
  font-size: 14px;
}

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
