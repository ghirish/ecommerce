"use client"

import { useState } from "react"
import Link from "next/link"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import CartItem from "@/components/cart/cart-item"
import CartSummary from "@/components/cart/cart-summary"
import EmptyCart from "@/components/cart/empty-cart"
import { ShoppingBag, ArrowLeft, Trash2, RefreshCw } from "lucide-react"
import { formatPrice } from "@/utils/format"

export default function CartPage() {
  const { items, clearCart, getTotalItems, getTotalPrice } = useCartStore()
  const [isClearing, setIsClearing] = useState(false)

  const handleClearCart = async () => {
    setIsClearing(true)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    clearCart()
    setIsClearing(false)
  }

  if (items.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <Badge variant="secondary" className="ml-2">
                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
              </Badge>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleClearCart}
            disabled={isClearing}
            className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
          >
            {isClearing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            {isClearing ? "Clearing..." : "Clear Cart"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Items in Your Cart</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id}>
                    <CartItem item={item} />
                    {index < items.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shopping Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Continue Shopping</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/products?category=Electronics">
                      Browse Electronics
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/products?category=Clothing">
                      Browse Clothing
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary />
            </div>
          </div>
        </div>

        {/* Mobile Checkout Button */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">Total:</span>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(getTotalPrice())}
            </span>
          </div>
          <Button size="lg" className="w-full" asChild>
            <Link href="/checkout">
              Proceed to Checkout ({getTotalItems()} items)
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 