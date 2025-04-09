
import { Loader2 } from "lucide-react";
import { NumberType } from "@/types";

interface LoadingIndicatorProps {
  selectedType: NumberType | null;
  typeMappings: Record<NumberType, string>;
}

const LoadingIndicator = ({ selectedType, typeMappings }: LoadingIndicatorProps) => {
  return (
    <div className="flex justify-center my-8">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Fetching {selectedType && typeMappings[selectedType]} numbers...
        </p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
