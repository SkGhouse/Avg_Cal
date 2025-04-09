
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WindowState } from "@/types";
import { BarChart, Sigma } from "lucide-react";

interface NumberStatisticsProps {
  data: WindowState;
  windowSize: number;
}

const NumberStatistics: React.FC<NumberStatisticsProps> = ({ 
  data, 
  windowSize 
}) => {
  if (!data || !data.windowCurrState || data.windowCurrState.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select a number type to fetch and view statistics.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { windowCurrState, avg } = data;
  
  // Calculate window usage
  const usagePercentage = (windowCurrState.length / windowSize) * 100;
  
  // Get min and max values
  const minValue = Math.min(...windowCurrState);
  const maxValue = Math.max(...windowCurrState);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Average</CardTitle>
          <Sigma className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avg.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            From {windowCurrState.length} number{windowCurrState.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Window Usage</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {windowCurrState.length} / {windowSize}
          </div>
          <div className="mt-2">
            <Progress value={usagePercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Min Value</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M2 12h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{minValue}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Max Value</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M2 12h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{maxValue}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NumberStatistics;
