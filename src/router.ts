import { createRouter, createWebHashHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import ProductView from "@/views/ProductView.vue";
import OrderView from "@/views/OrderView.vue";
import Checkout from "@/views/Checkout.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/order",
    name: "order",
    component: OrderView,
  },
  {
    path: "/checkout",
    name: "checkout",
    component: Checkout,
  },
  {
    path: "/product/:id",
    name: "product",
    component: ProductView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
