import React, { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, FormControl, ListGroup } from 'react-bootstrap';

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
  const [allOptions, setAllOptions] = useState<SelectOption[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchData();
        
        if (data && Array.isArray(data) && data.length > 0) { 
          const formattedOptions = data.map(item => ({
            value: item[valueKey],
            label: item[labelKey],
          }));
  
          setAllOptions(formattedOptions);
          setFilteredOptions(formattedOptions);
          setSelectedOption(formattedOptions.find(option => option.value === selectedValue) || null);
        } else {
          setAllOptions([]);
          setFilteredOptions([]);
          setSelectedOption(null);
          console.warn('No data returned or data is not an array.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error al cargar las opciones');
      } finally {
        setLoading(false);
      }
    };
  
    fetchOptions();
  }, [fetchData, labelKey, valueKey]);  
  
  useEffect(() => {
    if (allOptions.length > 0) {
      setSelectedOption(allOptions.find(option => option.value === selectedValue) || null);
    }
  }, [selectedValue, allOptions]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOptions(allOptions);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = allOptions.filter(option =>
        option.label.toLowerCase().includes(lowerSearch)
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, allOptions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(true);

    if (newValue.trim() === '') {
      setSelectedOption(null);
      onChange(0);
    }
  };

  const handleSelectOption = (option: SelectOption) => {
    setSelectedOption(option);
    setSearchTerm(option.label);
    onChange(option.value);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  if (error) {
    return (
      <Form.Select
        disabled
        aria-label={placeholder}
        className="form-select"
      >
        <option value="">{error}</option>
      </Form.Select>
    );
  }


  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <div ref={dropdownRef} className="position-relative">
  <InputGroup>
        <FormControl
          type="text"
          placeholder={displayValue}
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={toggleDropdown}
          readOnly={!isOpen}
          className="form-control"
          aria-label={placeholder}
          style={{ paddingRight: '2.5rem' }}
        />
        <span 
          onClick={toggleDropdown}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            zIndex: 10,
            cursor: 'pointer',
            color: '#6c757d',
            fontSize: '0.75rem',
            opacity: 0.7
          }}
        >
          ▼
        </span>
      </InputGroup>
      {isOpen && (
        <ListGroup 
          className="position-absolute w-100 shadow-sm border" 
          style={{ zIndex: 1050, maxHeight: '200px', overflowY: 'auto' }}
        >
          {filteredOptions.length === 0 ? (
            <ListGroup.Item className="text-muted">No se encontraron opciones</ListGroup.Item>
          ) : (
            filteredOptions.map((option) => (
              <ListGroup.Item
                key={option.value}
                action
                active={selectedOption?.value === option.value}
                onClick={() => handleSelectOption(option)}
                className="border-0"
              >
                {option.label}
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      )}
    </div>
  );
};

export default GenericSelect;