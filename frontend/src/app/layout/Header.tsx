import { ShoppingCart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import agent from '../api/api';
import { resetProductParams, fetchProductsAsync } from '../../features/catalog/catalogSlice';
import LoadingComponent from './LoadingComponent';


const midLinks = [
  { title: 'Home', path: '/' },
  { title: 'Shop', path: '/catalog', hasDropdown: true },
  { title: 'About Us', path: '/about' },
  { title: 'Blog', path: '/blog' },
  { title: 'Contact', path: '/contact' },
];

export default function Header() {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.account);
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const filters = await agent.Catalog.fetchFilters();
        setBrands(filters.brands);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    }
    fetchBrands();
  }, []);

  const handleShopClick = async () => {
    setLoading(true);
    dispatch(resetProductParams());
    await dispatch(fetchProductsAsync());
    navigate('/catalog');
    setLoading(false);
  };

  if (loading) return <LoadingComponent message="Loading Shop..." />;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Logo</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6">
          {midLinks.map(({ title, path, hasDropdown }) => (
            <div key={path} className="relative group">
              {hasDropdown ? (
                <>
                  <span
                    onClick={handleShopClick}
                    className={`inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-base font-medium text-black hover:bg-gray-100 focus:outline-none cursor-pointer ${
                      pathname.startsWith('/catalog') ? 'after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-0.5 after:bg-[#973d3d]' : ''
                    }`}
                  >
                    {title}
                  </span>
                  <div className="absolute left-0 mt-2 hidden group-hover:block pointer-events-auto z-50 bg-white rounded-md shadow-lg w-64">
                    <div className="py-2">
                      {brands.map((brand) => (
                        <Link
                          key={brand}
                          to={`/products/brand/${brand}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {brand}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to={path}
                  className={`inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-base font-medium text-black hover:bg-gray-100 focus:outline-none ${
                    pathname === path ? 'after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-0.5 after:bg-[#C40C0C]' : ''
                  }`}
                >
                  {title}
                </Link>
              )}
            </div>
          ))}
        </nav>

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
              <Link
                to="/login"
                className="rounded-md px-4 py-2 text-sm font-medium bg-white text-black border border-gray-300 hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md px-4 py-2 text-sm font-medium bg-black text-white hover:bg-gray-800"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
