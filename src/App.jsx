import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Franchises from "./pages/Franchises";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Shared by the browser (main.jsx) and the build-time pre-renderer (entry-server.jsx).
// Pages must render the same markup in both: anything that depends on the browser
// (window, scroll position, the URL's ?query) belongs in an effect, not in render.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="franchises" element={<Franchises />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
