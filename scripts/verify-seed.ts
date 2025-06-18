import { db } from '../lib/db'

async function verifySeededData() {
  try {
    console.log('🔍 Verifying seeded data...\n')

    // Get categories with their images
    const categories = await db.category.findMany({
      include: {
        children: true,
        _count: {
          select: { products: true }
        }
      }
    })

    console.log('📂 Categories:')
    categories.forEach((category) => {
      const indent = category.parentId ? '  └─ ' : '├─ '
      console.log(`${indent}${category.name} (${category._count.products} products)`)
      console.log(`    Image: ${category.image || 'No image'}`)
      console.log(`    Description: ${category.description}`)
      console.log('')
    })

    // Get products with their images and categories
    const products = await db.product.findMany({
      include: {
        category: {
          select: { name: true }
        },
        _count: {
          select: { reviews: true }
        }
      }
    })

    console.log('🛍️  Products:')
    products.forEach((product) => {
      console.log(`├─ ${product.name}`)
      console.log(`   Category: ${product.category.name}`)
      console.log(`   Price: $${product.price}${product.compareAtPrice ? ` (was $${product.compareAtPrice})` : ''}`)
      console.log(`   Stock: ${product.stock}`)
      console.log(`   Rating: ${product.rating}/5 (${product._count.reviews} reviews)`)
      console.log(`   Images: ${product.images.join(', ')}`)
      console.log(`   Tags: ${product.tags.join(', ')}`)
      console.log('')
    })

    // Get users
    const users = await db.user.findMany({
      select: {
        name: true,
        email: true,
        role: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
            addresses: true
          }
        }
      }
    })

    console.log('👥 Users:')
    users.forEach((user) => {
      console.log(`├─ ${user.name} (${user.email})`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Orders: ${user._count.orders}, Reviews: ${user._count.reviews}, Addresses: ${user._count.addresses}`)
      console.log('')
    })

    console.log('✅ Database verification completed!')

  } catch (error) {
    console.error('❌ Verification failed:', error)
  } finally {
    await db.$disconnect()
  }
}

verifySeededData() 