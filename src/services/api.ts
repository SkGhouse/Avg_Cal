
import { NumberResponse, NumberType, WindowState } from "@/types";
import { toast } from "sonner";

// Base URL for local server
const BASE_URL = "http://localhost:9876";

// URL mapping for different number types
const NUMBER_ENDPOINTS: Record<NumberType, string> = {
  p: `${BASE_URL}/numbers/p`,
  f: `${BASE_URL}/numbers/f`,
  e: `${BASE_URL}/numbers/e`,
  r: `${BASE_URL}/numbers/r`,
};

// Mock data for when API fails
const MOCK_DATA: Record<NumberType, number[]> = {
  p: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47],
  f: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377],
  e: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
  r: [15, 23, 6, 42, 37, 19, 94, 52, 13, 67, 81, 33, 44, 71, 29],
};

// Get numbers from the local server with timeout handling
export const fetchNumbers = async (
  type: NumberType
): Promise<NumberResponse | null> => {
  try {
    const controller = new AbortController();
    // Increased timeout from 500ms to 3000ms (3 seconds)
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
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
      console.warn("Request timeout exceeded 3000ms");
      // Return mock data with a note that it's a fallback
      return { numbers: MOCK_DATA[type], isMock: true };
    }
    
    console.error(`Error fetching ${type} numbers:`, error);
    // Return mock data with a note that it's a fallback
    return { numbers: MOCK_DATA[type], isMock: true };
  }
};

// Process and store numbers according to requirements
export const fetchNumbersFromMicroservice = async (
  type: NumberType,
  windowState: WindowState | null,
  windowSize: number
): Promise<WindowState> => {
  // Fetch numbers from local server
  const response = await fetchNumbers(type);
  
  if (!response) {
    // Return unchanged state if request failed or timed out
    return windowState || {
      windowPrevState: [],
      windowCurrState: [],
      numbers: [],
      avg: 0,
      isMock: true
    };
  }
  
  // Process the numbers
  const newNumbers = response.numbers;
  const isMock = 'isMock' in response && response.isMock === true;
  
  // Create initial state if this is the first request
  if (!windowState) {
    const initialNumbers = newNumbers.slice(0, windowSize);
    const avg = calculateAverage(initialNumbers);
    
    return {
      windowPrevState: [],
      windowCurrState: initialNumbers,
      numbers: newNumbers,
      avg,
      isMock
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
    isMock
  };
};

// Helper function to calculate average
export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return parseFloat((sum / numbers.length).toFixed(2));
};
