export interface Product {
  id: number;
  name: string;
  image: string;
  description: string;
  options: ProductOption[];
}

export interface ProductOption {
  categoryName: string;
  items: ProductItem[];
}

export interface ProductItem {
  name: string;
  price: number;
}
