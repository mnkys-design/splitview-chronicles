import { Link } from "react-router-dom";

const Work = () => {
  // Sample UUIDs for demo purposes
  const demoUUIDs = [
    "123e4567-e89b-12d3-a456-426614174000",
    "987fcdeb-51a2-43d8-b4c6-987654321000",
    "456e789a-12cd-34ef-b456-789012345000",
    "abc12345-6789-def0-1234-567890123000",
    "def67890-1234-5678-9abc-def012345000",
    "111aaa22-3333-4444-5555-666666666000"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="brutalist-container py-12">
        <h1 className="brutalist-heading mb-12">Work Index</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demoUUIDs.map((uuid, i) => (
            <Link key={uuid} to={`/work/${uuid}`} className="group">
              <div className="aspect-video mb-4 bg-card diagonal-line group-hover:opacity-80 transition-opacity"></div>
              <h2 className="brutalist-subheading mb-2">Work {i + 1}</h2>
              <p className="brutalist-text text-muted-foreground mb-4">
                Nulla ipsum augue, viverra ac neque a, gravida tempus tellus.
              </p>
              <span className="brutalist-link">
                View Project →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;