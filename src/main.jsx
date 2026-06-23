import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import BlogIndex from "./BlogIndex.jsx";
import BlogArticle from "./BlogArticle.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/blog" element={<BlogIndex />} />
      <Route path="/blog/:articleId" element={<BlogArticle />} />
    </Routes>
  </BrowserRouter>
);
