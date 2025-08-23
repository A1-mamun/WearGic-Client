import { TProduct } from "./product";

interface ICartProduct extends TProduct {
  orderQuantity: number;
  selectedProductId: string;
}

export default ICartProduct;
