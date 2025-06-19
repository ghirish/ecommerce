import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight, ShoppingCart, Heart } from "lucide-react"
import BannerCarousel from "@/components/home/banner-carousel"
import LatestProducts from "@/components/home/latest-products"
import { getLatestProducts, getFeaturedProducts } from "@/lib/products"



const categories = [
  { name: "Electronics", href: "/categories/electronics", count: "2,500+ items" },
  { name: "Clothing", href: "/categories/clothing", count: "1,800+ items" },
  { name: "Smartphones", href: "/categories/smartphones", count: "500+ items" },
  { name: "Laptops", href: "/categories/laptops", count: "300+ items" },
  { name: "Shoes", href: "/categories/shoes", count: "750+ items" },
  { name: "Jeans", href: "/categories/jeans", count: "400+ items" },
]

export default async function HomePage() {
  // Fetch latest and featured products
  const [latestProducts, featuredProducts] = await Promise.all([
    getLatestProducts(8),
    getFeaturedProducts(4)
  ])

  return (
    <div className="space-y-16">
      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Latest Products Section */}
      <LatestProducts products={latestProducts} />

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of categories and find exactly what you're looking for
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-lg text-muted-foreground">
              Handpicked products from our best-selling collection
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.images[0] || "/images/placeholder-product.jpg"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <Badge className="absolute top-2 left-2" variant="secondary">
                    Featured
                  </Badge>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <Badge variant="outline" className="mb-2 text-xs">
                  {product.category.name}
                </Badge>
                <CardTitle className="text-lg mb-2 line-clamp-1">{product.name}</CardTitle>
                <div className="flex items-center gap-1 mb-2">
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
                        {product.averageRating} ({product._count?.reviews || 0})
                      </>
                    ) : (
                      "New"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">${product.price}</span>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" asChild>
                  <Link href={`/products/${product.id}`}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover amazing deals on quality products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 