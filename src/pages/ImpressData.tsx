import { ScrollArea } from "@/components/ui/scroll-area";

const ImpressData = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="brutalist-container py-12">
          <h1 className="brutalist-heading mb-8">Impress + Data</h1>
          
          <section className="mb-12">
            <h2 className="brutalist-subheading mb-4">Legal Information</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>Maximus Gravida</p>
              <p>123 Design Street</p>
              <p>12345 Creative City</p>
              <p>Country</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="brutalist-subheading mb-4">Contact</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>Email: contact@example.com</p>
              <p>Phone: +1 234 567 890</p>
            </div>
          </section>

          <section>
            <h2 className="brutalist-subheading mb-4">Data Protection</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>This website respects your privacy and complies with applicable data protection laws.</p>
              <p>We only collect and process personal data that is necessary for the operation of this website.</p>
            </div>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ImpressData;