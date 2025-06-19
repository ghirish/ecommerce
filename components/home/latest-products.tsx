import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import ProductCard from "@/components/products/product-card"

interface Product {
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

interface LatestProductsProps {
  products: Product[]
}

export default function LatestProducts({ products }: LatestProductsProps) {
  if (!products.length) {
    return null
  }

  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Latest Products</h2>
          <p className="text-muted-foreground">
            Discover our newest arrivals and trending items
          </p>
        </div>
        
        <Button variant="outline" asChild className="hidden sm:flex">
          <Link href="/products?sort=newest">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
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