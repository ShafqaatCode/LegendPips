import "./App.css";

import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/SharedStyleComponents/ScrolltoTop";
import { AuthModalProvider } from "./contexts/AuthModalContext";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthModalProvider>
        <AppRoutes />
      </AuthModalProvider>
    </BrowserRouter>
  );
}

export default App;
