import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface TabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

const TabsContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
}>({});

export const Tabs: React.FC<TabsProps> = ({ children, value, onValueChange, ...props }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children, ...props }) => {
  return (
    <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg" {...props}>
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, value, ...props }) => {
  const { value: currentValue, onValueChange } = React.useContext(TabsContext);
  
  return (
    <button
      {...props}
      onClick={() => onValueChange?.(value)}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-md transition-colors",
        currentValue === value 
          ? "bg-white text-gray-900 shadow-sm" 
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      )}
      data-value={value}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({ children, value, ...props }) => {
  const { value: currentValue } = React.useContext(TabsContext);
  
  if (currentValue !== value) {
    return null;
  }
  
  return (
    <div {...props}>
      {children}
    </div>
  );
};