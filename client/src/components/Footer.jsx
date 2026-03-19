import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="text-3xl font-black">
                <span className="text-red-500">Eat</span>
                <span className="text-[#8fa31e]">Wisely</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              Discover restaurants with complete ingredient transparency. 
              Eat wisely, live healthier.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[#8fa31e] transition">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#8fa31e] transition">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#8fa31e] transition">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#8fa31e] transition">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-[#8fa31e]">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className="text-gray-400 hover:text-white transition">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/sign-up" className="text-gray-400 hover:text-white transition">
                  Join Now
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-[#8fa31e]">For Restaurants</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/sign-up" className="text-gray-400 hover:text-white transition">
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link to="/sign-up" className="text-gray-400 hover:text-white transition">
                  Advertise
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Restaurant Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-[#8fa31e]">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>support@eatwisely.com</li>
              <li>+44 123 456 7890</li>
              <li>London, United Kingdom</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 EatWisely. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/" className="text-gray-400 hover:text-white text-sm transition">
                Privacy Policy
              </Link>
              <Link to="/" className="text-gray-400 hover:text-white text-sm transition">
                Terms of Service
              </Link>
              <Link to="/" className="text-gray-400 hover:text-white text-sm transition">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
