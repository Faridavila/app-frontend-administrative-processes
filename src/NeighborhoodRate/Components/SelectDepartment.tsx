import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { GetAllDepartmentNoPage } from '../../Department/API/DepartmentAPI';

interface DepartmentSelectProps {
  selectedValue: number;
  onChange: (newValue: number) => void;
}

const DepartmentSelect: React.FC<DepartmentSelectProps> = ({ selectedValue, onChange }) => {
  const fetchDepartments = async () => {
    try {
      const departmentData = await GetAllDepartmentNoPage();
      
      if (departmentData && Array.isArray(departmentData)) {
        return departmentData.map(dep => ({
          id: dep.id,
          displayLabel: `${dep.departmentCode}-${dep.departmentName}`,
        }));
      }
      return null;
    } catch (error) {
      console.error('Error fetching departments:', error);
      return null;
    }
  };

  return (
    <GenericSelect
      fetchData={fetchDepartments}
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="displayLabel"
      valueKey="id"
      placeholder="Seleccione un departamento"
    />
  );
};

export default DepartmentSelect;