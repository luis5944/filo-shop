import React, { FC, useEffect, useReducer } from "react";
import {
  ICartProduct,
  IOrder,
  IOrderItem,
  ShippingAddress,
} from "../../interfaces";
import { CartContext, cartReducer } from "./";
import Cookie from "js-cookie";
import { testloApi } from "../../api";
import axios from "axios";

export interface CartState {
  cart: ICartProduct[];
  isLoaded: boolean;
  numberOfItems: number;
  subTotal: number;
  tax: number;
  totalPrice: number;
  shippingAddress?: ShippingAddress;
}

const INITIAL_STATE: CartState = {
  cart: [],
  isLoaded: false,
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  totalPrice: 0,
  shippingAddress: undefined,
};

const CartProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, INITIAL_STATE);

  useEffect(() => {
    try {
      const cookieProducts = Cookie.get("cart")
        ? JSON.parse(Cookie.get("cart")!)
        : [];

      dispatch({
        type: "load-cart",
        payload: cookieProducts,
      });
    } catch (error) {
      dispatch({
        type: "load-cart",
        payload: [],
      });
    }
  }, []);

  useEffect(() => {
    if (Cookie.get("firstName")) {
      const shippingAddress: ShippingAddress = {
        firstName: Cookie.get("firstName") || "",
        lastName: Cookie.get("lastName") || "",
        address: Cookie.get("address") || "",
        address2: Cookie.get("address2") || "",
        zip: Cookie.get("zip") || "",
        city: Cookie.get("city") || "",
        country: Cookie.get("country") || "",
        phone: Cookie.get("phone") || "",
      };
      dispatch({ type: "load-address", payload: shippingAddress });
    }
  }, []);

  useEffect(() => {
    Cookie.set("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (prev, current) => current.quantity + prev,
      0
    );
    const subTotal = state.cart.reduce(
      (prev, current) => current.price * current.quantity + prev,
      0
    );
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) * subTotal;
    const totalPrice = taxRate + subTotal;
    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: taxRate,
      totalPrice,
    };

    dispatch({ type: "order-summary", payload: orderSummary });
  }, [state.cart]);

  const addProduct = (product: ICartProduct) => {
    const existProduct = state.cart.find(
      (c) => c._id === product._id && c.size === product.size
    );

    if (!existProduct) {
      return dispatch({
        type: "update-cart",
        payload: [...state.cart, product],
      });
    }

    const updatedCart = state.cart.map((c) => {
      if (c._id === product._id && c.size === product.size) {
        return {
          ...c,
          quantity: c.quantity + product.quantity,
        };
      }
      return c;
    });

    return dispatch({ type: "update-cart", payload: updatedCart });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: "change-cart-quantity", payload: product });
  };

  const deleteProductFromCart = (product: ICartProduct) => {
    dispatch({ type: "delete-product", payload: product });
  };

  const updateAddress = (address: ShippingAddress) => {
    Cookie.set("firstName", address.firstName);
    Cookie.set("lastName", address.lastName);
    Cookie.set("address", address.address);
    Cookie.set("address2", address.address2 || "");
    Cookie.set("zip", address.zip);
    Cookie.set("city", address.city);
    Cookie.set("country", address.country);
    Cookie.set("phone", address.phone);
    dispatch({ type: "update-address", payload: address });
  };

  const createOrder = async (): Promise<{
    hasError: boolean;
    message: string;
  }> => {
    if (!state.shippingAddress) {
      throw new Error("No hay dirección de entrega");
    }

    const body: IOrder = {
      orderItems: state.cart.map((p) => ({
        ...p,
        size: p.size!,
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.totalPrice,
      isPaid: false,
    };
    try {
      const { data } = await testloApi.post<IOrder>("/orders", body);

      dispatch({ type: "order-complete" });

      return { hasError: false, message: data._id! };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }
      return {
        hasError: true,
        message: "Error no controlado",
      };
    }
  };
  return (
    <CartContext.Provider
      value={{
        ...state,
        addProduct,
        updateCartQuantity,
        deleteProductFromCart,
        updateAddress,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
