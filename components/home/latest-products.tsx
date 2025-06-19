import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, ArrowRight, Clock } from "lucide-react"
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

interface LatestProductsProps {
  products: Product[]
}

export default function LatestProducts({ products }: LatestProductsProps) {
  if (products.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Products</h2>
          <p className="text-muted-foreground">No products available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Just In</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Products</h2>
          <p className="text-lg text-muted-foreground">
            Discover our newest arrivals and trending products
          </p>
        </div>
        <Button variant="outline" asChild className="hidden sm:flex">
          <Link href="/products?sort=newest">
            View All Latest
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm hover:shadow-xl">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg bg-gray-100">
                <Link href={`/products/${product.id}`}>
                  <img
                    src={product.images[0] || "/images/placeholder-product.jpg"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                
                {/* New badge */}
                <Badge className="absolute top-2 left-2 bg-green-500 text-white border-0 shadow-sm">
                  New
                </Badge>
                
                {/* Wishlist button */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button size="icon" variant="secondary" className="h-8 w-8 shadow-sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Quick view overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/products/${product.id}`}>
                      Quick View
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4">
              <Badge variant="outline" className="mb-3 text-xs">
                {product.category.name}
              </Badge>
              
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
              <div className="flex items-center justify-between">
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
              <Button className="w-full group" asChild>
                <Link href={`/products/${product.id}`}>
                  <ShoppingCart className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Add to Cart
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Mobile view all button */}
      <div className="mt-8 text-center sm:hidden">
        <Button variant="outline" asChild>
          <Link href="/products?sort=newest">
            View All Latest Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
} 