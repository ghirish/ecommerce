import ProductCard from "@/components/products/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"

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
  )
} 