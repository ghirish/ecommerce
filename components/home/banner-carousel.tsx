"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ShoppingBag, Smartphone, Laptop, Shirt, ArrowRight } from "lucide-react"

const banners = [
  {
    id: 1,
    title: "Electronics Sale",
    subtitle: "Up to 50% Off",
    description: "Get the latest smartphones, laptops, and gadgets at unbeatable prices",
    ctaText: "Shop Electronics",
    ctaLink: "/categories/electronics",
    background: "bg-gradient-to-r from-blue-600 to-purple-700",
    textColor: "text-white",
    icon: Smartphone,
    badge: "Limited Time",
    badgeColor: "bg-yellow-500 text-black"
  },
  {
    id: 2,
    title: "Fashion Week",
    subtitle: "New Arrivals",
    description: "Discover the latest trends in clothing, shoes, and accessories",
    ctaText: "Explore Fashion", 
    ctaLink: "/categories/clothing",
    background: "bg-gradient-to-r from-pink-500 to-orange-500",
    textColor: "text-white",
    icon: Shirt,
    badge: "Trending",
    badgeColor: "bg-green-500 text-white"
  },
  {
    id: 3,
    title: "Tech Essentials",
    subtitle: "Starting at $99",
    description: "Premium laptops and accessories for work and play",
    ctaText: "Shop Tech",
    ctaLink: "/categories/laptops", 
    background: "bg-gradient-to-r from-gray-800 to-gray-600",
    textColor: "text-white",
    icon: Laptop,
    badge: "Best Value",
    badgeColor: "bg-blue-500 text-white"
  },
  {
    id: 4,
    title: "Holiday Special",
    subtitle: "Free Shipping",
    description: "On all orders over $50. No code needed, discount applied at checkout",
    ctaText: "Start Shopping",
    ctaLink: "/products",
    background: "bg-gradient-to-r from-emerald-600 to-teal-600",
    textColor: "text-white", 
    icon: ShoppingBag,
    badge: "Free Ship",
    badgeColor: "bg-red-500 text-white"
  }
]

export default function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative w-full">
      <Carousel className="w-full">
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id}>
              <div className={`relative ${banner.background} overflow-hidden`}>
                <div className="container mx-auto px-4 py-16 md:py-24">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Content */}
                    <div className={`space-y-6 ${banner.textColor}`}>
                      <div className="space-y-2">
                        <Badge className={`${banner.badgeColor} font-semibold`}>
                          {banner.badge}
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                          {banner.title}
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-semibold opacity-90">
                          {banner.subtitle}
                        </h2>
                      </div>
                      
                      <p className="text-lg md:text-xl opacity-80 max-w-lg">
                        {banner.description}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          size="lg" 
                          className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                          asChild
                        >
                          <Link href={banner.ctaLink}>
                            {banner.ctaText}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="border-white text-white hover:bg-white hover:text-gray-900"
                          asChild
                        >
                          <Link href="/products">
                            View All Products
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Icon/Visual */}
                    <div className="hidden lg:flex justify-center items-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl scale-150"></div>
                        <banner.icon className="relative h-48 w-48 text-white/80" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="left-4 bg-white/20 border-white/30 text-white hover:bg-white/30" />
        <CarouselNext className="right-4 bg-white/20 border-white/30 text-white hover:bg-white/30" />
      </Carousel>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
} 