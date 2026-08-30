import { DeliveriesAPI } from "./deliveries";
import { MenusAPI } from "./menus";
import { ProductsAPI } from "./products";
import { OrdersAPI } from "./orders";
import { UsersAPI } from "./users";
import { DirectUploadsAPI } from "./directUploads";
import { RestaurantsAPI } from "./restaurants";
import { ReportsAPI } from "./reports";
import { PublicOrdersAPI } from "./publicOrders";
import { PublicCatalogAPI } from "./publicCatalog";

export { axiosInstance } from "./axiosInstance";

export const apiClient = {
  deliveries: DeliveriesAPI,
  menus: MenusAPI,
  products: ProductsAPI,
  orders: OrdersAPI,
  users: UsersAPI,
  restaurants: RestaurantsAPI,
  directUploads: DirectUploadsAPI,
  reports: ReportsAPI,
  publicOrders: PublicOrdersAPI,
  publicCatalog: PublicCatalogAPI,
}
