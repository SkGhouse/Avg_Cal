
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

interface WindowSizeSelectorProps {
  windowSize: number;
  onWindowSizeChange: (size: number) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const WindowSizeSelector: React.FC<WindowSizeSelectorProps> = ({
  windowSize,
  onWindowSizeChange,
  onRefresh,
  isLoading,
}) => {
  const windowSizeOptions = [5, 10, 15, 20];

  return (
    <div className="flex items-center gap-4">
      <div className="flex-grow">
        <Select
          value={String(windowSize)}
          onValueChange={(value) => onWindowSizeChange(Number(value))}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select window size" />
          </SelectTrigger>
          <SelectContent>
            {windowSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                Window Size: {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onRefresh}
        disabled={isLoading}
        className="flex-shrink-0"
      >
        {isLoading ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default WindowSizeSelector;
