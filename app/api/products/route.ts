import { NextRequest, NextResponse } from 'next/server'
import { searchProducts } from '@/lib/products'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const searchQuery = searchParams.get('q') || ''
    const sortBy = searchParams.get('sort') || 'newest'
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || []
    const minRating = parseInt(searchParams.get('minRating') || '0')
    const inStock = searchParams.get('inStock') === 'true'
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    
    // Build filters object
    const filters: any = {
      searchQuery,
      sortBy,
      categories,
      minRating,
      inStock
    }
    
    // Add price range if provided
    if (priceMin && priceMax) {
      filters.priceRange = [parseFloat(priceMin), parseFloat(priceMax)]
    }
    
    // Call the server-side function
    const result = await searchProducts(filters, { page, limit })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
} 