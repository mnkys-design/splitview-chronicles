import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const CV = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="brutalist-container py-12">
        <h1 className="brutalist-heading mb-12">Curriculum Vitae</h1>
        
        <section className="mb-12">
          <h2 className="brutalist-subheading mb-6">Experience</h2>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-sm">2023 - Present</TableCell>
                <TableCell>
                  <span className="font-bold">Senior Art Director</span>
                  <br />
                  <span className="text-muted-foreground">Creative Agency XYZ</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm">2020 - 2023</TableCell>
                <TableCell>
                  <span className="font-bold">Art Director</span>
                  <br />
                  <span className="text-muted-foreground">Design Studio ABC</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>

        <section className="mb-12">
          <h2 className="brutalist-subheading mb-6">Education</h2>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-sm">2016 - 2020</TableCell>
                <TableCell>
                  <span className="font-bold">Bachelor of Design</span>
                  <br />
                  <span className="text-muted-foreground">University of Design</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  );
};

export default CV;