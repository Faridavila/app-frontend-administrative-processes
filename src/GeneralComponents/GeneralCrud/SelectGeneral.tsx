import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Form, InputGroup, FormControl, ListGroup } from 'react-bootstrap';

export interface SelectOption {
  value: number;
  label: string;
}

interface GenericSelectProps {
  fetchData: () => Promise<any[] | null>; 
  searchData?: (searchTerm: string) => Promise<any[] | null>;
  selectedValue: number;
  onChange: (newValue: number, selectedItem?: any) => void;
  labelKey: string; 
  valueKey: string; 
  placeholder?: string;
}

const GenericSelect: React.FC<GenericSelectProps> = ({ 
  fetchData, 
  searchData,
  selectedValue, 
  onChange, 
  labelKey, 
  valueKey,
  placeholder = "Seleccione una opción",
}) => {
  const [allOptions, setAllOptions] = useState<SelectOption[]>([]);
  const [allData, setAllData] = useState<any[]>([]); 
  const [initialData, setInitialData] = useState<any[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRequestRef = useRef(0);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchData();
        
        if (data && Array.isArray(data) && data.length > 0) {
          setAllData(data);
          setInitialData(data);
          
          const formattedOptions = data.map(item => ({
            value: item[valueKey],
            label: item[labelKey],
          }));
  
          setAllOptions(formattedOptions);
          setFilteredOptions(formattedOptions);
          setSelectedOption(formattedOptions.find(option => option.value === selectedValue) || null);
        } else {
          setAllData([]);
          setInitialData([]);
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
      const foundOption = allOptions.find(option => option.value === selectedValue);
      setSelectedOption(foundOption || null);
      
      if (!foundOption || selectedValue === 0) {
        setSearchTerm('');
      }
    } else if (selectedValue === 0) {
      setSelectedOption(null);
      setSearchTerm('');
    }
  }, [selectedValue, allOptions]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setAllData(initialData);
      setFilteredOptions(allOptions);
      return;
    }

    if (selectedOption && searchTerm === selectedOption.label) {
      return;
    }

    if (!searchData) {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = allOptions.filter(option =>
        option.label.toLowerCase().includes(lowerSearch)
      );
      setFilteredOptions(filtered);
      return;
    }

    const requestId = ++searchRequestRef.current;
    const timeoutId = window.setTimeout(async () => {
      try {
        const data = await searchData(searchTerm.trim());
        if (requestId !== searchRequestRef.current) return;

        const results = Array.isArray(data) ? data : [];
        setAllData(results);
        setFilteredOptions(results.map(item => ({
          value: item[valueKey],
          label: item[labelKey],
        })));
      } catch (error) {
        if (requestId !== searchRequestRef.current) return;
        console.error('Error searching options:', error);
        setAllData([]);
        setFilteredOptions([]);
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm, allOptions, initialData, searchData, selectedOption, labelKey, valueKey]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
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
    
    const fullItem = allData.find(item => item[valueKey] === option.value);

    onChange(option.value, fullItem);
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

  const dropdownPortal = isOpen ? ReactDOM.createPortal(
    <div 
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        zIndex: 99999,
      }}
    >
      <ListGroup 
        className="shadow-sm" 
        style={{ 
          maxHeight: '200px', 
          overflowY: 'auto',
          borderRadius: '0.375rem',
        }}
      >
        {filteredOptions.length === 0 ? (
          <ListGroup.Item 
            className="text-muted"
            style={{ 
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              borderBottom: 'none',
            }}
          >
            No se encontraron opciones
          </ListGroup.Item>
        ) : (
          filteredOptions.map((option) => (
            <ListGroup.Item
              key={option.value}
              action
              active={selectedOption?.value === option.value}
              onClick={() => handleSelectOption(option)}
              style={{
                cursor: 'pointer',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
              }}
            >
              {option.label}
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </div>,
    document.body
  ) : null;

  return (
    <div className="position-relative">
      <InputGroup>
        <FormControl
          ref={inputRef}
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
            pointerEvents: 'auto',
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
      {dropdownPortal}
    </div>
  );
};

export default GenericSelect;