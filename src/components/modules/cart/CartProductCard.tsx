import { Button } from "@/components/ui/button";
import {
  decrementOrderQuantity,
  incrementOrderQuantity,
  removeSelectedProductFromCart,
} from "@/redux/features/cart/cartSlice";
import { useAppDispatch } from "@/redux/hooks";
import ICartProduct from "@/types/cartProduct";
import { TProductImage } from "@/types/product";
import { Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";

const CartProductCard = ({
  isCouponApplied,
  product,
}: {
  isCouponApplied?: boolean;
  product: ICartProduct;
}) => {
  const dispatch = useAppDispatch();

  const incrementQuantity = (id: string, selectedId: string) => {
    // Dispatch increment action
    dispatch(incrementOrderQuantity({ productId: id, selectedId }));
  };

  const decrementQuantity = (id: string, selectedId: string) => {
    // Dispatch decrement action
    dispatch(decrementOrderQuantity({ productId: id, selectedId }));
  };

  const removeProduct = (id: string, selectedId: string) => {
    // Dispatch remove action
    dispatch(removeSelectedProductFromCart({ productId: id, selectedId }));
  };

  const primaryImage =
    product.productImages.find((img: TProductImage) => img.isPrimary) ||
    product.productImages[0];

  return (
    <div className="flex items-center space-x-4 p-3 border rounded-lg">
      <Image
        src={primaryImage.imageUrl}
        alt={product.name}
        width={70}
        height={70}
        className="object-cover rounded-md"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{product.name}</h4>
        <p className="text-sm text-muted-foreground">${product.price}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={isCouponApplied}
          onClick={() =>
            decrementQuantity(product.id, product.selectedProductId)
          }
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center">{product.orderQuantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={isCouponApplied}
          onClick={() =>
            incrementQuantity(product.id, product.selectedProductId)
          }
        >
          <Plus className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          disabled={isCouponApplied}
          onClick={() => removeProduct(product.id, product.selectedProductId)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default CartProductCard;
