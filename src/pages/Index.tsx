
import JsonDisplay from "@/components/JsonDisplay";
import NumberStatistics from "@/components/NumberStatistics";
import NumberTypeSelector from "@/components/NumberTypeSelector";
import WindowSizeSelector from "@/components/WindowSizeSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchNumbersFromMicroservice } from "@/services/api";
import { NumberType, WindowState } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Index = () => {
  const [windowSize, setWindowSize] = useState<number>(10);
  const [selectedType, setSelectedType] = useState<NumberType | null>(null);
  const [windowState, setWindowState] = useState<WindowState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const fetchData = async (type: NumberType) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setSelectedType(type);
    
    try {
      const result = await fetchNumbersFromMicroservice(
        type, 
        windowState,
        windowSize
      );
      
      setWindowState(result);
      
      // Show success toast for the specific number type
      const numberTypeLabels: Record<NumberType, string> = {
        p: "Prime",
        f: "Fibonacci",
        e: "Even",
        r: "Random"
      };
      
      toast.success(`${numberTypeLabels[type]} numbers fetched successfully`);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (selectedType) {
      fetchData(selectedType);
    } else {
      toast.warning("Select a number type first");
    }
  };

  const handleWindowSizeChange = (newSize: number) => {
    setWindowSize(newSize);
    // Reset window state when window size changes
    setWindowState(null);
    setSelectedType(null);
  };

  const typeMappings: Record<NumberType, string> = {
    p: "Prime",
    f: "Fibonacci",
    e: "Even",
    r: "Random"
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Average Calculator Microservice</h1>
          <p className="text-muted-foreground">
            HTTP microservice for calculating averages of various number sequences
          </p>
        </div>
      </header>

      <div className="grid gap-6">
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
                onSelect={fetchData}
                isLoading={isLoading}
                selectedType={selectedType}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Window Size Configuration</h3>
              <WindowSizeSelector
                windowSize={windowSize}
                onWindowSizeChange={handleWindowSizeChange}
                onRefresh={handleRefresh}
                isLoading={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Fetching {selectedType && typeMappings[selectedType]} numbers...
              </p>
            </div>
          </div>
        )}

        {windowState && (
          <Tabs
            defaultValue="dashboard"
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
                    Raw numbers received from the third-party server
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
        )}

        {!windowState && !isLoading && (
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
                onClick={() => setActiveTab("dashboard")} 
                variant="outline" 
                className="mt-2"
              >
                Get Started
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
