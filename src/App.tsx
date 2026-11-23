import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import PropertyDetails from "./pages/PropertyDetails";
import Placeholder from "./pages/Placeholder";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/browse/:id" element={<PropertyDetails />} />
      <Route path="/about" element={<Placeholder title="About Bodima.lk" />} />
      <Route path="/contact" element={<Placeholder title="Contact Us" />} />
      <Route path="/login" element={<Placeholder title="Login" />} />
      <Route path="/register" element={<Placeholder title="Sign Up" />} />
      <Route path="*" element={<Placeholder title="Page Not Found" />} />
    </Routes>
  );
}
