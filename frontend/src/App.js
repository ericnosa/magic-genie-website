import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Residential from "@/pages/Residential";
import DeepCleaning from "@/pages/DeepCleaning";
import Airbnb from "@/pages/Airbnb";
import Commercial from "@/pages/Commercial";
import Pricing from "@/pages/Pricing";
import Booking from "@/pages/Booking";
import BookingConfirmation from "@/pages/BookingConfirmation";
import About from "@/pages/About";
import FAQ from "@/pages/FAQ";
import Checklist from "@/pages/Checklist";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/residential" element={<Residential />} />
            <Route path="/deep-cleaning" element={<DeepCleaning />} />
            <Route path="/fresh-start" element={<Residential defaultPackage="fresh_start" />} />
            <Route path="/airbnb" element={<Airbnb />} />
            <Route path="/commercial" element={<Commercial />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking/confirmation/:id" element={<BookingConfirmation />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
