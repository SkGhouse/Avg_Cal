
import JsonDisplay from "@/components/JsonDisplay";
import NumberStatistics from "@/components/NumberStatistics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WindowState } from "@/types";

interface DataDisplayProps {
  windowState: WindowState;
  windowSize: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DataDisplay = ({ windowState, windowSize, activeTab, setActiveTab }: DataDisplayProps) => {
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="json">JSON Response</TabsTrigger>
        <TabsTrigger value="raw">Raw Data</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard" className="space-y-6">
        <NumberStatistics data={windowState} windowSize={windowSize} />
        
        <Card>
          <CardHeader>
            <CardTitle>Current Window State</CardTitle>
            <CardDescription>
              Numbers currently in the calculation window (max: {windowSize})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {windowState.windowCurrState.length > 0 ? (
                windowState.windowCurrState.map((num, index) => (
                  <div
                    key={`${num}-${index}`}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {num}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No numbers in window</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Previous Window State</CardTitle>
            <CardDescription>
              Numbers from the previous state before the latest update
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {windowState.windowPrevState.length > 0 ? (
                windowState.windowPrevState.map((num, index) => (
                  <div
                    key={`prev-${num}-${index}`}
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                  >
                    {num}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No previous window state</p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="json">
        <Card>
          <CardHeader>
            <CardTitle>Formatted JSON Response</CardTitle>
            <CardDescription>
              The response from the microservice API
              {windowState.isMock && " (mock data)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JsonDisplay data={windowState} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="raw">
        <Card>
          <CardHeader>
            <CardTitle>Raw Server Response</CardTitle>
            <CardDescription>
              Raw numbers received from the 
              {windowState.isMock ? " mock data" : " third-party server"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Received Numbers:</h3>
                <div className="flex flex-wrap gap-2">
                  {windowState.numbers.map((num, index) => (
                    <div
                      key={`raw-${num}-${index}`}
                      className="bg-accent/10 text-accent-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Current Average: <span className="font-bold">{windowState.avg.toFixed(2)}</span></h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DataDisplay;
