import { ShoppingCart } from 'lucide-react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useAppSelector } from "../store/configureStore"
import SignedInMenu from "./SignedInMenu"
import { Link, useLocation } from 'react-router-dom';

const midLinks = [
  { title: 'Home', path: '/' },
  { title: 'Shop', path: '/catalog', hasDropdown: true },
  { title: 'About Us', path: '/about' },
  { title: 'Blog', path: '/blog' },
  { title: 'Contact', path: '/contact' },
]

const shopCategories = [
  { title: 'Category One', path: '/category-one' },
  { title: 'Category Two', path: '/category-two' },
  { title: 'Category Three', path: '/category-three' },
  { title: 'Category Four', path: '/category-four' },
  { title: 'Category Five', path: '/category-five' },
]

const rightLinks = [
  { title: 'Login', path: '/login' },
  { title: 'Register', path: '/register' },
]

export default function Header() {
  const location = useLocation()
  const pathname = location.pathname
  const { cart } = useAppSelector(state => state.cart)
  const { user } = useAppSelector(state => state.account)
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Logo</span>
        </Link>

        {/* Navigation Links */}
        <NavigationMenu.Root className="relative z-[1] flex">
          <NavigationMenu.List className="flex flex-row space-x-4">
            {midLinks.map(({ title, path, hasDropdown }) => (
              <NavigationMenu.Item key={path}>
                {hasDropdown ? (
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <Link
                        to={path}
                        className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-base font-medium text-black hover:bg-gray-100 focus:outline-none relative ${
                          pathname === path || pathname === '/catalog' ? 'after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-0.5 after:bg-[#C40C0C]' : ''
                        } hover:after:absolute hover:after:bottom-0 hover:after:left-1/4 hover:after:right-1/4 hover:after:h-0.5 hover:after:bg-[#C40C0C]`}
                      >
                        {title}
                      </Link>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="min-w-[220px] rounded-md bg-white p-2 shadow-md"
                        sideOffset={5}
                        align="start"
                      >
                        {shopCategories.map(({ title, path }) => (
                          <DropdownMenu.Item key={path} asChild>
                            <Link
                              to={path}
                              className="block rounded-md px-4 py-2 text-sm text-black hover:bg-gray-100 focus:outline-none"
                            >
                              {title}
                            </Link>
                          </DropdownMenu.Item>
                        ))}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                ) : (
                  <Link
                    to={path}
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-base font-medium text-black hover:bg-gray-100 focus:outline-none relative ${
                      pathname === path ? 'after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-0.5 after:bg-[#C40C0C]' : ''
                    } hover:after:absolute hover:after:bottom-0 hover:after:left-1/4 hover:after:right-1/4 hover:after:h-0.5 hover:after:bg-[#C40C0C]`}
                  >
                    {title}
                  </Link>
                )}
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
        </NavigationMenu.Root>

        {/* Right Side Icons/Buttons */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <SignedInMenu />
          ) : (
            <div className="flex items-center space-x-2">
              {rightLinks.map(({ title, path }) => (
                <Link
                  key={path}
                  to={path}
                  className={`rounded-md px-4 py-2 text-sm font-medium ${
                    title === 'Register'
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}