"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Filter, 
  Star, 
  X, 
  ChevronDown, 
  ChevronRight,
  Smartphone,
  Laptop,
  Shirt,
  Footprints
} from "lucide-react"
import { formatPrice } from "@/utils/format"

interface FilterOptions {
  categories: string[]
  priceRange: [number, number]
  minRating: number
  inStock: boolean
  brands: string[]
  sortBy: string
}

interface ProductFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onClearFilters: () => void
  totalProducts: number
}

const categories = [
  { name: "Electronics", icon: Smartphone, count: 156 },
  { name: "Clothing", icon: Shirt, count: 234 },
  { name: "Smartphones", icon: Smartphone, count: 89 },
  { name: "Laptops", icon: Laptop, count: 67 },
  { name: "Jeans", icon: Shirt, count: 45 },
  { name: "Shoes", icon: Footprints, count: 123 },
]

const brands = [
  { name: "Apple", count: 45 },
  { name: "Nike", count: 67 },
  { name: "Samsung", count: 34 },
  { name: "Adidas", count: 23 },
  { name: "Sony", count: 12 },
  { name: "Levi's", count: 18 },
]

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
]

export default function ProductFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  totalProducts
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    brands: false,
    availability: true
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category)
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    })
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter(b => b !== brand)
    
    onFiltersChange({
      ...filters,
      brands: newBrands
    })
  }

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0] || 0, value[1] || 2000]
    })
  }

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      minRating: rating
    })
  }

  const activeFiltersCount = 
    filters.categories.length + 
    filters.brands.length + 
    (filters.minRating > 0 ? 1 : 0) + 
    (filters.inStock ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000 ? 1 : 0)

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        {totalProducts} products found
      </div>

      {/* Categories */}
      <Card>
        <CardHeader 
          className="pb-3 cursor-pointer" 
          onClick={() => toggleSection('categories')}
        >
          <CardTitle className="flex items-center justify-between text-sm">
            Categories
            {expandedSections.categories ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </CardTitle>
        </CardHeader>
        {expandedSections.categories && (
          <CardContent className="pt-0 space-y-3">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.name}`}
                    checked={filters.categories.includes(category.name)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category.name, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`category-${category.name}`}
                    className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    <category.icon className="h-4 w-4" />
                    {category.name}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground">
                  {category.count}
                </span>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader 
          className="pb-3 cursor-pointer" 
          onClick={() => toggleSection('price')}
        >
          <CardTitle className="flex items-center justify-between text-sm">
            Price Range
            {expandedSections.price ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </CardTitle>
        </CardHeader>
        {expandedSections.price && (
          <CardContent className="pt-0 space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={handlePriceRangeChange}
              max={2000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm">
              <span>{formatPrice(filters.priceRange[0])}</span>
              <span>{formatPrice(filters.priceRange[1])}</span>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader 
          className="pb-3 cursor-pointer" 
          onClick={() => toggleSection('rating')}
        >
          <CardTitle className="flex items-center justify-between text-sm">
            Customer Rating
            {expandedSections.rating ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </CardTitle>
        </CardHeader>
        {expandedSections.rating && (
          <CardContent className="pt-0 space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div 
                key={rating} 
                className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded"
                onClick={() => handleRatingChange(rating)}
              >
                <Checkbox
                  checked={filters.minRating === rating}
                />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm ml-1">& up</span>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader 
          className="pb-3 cursor-pointer" 
          onClick={() => toggleSection('brands')}
        >
          <CardTitle className="flex items-center justify-between text-sm">
            Brands
            {expandedSections.brands ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </CardTitle>
        </CardHeader>
        {expandedSections.brands && (
          <CardContent className="pt-0 space-y-3">
            {brands.map((brand) => (
              <div key={brand.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.name}`}
                    checked={filters.brands.includes(brand.name)}
                    onCheckedChange={(checked) => 
                      handleBrandChange(brand.name, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`brand-${brand.name}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {brand.name}
                  </label>
                </div>
                <span className="text-xs text-muted-foreground">
                  {brand.count}
                </span>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader 
          className="pb-3 cursor-pointer" 
          onClick={() => toggleSection('availability')}
        >
          <CardTitle className="flex items-center justify-between text-sm">
            Availability
            {expandedSections.availability ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </CardTitle>
        </CardHeader>
        {expandedSections.availability && (
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={(checked) => 
                  onFiltersChange({
                    ...filters,
                    inStock: checked as boolean
                  })
                }
              />
              <label
                htmlFor="in-stock"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                In Stock Only
              </label>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
} 