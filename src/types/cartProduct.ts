import { TProduct } from "./product";

interface ICartProduct extends TProduct {
  orderQuantity: number;
}

export default ICartProduct;
