import { Outlet } from "react-router-dom";
import Header from "./Header";
import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useCallback, useEffect, useState } from "react";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchCartAsync } from "../../features/cart/cartSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import Footer from "./Footer";

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const initApp = useCallback(async () =>  {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchCartAsync());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch])

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp])

  if (loading) return <LoadingComponent message="Initializing application..." />
  
  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header />
      <div className="flex flex-col min-h-screen">
        {/* Main Content */}
        <div className="flex-grow">
          <Outlet />
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

export default App;
