// src/types/product.ts

/* =======================
 * ITEM BASE
 * ======================= */
export interface BaseItem {
  name: string;
  price: number;
  type: "checkbox" | "quantity";
  obrigatory?: boolean;
}

/* =======================
 * ITEM CHECKBOX
 * ======================= */
export interface CheckboxItem extends BaseItem {
  type: "checkbox";
  checked: boolean;
}

/* =======================
 * ITEM QUANTITY
 * ======================= */
export interface QuantityItem extends BaseItem {
  type: "quantity";
  quantity: number;
  max: number;
}

/* =======================
 * UNIÃO DOS ITENS
 * ======================= */
export type OptionItem = CheckboxItem | QuantityItem;

/* =======================
 * OPÇÕES DO PRODUTO
 * ======================= */
export interface ProductOption {
  categoryName: string;
  items: OptionItem[];
  obrigatory?: boolean;
}

/* =======================
 * PRODUTO
 * ======================= */
export interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  options: ProductOption[];
}

/* =======================
 * STORE STATE (PINIA)
 * ======================= */
export interface ProductState {
  products: Product[];
}
