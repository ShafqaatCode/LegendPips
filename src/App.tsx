import "./App.css";

import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/SharedStyleComponents/ScrolltoTop";
import { AuthModalProvider } from "./contexts/AuthModalContext";
import LiveChatWidget from "./components/Chat/LiveChatWidget";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthModalProvider>
        <AppRoutes />
        <LiveChatWidget />
      </AuthModalProvider>
    </BrowserRouter>
  );
}

export default App;
