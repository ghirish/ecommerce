"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/components/products/product-grid"
import ProductPagination from "@/components/products/product-pagination"
import { ArrowLeft, Search } from "lucide-react"

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

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams?.get('q') || ''
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 12

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setProducts([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          q: query.trim()
        })

        const response = await fetch(`/api/products?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch search results')
        }
        
        const result = await response.json()
        // Transform API response to match our Product interface
        const transformedProducts = (result.products || []).map((product: any) => ({
          ...product,
          categoryId: product.categoryId || product.category?.id || "",
          stock: product.stock || 0,
          sku: product.sku || product.id,
          status: product.status || "ACTIVE",
          rating: product.averageRating || product.rating || 0,
          reviewCount: product._count?.reviews || product.reviewCount || 0,
          tags: product.tags || [],
          createdAt: product.createdAt ? new Date(product.createdAt) : new Date(),
          updatedAt: product.updatedAt ? new Date(product.updatedAt) : new Date()
        }))
        setProducts(transformedProducts)
        setTotalPages(result.totalPages || 0)
        setTotalItems(result.totalCount || 0)
      } catch (error) {
        console.error('Error fetching search results:', error)
        setProducts([])
        setTotalPages(0)
        setTotalItems(0)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    // For search results, we'll redirect to the main products page with filters
    const params = new URLSearchParams()
    params.set('q', query)
    params.set('limit', newItemsPerPage.toString())
    window.location.href = `/products?${params.toString()}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Search className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-3xl md:text-4xl font-bold">
            Search Results
          </h1>
        </div>

        {query && (
          <div className="mb-6">
            <p className="text-lg text-muted-foreground">
              Showing results for: <span className="font-semibold text-foreground">"{query}"</span>
            </p>
            {!loading && (
              <p className="text-sm text-muted-foreground mt-1">
                {totalItems} {totalItems === 1 ? 'product' : 'products'} found
              </p>
            )}
          </div>
        )}

        {!query && (
          <div className="text-center py-16">
            <div className="bg-muted/30 rounded-full p-6 mb-4 inline-flex">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Search Query</h2>
            <p className="text-muted-foreground mb-6">
              Please enter a search term to find products.
            </p>
            <Button asChild>
              <Link href="/products">
                Browse All Products
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      {query && (
        <>
          <div className="mb-6">
            <ProductGrid
              products={products}
              loading={loading}
              emptyMessage={`No products found for "${query}". Try a different search term or browse our categories.`}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <ProductPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}

          {/* Advanced Search CTA */}
          {!loading && totalItems > 0 && (
            <div className="mt-12 text-center">
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Want more control over your search?</h3>
                <p className="text-muted-foreground mb-4">
                  Use our advanced filters to find exactly what you're looking for.
                </p>
                <Button asChild>
                  <Link href={`/products?q=${encodeURIComponent(query)}`}>
                    Advanced Search & Filters
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-4">
          <Search className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-3xl md:text-4xl font-bold">
            Search Results
          </h1>
        </div>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
} 