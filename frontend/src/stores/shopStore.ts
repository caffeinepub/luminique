import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRODUCTS } from '../data/products';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  reviewCount: number;
  skinTypes: string[];
  concerns: string[];
  category: string;
  description: string;
  ingredients: string[];
  reviews: { user: string; rating: number; comment: string }[];
  isBestSeller: boolean;
  discount: number;
  gradient: string;
  icon: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShopState {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  cartBounce: boolean;
}

export interface ShopActions {
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleWishlist: (id: string) => void;
  clearCart: () => void;
  setCartBounce: (val: boolean) => void;
}

export const useShopStore = create<ShopState & ShopActions>()(
  persist(
    (set) => ({
      products: PRODUCTS,
      cart: [],
      wishlist: [],
      cartBounce: false,

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              cartBounce: true,
            };
          }
          return {
            cart: [...state.cart, { product, quantity: 1 }],
            cartBounce: true,
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: quantity <= 0
            ? state.cart.filter((item) => item.product.id !== id)
            : state.cart.map((item) =>
                item.product.id === id ? { ...item, quantity } : item
              ),
        })),

      toggleWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.includes(id)
            ? state.wishlist.filter((wid) => wid !== id)
            : [...state.wishlist, id],
        })),

      clearCart: () => set({ cart: [] }),

      setCartBounce: (val) => set({ cartBounce: val }),
    }),
    {
      name: 'luminique-shop',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
      }),
    }
  )
);
