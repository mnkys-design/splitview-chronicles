import { useParams } from "react-router-dom";

const BlogPost = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <div className="brutalist-container py-12">
        <time className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString()}
        </time>
        <h1 className="brutalist-heading mt-4 mb-8">Blog Post {id}</h1>
        <p className="brutalist-text text-muted-foreground">
          Nulla ipsum augue, viverra ac neque a, gravida tempus tellus. Nam vitae nisl risus. 
          Pellentes que ex libero pharetra sodales vel eu ante. Quisque interdum ipsum a ante 
          lacinia, a vehicula quam gravida. In hac habitasse platea dictumst.
        </p>
      </div>
    </div>
  );
};

export default BlogPost;