import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/open-sans/300.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import { router } from './app/router/Routes.tsx';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store/configureStore.ts';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
        <RouterProvider router={router}/>
      </Provider>   
  </StrictMode>,
)

