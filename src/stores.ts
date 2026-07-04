import { defineStore } from "pinia";

export interface BaseItem {
  name: string;
  price: number;
  type: "checkbox" | "quantity";
  enabled?: boolean;
  obrigatory?: boolean;
}

export interface CheckboxItem extends BaseItem {
  type: "checkbox";
  checked: boolean;
}

export interface QuantityItem extends BaseItem {
  type: "quantity";
  quantity: number;
  max: number;
}

export type OptionItem = CheckboxItem | QuantityItem;

export interface ProductOption {
  categoryName: string;
  items: OptionItem[];
  maxItems?: number;
  obrigatory?: boolean;
}

export interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  enabled: boolean;
  options: ProductOption[];
}

export interface OrderOption {
  categoryName: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderProduct {
  productId: number;
  productName: string;
  options: OrderOption[];
}

const PRODUCT_STATUS_STORAGE_KEY = "menu-product-status";
const OPTION_ITEM_STATUS_STORAGE_KEY = "menu-option-item-status";

export const isOptionItemEnabled = (item: OptionItem) => item.enabled !== false;

const getStoredStatus = (storageKey: string) => {
  if (typeof localStorage === "undefined") return {} as Record<string, boolean>;

  try {
    const value = localStorage.getItem(storageKey);
    if (!value) return {} as Record<string, boolean>;

    return JSON.parse(value) as Record<string, boolean>;
  } catch {
    return {} as Record<string, boolean>;
  }
};

const getStoredProductStatus = () => getStoredStatus(PRODUCT_STATUS_STORAGE_KEY);

const getStoredOptionItemStatus = () =>
  getStoredStatus(OPTION_ITEM_STATUS_STORAGE_KEY);

const getOptionItemStatusKey = (
  productId: number,
  categoryName: string,
  itemName: string
) => `${productId}:${categoryName}:${itemName}`;

const saveProductStatus = (products: Product[]) => {
  if (typeof localStorage === "undefined") return;

  const status = Object.fromEntries(
    products.map((product) => [String(product.id), product.enabled])
  );

  localStorage.setItem(PRODUCT_STATUS_STORAGE_KEY, JSON.stringify(status));
};

const saveOptionItemStatus = (products: Product[]) => {
  if (typeof localStorage === "undefined") return;

  const status = products.reduce<Record<string, boolean>>((result, product) => {
    product.options.forEach((option) => {
      option.items.forEach((item) => {
        result[
          getOptionItemStatusKey(product.id, option.categoryName, item.name)
        ] = isOptionItemEnabled(item);
      });
    });

    return result;
  }, {});

  localStorage.setItem(OPTION_ITEM_STATUS_STORAGE_KEY, JSON.stringify(status));
};

const getSelectedOptions = (product: Product): OrderOption[] =>
  product.options.flatMap((option) =>
    option.items.flatMap((item) => {
      if (!isOptionItemEnabled(item)) return [];

      if (item.type === "checkbox" && (item.checked || item.obrigatory)) {
        return [
          {
            categoryName: option.categoryName,
            itemName: item.name,
            quantity: 1,
            unitPrice: item.price,
            totalPrice: item.price,
          },
        ];
      }

      if (item.type === "quantity" && item.quantity > 0) {
        return [
          {
            categoryName: option.categoryName,
            itemName: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.quantity * item.price,
          },
        ];
      }

      return [];
    })
  );

export const hasSelectedOptions = (product: Product) =>
  getSelectedOptions(product).length > 0;

const getProductTotal = (product: OrderProduct) =>
  product.options.reduce((sum, option) => sum + option.totalPrice, 0);

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customer: {
      formaDeEntrega: "Vou buscar",
      formaDePagamento: "",
      nome: "",
      rua: "",
      bairro: "",
      numero: "",
      referencia: "",
      troco: null as number | null,
    },
  }),

  actions: {
    finalizeCustomer() {
      console.log("Pedido finalizado:", this.customer);
    },
  },
});

export const useProductStore = defineStore("product", {
  state: () => {
    const storedStatus = getStoredProductStatus();
    const storedOptionItemStatus = getStoredOptionItemStatus();

    const products = [
      {
        id: 1,
        name: "ESFIRRAS",
        image: "foods/food1.webp",
        description: "Saborosas esfirras doces e salgadas",
        enabled: storedStatus["1"] ?? true,
        options: [
          {
            categoryName: "Pão",
            maxItems: 1,
            items: [
              {
                name: "Pão Árabe",
                price: 3.0,
                type: "checkbox",
                checked: false,
                obrigatory: false,
              },
              {
                name: "Pão Bola",
                price: 2.0,
                type: "checkbox",
                checked: false,
              },
              {
                name: "Pão Brioche",
                price: 3.0,
                type: "checkbox",
                checked: false,
              },
            ],
          },
          {
            categoryName: "Queijo",
            items: [
              { name: "Cheddar", price: 4.0, type: "checkbox", checked: false },
              {
                name: "Mussarela",
                price: 3.0,
                type: "checkbox",
                checked: false,
              },
              { name: "Coalho", price: 2.0, type: "checkbox", checked: false },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "teste",
        image: "foods/food1.webp",
        description: "Saborosas e salgadas",
        enabled: storedStatus["2"] ?? true,
        options: [
          {
            categoryName: "Dough",
            items: [
              {
                name: "Pão Árabe",
                price: 3.0,
                type: "quantity",
                quantity: 0,
                max: 10,
              },
              {
                name: "Pão Bola",
                price: 2.0,
                type: "quantity",
                quantity: 0,
                max: 10,
              },
              {
                name: "Pão Brioche",
                price: 3.0,
                type: "quantity",
                quantity: 0,
                max: 10,
              },
            ],
          },
          {
            categoryName: "Cheese",
            items: [
              {
                name: "Cheddar",
                price: 4.0,
                type: "quantity",
                quantity: 0,
                max: 10,
              },
              {
                name: "Mussarela",
                price: 3.0,
                type: "quantity",
                quantity: 0,
                max: 10,
              },
              {
                name: "Coalho",
                price: 2.0,
                type: "quantity",
                quantity: 0,
                max: 10,
              },
            ],
          },
        ],
      },
    ] as Product[];

    products.forEach((product) => {
      product.options.forEach((option) => {
        option.items.forEach((item) => {
          const storedEnabled =
            storedOptionItemStatus[
              getOptionItemStatusKey(product.id, option.categoryName, item.name)
            ];

          if (storedEnabled !== undefined) item.enabled = storedEnabled;
        });
      });
    });

    return {
      products,
    };
  },

  getters: {
    enabledProducts: (state) =>
      state.products.filter(
        (product) =>
          product.enabled &&
          product.options.some((option) =>
            option.items.some(isOptionItemEnabled)
          )
      ),
    getProductById: (state) => (id: number) =>
      state.products.find((p) => p.id === id) as Product | undefined,
  },

  actions: {
    setProductEnabled(productId: number, enabled: boolean) {
      const product = this.products.find((p) => p.id === productId);
      if (!product) return;

      product.enabled = enabled;
      saveProductStatus(this.products);
    },

    setOptionItemEnabled(
      productId: number,
      categoryName: string,
      itemName: string,
      enabled: boolean
    ) {
      const product = this.products.find((p) => p.id === productId);
      const option = product?.options.find(
        (productOption) => productOption.categoryName === categoryName
      );
      const item = option?.items.find(
        (optionItem) => optionItem.name === itemName
      );
      if (!item) return;

      item.enabled = enabled;

      if (!enabled) {
        if (item.type === "checkbox") item.checked = false;
        else if (item.type === "quantity") item.quantity = 0;
      }

      saveOptionItemStatus(this.products);
    },

    resetProductOptions(productId: number) {
      const product = this.products.find((p) => p.id === productId);
      if (!product) return;

      product.options.forEach((option) => {
        option.items.forEach((item) => {
          if (item.type === "checkbox")
            item.checked = isOptionItemEnabled(item) && Boolean(item.obrigatory);
          else if (item.type === "quantity") item.quantity = 0;
        });
      });
    },
  },
});

export const useOrderStore = defineStore("order", {
  state: () => ({
    items: [] as OrderProduct[],
    editingProductIndex: null as number | null,
  }),

  getters: {
    itemCount: (state) => state.items.length,
    total: (state) =>
      state.items.reduce((sum, product) => sum + getProductTotal(product), 0),
    productTotal: () => getProductTotal,
  },

  actions: {
    addProduct(product: Product) {
      const options = getSelectedOptions(product);

      if (options.length === 0) return false;

      const orderProduct: OrderProduct = {
        productId: product.id,
        productName: product.name,
        options,
      };

      if (this.editingProductIndex !== null) {
        this.items[this.editingProductIndex] = orderProduct;
        this.editingProductIndex = null;
      } else {
        this.items.push(orderProduct);
      }

      return true;
    },

    clearOrder() {
      this.items = [];
    },

    editProduct(productIndex: number) {
      const orderProduct = this.items[productIndex];
      if (!orderProduct) return;

      this.editingProductIndex = productIndex;
      const product = useProductStore().getProductById(orderProduct.productId);
      if (!product) return;

      product.options.forEach((option) => {
        option.items.forEach((item) => {
          const orderItem = orderProduct.options.find(
            (opt) =>
              opt.itemName === item.name &&
              opt.categoryName === option.categoryName
          );

          if (orderItem && isOptionItemEnabled(item)) {
            if (item.type === "checkbox") item.checked = true;
            else if (item.type === "quantity")
              item.quantity = orderItem.quantity;
          } else {
            if (item.type === "checkbox")
              item.checked = isOptionItemEnabled(item) && Boolean(item.obrigatory);
            else if (item.type === "quantity") item.quantity = 0;
          }
        });
      });

      return orderProduct.productId;
    },

    cancelEdit() {
      this.editingProductIndex = null;
    },

    removeProduct(productIndex: number) {
      if (this.editingProductIndex === productIndex)
        this.editingProductIndex = null;
      this.items.splice(productIndex, 1);
    },
  },
});
