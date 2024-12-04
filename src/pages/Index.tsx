import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - CV Summary */}
      <div className="w-full md:w-1/2 min-h-screen bg-background p-8 flex flex-col justify-between">
        <div>
          <h1 className="brutalist-heading mb-8">Michael Chruściński</h1>
          <p className="brutalist-subheading mb-4">Senior Art Director</p>
          <p className="brutalist-text mb-8">
            Nulla ipsum augue, viverra ac neque a, gravida tempus tellus. Nam vitae nisl risus. 
            Pellentes que ex libero pharetra sodales vel eu ante.
          </p>
          <div className="space-y-4">
            <Link to="/work" className="brutalist-link brutalist-subheading block">
              Work Index →
            </Link>
            <Link to="/blog" className="brutalist-link brutalist-subheading block">
              Blog Archive →
            </Link>
          </div>
        </div>
        <div className="mt-auto pt-8">
          <p className="brutalist-text text-muted-foreground">
            Based in Warsaw, Poland
          </p>
        </div>
      </div>

      {/* Right Panel - Latest Posts */}
      <div className="w-full md:w-1/2 min-h-screen bg-card p-8">
        <h2 className="brutalist-subheading mb-8">Latest Posts</h2>
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <article key={i} className="border-t border-muted pt-4">
              <time className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString()}
              </time>
              <h3 className="brutalist-subheading mt-2 mb-2">
                Post Title {i}
              </h3>
              <p className="brutalist-text text-muted-foreground">
                Aenean ut bibendum ipsum. Nam vitae felis diam. Aenean ligula ligula, malesuada et 
                volutpat ullamcorper, convallis quis dolor.
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;