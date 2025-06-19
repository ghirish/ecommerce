"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import StarRating from "@/components/ui/star-rating"
import { formatPrice } from "@/utils/format"
import { ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"

interface RelatedProduct {
  id: string
  name: string
  price: number
  images: string[]
  category: {
    name: string
  }
  averageRating?: number
  reviewCount?: number
  stock: number
}

interface RelatedProductsProps {
  products: RelatedProduct[]
  currentProductId: string
}

export default function RelatedProducts({ 
  products, 
  currentProductId 
}: RelatedProductsProps) {
  // Filter out current product and ensure we have products to show
  const relatedProducts = products.filter(p => p.id !== currentProductId)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Related Products</h3>
        <Button variant="outline" asChild>
          <Link href="/products">View All</Link>
        </Button>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {relatedProducts.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  {/* Product Image */}
                  <Link href={`/products/${product.id}`}>
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={product.images[0] || "/images/placeholder-product.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-white/90 hover:bg-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-white/90 hover:bg-white"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stock Badge */}
                  {product.stock <= 5 && product.stock > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute top-3 left-3 text-xs"
                    >
                      Only {product.stock} left
                    </Badge>
                  )}
                  
                  {product.stock === 0 && (
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 left-3 text-xs bg-gray-800 text-white"
                    >
                      Out of Stock
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Category */}
                  <Badge variant="outline" className="text-xs">
                    {product.category.name}
                  </Badge>

                  {/* Product Name */}
                  <Link href={`/products/${product.id}`}>
                    <h4 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                      {product.name}
                    </h4>
                  </Link>

                  {/* Rating */}
                  {product.averageRating && product.averageRating > 0 && (
                    <div className="flex items-center gap-2">
                      <StarRating rating={product.averageRating} size="sm" />
                      <span className="text-sm text-muted-foreground">
                        ({product.reviewCount || 0})
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-lg text-primary">
                      {formatPrice(product.price)}
                    </div>
                    
                    {product.stock > 0 && (
                      <Button size="sm" className="shrink-0">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>

      {/* Mobile indicators */}
      <div className="flex justify-center gap-2 sm:hidden">
        <div className="text-sm text-muted-foreground">
          Swipe to see more products
        </div>
      </div>
    </div>
  )
} 