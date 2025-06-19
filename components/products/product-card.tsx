import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AddToCartButton from "@/components/products/add-to-cart-button"
import StarRating from "@/components/ui/star-rating"
import { formatPrice } from "@/utils/format"
import { Star, Heart, Eye } from "lucide-react"

interface ProductCardProps {
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
    _count?: {
      reviews: number
    }
    averageRating?: number
  }
  showQuickActions?: boolean
  showAddToCart?: boolean
  className?: string
}

export default function ProductCard({ 
  product, 
  showQuickActions = true,
  showAddToCart = true,
  className = ""
}: ProductCardProps) {
  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = isOnSale 
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:shadow-xl overflow-hidden ${className}`}>
      <CardHeader className="p-0">
        <div className="relative overflow-hidden bg-gray-100">
          <Link href={`/products/${product.id}`}>
            <img
              src={product.images[0] || "/images/placeholder-product.jpg"}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 space-y-1">
            <Badge className="bg-white/90 text-black border-0 shadow-sm">
              {product.category.name}
            </Badge>
            {isOnSale && (
              <Badge className="bg-red-500 text-white border-0 shadow-sm">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          {showQuickActions && (
            <>
              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <Button size="sm" variant="secondary" asChild>
                  <Link href={`/products/${product.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    Quick View
                  </Link>
                </Button>
              </div>

              {/* Wishlist button */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button size="icon" variant="secondary" className="h-8 w-8 shadow-sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {(product.averageRating || product.rating) && (
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={product.averageRating || product.rating || 0} size="sm" />
            <span className="text-sm text-muted-foreground">
              {product.averageRating || product.rating ? (
                <>
                  {(product.averageRating || product.rating)!.toFixed(1)} ({product._count?.reviews || product.reviewCount || 0})
                </>
              ) : (
                "New"
              )}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {isOnSale && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.stock <= 5 && product.stock > 0 && (
          <Badge variant="secondary" className="text-xs mb-2">
            Only {product.stock} left
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge variant="destructive" className="text-xs mb-2">
            Out of Stock
          </Badge>
        )}
      </CardContent>

      {showAddToCart && (
        <CardFooter className="p-4 pt-0">
          <AddToCartButton 
            product={product}
            variant="grid"
            size="sm"
            className="w-full"
          />
        </CardFooter>
      )}
    </Card>
  )
} 