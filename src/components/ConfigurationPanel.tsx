
import NumberStatistics from "@/components/NumberStatistics";
import NumberTypeSelector from "@/components/NumberTypeSelector";
import WindowSizeSelector from "@/components/WindowSizeSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberType } from "@/types";

interface ConfigurationPanelProps {
  windowSize: number;
  onWindowSizeChange: (size: number) => void;
  onTypeSelect: (type: NumberType) => void;
  onRefresh: () => void;
  isLoading: boolean;
  selectedType: NumberType | null;
}

const ConfigurationPanel = ({
  windowSize,
  onWindowSizeChange,
  onTypeSelect,
  onRefresh,
  isLoading,
  selectedType,
}: ConfigurationPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
        <CardDescription>
          Select the number type and window size for your calculations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Number Type</h3>
          <NumberTypeSelector
            onSelect={onTypeSelect}
            isLoading={isLoading}
            selectedType={selectedType}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-3">Window Size Configuration</h3>
          <WindowSizeSelector
            windowSize={windowSize}
            onWindowSizeChange={onWindowSizeChange}
            onRefresh={onRefresh}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigurationPanel;
