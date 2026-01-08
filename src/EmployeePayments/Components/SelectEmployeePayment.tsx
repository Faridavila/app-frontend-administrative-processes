import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { EmployeeHistoryTypes } from '../../EmployeeHistory/Types/EmployeeHistoryTypes';
import { GetAllEmployeePaymentNoPage } from '../../EmployeeHistory/API/EmployeeHistoryAPI';

const fetchEmployee = async (): Promise<EmployeeHistoryTypes[]> => {
  const response = await GetAllEmployeePaymentNoPage();
  if (response && 'data' in response && Array.isArray(response.data)) {
    return response.data;  
  } else if (Array.isArray(response)) {
    return response;
  }
  return [];
}; 

interface EmployeeSelectProps {
  selectedValue: number;
  onChange: (newValue: number, employeeData?: EmployeeHistoryTypes) => void; 
}

const EmployeeSelect: React.FC<EmployeeSelectProps> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchEmployee} 
      selectedValue={selectedValue}
      onChange={(newValue, selectedItem) => {
        onChange(newValue, selectedItem as EmployeeHistoryTypes);
      }}
      labelKey="name" 
      valueKey="id"             
      placeholder="Seleccione un empleado"
    />
  );
};

export default EmployeeSelect;