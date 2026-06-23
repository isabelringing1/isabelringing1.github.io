import { Link } from "react-router-dom";

export default function BlogCard({ post }) {
  const formattedDate = new Date(post.date + "T00:00:00").toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <Link to={`/blog/${post.id}`} className="blog-card-link">
      <div className="itembox blog-card">
        {post["card-image"] && (
          <img
            className="blog-card-image"
            src={post["card-image"]}
            alt=""
          />
        )}
        <div className="hoverbox-title">{post.title}</div>
        <div className="itembox-desc">{post.subtitle}</div>
        <div className="blog-card-date">{formattedDate}</div>
      </div>
    </Link>
  );
}
