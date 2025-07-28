import { TProduct } from "@/types/product";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface InitialState {
  products: TProduct[];
}

const initialState: InitialState = {
  products: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
  },
});

export const orderProductsSelector = (state: RootState) => state.cart.products;

export const { addProduct } = cartSlice.actions;
export default cartSlice.reducer;
