export default function ResearchPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-3xl font-bold">Research</h1>
          <p className="text-muted-foreground">
            Explore my research work and publications
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-2">Research Paper</h2>
          <p className="text-muted-foreground mb-4">
            Access my latest research publication
          </p>
          <a 
            href="/research/view" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View PDF
          </a>
        </div>
      </div>
    </div>
  );
}
