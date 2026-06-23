import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Field from "./Field";
import grassBg from "/grass_bg.jpg";

export default function BlogLayout({ children }) {
  const location = useLocation();
  const showMobileView = window.innerWidth <= 600;
  const onBlogIndex = location.pathname === "/blog";
  const backTo = onBlogIndex ? "/" : "/blog";
  const backLabel = onBlogIndex ? "← home" : "← blog";

  const MAX_BLADES_PER_ROW = 50;
  const MAX_BLADES_PER_COLUMN = 40;

  const blades_per_row = Math.floor(
    Math.min(MAX_BLADES_PER_ROW, window.innerWidth / 25)
  );
  const blades_per_column = Math.floor(
    Math.min(MAX_BLADES_PER_COLUMN, window.innerHeight / 14)
  );

  useEffect(() => {
    document.body.classList.add("blog-page");
    return () => {
      document.body.classList.remove("blog-page");
    };
  }, []);

  return (
    <div className="blog-content">
      <img id="bg" src={grassBg} alt="" />
      <Field
        blades_per_row={blades_per_row}
        blades_per_column={blades_per_column}
        grassMotion={true}
        showMobileView={showMobileView}
        blogMode={true}
        onBlogIndex={onBlogIndex}
      />
      <Link to={backTo} className="blog-back-button">
        {backLabel}
      </Link>
      <div className="blog-scroll blog-fade-in">{children}</div>
    </div>
  );
}
