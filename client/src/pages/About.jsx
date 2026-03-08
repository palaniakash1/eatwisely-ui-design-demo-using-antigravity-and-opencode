import { Card } from 'flowbite-react'

export default function About() {
  return (
    <div className="min-h-screen bg-[#f1f8eb]">
      <section className="bg-[#8fa31e] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About EatWisely</h1>
          <p className="text-xl">Empowering you to make informed food choices</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg mb-8">
            EatWisely was founded with a simple mission: to provide complete transparency 
            in the food industry. We believe that every consumer deserves to know exactly 
            what's in their food, where it comes from, and how it affects their health.
          </p>

          <h2 className="text-3xl font-bold mb-6">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <h3 className="text-xl font-bold mb-2">Restaurant Listings</h3>
              <p>Browse restaurants with detailed ingredient lists and nutritional information.</p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold mb-2">Verified Reviews</h3>
              <p>Read authentic reviews from verified users about food quality and transparency.</p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold mb-2">Allergen Tracking</h3>
              <p>Easy identification of allergens and dietary restrictions for safe dining.</p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold mb-2">Health Goals</h3>
              <p>Find restaurants that align with your specific dietary needs and health goals.</p>
            </Card>
          </div>

          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <p className="text-lg">
            Have questions or suggestions? We'd love to hear from you!
          </p>
          <p className="text-lg mt-4">
            Email: support@eatwisely.com
          </p>
        </div>
      </section>
    </div>
  )
}
