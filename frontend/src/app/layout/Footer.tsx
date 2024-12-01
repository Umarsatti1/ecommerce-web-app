import { Instagram, Twitter } from '@mui/icons-material'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailIcon from '@mui/icons-material/Mail';
import { Link } from 'react-router-dom'

const shoppingLinks = [
  { title: 'Clothing Store', href: '/clothing' },
  { title: 'Trending Shoes', href: '/shoes' },
  { title: 'Accessories', href: '/accessories' },
  { title: 'Sale', href: '/sale' },
]

const customerLinks = [
  { title: 'Contact Us', href: '/contact' },
  { title: 'Payment Methods', href: '/payment' },
  { title: 'Delivery', href: '/delivery' },
  { title: 'Return & Exchanges', href: '/returns' },
]

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-[15%] pt-12 pb-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">E-Commerce</h2>
            <p className="text-gray-300">
              The customer is at the heart of our unique business model, which includes design and fashion.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <LinkedInIcon className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Shopping Column */}
          <div className="space-y-4 pl-11 lg:pr-8">
            <h3 className="text-lg font-semibold">SHOPPING</h3>
            <ul className="space-y-2">
              {shoppingLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Column */}
          <div className="space-y-4 pr-11 lg:pl-8">
            <h3 className="text-lg font-semibold">CUSTOMER</h3>
            <ul className="space-y-2">
              {customerLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">NEWSLETTER</h3>
            <p className="text-gray-300">
              Be the first to know about new arrivals, look books, sales & promos!
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-transparent border-b border-gray-600 py-2 pr-10 text-white placeholder-gray-500 focus:border-white focus:outline-none"
              />
              <button 
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors"
              >
                <MailIcon className="h-5 w-5" />
                <span className="sr-only">Subscribe to newsletter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-300">
            Copyright © 2020 - 2024. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
