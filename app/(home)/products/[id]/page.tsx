import { notFound } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductImageGallery from "@/components/products/product-image-gallery"
import ProductInfo from "@/components/products/product-info"
import ProductReviews from "@/components/products/product-reviews"
import RelatedProducts from "@/components/products/related-products"
import { getProductById, getRelatedProducts } from "@/lib/products"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  // Get related products from the same category
  const relatedProducts = await getRelatedProducts(
    product.id, 
    product.categoryId, 
    8
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 py-4 max-w-7xl">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground transition-colors">
              Home
            </a>
            <span>/</span>
            <a href="/products" className="hover:text-foreground transition-colors">
              Products
            </a>
            <span>/</span>
            <a 
              href={`/products?category=${encodeURIComponent(product.category.name)}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </a>
            <span>/</span>
            <span className="text-foreground font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-16 py-8 max-w-7xl">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 mb-16">
          {/* Product Images */}
          <div className="space-y-4 lg:px-4">
            <ProductImageGallery 
              images={product.images} 
              productName={product.name}
            />
          </div>

          {/* Product Information */}
          <div className="space-y-6 lg:px-4">
            <ProductInfo product={product} />
          </div>
        </div>

        <Separator className="my-12" />

        {/* Product Details and Reviews */}
        <div className="mb-16 px-4 md:px-8">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.reviewCount})
              </TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                {product.description ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Product Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                    
                    {/* Additional product details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="space-y-2">
                        <h4 className="font-medium">Product Details</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>SKU: {product.sku}</li>
                          <li>Category: {product.category.name}</li>
                          <li>Stock: {product.stock} available</li>
                          <li>Rating: {product.averageRating?.toFixed(1) || 'No ratings yet'}</li>
                        </ul>
                      </div>
                      
                      {product.tags.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-muted text-xs rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No description available for this product.
                  </p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <ProductReviews
                productId={product.id}
                reviews={product.reviews}
                averageRating={product.averageRating || 0}
                totalReviews={product.reviewCount}
              />
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Product Specifications</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">General Information</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Brand:</dt>
                          <dd className="font-medium">Generic</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Model:</dt>
                          <dd className="font-medium">{product.sku}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Category:</dt>
                          <dd className="font-medium">{product.category.name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Weight:</dt>
                          <dd className="font-medium">N/A</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Purchase Information</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Warranty:</dt>
                          <dd className="font-medium">1 Year</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Return Policy:</dt>
                          <dd className="font-medium">30 Days</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Shipping:</dt>
                          <dd className="font-medium">Free over $50</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Availability:</dt>
                          <dd className="font-medium">
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <>
            <Separator className="my-12" />
            <div className="px-4 md:px-8">
              <RelatedProducts 
                products={relatedProducts}
                currentProductId={product.id}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
  }

  return {
    title: `${product.name} | Ecommerce Store`,
    description: product.description || `Buy ${product.name} online. High quality products at great prices.`,
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} online`,
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
  }
} 