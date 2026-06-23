import { Link, useParams } from "react-router-dom";
import blogData from "./data/blog.json";
import BlogLayout from "./BlogLayout";
import BlogBodyItem from "./BlogBodyItem";

export default function BlogArticle() {
  const { articleId } = useParams();
  const post = blogData.posts.find((p) => p.id === articleId);

  if (!post) {
    return (
      <BlogLayout>
        <div className="blog-article">
          <p className="blog-body">Post not found.</p>
          <Link to="/blog" className="blog-back-link">
            ← back to blog
          </Link>
        </div>
      </BlogLayout>
    );
  }

  const formattedDate = new Date(post.date + "T00:00:00").toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const paragraphs = Array.isArray(post.body) ? post.body : [post.body];

  return (
    <BlogLayout>
      <article className="blog-article">
        <h1 className="blog-article-title">{post.title}</h1>
        <p className="blog-article-subtitle">{post.subtitle}</p>
        <p className="blog-article-date">{formattedDate}</p>
        <div className="blog-body">
          {paragraphs.map((paragraph, i) => (
            <BlogBodyItem content={paragraph} key={i} />
          ))}
        </div>
        <Link to="/blog" className="blog-back-link">
          ← back to blog
        </Link>
      </article>
    </BlogLayout>
  );
}
