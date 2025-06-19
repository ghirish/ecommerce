"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import ProductGrid from "@/components/products/product-grid"
import ProductFilters from "@/components/products/product-filters"
import ProductPagination from "@/components/products/product-pagination"
import { Search, Filter, SlidersHorizontal, X } from "lucide-react"

interface FilterOptions {
  categories: string[]
  priceRange: [number, number]
  minRating: number
  inStock: boolean
  brands: string[]
  sortBy: string
}

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

function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 2000],
    minRating: 0,
    inStock: false,
    brands: [],
    sortBy: 'newest'
  })

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sort: filters.sortBy,
      })

      if (searchQuery.trim()) {
        params.set('q', searchQuery.trim())
      }
      if (filters.categories.length > 0) {
        params.set('categories', filters.categories.join(','))
      }
      if (filters.minRating > 0) {
        params.set('minRating', filters.minRating.toString())
      }
      if (filters.inStock) {
        params.set('inStock', 'true')
      }
      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) {
        params.set('priceMin', filters.priceRange[0].toString())
        params.set('priceMax', filters.priceRange[1].toString())
      }

      const response = await fetch(`/api/products?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const result = await response.json()
      setProducts(result.products || [])
      setTotalPages(result.totalPages || 0)
      setTotalItems(result.totalCount || 0)
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
      setTotalPages(0)
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }, [filters, searchQuery, currentPage, itemsPerPage])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Update URL with search params
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (searchQuery) {
      params.set('q', searchQuery)
    }
    if (currentPage > 1) {
      params.set('page', currentPage.toString())
    }
    if (itemsPerPage !== 12) {
      params.set('limit', itemsPerPage.toString())
    }
    if (filters.sortBy !== 'newest') {
      params.set('sort', filters.sortBy)
    }
    if (filters.categories.length > 0) {
      params.set('categories', filters.categories.join(','))
    }

    const queryString = params.toString()
    const newUrl = queryString ? `/products?${queryString}` : '/products'
    
    window.history.replaceState({}, '', newUrl)
  }, [searchQuery, currentPage, itemsPerPage, filters])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 2000],
      minRating: 0,
      inStock: false,
      brands: [],
      sortBy: 'newest'
    })
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy }))
    setCurrentPage(1)
  }

  const activeFiltersCount = 
    filters.categories.length + 
    filters.brands.length + 
    (filters.minRating > 0 ? 1 : 0) + 
    (filters.inStock ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000 ? 1 : 0)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Products</h1>
        
        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          
          <div className="flex items-center gap-4">
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile filter button */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <ProductFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                  totalProducts={totalItems}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active filters display */}
        {(searchQuery || activeFiltersCount > 0) && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setCurrentPage(1)
                  }}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {filters.categories.map(category => (
              <Badge key={category} variant="secondary" className="gap-1">
                {category}
                <button
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      categories: prev.categories.filter(c => c !== category)
                    }))
                    setCurrentPage(1)
                  }}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {filters.minRating > 0 && (
              <Badge variant="secondary" className="gap-1">
                {filters.minRating}+ Stars
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, minRating: 0 }))
                    setCurrentPage(1)
                  }}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.inStock && (
              <Badge variant="secondary" className="gap-1">
                In Stock
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, inStock: false }))
                    setCurrentPage(1)
                  }}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {(activeFiltersCount > 0 || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  handleClearFilters()
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              totalProducts={totalItems}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3 space-y-6">
          <ProductGrid
            products={products}
            loading={loading}
            emptyMessage={
              searchQuery
                ? `No products found for "${searchQuery}". Try adjusting your search or filters.`
                : "No products found. Try adjusting your filters."
            }
          />

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
        </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Products</h1>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
} 