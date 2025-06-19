"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCartStore } from "@/store/cart-store"
import StarRating from "@/components/ui/star-rating"
import { formatPrice } from "@/utils/format"
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Package, 
  Truck, 
  Shield,
  Plus,
  Minus
} from "lucide-react"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  stock: number
  images: string[]
  category: {
    name: string
  }
  averageRating?: number
  reviewCount?: number
}

interface ProductInfoProps {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addItem } = useCartStore()

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    
    // Convert to cart-compatible product format
    const cartProduct = {
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: product.price,
      compareAtPrice: undefined,
      images: product.images,
      category: {
        id: product.category.name, // Using name as fallback
        name: product.category.name,
        slug: product.category.name.toLowerCase().replace(/\s+/g, '-'),
        description: undefined,
        image: undefined,
        parentId: undefined,
        children: undefined
      },
      categoryId: product.category.name, // Using name as fallback
      stock: product.stock,
      sku: product.id, // Using id as fallback for sku
      status: "ACTIVE" as const,
      rating: product.averageRating || 0,
      reviewCount: product.reviewCount || 0,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Add to cart
    addItem(cartProduct, quantity)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsAddingToCart(false)
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const isInStock = product.stock > 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <Badge variant="outline" className="text-xs">
          {product.category.name}
        </Badge>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          {product.name}
        </h1>
      </div>

      {/* Rating */}
      {product.averageRating && (
        <div className="flex items-center gap-3">
          <StarRating rating={product.averageRating} size="md" />
          <span className="text-sm text-muted-foreground">
            {product.averageRating.toFixed(1)} ({product.reviewCount || 0} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <div className="space-y-2">
        <div className="text-3xl font-bold text-primary">
          {formatPrice(product.price)}
        </div>
        <div className="text-sm text-muted-foreground">
          Price includes taxes and shipping
        </div>
      </div>

      <Separator />

      {/* Stock Status */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <span className="font-medium">Availability:</span>
          {isInStock ? (
            <Badge variant={isLowStock ? "destructive" : "default"} className="text-xs">
              {isLowStock ? `Only ${product.stock} left` : "In Stock"}
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          )}
        </div>
        
        {isInStock && (
          <div className="text-sm text-muted-foreground">
            {product.stock} items available
          </div>
        )}
      </div>

      {/* Quantity and Add to Cart */}
      {isInStock && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={decrementQuantity}
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
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
            
            <Button variant="outline" size="lg">
              <Heart className="mr-2 h-4 w-4" />
              Wishlist
            </Button>
            
            <Button variant="outline" size="lg" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      )}

      <Separator />

      {/* Features */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <span>Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span>30-day return policy</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span>Secure packaging</span>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        </>
      )}
    </div>
  )
} 