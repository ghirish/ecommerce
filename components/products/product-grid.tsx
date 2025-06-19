import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, ShoppingCart, Heart, Eye } from "lucide-react"
import { formatPrice } from "@/utils/format"

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  category: {
    name: string
  }
  createdAt: Date
  _count?: {
    reviews: number
  }
  averageRating?: number
}

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  emptyMessage?: string
}

export default function ProductGrid({ 
  products, 
  loading = false, 
  emptyMessage = "No products found." 
}: ProductGridProps) {
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-0">
              <Skeleton className="h-48 w-full" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-6 w-20" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-muted/30 rounded-full p-6 mb-4">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          {emptyMessage}
        </p>
        <Button asChild>
          <Link href="/products">
            Browse All Products
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:shadow-xl overflow-hidden">
          <CardHeader className="p-0">
            <div className="relative overflow-hidden bg-gray-100">
              <Link href={`/products/${product.id}`}>
                <img
                  src={product.images[0] || "/images/placeholder-product.jpg"}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              
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

              {/* Category badge */}
              <Badge className="absolute top-2 left-2 bg-white/90 text-black border-0 shadow-sm">
                {product.category.name}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-4">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.averageRating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.averageRating ? (
                  <>
                    {product.averageRating.toFixed(1)} ({product._count?.reviews || 0})
                  </>
                ) : (
                  "New"
                )}
              </span>
            </div>
            
            {/* Price */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(product.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0">
            <Button className="w-full group/btn" asChild>
              <Link href={`/products/${product.id}`}>
                <ShoppingCart className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                Add to Cart
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 