import { db } from "@/lib/db"

interface SearchFilters {
  categories?: string[]
  priceRange?: [number, number]
  minRating?: number
  inStock?: boolean
  brands?: string[]
  sortBy?: string
  searchQuery?: string
}

interface PaginationOptions {
  page: number
  limit: number
}

export async function getLatestProducts(limit: number = 8) {
  try {
    const products = await db.product.findMany({
      where: {
        status: 'ACTIVE'
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    })

    // Calculate average rating for each product
    const productsWithRating = await Promise.all(
      products.map(async (product: any) => {
        const ratings = await db.review.findMany({
          where: { productId: product.id },
          select: { rating: true }
        })

        const averageRating = ratings.length > 0 
          ? ratings.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0) / ratings.length
          : 0

        return {
          ...product,
          averageRating: averageRating > 0 ? Number(averageRating.toFixed(1)) : undefined
        }
      })
    )

    return productsWithRating
  } catch (error) {
    console.error('Error fetching latest products:', error)
    return []
  }
}

export async function getFeaturedProducts(limit: number = 4) {
  try {
    const products = await db.product.findMany({
      where: {
        status: 'ACTIVE'
      },
      take: limit,
      orderBy: [
        { createdAt: 'desc' },
        { name: 'asc' }
      ],
      include: {
        category: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    })

    // Calculate average rating for each product
    const productsWithRating = await Promise.all(
      products.map(async (product: any) => {
        const ratings = await db.review.findMany({
          where: { productId: product.id },
          select: { rating: true }
        })

        const averageRating = ratings.length > 0 
          ? ratings.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0) / ratings.length
          : 0

        return {
          ...product,
          averageRating: averageRating > 0 ? Number(averageRating.toFixed(1)) : undefined
        }
      })
    )

    return productsWithRating
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

export async function getProductsByCategory(categoryName: string, limit: number = 8) {
  try {
    const products = await db.product.findMany({
      take: limit,
      where: {
        status: 'ACTIVE',
        category: {
          name: {
            equals: categoryName,
            mode: 'insensitive'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    })

    // Calculate average rating for each product
    const productsWithRating = await Promise.all(
      products.map(async (product: any) => {
        const ratings = await db.review.findMany({
          where: { productId: product.id },
          select: { rating: true }
        })

        const averageRating = ratings.length > 0 
          ? ratings.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0) / ratings.length
          : 0

        return {
          ...product,
          averageRating: averageRating > 0 ? Number(averageRating.toFixed(1)) : undefined
        }
      })
    )

    return productsWithRating
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
}

export async function searchProducts(
  filters: SearchFilters = {},
  pagination: PaginationOptions = { page: 1, limit: 12 }
) {
  try {
    const {
      categories = [],
      priceRange,
      minRating = 0,
      inStock = false,
      brands = [],
      sortBy = 'newest',
      searchQuery = ''
    } = filters

    const { page, limit } = pagination
    const skip = (page - 1) * limit

    // Build where clause
    const whereClause: any = {
      status: 'ACTIVE' // Only show active products
    }

    // Search query
    if (searchQuery) {
      whereClause.OR = [
        {
          name: {
            contains: searchQuery,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: searchQuery,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Categories filter
    if (categories.length > 0) {
      whereClause.category = {
        name: {
          in: categories
        }
      }
    }

    // Price range filter
    if (priceRange) {
      whereClause.price = {
        gte: priceRange[0],
        lte: priceRange[1]
      }
    }

    // In stock filter
    if (inStock) {
      whereClause.stock = {
        gt: 0
      }
    }

    // Build order by clause
    let orderBy: any = {}
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'price-low':
        orderBy = { price: 'asc' }
        break
      case 'price-high':
        orderBy = { price: 'desc' }
        break
      case 'rating':
        // We'll handle this after getting the data since rating is calculated
        orderBy = { createdAt: 'desc' }
        break
      case 'popular':
        orderBy = { createdAt: 'desc' } // Could be based on views/purchases in the future
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      db.product.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: {
              name: true
            }
          },
          _count: {
            select: {
              reviews: true
            }
          }
        }
      }),
      db.product.count({
        where: whereClause
      })
    ])

    // Calculate average rating for each product and apply rating filter
    let productsWithRating = await Promise.all(
      products.map(async (product: any) => {
        const ratings = await db.review.findMany({
          where: { productId: product.id },
          select: { rating: true }
        })

        const averageRating = ratings.length > 0 
          ? ratings.reduce((acc: number, review: { rating: number }) => acc + review.rating, 0) / ratings.length
          : 0

        return {
          ...product,
          averageRating: averageRating > 0 ? Number(averageRating.toFixed(1)) : undefined
        }
      })
    )

    // Apply rating filter after calculation
    if (minRating > 0) {
      productsWithRating = productsWithRating.filter(
        product => (product.averageRating || 0) >= minRating
      )
    }

    // Apply rating sort if needed
    if (sortBy === 'rating') {
      productsWithRating.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    }

    const totalPages = Math.ceil(totalCount / limit)

    return {
      products: productsWithRating,
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  } catch (error) {
    console.error('Error searching products:', error)
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false
    }
  }
}

export async function getCategories() {
  try {
    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return categories.map(category => ({
      ...category,
      count: category._count.products
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Get product by ID with full details
export async function getProductById(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!product) {
      return null
    }

    // Calculate average rating and review count
    const totalReviews = product.reviews.length
    const averageRating = totalReviews > 0 
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0

    // Transform reviews
    const transformedReviews = product.reviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment || '',
      createdAt: review.createdAt,
      user: {
        name: review.user.name || 'Anonymous',
        avatar: review.user.avatar || undefined
      },
      helpful: 0 // TODO: Add helpful votes to schema
    }))

    return {
      ...product,
      averageRating,
      reviewCount: totalReviews,
      reviews: transformedReviews
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Get related products from same category
export async function getRelatedProducts(productId: string, categoryId: string, limit: number = 8) {
  try {
    const relatedProducts = await db.product.findMany({
      where: {
        categoryId,
        id: {
          not: productId // Exclude current product
        }
      },
      include: {
        category: true,
        reviews: true
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform products with ratings
    return relatedProducts.map(product => {
      const totalReviews = product.reviews.length
      const averageRating = totalReviews > 0 
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        category: {
          name: product.category.name
        },
        averageRating,
        reviewCount: totalReviews,
        stock: product.stock
      }
    })
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
} 