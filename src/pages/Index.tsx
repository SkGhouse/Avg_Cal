
import ConfigurationPanel from "@/components/ConfigurationPanel";
import DataDisplay from "@/components/DataDisplay";
import LoadingIndicator from "@/components/LoadingIndicator";
import MockDataAlert from "@/components/MockDataAlert";
import NoData from "@/components/NoData";
import { fetchNumbersFromMicroservice } from "@/services/api";
import { NumberType, WindowState } from "@/types";
import { useState } from "react";
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
      
      // Show appropriate toast based on whether data is real or mock
      const numberTypeLabels: Record<NumberType, string> = {
        p: "Prime",
        f: "Fibonacci",
        e: "Even",
        r: "Random"
      };

      if (result.isMock) {
        toast.warning(`Using mock ${numberTypeLabels[type]} numbers - API unavailable`);
      } else {
        toast.success(`${numberTypeLabels[type]} numbers fetched successfully`);
      }
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
        <ConfigurationPanel 
          windowSize={windowSize}
          onWindowSizeChange={handleWindowSizeChange}
          onTypeSelect={fetchData}
          onRefresh={handleRefresh}
          isLoading={isLoading}
          selectedType={selectedType}
        />

        {isLoading && (
          <LoadingIndicator 
            selectedType={selectedType} 
            typeMappings={typeMappings}
          />
        )}

        {windowState && windowState.isMock && <MockDataAlert />}

        {windowState && (
          <DataDisplay 
            windowState={windowState}
            windowSize={windowSize}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        {!windowState && !isLoading && (
          <NoData 
            onGetStarted={() => setActiveTab("dashboard")} 
          />
        )}
      </div>
    </div>
  );
};

export default Index;
