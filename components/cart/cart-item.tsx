"use client"

import { useState } from "react"
import Link from "next/link"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/utils/format"
import { 
  Plus, 
  Minus, 
  Trash2, 
  Heart,
  ExternalLink
} from "lucide-react"
import type { CartItem as CartItemType } from "@/types"

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return
    
    setIsUpdating(true)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    updateQuantity(item.productId, newQuantity)
    setIsUpdating(false)
  }

  const handleRemove = async () => {
    setIsRemoving(true)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    removeItem(item.productId)
  }

  const isInStock = item.product.stock > 0
  const isLowStock = item.product.stock > 0 && item.product.stock <= 5
  const exceedsStock = item.quantity > item.product.stock

  return (
    <div className={`flex gap-4 p-4 rounded-lg border transition-all duration-200 ${
      isRemoving ? 'opacity-50 scale-95' : 'hover:shadow-sm'
    }`}>
      {/* Product Image */}
      <div className="flex-shrink-0">
        <Link href={`/products/${item.product.id}`}>
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden group">
            <img
              src={item.product.images[0] || "/images/placeholder-product.jpg"}
              alt={item.product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex-grow min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          {/* Product Info */}
          <div className="flex-grow min-w-0">
            <Link 
              href={`/products/${item.product.id}`}
              className="group"
            >
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {item.product.name}
                <ExternalLink className="inline-block ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
            </Link>
            
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {item.product.category.name}
              </Badge>
              
              {!isInStock && (
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              )}
              
              {isLowStock && isInStock && (
                <Badge variant="secondary" className="text-xs">
                  Low Stock
                </Badge>
              )}
              
              {exceedsStock && (
                <Badge variant="destructive" className="text-xs">
                  Exceeds Available Stock
                </Badge>
              )}
            </div>

            {/* Stock Info */}
            <div className="text-sm text-muted-foreground mt-1">
              {isInStock ? (
                <>
                  {item.product.stock} available
                  {exceedsStock && (
                    <span className="text-red-600 ml-2">
                      (Reduce quantity to {item.product.stock})
                    </span>
                  )}
                </>
              ) : (
                "Currently unavailable"
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col items-start sm:items-end gap-1">
            <div className="text-xl font-bold text-primary">
              {formatPrice(item.price)}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatPrice(item.price * item.quantity)} total
            </div>
          </div>
        </div>

        {/* Quantity Controls & Actions */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="px-3 py-1 text-center min-w-[2.5rem] border-x">
                <span className="font-medium">
                  {isUpdating ? "..." : item.quantity}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating || item.quantity >= item.product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              × {formatPrice(item.price)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Heart className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 