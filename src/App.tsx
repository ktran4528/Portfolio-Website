/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Series from "./pages/Series";
import Episodes from "./pages/Episodes";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Reader from "./pages/Reader";
import { AuthProvider } from "./lib/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-comic-bg font-sans selection:bg-comic-nav selection:text-white">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/series" element={<Series />} />
            <Route path="/series/:id/episodes" element={<Episodes />} />
            <Route path="/episodes" element={<Episodes />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/read/:comicId/:chapterId" element={<Reader />} />
            <Route path="/read/:chapterId" element={<Reader />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
