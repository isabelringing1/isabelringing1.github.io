import blogData from "./data/blog.json";
import BlogLayout from "./BlogLayout";
import BlogCard from "./BlogCard";

export default function BlogIndex() {
  const posts = [...blogData.posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <BlogLayout>
      <h1 className="blog-page-title">blog!</h1>
      <h3 className="blog-page-title subtitle">sometimes I write about the stuff I make. don't hold me to it</h3>
      <div className="blog-card-list">
        {posts.map((post) => (
          <BlogCard post={post} key={post.id} />
        ))}
      </div>
    </BlogLayout>
  );
}
