import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { GetAllDepartmentNoPage } from '../../Department/API/DepartmentAPI';  

export interface DepartmentOption {
  value: number;
  label: string;
}

interface DepartmentSelectProps {
  selectedValue: number;
  onChange: (newValue: number) => void;
}

const DepartmentSelect: React.FC<DepartmentSelectProps> = ({ selectedValue, onChange }) => {
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentOption | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentData = await GetAllDepartmentNoPage();
        if (departmentData) {
          const departmentOptions = departmentData.map(dep => ({
            value: dep.id,
            label: `${dep.departmentCode}-${dep.departmentName}`,
          }));

          setDepartments(departmentOptions);
          setSelectedDepartment(departmentOptions.find(dep => dep.value === selectedValue) || null);
        } else {
          console.warn('No department data returned.');
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
  
    fetchDepartments();
  }, [selectedValue]);
  
  const handleDepartmentChange = (option: any) => {
    setSelectedDepartment(option);
    onChange(option?.value);  
  };

  return (
    <div>
      <Select
        options={departments}
        value={selectedDepartment}
        onChange={handleDepartmentChange}
        placeholder="Seleccione un departamento"
      />
    </div>
  );
};

export default DepartmentSelect;
