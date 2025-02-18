import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import ProductPage from './pages/ProductPage';

function App() {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <>
      {!isAuth ? (
        <LoginPage setIsAuth={setIsAuth} />
      ) : (
        <ProductPage />
      )}
    </>
  );
}

export default App;
