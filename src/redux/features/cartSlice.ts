/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import ICartProduct from "@/types/cartProduct";
import { addCoupon } from "@/services/checkout";

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
    addProduct: (state, action) => {
      const existingProduct = state.products.find(
        (product) => product.id === action.payload.id
      );
      if (existingProduct) {
        existingProduct.orderQuantity += 1;
        return;
      }
      // If product does not exist, add it to the cart
      state.products.push({ ...action.payload, orderQuantity: 1 });
    },
    incrementOrderQuantity: (state, action) => {
      const product = state.products.find(
        (product) => product.id === action.payload
      );
      if (product) {
        product.orderQuantity += 1;
      }
    },
    decrementOrderQuantity: (state, action) => {
      const product = state.products.find(
        (product) => product.id === action.payload
      );
      if (product && product.orderQuantity > 1) {
        product.orderQuantity -= 1;
      } else if (product) {
        // If order quantity is 1, remove the product from the cart
        state.products = state.products.filter((p) => p.id !== action.payload);
      }
    },
    removeOrderProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
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
      product: product.id,
      quantity: product.orderQuantity,
      // color: "White",
    })),
    shippingAddress: `${state.cart.shippingAddress} - ${state.cart.city}`,
    paymentMethod: "Online",
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
  incrementOrderQuantity,
  decrementOrderQuantity,
  removeOrderProduct,
  updateCity,
  updateShippingAddress,
  clearCart,
  removeCoupon,
} = cartSlice.actions;
export default cartSlice.reducer;
