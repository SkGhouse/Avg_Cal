import { NumberResponse, NumberType, WindowState } from "@/types";
import { toast } from "sonner";

// Base URL for test server
const BASE_URL = "http://20.244.56.144/evaluation-service";

// URL mapping for different number types
const NUMBER_ENDPOINTS: Record<NumberType, string> = {
  p: `${BASE_URL}/primes`,
  f: `${BASE_URL}/fibo`,
  e: `${BASE_URL}/even`,
  r: `${BASE_URL}/rand`,
};

// Get numbers from the test server with timeout handling
export const fetchNumbers = async (
  type: NumberType
): Promise<NumberResponse | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 500);
    
    const response = await fetch(NUMBER_ENDPOINTS[type], {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} numbers: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      console.warn("Request timeout exceeded 500ms");
      return null;
    }
    
    console.error(`Error fetching ${type} numbers:`, error);
    toast.error(`Failed to fetch ${type} numbers`);
    return null;
  }
};

// Mock API for simulating the microservice
export const fetchNumbersFromMicroservice = async (
  type: NumberType,
  windowState: WindowState | null,
  windowSize: number
): Promise<WindowState> => {
  // Fetch numbers from test server
  const response = await fetchNumbers(type);
  
  if (!response) {
    // Return unchanged state if request failed or timed out
    return windowState || {
      windowPrevState: [],
      windowCurrState: [],
      numbers: [],
      avg: 0,
    };
  }
  
  // Process the numbers
  const newNumbers = response.numbers;
  
  // Create initial state if this is the first request
  if (!windowState) {
    const initialNumbers = newNumbers.slice(0, windowSize);
    const avg = calculateAverage(initialNumbers);
    
    return {
      windowPrevState: [],
      windowCurrState: initialNumbers,
      numbers: newNumbers,
      avg,
    };
  }
  
  // Handle existing state
  const { windowCurrState: prevWindowState } = windowState;
  
  // Filter out duplicates and create a set of unique numbers
  const uniqueWindowNumbers = new Set([...prevWindowState]);
  const newUniqueNumbers: number[] = [];
  
  // Process new numbers, adding only unique ones
  for (const num of newNumbers) {
    if (!uniqueWindowNumbers.has(num)) {
      uniqueWindowNumbers.add(num);
      newUniqueNumbers.push(num);
    }
  }
  
  // Create new window state
  const allNumbers = [...prevWindowState, ...newUniqueNumbers];
  let windowCurrState = allNumbers;
  
  // If we exceed window size, remove oldest numbers
  if (allNumbers.length > windowSize) {
    windowCurrState = allNumbers.slice(allNumbers.length - windowSize);
  }
  
  // Calculate average
  const avg = calculateAverage(windowCurrState);
  
  return {
    windowPrevState: prevWindowState,
    windowCurrState,
    numbers: newNumbers,
    avg,
  };
};

// Helper function to calculate average
export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return parseFloat((sum / numbers.length).toFixed(2));
};
