import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ShoppingCart, 
  ArrowRight,
  Package,
  Smartphone,
  Laptop,
  Shirt
} from "lucide-react"

export default function EmptyCart() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Empty Cart Illustration */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
              
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. 
                Start shopping to find great deals!
              </p>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="/products">
                    <Package className="mr-2 h-5 w-5" />
                    Start Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <div className="text-sm text-muted-foreground">
                  or browse by category below
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Quick Links */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
              <Link href="/products?category=Electronics">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Smartphone className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Electronics</h3>
                  <p className="text-sm text-muted-foreground">
                    Smartphones, laptops & more
                  </p>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
              <Link href="/products?category=Clothing">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Shirt className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Clothing</h3>
                  <p className="text-sm text-muted-foreground">
                    Fashion & accessories
                  </p>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
              <Link href="/products?sort=newest">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">New Arrivals</h3>
                  <p className="text-sm text-muted-foreground">
                    Latest products
                  </p>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* Recently Viewed or Recommendations */}
          <Card className="mt-8 border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-center">Why Shop With Us?</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-10 h-10 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $50</p>
                </div>
                
                <div>
                  <div className="w-10 h-10 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">SSL encrypted</p>
                </div>
                
                <div>
                  <div className="w-10 h-10 mx-auto mb-2 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30-day policy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 