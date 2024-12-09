'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, ArrowRightIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '../catalog/ProductCard'
import { Product } from '../../app/models/product'
import api from '../../app/api/api'
import { Container } from '@mui/material'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CarouselItem {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
}

const carouselItems: CarouselItem[] = [
    {
      id: 1,
      title: "Fall - Winter Collections 2030",
      subtitle: "SUMMER COLLECTION",
      description: "A specialist label creating luxury essentials. Ethically crafted with an unwavering commitment to exceptional quality.",
      image: "/images/carousel-1.png",
    },
    {
      id: 2,
      title: "Spring Collection 2030",
      subtitle: "NEW ARRIVALS",
      description: "Discover our latest collection of premium essentials designed for the modern lifestyle.",
      image: "/images/carousel-1.png",
    },
    {
      id: 3,
      title: "Summer Essentials",
      subtitle: "FEATURED COLLECTION",
      description: "Elevate your wardrobe with our curated selection of timeless pieces.",
      image: "/images/carousel-1.png",
    },
  ]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 30,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Create URLSearchParams with default values to fetch all products
        const params = new URLSearchParams({
          pageNumber: '1',
          pageSize: '100', // Large enough to get a good sample
          orderBy: 'name' // or any default ordering you prefer
        })
        
        const response = await api.Catalog.list(params)
        // Randomly select 8 products from the response
        const shuffled = response.items.sort(() => 0.5 - Math.random())
        setProducts(shuffled.slice(0, 8))
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { days, hours, minutes, seconds } = prevTime
        if (seconds > 0) {
          seconds--
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes--
          } else {
            minutes = 59
            if (hours > 0) {
              hours--
            } else {
              hours = 23
              if (days > 0) {
                days--
              }
            }
          }
        }
        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(timer)
        }
        return { days, hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true)
      setCurrentSlide(index)
      setTimeout(() => setIsAnimating(false), 500)
    }
  }

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % carouselItems.length)
  }

  const previousSlide = () => {
    goToSlide(currentSlide === 0 ? carouselItems.length - 1 : currentSlide - 1)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        previousSlide()
      } else if (e.key === 'ArrowRight') {
        nextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide])

  return (
    <div>
      {/* Carousel Section */}
      <div className="relative h-[600px] w-full overflow-hidden">
        {carouselItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="relative h-full w-full">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10">
                <div className="container mx-auto flex h-full items-center px-4">
                  <div className="max-w-2xl">
                    <span className="mb-4 inline-block text-sm font-medium tracking-wider text-red-500">
                      {item.subtitle}
                    </span>
                    <h1 className="mb-6 text-5xl font-bold text-black">
                      {item.title}
                    </h1>
                    <p className="mb-8 text-lg text-gray-800">
                      {item.description}
                    </p>
                    <Link 
                      to="/catalog"
                      className="inline-flex items-center gap-2 bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                    >
                      SHOP NOW
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={previousSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 transition-colors hover:bg-white"
          aria-label="Previous slide"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 transition-colors hover:bg-white"
          aria-label="Next slide"
        >
          <ArrowRight className="h-6 w-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-4' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* New Arrivals Section */}
      <Container>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-2 text-center text-3xl font-bold">New Arrivals</h2>
            <p className="mb-12 text-center text-gray-600">
              Far far away, behind the word mountains, far from the countries Vokalia and Consonantia
            </p>

            {loading ? (
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="w-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </Container>

      {/* Deal Banner Section */}
      <section className="h-[600px] w-full bg-[#DCDCDC]">
        <div className="container mx-auto flex h-full items-center px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Image Column */}
            <div className="flex items-center justify-center lg:justify-end">
              <img
                src="/images/Handbag.png"
                alt="Multi-pocket Chest Bag"
                className="max-h-[700px] w-auto"
              />
            </div>
            {/* Content Column */}
            <div className="flex flex-col items-center justify-center lg:items-start">
              <span className="mb-2 text-sm font-medium tracking-wider text-red-500">
                DEAL OF THE WEEK
              </span>
              
              <h2 className="mb-8 text-center text-4xl font-bold text-black lg:text-left">
                Multi-pocket Chest<br />Bag Black
              </h2>
              {/* Timer */}
              <div className="mb-8 grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold">
                    {String(timeLeft.days).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">Seconds</div>
                </div>
              </div>
              <Link 
                to="/catalog"
                className="inline-flex items-center gap-2 bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                SHOP NOW
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}