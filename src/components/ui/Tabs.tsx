import React, { createContext, useContext, useId, useState } from "react";
import { cn } from "../../utils";

type TabValue = string;

interface TabsContextValue {
  activeValue: TabValue;
  setActiveValue: (value: TabValue) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(componentName: string) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Tabs`);
  }

  return context;
}

interface TabsProps {
  defaultValue?: TabValue;
  value?: TabValue;
  onValueChange?: (value: TabValue) => void;
  className?: string;
  children: React.ReactNode;
}

function TabsRoot({ defaultValue, value, onValueChange, className, children }: TabsProps) {
  const [internalValue, setInternalValue] = useState<TabValue>(defaultValue ?? "");
  const baseId = useId();

  const activeValue = value ?? internalValue;

  const setActiveValue = (nextValue: TabValue) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  };

  const contextValue = {
    activeValue,
    setActiveValue,
    baseId,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

function TabsList({ className, children }: TabsListProps) {
  return (
    <div className={className}>
      <div className="-mb-px flex space-x-8 overflow-x-auto" role="tablist" aria-label="Tabs">
        {children}
      </div>
    </div>
  );
}

interface TabsTriggerProps {
  value: TabValue;
  className?: string;
  children: React.ReactNode;
}

function TabsTrigger({ value, className, children }: TabsTriggerProps) {
  const { activeValue, setActiveValue, baseId } = useTabsContext("Tabs.Trigger");
  const isActive = activeValue === value;
  const triggerId = `${baseId}-trigger-${value}`;
  const panelId = `${baseId}-content-${value}`;

  return (
    <button
      type="button"
      id={triggerId}
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      onClick={() => setActiveValue(value)}
      className={cn(
        "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
        isActive
          ? "border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400"
          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600",
        className
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: TabValue;
  className?: string;
  children: React.ReactNode;
}

function TabsContent({ value, className, children }: TabsContentProps) {
  const { activeValue, baseId } = useTabsContext("Tabs.Content");

  if (activeValue !== value) {
    return null;
  }

  return (
    <div
      id={`${baseId}-content-${value}`}
      role="tabpanel"
      aria-labelledby={`${baseId}-trigger-${value}`}
      className={cn("animate-in fade-in duration-300", className)}
    >
      {children}
    </div>
  );
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});
