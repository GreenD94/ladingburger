export interface PillSelectOption {
  id: string;
  label: string;
  value: string;
}

export interface PillSelectProps {
  options: PillSelectOption[];
  selectedValues: string[];
  onSelectionChange: (selectedValues: string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  maxVisible?: number;
  onSearch?: (query: string) => Promise<PillSelectOption[]> | PillSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}

