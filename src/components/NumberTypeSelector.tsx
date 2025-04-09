
import { Button } from "@/components/ui/button";
import { NumberType } from "@/types";
import { 
  CircleX,
  Dice5, 
  Hash, 
  ListFilter, 
  Loader2
} from "lucide-react";
import { useState } from "react";

interface NumberTypeSelectorProps {
  onSelect: (type: NumberType) => void;
  isLoading: boolean;
  selectedType: NumberType | null;
}

interface NumberTypeOption {
  type: NumberType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const NumberTypeSelector: React.FC<NumberTypeSelectorProps> = ({
  onSelect,
  isLoading,
  selectedType,
}) => {
  const numberTypes: NumberTypeOption[] = [
    {
      type: "p",
      label: "Prime Numbers",
      icon: <Hash className="h-5 w-5 mr-2" />,
      description: "Numbers divisible only by 1 and themselves",
    },
    {
      type: "f",
      label: "Fibonacci Numbers",
      icon: <ListFilter className="h-5 w-5 mr-2" />,
      description: "Each number is the sum of the two preceding ones",
    },
    {
      type: "e",
      label: "Even Numbers",
      icon: <Hash className="h-5 w-5 mr-2" />,
      description: "Numbers divisible by 2 with no remainder",
    },
    {
      type: "r",
      label: "Random Numbers",
      icon: <Dice5 className="h-5 w-5 mr-2" />,
      description: "Randomly generated numbers",
    },
  ];

  const handleSelect = (type: NumberType) => {
    if (isLoading) return;
    onSelect(type);
  };

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {numberTypes.map((option) => (
        <Button
          key={option.type}
          variant={selectedType === option.type ? "default" : "outline"}
          className={`flex items-center justify-center h-auto p-4 ${
            selectedType === option.type
              ? "border-2 border-primary"
              : "border hover:border-primary/70"
          }`}
          onClick={() => handleSelect(option.type)}
          disabled={isLoading}
        >
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-2">
              {option.icon}
              <span className="font-medium">{option.label}</span>
            </div>
            <p className="text-xs text-muted-foreground">{option.description}</p>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default NumberTypeSelector;
