import { Link } from "react-router-dom";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="brutalist-container py-12">
        <h1 className="brutalist-heading mb-12">Blog Archive</h1>
        <div className="space-y-16">
          {[1, 2, 3, 4, 5].map((i) => (
            <article key={i} className="border-t border-muted pt-8">
              <time className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString()}
              </time>
              <h2 className="brutalist-subheading mt-4 mb-4">Blog Post {i}</h2>
              <p className="brutalist-text text-muted-foreground mb-4">
                Nulla ipsum augue, viverra ac neque a, gravida tempus tellus. Nam vitae nisl risus. 
                Pellentes que ex libero pharetra sodales vel eu ante.
              </p>
              <Link to={`/blog/${i}`} className="brutalist-link">
                Read More →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;