<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { isOptionItemEnabled, useProductStore } from "@/stores";
import { formatCurrency } from "@/formatCurrency";

const productStore = useProductStore();

const enabledProductCount = computed(
  () => productStore.products.filter((product) => product.enabled).length
);

const optionItems = computed(() =>
  productStore.products.flatMap((product) =>
    product.options.flatMap((option) => option.items)
  )
);

const enabledOptionItemCount = computed(
  () => optionItems.value.filter(isOptionItemEnabled).length
);

const updateProductStatus = (productId: number, event: Event) => {
  const input = event.target as HTMLInputElement;
  productStore.setProductEnabled(productId, input.checked);
};

const updateOptionItemStatus = (
  productId: number,
  categoryName: string,
  itemName: string,
  event: Event
) => {
  const input = event.target as HTMLInputElement;
  productStore.setOptionItemEnabled(
    productId,
    categoryName,
    itemName,
    input.checked
  );
};
</script>

<template>
  <main class="dashboard-page">
    <header class="dashboard-header">
      <div>
        <span class="eyebrow">Dashboard</span>
        <h1>Itens do cardápio</h1>
      </div>

      <RouterLink class="menu-link" :to="{ name: 'home' }">
        Cardápio
      </RouterLink>
    </header>

    <section class="status-bar" aria-label="Resumo dos itens">
      <div>
        <strong>{{ enabledProductCount }}</strong>
        <span>produtos habilitados</span>
      </div>

      <div>
        <strong>{{ enabledOptionItemCount }}</strong>
        <span>opções habilitadas</span>
      </div>

      <div>
        <strong>{{ optionItems.length }}</strong>
        <span>opções</span>
      </div>
    </section>

    <section class="menu-list" aria-label="Itens do cardápio">
      <article
        v-for="product in productStore.products"
        :key="product.id"
        class="menu-item"
        :class="{ 'is-disabled': !product.enabled }"
      >
        <div class="menu-item__summary">
          <img
            class="menu-item__image"
            :src="product.image"
            :alt="product.name"
          />

          <div class="menu-item__content">
            <h2>{{ product.name }}</h2>
            <p>{{ product.description }}</p>
            <span>{{ product.options.length }} categorias</span>
          </div>

          <label class="switch">
            <input
              type="checkbox"
              :checked="product.enabled"
              :aria-label="`Habilitar ${product.name}`"
              @change="updateProductStatus(product.id, $event)"
            />

            <span class="switch__track">
              <span class="switch__thumb"></span>
            </span>

            <span class="switch__label">
              {{ product.enabled ? "Habilitado" : "Desabilitado" }}
            </span>
          </label>
        </div>

        <div class="category-list">
          <section
            v-for="category in product.options"
            :key="category.categoryName"
            class="category-block"
          >
            <h3>{{ category.categoryName }}</h3>

            <div class="category-items">
              <div
                v-for="item in category.items"
                :key="item.name"
                class="category-row"
                :class="{ 'is-disabled': !isOptionItemEnabled(item) }"
              >
                <div class="category-row__text">
                  <strong>{{ item.name }}</strong>
                  <span>{{ formatCurrency(item.price) }}</span>
                </div>

                <label class="switch switch--compact">
                  <input
                    type="checkbox"
                    :checked="isOptionItemEnabled(item)"
                    :aria-label="`Habilitar ${item.name}`"
                    @change="
                      updateOptionItemStatus(
                        product.id,
                        category.categoryName,
                        item.name,
                        $event
                      )
                    "
                  />

                  <span class="switch__track">
                    <span class="switch__thumb"></span>
                  </span>

                  <span class="switch__label">
                    {{ isOptionItemEnabled(item) ? "Habilitado" : "Desabilitado" }}
                  </span>
                </label>
              </div>
            </div>
          </section>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.dashboard-page {
  width: min(920px, calc(100% - 32px));
  margin: 0 auto 80px;
  color: #f7f7f7;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.eyebrow {
  display: block;
  margin-bottom: 6px;
  color: #fdd426;
  font-size: 12px;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  font-size: 28px;
  color: #ffffff;
}

.menu-link {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border: 1px solid #fdd426;
  border-radius: 8px;
  color: #fdd426;
  text-decoration: none;
  font-size: 14px;
}

.status-bar {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.status-bar div {
  min-height: 76px;
  padding: 16px;
  border: 1px solid #2f2f2f;
  border-radius: 8px;
  background: #202024;
}

.status-bar strong {
  display: block;
  color: #ffffff;
  font-size: 26px;
  line-height: 1;
}

.status-bar span {
  display: block;
  margin-top: 8px;
  color: #a8a8a8;
  font-size: 13px;
}

.menu-list {
  display: grid;
  gap: 12px;
}

.menu-item {
  display: grid;
  gap: 18px;
  padding: 14px;
  border: 1px solid #303030;
  border-radius: 8px;
  background: #242424;
}

.menu-item.is-disabled .menu-item__summary {
  opacity: 0.62;
}

.menu-item__summary {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  min-height: 88px;
}

.menu-item__image {
  width: 88px;
  height: 88px;
  border-radius: 8px;
  object-fit: cover;
  background: #141414;
}

.menu-item__content {
  min-width: 0;
}

.menu-item__content h2 {
  color: #ffffff;
  font-size: 18px;
}

.menu-item__content p {
  margin-top: 6px;
  color: #c7c7c7;
  font-size: 14px;
  line-height: 1.35;
}

.menu-item__content span {
  display: inline-block;
  margin-top: 10px;
  color: #76d381;
  font-size: 12px;
}

.category-list {
  display: grid;
  gap: 14px;
  padding-top: 4px;
}

.category-block {
  display: grid;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid #343434;
}

.category-block h3 {
  margin: 0;
  color: #fdd426;
  font-size: 14px;
}

.category-items {
  display: grid;
  gap: 8px;
}

.category-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #1d1d1f;
}

.category-row.is-disabled {
  opacity: 0.62;
}

.category-row__text {
  min-width: 0;
}

.category-row__text strong {
  display: block;
  color: #ffffff;
  font-size: 14px;
}

.category-row__text span {
  display: block;
  margin-top: 4px;
  color: #76d381;
  font-size: 12px;
}

.switch {
  display: grid;
  grid-template-columns: 54px 92px;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.switch input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.switch__track {
  width: 54px;
  height: 30px;
  display: flex;
  align-items: center;
  padding: 3px;
  border-radius: 999px;
  background: #565656;
  transition: background 0.2s ease;
}

.switch__thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ffffff;
  transition: transform 0.2s ease;
}

.switch input:checked + .switch__track {
  background: #fdd426;
}

.switch input:checked + .switch__track .switch__thumb {
  transform: translateX(24px);
}

.switch input:focus-visible + .switch__track {
  outline: 3px solid rgba(253, 212, 38, 0.35);
  outline-offset: 3px;
}

.switch__label {
  color: #ffffff;
  font-size: 13px;
}

.switch--compact {
  grid-template-columns: 46px 92px;
}

.switch--compact .switch__track {
  width: 46px;
  height: 26px;
  padding: 3px;
}

.switch--compact .switch__thumb {
  width: 20px;
  height: 20px;
}

.switch--compact input:checked + .switch__track .switch__thumb {
  transform: translateX(20px);
}

@media (max-width: 640px) {
  .dashboard-page {
    width: min(100% - 24px, 420px);
  }

  .dashboard-header {
    align-items: flex-start;
  }

  .status-bar {
    grid-template-columns: 1fr;
  }

  .menu-item__summary {
    grid-template-columns: 72px minmax(0, 1fr);
  }

  .menu-item__image {
    width: 72px;
    height: 72px;
  }

  .menu-item__summary > .switch {
    grid-column: 1 / -1;
    grid-template-columns: 54px 1fr;
    width: 100%;
    padding-top: 12px;
    border-top: 1px solid #303030;
  }

  .category-row {
    grid-template-columns: 1fr;
  }

  .switch--compact {
    grid-template-columns: 46px 1fr;
  }
}
</style>
