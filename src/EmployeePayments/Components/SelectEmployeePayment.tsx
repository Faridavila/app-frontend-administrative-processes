import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { EmployeePaymentTypes } from '../Types/EmployeePaymentTypes';
import { GetAllEmployeePaymentNoPage } from '../API/EmployeePaymentAPI';

const fetchEmployeePayments = async (): Promise<EmployeePaymentTypes[]> => {
  const EmployeePaymentData = await GetAllEmployeePaymentNoPage();
  return EmployeePaymentData || [];
};

const EmployeePaymentSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchEmployeePayments} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="EmployeePaymentName" 
      valueKey="id"             
      placeholder="Seleccione un empleado"
    />
  );
};

export default EmployeePaymentSelect;
