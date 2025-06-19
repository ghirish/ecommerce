"use client"

import { useState } from "react"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingCart, 
  Plus, 
  Minus,
  Check
} from "lucide-react"
import type { Product } from "@/types"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    compareAtPrice?: number
    images: string[]
    category: {
      id?: string
      name: string
      slug?: string
      description?: string | null
      image?: string | null
      parentId?: string | null
      children?: any[]
    }
    categoryId: string
    stock: number
    sku: string
    status: "ACTIVE" | "DRAFT" | "ARCHIVED"
    rating?: number
    reviewCount?: number
    tags?: string[]
    description?: string | null
    createdAt?: Date
    updatedAt?: Date
  }
  variant?: "default" | "outline" | "ghost" | "grid"
  size?: "sm" | "default" | "lg"
  showQuantity?: boolean
  className?: string
}

export default function AddToCartButton({ 
  product, 
  variant = "default",
  size = "default",
  showQuantity = false,
  className = ""
}: AddToCartButtonProps) {
  const { addItem } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    
    // Convert to cart-compatible product format
    const cartProduct: Product = {
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      images: product.images,
      category: {
        id: product.category.id || product.categoryId,
        name: product.category.name,
        slug: product.category.slug || product.category.name.toLowerCase().replace(/\s+/g, '-'),
        description: product.category.description || undefined,
        image: product.category.image || undefined,
        parentId: product.category.parentId || undefined,
        children: product.category.children || undefined
      },
      categoryId: product.categoryId,
      stock: product.stock,
      sku: product.sku,
      status: product.status,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      tags: product.tags || [],
      createdAt: product.createdAt || new Date(),
      updatedAt: product.updatedAt || new Date()
    }
    
    // Add to cart
    addItem(cartProduct, quantity)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsAdding(false)
    setJustAdded(true)
    
    // Reset "just added" state after 2 seconds
    setTimeout(() => setJustAdded(false), 2000)
  }

  const isInStock = product.stock > 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  // Grid variant for product grids
  if (variant === "grid") {
    return (
      <div className="space-y-2">
        {showQuantity && isInStock && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-medium min-w-[2rem] text-center">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        <Button
          variant={justAdded ? "outline" : "default"}
          size={size}
          className={`w-full ${className}`}
          onClick={handleAddToCart}
          disabled={!isInStock || isAdding}
        >
          {justAdded ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-600" />
              Added!
            </>
          ) : isAdding ? (
            "Adding..."
          ) : !isInStock ? (
            "Out of Stock"
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
        
        {isLowStock && isInStock && (
          <Badge variant="secondary" className="w-full justify-center text-xs">
            Only {product.stock} left
          </Badge>
        )}
      </div>
    )
  }

  // Default button variant
  return (
    <div className="space-y-3">
      {showQuantity && isInStock && (
        <div className="flex items-center gap-4">
          <span className="font-medium">Quantity:</span>
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2 text-center min-w-[3rem]">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Button
        variant={justAdded ? "outline" : variant}
        size={size}
        className={`${className} ${justAdded ? 'border-green-600 text-green-600' : ''}`}
        onClick={handleAddToCart}
        disabled={!isInStock || isAdding}
      >
        {justAdded ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Added to Cart!
          </>
        ) : isAdding ? (
          "Adding to Cart..."
        ) : !isInStock ? (
          "Out of Stock"
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        )}
      </Button>

      {isLowStock && isInStock && (
        <Badge variant="secondary" className="text-xs">
          Only {product.stock} left in stock
        </Badge>
      )}
    </div>
  )
} 