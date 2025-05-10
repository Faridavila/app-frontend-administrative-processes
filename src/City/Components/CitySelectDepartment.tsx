import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { DepartmentTypes } from '../../Department/Types/DepartmentTypes';
import { GetAllDepartmentNoPage } from '../../Department/API/DepartmentAPI';

const fetchDepartments = async (): Promise<DepartmentTypes[]> => {
  const departmentData = await GetAllDepartmentNoPage();
  return departmentData || [];
};

const DepartmentSelectWrapper: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchDepartments} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="departmentName" 
      valueKey="id"             
      placeholder="Seleccione un departamento"
    />
  );
};

export default DepartmentSelectWrapper;
