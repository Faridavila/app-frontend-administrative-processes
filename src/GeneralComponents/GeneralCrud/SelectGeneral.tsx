import React, { useState, useEffect } from 'react';
import Select from 'react-select';

export interface SelectOption {
  value: number;
  label: string;
}

interface GenericSelectProps {
  fetchData: () => Promise<any[] | null>; 
  selectedValue: number;
  onChange: (newValue: number) => void;
  labelKey: string; 
  valueKey: string; 
  placeholder?: string;
}

const GenericSelect: React.FC<GenericSelectProps> = ({ 
  fetchData, 
  selectedValue, 
  onChange, 
  labelKey, 
  valueKey,
  placeholder = "Seleccione una opción",
}) => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await fetchData();
        
        if (data && Array.isArray(data)) {  // Asegura que los datos sean un arreglo
          const formattedOptions = data.map(item => ({
            value: item[valueKey],
            label: item[labelKey],
          }));
  
          setOptions(formattedOptions);
          setSelectedOption(formattedOptions.find(option => option.value === selectedValue) || null);
        } else {
          console.warn('No data returned or data is not an array.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchOptions();
  }, [fetchData, selectedValue, labelKey, valueKey]);
  
  const handleChange = (option: any) => {
    setSelectedOption(option);
    onChange(option?.value);  
  };

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};

export default GenericSelect;
