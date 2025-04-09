
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NoDataProps {
  onGetStarted: () => void;
}

const NoData = ({ onGetStarted }: NoDataProps) => {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-primary h-8 w-8"
          >
            <path d="M3 2v1c0 1 2 1 2 2S3 6 3 7s2 1 2 2-2 1-2 2 2 1 2 2"></path>
            <path d="M18 6h.01"></path>
            <path d="M6 18h.01"></path>
            <circle cx="18" cy="18" r="3"></circle>
            <circle cx="6" cy="6" r="3"></circle>
          </svg>
        </div>
        <h2 className="text-xl font-semibold">No Data Yet</h2>
        <p className="text-muted-foreground max-w-md">
          Select a number type above to fetch data from the API. The calculator will process the numbers and show the results here.
        </p>
        <Button 
          onClick={onGetStarted} 
          variant="outline" 
          className="mt-2"
        >
          Get Started
        </Button>
      </div>
    </Card>
  );
};

export default NoData;
