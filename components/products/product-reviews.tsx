"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import StarRating from "@/components/ui/star-rating"
import { formatDate } from "@/utils/format"
import { MessageSquare, ThumbsUp, Flag } from "lucide-react"

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: Date
  user: {
    name: string
    avatar?: string
  }
  helpful: number
}

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export default function ProductReviews({
  productId,
  reviews,
  averageRating,
  totalReviews
}: ProductReviewsProps) {
  const { data: session } = useSession()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || newRating === 0) return

    setIsSubmitting(true)
    
    try {
      // TODO: Implement API call to submit review
      console.log("Submitting review:", {
        productId,
        rating: newRating,
        comment: newComment
      })
      
      // Reset form
      setNewRating(0)
      setNewComment("")
      setShowReviewForm(false)
      
      // TODO: Refresh reviews list
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0] // 1-5 stars
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        const index = review.rating - 1
        if (index >= 0 && index < distribution.length) {
          distribution[index]!++
        }
      }
    })
    return distribution.reverse() // Show 5 stars first
  }

  const ratingDistribution = getRatingDistribution()

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
        
        {totalReviews > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Overall Rating */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                <div>
                  <StarRating rating={averageRating} size="lg" />
                  <div className="text-sm text-muted-foreground">
                    Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((count, index) => {
                const stars = 5 - index
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                
                return (
                  <div key={stars} className="flex items-center gap-2 text-sm">
                    <span className="w-8">{stars}★</span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-muted-foreground">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">No reviews yet</h4>
            <p className="text-muted-foreground">
              Be the first to review this product!
            </p>
          </div>
        )}
      </div>

      <Separator />

      {/* Add Review Section */}
      <div>
        {session ? (
          <div className="space-y-4">
            {!showReviewForm ? (
              <Button onClick={() => setShowReviewForm(true)}>
                Write a Review
              </Button>
            ) : (
              <Card>
                <CardHeader>
                  <h4 className="font-semibold">Write Your Review</h4>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Rating *
                      </label>
                      <StarRating
                        rating={newRating}
                        interactive
                        onRatingChange={setNewRating}
                        size="lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Your Review
                      </label>
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts about this product..."
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={newRating === 0 || isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowReviewForm(false)
                          setNewRating(0)
                          setNewComment("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Sign in to write a review
            </p>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      {reviews.length > 0 && (
        <>
          <Separator />
          <div className="space-y-6">
            <h4 className="font-semibold">All Reviews ({reviews.length})</h4>
            
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="space-y-3">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.user.avatar} />
                      <AvatarFallback>
                        {review.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{review.user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      
                      {review.comment && (
                        <p className="text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                          <ThumbsUp className="h-4 w-4" />
                          Helpful ({review.helpful})
                        </button>
                        <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                          <Flag className="h-4 w-4" />
                          Report
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {review !== reviews[reviews.length - 1] && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
} 