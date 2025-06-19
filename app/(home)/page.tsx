import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight, ShoppingCart, Heart } from "lucide-react"
import BannerCarousel from "@/components/home/banner-carousel"
import LatestProducts from "@/components/home/latest-products"
import ProductCard from "@/components/products/product-card"
import { getLatestProducts, getFeaturedProducts } from "@/lib/products"

const categories = [
  { name: "Electronics", href: "/products?category=Electronics", count: "2,500+ items" },
  { name: "Clothing", href: "/products?category=Clothing", count: "1,800+ items" },
  { name: "Smartphones", href: "/products?category=Smartphones", count: "500+ items" },
  { name: "Laptops", href: "/products?category=Laptops", count: "300+ items" },
  { name: "Shoes", href: "/products?category=Shoes", count: "750+ items" },
  { name: "Jeans", href: "/products?category=Jeans", count: "400+ items" },
]

export default async function HomePage() {
  const [latestProducts, featuredProducts] = await Promise.all([
    getLatestProducts(8),
    getFeaturedProducts(4),
  ])

  return (
    <div className="min-h-screen">
      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of products across different categories
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card key={category.name} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <Link href={category.href}>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.count}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hand-picked products that are trending and highly rated by our customers
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                categoryId: product.categoryId || product.category.id || "",
                stock: product.stock || 0,
                sku: product.sku || product.id,
                status: product.status || "ACTIVE",
                rating: product.averageRating || product.rating || 0,
                reviewCount: product._count?.reviews || product.reviewCount || 0,
                tags: product.tags || [],
                createdAt: product.createdAt || new Date(),
                updatedAt: product.updatedAt || new Date()
              }}
              showQuickActions={true}
              showAddToCart={true}
            />
          ))}
        </div>
      </section>

      {/* Latest Products */}
      <div className="container mx-auto px-4">
        <LatestProducts products={latestProducts} />
      </div>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Get exclusive access to new arrivals, special discounts, and personalized recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Sign Up Now
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 