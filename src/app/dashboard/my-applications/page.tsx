import ApplicationTracker from "./application-tracker";

export default function MyApplicationsPage() {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold font-headline">Application Tracking</h1>
          <p className="text-muted-foreground">
            Manage and monitor all your internship applications in one place.
          </p>
        </header>
        <ApplicationTracker />
      </div>
    );
  }
