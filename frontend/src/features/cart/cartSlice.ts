import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit"
import { Cart } from "../../app/models/cart"

import { getCookie } from "../../app/models/util";
import api from "../../app/api/api";

interface CartState {
    cart: Cart | null;
    status: string;
}

const initialState: CartState = {
    cart: null,
    status: 'idle'
}

export const fetchCartAsync = createAsyncThunk<Cart>(
    'cart/fetchCartAsync',
    async (_, thunkAPI) => {
        try {
            return await api.Cart.get();
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    },
    {
        condition: () => {
            if (!getCookie('buyerId')) return false;
        }
    }
)

export const addCartItemAsync = createAsyncThunk<Cart, {productId: number, quantity?: number}>(
    'cart/addCartItemAsync',
    async ({productId, quantity = 1}, thunkAPI) => {
        try {
            return await api.Cart.addItem(productId, quantity);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const removeCartItemAsync = createAsyncThunk<void, {productId: number, quantity: number, name?: string}>(
    'cart/removeCartItemAsync',
    async ({productId, quantity}, thunkAPI) => {
        try {
            await api.Cart.removeItem(productId, quantity);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const cartSlice = createSlice ({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload
        },
        clearCart: (state) => {
            state.cart = null;
        }
    },
    extraReducers: (builder => {
        builder.addCase(addCartItemAsync.pending, (state, action) => {
            state.status = 'pendingAddItem' + action.meta.arg.productId;
        });
        builder.addCase(removeCartItemAsync.pending, (state, action) => {
            state.status = 'pendingRemoveItem' + action.meta.arg.productId + 'rem';
        });
        builder.addCase(removeCartItemAsync.fulfilled, (state, action) => {
            const {productId, quantity} = action.meta.arg;
            const itemIndex = state.cart?.items.findIndex(i => i.productId === productId);
            if (itemIndex === -1 || itemIndex === undefined) return;
            state.cart!.items[itemIndex].quantity -= quantity;
            if (state.cart?.items[itemIndex].quantity === 0) 
                state.cart.items.splice(itemIndex, 1);
            state.status = 'idle';
        });
        builder.addCase(removeCartItemAsync.rejected, (state, action) => {
            state.status = 'idle';
            console.log(action.payload);
        });
        builder.addMatcher(isAnyOf(addCartItemAsync.fulfilled, fetchCartAsync.fulfilled), (state, action) => {
            state.cart = action.payload;
            state.status = 'idle';
        });
        builder.addMatcher(isAnyOf(addCartItemAsync.rejected, fetchCartAsync.rejected), (state, action) => {
            state.status = 'idle';
            console.log(action.payload);
        });
    })
})

export const {setCart, clearCart} = cartSlice.actions;