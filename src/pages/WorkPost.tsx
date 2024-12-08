import { useParams } from "react-router-dom";

const WorkPost = () => {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="brutalist-container py-12">
        <h1 className="brutalist-heading mb-8">Work {id}</h1>
        <div className="aspect-video mb-8 bg-card diagonal-line"></div>
        <p className="brutalist-text text-muted-foreground mb-8">
          Nulla ipsum augue, viverra ac neque a, gravida tempus tellus. Nam vitae nisl risus. 
          Pellentes que ex libero pharetra sodales vel eu ante. Quisque interdum ipsum a ante 
          lacinia, a vehicula quam gravida.
        </p>
      </div>
    </div>
  );
};

export default WorkPost;