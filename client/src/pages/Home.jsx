import { Link } from 'react-router-dom';
import { Button, Card } from 'flowbite-react';
import {
  HiArrowRight,
  HiStar,
  HiFire,
  HiGift,
  HiSparkles,
  HiShieldCheck,
  HiCurrencyDollar,
  HiTruck,
  HiUserGroup
} from 'react-icons/hi';
import restaurantsData from '../data/restaurants.json';
import RestaurantCard from '../components/RestaurantCard';

const banners = [
  {
    id: 1,
    title: 'Flat 50% OFF',
    subtitle: 'On Your First Order',
    description: 'Use code: FIRST50',
    bg: 'bg-gradient-to-r from-red-500 to-red-700',
    cta: 'Order Now'
  },
  {
    id: 2,
    title: 'Free Delivery',
    subtitle: 'On Orders Above £30',
    description: 'No delivery fees',
    bg: 'bg-gradient-to-r from-[#8fa31e] to-emerald-600',
    cta: 'Explore Restaurants'
  },
  {
    id: 3,
    title: 'Weekend Special',
    subtitle: 'Buy 1 Get 1 Free',
    description: 'Selected restaurants only',
    bg: 'bg-gradient-to-r from-red-600 to-pink-600',
    cta: 'Grab Deal'
  }
];

const exclusiveOffers = [
  {
    id: 1,
    code: 'EAT20',
    discount: '20% OFF',
    minOrder: '£15+',
    title: 'Italian Night'
  },
  {
    id: 2,
    code: 'ASIAN10',
    discount: '£10 OFF',
    minOrder: '£40+',
    title: 'Asian Cuisine'
  },
  {
    id: 3,
    code: 'BBQ50',
    discount: '50% OFF',
    minOrder: '£25+',
    title: 'BBQ Special'
  },
  {
    id: 4,
    code: 'HEALTHY',
    discount: '15% OFF',
    minOrder: '£20+',
    title: 'Healthy Eats'
  }
];

const foodCategories = [
  {
    id: 1,
    name: 'Burgers',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    count: '120+'
  },
  {
    id: 2,
    name: 'Pizza',
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    count: '85+'
  },
  {
    id: 3,
    name: 'Sushi',
    image:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop',
    count: '65+'
  },
  {
    id: 4,
    name: 'Indian',
    image:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    count: '95+'
  },
  {
    id: 5,
    name: 'Chinese',
    image:
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
    count: '110+'
  },
  {
    id: 6,
    name: 'Mexican',
    image:
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
    count: '45+'
  }
];

const legendaryBrands = [
  {
    id: 1,
    name: 'The Golden Fork',
    cuisine: 'Fine Dining',
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    featured: true
  },
  {
    id: 2,
    name: 'Spice Garden',
    cuisine: 'Indian',
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    featured: true
  },
  {
    id: 3,
    name: 'Dragon Palace',
    cuisine: 'Chinese',
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop',
    featured: true
  },
  {
    id: 4,
    name: 'Bella Italia',
    cuisine: 'Italian',
    rating: 4.6,
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    featured: false
  }
];

const whyChooseUs = [
  {
    icon: HiShieldCheck,
    title: 'Verified Restaurants',
    desc: 'All restaurants verified for quality & hygiene'
  },
  {
    icon: HiCurrencyDollar,
    title: 'Best Prices',
    desc: 'Exclusive deals & discounts every day'
  },
  {
    icon: HiTruck,
    title: 'Fast Delivery',
    desc: 'Hot food delivered in 30 minutes'
  },
  {
    icon: HiUserGroup,
    title: '10M+ Users',
    desc: 'Trusted by millions worldwide'
  }
];

export default function Home() {
  const featuredRestaurants = restaurantsData.slice(0, 4);
  const popularRestaurants = restaurantsData.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Banner Carousel */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-amber-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#8fa31e]/20 text-[#8fa31e] px-4 py-2 rounded-full text-sm font-medium mb-6">
                <HiSparkles className="w-4 h-4" />
                #1 Food Discovery Platform
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                Discover
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-500">
                  Deliciousness
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                Explore thousands of restaurants, order your favorite food, and
                enjoy exclusive deals. Your next culinary adventure starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/restaurants"
                  className="bg-[#8fa31e] text-white px-8 py-4 rounded-full font-bold hover:bg-[#7a8c1a] transition shadow-lg shadow-[#8fa31e]/30"
                >
                  Explore Restaurants
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-full font-bold hover:bg-white/20 transition"
                >
                  Join Free
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 justify-center lg:justify-start">
                <div>
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-gray-400 text-sm">Restaurants</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-gray-400 text-sm">Reviews</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">1M+</div>
                  <div className="text-gray-400 text-sm">Orders</div>
                </div>
              </div>
            </div>

            {/* Hero Banner Cards */}
            <div className="grid gap-4">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className={`${banner.bg} p-6 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white/90 text-sm font-medium mb-1">
                        {banner.subtitle}
                      </div>
                      <div className="text-3xl font-black text-white">
                        {banner.title}
                      </div>
                      <div className="text-white/80 text-sm mt-1">
                        {banner.description}
                      </div>
                    </div>
                    <Link
                      to="/restaurants"
                      className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition"
                    >
                      {banner.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Exclusive For You - Offers Section */}
      <section className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <HiGift className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              Exclusively For You
            </h2>
            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold">
              LIMITED
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {exclusiveOffers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-dashed border-red-200 hover:border-red-400 transition group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-red-600 text-xs font-bold uppercase tracking-wider">
                      {offer.title}
                    </div>
                    <div className="text-3xl font-black text-gray-900 mt-1">
                      {offer.discount}
                    </div>
                  </div>
                  <div className="bg-red-100 p-2 rounded-lg">
                    <HiGift className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <code className="text-lg font-bold text-gray-700">
                      {offer.code}
                    </code>
                    <span className="text-xs text-gray-500">
                      Min. {offer.minOrder}
                    </span>
                  </div>
                </div>
                <Link
                  to="/restaurants"
                  className="block text-center bg-red-600 text-white py-2 rounded-lg font-semibold group-hover:bg-red-700 transition"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Our Best Food Options */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Order Our Best Food Options
              </h2>
              <p className="text-gray-500 mt-1">
                Browse by your favorite cuisines
              </p>
            </div>
            <Link
              to="/restaurants"
              className="text-[#8fa31e] font-semibold flex items-center gap-1 hover:underline"
            >
              View All <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {foodCategories.map((category) => (
              <Link
                key={category.id}
                to="/restaurants"
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
              >
                <div className="aspect-square">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-white font-bold text-lg">
                    {category.name}
                  </div>
                  <div className="text-white/70 text-sm">
                    {category.count} restaurants
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Legendary Restaurant Brands */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <HiStar className="w-4 h-4" />
              Top Rated
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Our Legendary Restaurant Brands
            </h2>
            <p className="text-gray-500 mt-2">
              Experience culinary excellence at these renowned establishments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {legendaryBrands.map((brand) => (
              <div
                key={brand.id}
                className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group ${brand.featured ? 'ring-2 ring-red-400' : ''}`}
              >
                <div className="relative h-48">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {brand.featured && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                      FEATURED
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <HiStar className="w-4 h-4 text-red-500" />
                    {brand.rating}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-sm text-[#8fa31e] font-medium mb-1">
                    {brand.cuisine}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {brand.name}
                  </h3>
                  <Link
                    to="/restaurants"
                    className="block text-center border-2 border-[#8fa31e] text-[#8fa31e] py-2 rounded-lg font-semibold group-hover:bg-[#8fa31e] group-hover:text-white transition"
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discover Best Restaurants on Dineout */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <HiFire className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              Discover Best Restaurants
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Featured Card */}
            <div className="md:col-span-2 relative rounded-3xl overflow-hidden h-[400px] group">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
                alt="Featured"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-3">
                  TRENDING NOW
                </div>
                <h3 className="text-3xl font-black text-white mb-2">
                  The Grand Bistro
                </h3>
                <p className="text-white/80 mb-4">
                  Experience the finest dining with our award-winning chefs
                </p>
                <Link
                  to="/restaurants"
                  className="inline-flex items-center gap-2 bg-[#8fa31e] text-white px-6 py-3 rounded-full font-bold hover:bg-[#7a8c1a] transition"
                >
                  Explore <HiArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Side Cards */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden h-[190px] group">
                <img
                  src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop"
                  alt="Quick Bites"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h4 className="text-xl font-bold text-white">Quick Bites</h4>
                  <p className="text-white/70 text-sm">Fast & delicious</p>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden h-[190px] group">
                <img
                  src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=300&fit=crop"
                  alt="Coffee & Drinks"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h4 className="text-xl font-bold text-white">
                    Coffee & Drinks
                  </h4>
                  <p className="text-white/70 text-sm">Refreshing beverages</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Popular Restaurants
              </h2>
              <p className="text-gray-500 mt-1">
                Order from the most loved restaurants
              </p>
            </div>
            <Link
              to="/restaurants"
              className="text-[#8fa31e] font-semibold flex items-center gap-1 hover:underline"
            >
              View All <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#8fa31e] to-emerald-600 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <HiStar className="w-4 h-4" />
                  Editor's Choice
                </div>
                <h2 className="text-4xl font-black text-white mb-4">
                  Featured Restaurants
                </h2>
                <p className="text-white/80 text-lg mb-8">
                  Hand-picked selection of the finest restaurants offering
                  exceptional dining experiences, curated just for you.
                </p>
                <Link
                  to="/restaurants"
                  className="inline-flex items-center gap-2 bg-white text-[#8fa31e] px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition"
                >
                  View All Featured <HiArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {featuredRestaurants.slice(0, 4).map((restaurant, idx) => (
                  <div
                    key={restaurant._id}
                    className="bg-white rounded-2xl p-4 shadow-lg"
                  >
                    <img
                      src={
                        restaurant.coverImage ||
                        'https://images.unsplash.com/photo-1562564055-71e051d33c19?w=200&h=150&fit=crop'
                      }
                      alt={restaurant.name}
                      className="w-full h-24 object-cover rounded-xl mb-3"
                    />
                    <div className="font-bold text-gray-900 text-sm truncate">
                      {restaurant.name}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {restaurant.categories?.[0] || 'Restaurant'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Offers Banner */}
      <section className="py-16 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 text-white text-9xl font-black rotate-12">
            50%
          </div>
          <div className="absolute bottom-10 right-20 text-white text-8xl font-black -rotate-12">
            OFF
          </div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Latest Offers
          </h2>
          <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
            Don't miss out on these exclusive deals! Save big on your favorite
            cuisines.
          </p>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition shadow-xl"
          >
            Grab All Offers <HiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose EatWisely?
            </h2>
            <p className="text-gray-500 mt-2">
              We're committed to delivering the best food experience
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-2xl hover:bg-gray-50 transition"
              >
                <div className="w-16 h-16 bg-[#8fa31e]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-[#8fa31e]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8fa31e] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to <span className="text-[#8fa31e]">Eat Wisely</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join millions of happy customers and discover the best restaurants
            in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/sign-up"
              className="bg-[#8fa31e] text-white px-10 py-4 rounded-full font-bold hover:bg-[#7a8c1a] transition shadow-lg shadow-[#8fa31e]/30"
            >
              Get Started Free
            </Link>
            <Link
              to="/restaurants"
              className="bg-white/10 backdrop-blur-sm text-white border border-white/30 px-10 py-4 rounded-full font-bold hover:bg-white/20 transition"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
