/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import ICartProduct from "@/types/cartProduct";
import { addCoupon } from "@/services/checkout";
import { TProduct } from "@/types/product";

interface InitialState {
  products: ICartProduct[];
  city: string;
  shippingAddress: string;
  coupon: {
    code: string;
    type: string;
    discountAmount: number;
    isLoading: boolean;
    error: string;
  };
}

const initialState: InitialState = {
  products: [],
  city: "",
  shippingAddress: "",
  coupon: {
    code: "",
    type: "",
    discountAmount: 0,
    isLoading: false,
    error: "",
  },
};

export const fetchCoupon = createAsyncThunk(
  "cart/fetchCoupon",
  async ({
    couponCode,
    subTotal,
  }: {
    couponCode: string;
    subTotal: number;
  }) => {
    try {
      const res = await addCoupon(couponCode, subTotal);

      if (!res.success) {
        throw new Error(res.message);
      }

      return res;
    } catch (err: any) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

// Helper function to clear coupon completely
const clearCouponState = (state: InitialState) => {
  state.coupon.code = "";
  state.coupon.type = "";
  state.coupon.discountAmount = 0;
  state.coupon.error = "";
  state.coupon.isLoading = false;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (
      state,
      action: PayloadAction<{ product: TProduct; selectedId: string }>
    ) => {
      const { product, selectedId } = action.payload;
      const existingProduct = state.products.find(
        (item) =>
          item.id === product.id && item.selectedProductId === selectedId
      );
      if (existingProduct) {
        existingProduct.orderQuantity += 1;
        return;
      }

      state.products.push({
        ...product,
        orderQuantity: 1,
        selectedProductId: selectedId,
      });
    },
    addProductWithQuantity: (
      state,
      action: PayloadAction<{
        product: TProduct;
        selectedId: string;
        quantity: number;
      }>
    ) => {
      const { product, selectedId, quantity } = action.payload;
      const existingProduct = state.products.find(
        (item) =>
          item.id === product.id && item.selectedProductId === selectedId
      );
      if (existingProduct) {
        existingProduct.orderQuantity = quantity;
        return;
      }

      state.products.push({
        ...product,
        orderQuantity: quantity,
        selectedProductId: selectedId,
      });
    },
    removeFromCart: (state, action) => {
      state.products = state.products.filter(
        (cartItem) => !(cartItem.id === action.payload)
      );
    },

    removeSelectedProductFromCart: (
      state,
      action: PayloadAction<{ productId: string; selectedId: string }>
    ) => {
      const { productId, selectedId } = action.payload;
      state.products = state.products.filter(
        (cartItem) =>
          !(
            cartItem.id === productId &&
            cartItem.selectedProductId === selectedId
          )
      );
    },
    incrementOrderQuantity: (
      state,
      action: PayloadAction<{ productId: string; selectedId: string }>
    ) => {
      const { productId, selectedId } = action.payload;
      const existingProduct = state.products.find(
        (item) => item.id === productId && item.selectedProductId === selectedId
      );

      if (existingProduct) {
        existingProduct.orderQuantity += 1;
      }
    },

    decrementOrderQuantity: (
      state,
      action: PayloadAction<{ productId: string; selectedId: string }>
    ) => {
      const { productId, selectedId } = action.payload;
      const existingProduct = state.products.find(
        (item) => item.id === productId && item.selectedProductId === selectedId
      );
      if (existingProduct && existingProduct.orderQuantity > 1) {
        existingProduct.orderQuantity -= 1;
      } else if (existingProduct) {
        // If order quantity is 1, remove the product from the cart
        state.products = state.products.filter(
          (p) => !(p.id === productId && p.selectedProductId === selectedId)
        );
      }
    },

    updateCity: (state, action) => {
      state.city = action.payload;
    },
    updateShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    clearCart: (state) => {
      state.products = [];
      state.city = "";
      state.shippingAddress = "";
      clearCouponState(state);
    },

    removeCoupon: (state) => {
      clearCouponState(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCoupon.pending, (state) => {
      state.coupon.isLoading = true;
      state.coupon.error = "";
    });
    builder.addCase(fetchCoupon.rejected, (state, action) => {
      state.coupon.isLoading = false;
      state.coupon.error = action.error.message as string;
      state.coupon.code = "";
      state.coupon.discountAmount = 0;
      state.coupon.type = "";
    });
    builder.addCase(fetchCoupon.fulfilled, (state, action) => {
      state.coupon.isLoading = false;
      state.coupon.error = "";
      state.coupon.code = action.payload.data.coupon.code;
      state.coupon.discountAmount = action.payload.data.discountAmount;
      state.coupon.type = action.payload.data.coupon.discountType;
    });
  },
});

export const orderProductsSelector = (state: RootState) => state.cart.products;

export const orderSelector = (state: RootState) => {
  return {
    products: state.cart.products.map((product) => ({
      productId: product.id,
      quantity: product.orderQuantity,
      selectedProductId: product.selectedProductId,
    })),
    shippingAddress: `${state.cart.shippingAddress} - ${state.cart.city}`,
  };
};

export const subTotalSelector = (state: RootState) =>
  state.cart.products.reduce(
    (total, product) => total + product.price * product.orderQuantity,
    0
  );

export const shippingCostSelector = (state: RootState) => {
  if (
    state.cart.city &&
    state.cart.products.length > 0 &&
    state.cart.coupon.type === "FREE_SHIPPING"
  ) {
    return 0;
  } else if (
    state.cart.city &&
    state.cart.city === "Dhaka" &&
    state.cart.products.length > 0
  ) {
    return 60;
  } else if (
    state.cart.city &&
    state.cart.city !== "Dhaka" &&
    state.cart.products.length > 0
  ) {
    return 120;
  } else {
    return 0;
  }
};

export const couponSelector = (state: RootState) => {
  return state.cart.coupon;
};

export const discountAmountSelector = (state: RootState) => {
  return state.cart.coupon.discountAmount;
};

export const grandTotalSelector = (state: RootState) => {
  const subTotal = subTotalSelector(state);
  const shippingCost = shippingCostSelector(state);
  const discountAmount = discountAmountSelector(state);

  return subTotal - discountAmount + shippingCost;
};

export const citySelector = (state: RootState) => {
  return state.cart.city;
};

export const shippingAddressSelector = (state: RootState) => {
  return state.cart.shippingAddress;
};

export const {
  addProduct,
  addProductWithQuantity,
  incrementOrderQuantity,
  decrementOrderQuantity,
  updateCity,
  updateShippingAddress,
  clearCart,
  removeCoupon,
  removeFromCart,
  removeSelectedProductFromCart,
} = cartSlice.actions;
export default cartSlice.reducer;
