import { Link } from 'react-router-dom'
import { Card, Button } from 'flowbite-react'
import { HiArrowRight, HiStar } from 'react-icons/hi'
import restaurantsData from '../data/restaurants.json'
import RestaurantCard from '../components/RestaurantCard'

export default function Home() {
  const featuredRestaurants = restaurantsData.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#f1f8eb]">
      <section className="bg-[#8fa31e] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-red-500">Eat</span>
            <span className="text-white">Wisely</span>
          </h1>
          <p className="text-xl mb-8">Discover restaurants with complete ingredient transparency</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/restaurants"
              className="bg-white text-[#8fa31e] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              Browse Restaurants
            </Link>
            <Link
              to="/sign-up"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#8fa31e] transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Restaurants</h2>
          <Link to="/restaurants" className="text-[#8fa31e] font-semibold flex items-center gap-1 hover:underline">
            View All <HiArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant._id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose EatWisely?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="max-w-sm">
            <h3 className="text-xl font-bold mb-2">Ingredient Transparency</h3>
            <p>Know exactly what's in your food with detailed ingredient lists and allergen information.</p>
          </Card>
          <Card className="max-w-sm">
            <h3 className="text-xl font-bold mb-2">Verified Reviews</h3>
            <p>Read authentic reviews from real customers to make informed dining decisions.</p>
          </Card>
          <Card className="max-w-sm">
            <h3 className="text-xl font-bold mb-2">Easy Discovery</h3>
            <p>Find restaurants that match your dietary preferences and health goals.</p>
          </Card>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Eat Wisely?</h2>
          <p className="text-xl mb-8">Join thousands of users making healthier food choices</p>
          <Link
            to="/sign-up"
            className="bg-[#8fa31e] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#7a8c1a] transition"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  )
}
