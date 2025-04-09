
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MockDataAlert = () => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Using Mock Data</AlertTitle>
      <AlertDescription>
        The API is currently unavailable or timed out. Showing mock data instead.
      </AlertDescription>
    </Alert>
  );
};

export default MockDataAlert;
