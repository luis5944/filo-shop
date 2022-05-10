import { CartState } from "./CartProvider";
import { ICartProduct, ShippingAddress } from "../../interfaces";

type CartAction =
  | { type: "load-cart"; payload: ICartProduct[] }
  | { type: "update-cart"; payload: ICartProduct[] }
  | { type: "change-cart-quantity"; payload: ICartProduct }
  | { type: "delete-product"; payload: ICartProduct }
  | { type: "load-address"; payload: ShippingAddress }
  | { type: "update-address"; payload: ShippingAddress }
  | { type: "order-complete" }
  | {
      type: "order-summary";
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        totalPrice: number;
      };
    };
export const cartReducer = (
  state: CartState,
  action: CartAction
): CartState => {
  switch (action.type) {
    case "load-cart":
      return { ...state, cart: [...action.payload], isLoaded: true };

    case "update-cart":
      return { ...state, cart: [...action.payload] };

    case "change-cart-quantity":
      return {
        ...state,
        cart: state.cart.map((product) => {
          if (
            product._id === action.payload._id &&
            product.size === action.payload.size
          ) {
            return action.payload;
          }
          return product;
        }),
      };
    case "delete-product":
      return {
        ...state,
        cart: state.cart.filter(
          (product) =>
            !(
              product._id === action.payload._id &&
              product.size === action.payload.size
            )
        ),
      };
    case "order-summary":
      return {
        ...state,
        ...action.payload,
      };

    case "update-address":
    case "load-address":
      return { ...state, shippingAddress: action.payload };
    case "order-complete":
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        subTotal: 0,
        tax: 0,
        totalPrice: 0,
      };
    default:
      return state;
  }
};
