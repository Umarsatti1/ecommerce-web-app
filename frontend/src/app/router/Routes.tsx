import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";

import ProductDetails from "../../features/catalog/ProductDetails";
import Catalog from "../../features/catalog/Catalog";
import CategoryPageTwo from "../../features/category/CategoryPageTwo";
import CategoryPageOne from "../../features/category/CategoryPageOne";
import ServerError from "../errors/ServerError";
import CartPage from "../../features/cart/CartPage";
import NotFound from "../errors/NotFound";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import RequireAuth from "./RequireAuth";
import Orders from "../../features/orders/Orders";
import CheckoutWrapper from "../../features/checkout/CheckoutWrapper";
import Inventory from "../../features/admin/Inventory";
import ProfileSettings from "../../features/account/ProfileSettings";
import BrandProductsPage from "../../features/catalog/BrandsProductPage";
import Contact from "../../features/extras/Contact";
import About from "../../features/extras/About";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            // Authenticated Routes
            {element: <RequireAuth />, children: [
                {path: 'checkout', element: <CheckoutWrapper />},
                {path: 'orders', element: <Orders/>},
                //{path: 'profile', element: <ProfileSettings />},
                { path: 'profile-settings', element: <ProfileSettings /> },
            ]},

            //Admin Routes
            {element: <RequireAuth roles={['Admin']} />, children: [
                {path: 'inventory', element: <Inventory/>},
            ]},

            {path: '', element: <HomePage />},
            {path: 'catalog', element: <Catalog />},
            {path: 'catalog/:id', element: <ProductDetails />},
            {path: 'products/brand/:brand', element: <BrandProductsPage />}, //BrandProductsPage
            {path: 'about', element: <About/>},
            {path: 'contact', element: <Contact />},
            {path: 'categoryone', element: <CategoryPageOne />},
            {path: 'categorytwo', element: <CategoryPageTwo />},
            {path: 'server-error', element: <ServerError />},
            {path: 'not-found', element: <NotFound />},
            {path: 'cart', element: <CartPage />},

            {path: 'login', element: <Login />},
            {path: 'register', element: <Register />},
            {path: '*', element: <Navigate replace to='/not-found' />}
        ]
    }
])