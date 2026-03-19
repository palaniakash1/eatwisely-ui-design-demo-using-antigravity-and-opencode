import { useState } from 'react'
import { Card, Button, TextInput, Label, Textarea, Rating } from 'flowbite-react'
import { HiStar, HiPencil, HiTrash, HiSearch } from 'react-icons/hi'

export default function UserReviews() {
  const [reviews, setReviews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredReviews = reviews.filter(review =>
    review.restaurant?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
      </div>

      <Card className="mb-6">
        <TextInput
          type="text"
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={HiSearch}
        />
      </Card>

      <Card>
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiStar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-500 mb-4">Start exploring restaurants and share your experience!</p>
            <Button className="bg-[#8fa31e]" href="/restaurants">
              Browse Restaurants
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{review.restaurant}</h3>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <HiStar 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                <div className="flex gap-2">
                  <Button size="xs" color="blue">
                    <HiPencil className="mr-1" /> Edit
                  </Button>
                  <Button size="xs" color="failure">
                    <HiTrash className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
