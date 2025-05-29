import { tesloApi } from "../../config/api/tesloApi";

export interface DecrementStockItem {
  id: string;
  quantity: number;
}

export const decrementStock = async (items: DecrementStockItem[]) => {
  // Antes: return tesloApi.patch('/products/decrement-stock', { items });
  // Ahora:
  return tesloApi.patch('/products/decrement-stock', items);
};

