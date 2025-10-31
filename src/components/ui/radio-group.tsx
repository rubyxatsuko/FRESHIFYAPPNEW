import * as React from "react";
import { Circle } from "../../lib/icons";
import { cn } from "./utils";

interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined);

const useRadioGroupContext = () => {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error("RadioGroupItem must be used within RadioGroup");
  }
  return context;
};

interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  children: React.ReactNode;
  className?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value: controlledValue, defaultValue, onValueChange, name, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "");
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleValueChange = (newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    return (
      <RadioGroupContext.Provider value={{ value, onValueChange: handleValueChange, name }}>
        <div ref={ref} className={cn("grid gap-2", className)} {...props} />
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value: itemValue, ...props }, ref) => {
    const { value, onValueChange, name } = useRadioGroupContext();
    const isChecked = value === itemValue;

    return (
      <div 
        className="relative inline-flex items-center cursor-pointer"
        onClick={() => onValueChange(itemValue)}
      >
        <input
          type="radio"
          className="peer sr-only"
          ref={ref}
          name={name}
          value={itemValue}
          checked={isChecked}
          onChange={() => onValueChange(itemValue)}
          {...props}
        />
        <div
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-full border border-gray-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer-checked:border-green-600 flex items-center justify-center",
            className
          )}
        >
          {isChecked && <Circle className="h-2.5 w-2.5 fill-green-600 text-green-600" />}
        </div>
      </div>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
