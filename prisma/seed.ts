import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create test customer
  const customerPassword = await hash('customer123', 12)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'John Doe',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  })

  console.log('✅ Users created')

  // Create categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest electronic devices and gadgets',
      image: '/images/banner1.jpg',
    },
  })

  const smartphones = await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: {},
    create: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Latest smartphones and accessories',
      parentId: electronics.id,
      image: '/images/banner2.jpg',
    },
  })

  const laptops = await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: {},
    create: {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Laptops and portable computers',
      parentId: electronics.id,
      image: '/images/banner3.jpg',
    },
  })

  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel for all',
      image: '/images/c-tshirts.jpg',
    },
  })

  const shoes = await prisma.category.upsert({
    where: { slug: 'shoes' },
    update: {},
    create: {
      name: 'Shoes',
      slug: 'shoes',
      description: 'Footwear for all occasions',
      parentId: clothing.id,
      image: '/images/c-shoes.jpg',
    },
  })

  const jeans = await prisma.category.upsert({
    where: { slug: 'jeans' },
    update: {},
    create: {
      name: 'Jeans',
      slug: 'jeans',
      description: 'Denim and casual wear',
      parentId: clothing.id,
      image: '/images/c-jeans.jpg',
    },
  })

  console.log('✅ Categories created')

  // Create sample products
  const products = [
    {
      name: 'Premium Smartphone Pro',
      description: 'Latest flagship smartphone with advanced camera system and powerful performance. Features cutting-edge technology.',
      price: 999.99,
      compareAtPrice: 1099.99,
      images: ['/images/p11-1.jpg', '/images/p11-2.jpg'],
      categoryId: smartphones.id,
      stock: 50,
      sku: 'SMARTPHONE-PRO-128',
      status: 'ACTIVE' as const,
      rating: 4.8,
      reviewCount: 127,
      tags: ['smartphone', 'camera', 'flagship', 'premium'],
    },
    {
      name: 'Professional Laptop 14"',
      description: 'High-performance laptop with stunning display and all-day battery life. Perfect for work and creativity.',
      price: 1599.99,
      compareAtPrice: 1799.99,
      images: ['/images/p12-1.jpg', '/images/p12-2.jpg'],
      categoryId: laptops.id,
      stock: 25,
      sku: 'LAPTOP-PRO-14-512',
      status: 'ACTIVE' as const,
      rating: 4.9,
      reviewCount: 89,
      tags: ['laptop', 'professional', 'performance', 'productivity'],
    },
    {
      name: 'Ultra Smartphone Max',
      description: 'Ultimate smartphone with advanced AI features and incredible camera capabilities. The future in your hands.',
      price: 1199.99,
      images: ['/images/p21-1.jpg', '/images/p21-2.jpg'],
      categoryId: smartphones.id,
      stock: 40,
      sku: 'SMARTPHONE-ULTRA-256',
      status: 'ACTIVE' as const,
      rating: 4.7,
      reviewCount: 203,
      tags: ['smartphone', 'ultra', 'ai', 'camera'],
    },
    {
      name: 'Gaming Laptop Elite',
      description: 'Powerful gaming laptop with high-refresh display and premium cooling system. Built for performance.',
      price: 2299.99,
      compareAtPrice: 2599.99,
      images: ['/images/p22-1.jpg', '/images/p22-2.jpg'],
      categoryId: laptops.id,
      stock: 15,
      sku: 'LAPTOP-GAMING-ELITE',
      status: 'ACTIVE' as const,
      rating: 4.8,
      reviewCount: 156,
      tags: ['laptop', 'gaming', 'performance', 'elite'],
    },
    {
      name: 'Classic Denim Jeans',
      description: 'Premium quality denim jeans with perfect fit and comfort. Timeless style for everyday wear.',
      price: 89.99,
      compareAtPrice: 119.99,
      images: ['/images/p31-1.jpg', '/images/p31-2.jpg'],
      categoryId: jeans.id,
      stock: 100,
      sku: 'JEANS-CLASSIC-DENIM',
      status: 'ACTIVE' as const,
      rating: 4.5,
      reviewCount: 67,
      tags: ['jeans', 'denim', 'classic', 'comfort'],
    },
    {
      name: 'Running Shoes Pro',
      description: 'High-performance running shoes with advanced cushioning and breathable design. Perfect for athletes.',
      price: 159.99,
      images: ['/images/p32-1.jpg', '/images/p32-2.jpg'],
      categoryId: shoes.id,
      stock: 75,
      sku: 'SHOES-RUNNING-PRO',
      status: 'ACTIVE' as const,
      rating: 4.6,
      reviewCount: 243,
      tags: ['shoes', 'running', 'athletic', 'comfort'],
    },
  ]

  for (const productData of products) {
    await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: productData,
    })
  }

  console.log('✅ Products created')

  // Create sample address for customer
  await prisma.address.upsert({
    where: { id: 'sample-address-id' },
    update: {},
    create: {
      id: 'sample-address-id',
      firstName: 'John',
      lastName: 'Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true,
      userId: customer.id,
    },
  })

  console.log('✅ Sample address created')

  // Create sample reviews
  const sampleProducts = await prisma.product.findMany({ take: 3 })
  
  for (const product of sampleProducts) {
    await prisma.review.upsert({
      where: { 
        userId_productId: {
          userId: customer.id,
          productId: product.id,
        }
      },
      update: {},
      create: {
        rating: 5,
        comment: 'Great product! Highly recommended.',
        userId: customer.id,
        productId: product.id,
      },
    })
  }

  console.log('✅ Sample reviews created')

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📝 Test Accounts:')
  console.log('Admin: admin@example.com / admin123')
  console.log('Customer: customer@example.com / customer123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 