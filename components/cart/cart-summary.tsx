"use client"

import Link from "next/link"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/utils/format"
import { 
  ShoppingCart, 
  Truck, 
  Shield, 
  CreditCard,
  Gift,
  ArrowRight
} from "lucide-react"

export default function CartSummary() {
  const { items, getTotalItems, getTotalPrice } = useCartStore()
  
  const subtotal = getTotalPrice()
  const shipping = subtotal >= 50 ? 0 : 9.99
  const tax = subtotal * 0.08875 // 8.875% tax rate
  const total = subtotal + shipping + tax
  
  const totalItems = getTotalItems()
  const hasOutOfStockItems = items.some(item => item.product.stock === 0)
  const hasExceedingItems = items.some(item => item.quantity > item.product.stock)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Items Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Items ({totalItems}):</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Truck className="h-3 w-3" />
              Shipping:
            </span>
            <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
              {shipping === 0 ? "FREE" : formatPrice(shipping)}
            </span>
          </div>
          
          {shipping > 0 && (
            <div className="text-xs text-muted-foreground">
              Add {formatPrice(50 - subtotal)} more for free shipping
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span>Tax:</span>
            <span>{formatPrice(tax)}</span>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>

        {/* Warnings */}
        {(hasOutOfStockItems || hasExceedingItems) && (
          <div className="space-y-2">
            {hasOutOfStockItems && (
              <Badge variant="destructive" className="w-full justify-center">
                Some items are out of stock
              </Badge>
            )}
            {hasExceedingItems && (
              <Badge variant="destructive" className="w-full justify-center">
                Some quantities exceed available stock
              </Badge>
            )}
          </div>
        )}

        {/* Checkout Button */}
        <div className="space-y-3">
          <Button 
            size="lg" 
            className="w-full" 
            asChild
            disabled={hasOutOfStockItems || hasExceedingItems}
          >
            <Link href="/checkout">
              <CreditCard className="mr-2 h-4 w-4" />
              Proceed to Checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button variant="outline" size="lg" className="w-full" asChild>
            <Link href="/products">
              Continue Shopping
            </Link>
          </Button>
        </div>

        <Separator />

        {/* Features */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secure checkout with SSL encryption</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Truck className="h-4 w-4" />
            <span>Free shipping on orders over $50</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gift className="h-4 w-4" />
            <span>30-day return policy</span>
          </div>
        </div>

        {/* Promo Code Section */}
        <div className="pt-2">
          <details className="group">
            <summary className="text-sm text-primary cursor-pointer hover:underline">
              Have a promo code?
            </summary>
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="sm" variant="outline">
                  Apply
                </Button>
              </div>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  )
} 