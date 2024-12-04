import { Link } from "react-router-dom";

const Work = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="brutalist-container py-12">
        <h1 className="brutalist-heading mb-12">Work Index</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group">
              <div className="aspect-video mb-4 bg-card diagonal-line"></div>
              <h2 className="brutalist-subheading mb-2">Work {i}</h2>
              <p className="brutalist-text text-muted-foreground mb-4">
                Nulla ipsum augue, viverra ac neque a, gravida tempus tellus.
              </p>
              <Link to={`/work/${i}`} className="brutalist-link">
                View Project →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;