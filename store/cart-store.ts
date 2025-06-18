import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cart, CartItem, Product } from "@/types";

interface CartStore extends Cart {
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      id: "cart",
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (product: Product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.productId === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            product,
            quantity,
            price: product.price,
          };
          set({ items: [...items, newItem] });
        }

        // Update totals
        const state = get();
        set({
          itemCount: state.getTotalItems(),
          total: state.getTotalPrice(),
        });
      },

      removeItem: (productId: string) => {
        const items = get().items.filter((item) => item.productId !== productId);
        set({ items });
        
        const state = get();
        set({
          itemCount: state.getTotalItems(),
          total: state.getTotalPrice(),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const items = get().items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        set({ items });

        const state = get();
        set({
          itemCount: state.getTotalItems(),
          total: state.getTotalPrice(),
        });
      },

      clearCart: () => {
        set({ items: [], total: 0, itemCount: 0 });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
    }
  )
); 