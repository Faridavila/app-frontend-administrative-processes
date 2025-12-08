import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { CompanyType } from '../../Company/Types/Company';
import { GetCompany } from '../../Company/API/CompanyAPI';

const fetchCompany = async (): Promise<CompanyType[]> => {
  const response = await GetCompany();


  if (response && 'data' in response && Array.isArray(response.data)) {
    return response.data;  
  }else if (Array.isArray(response)) {
    return response;
  }
  return [];
};

const CompanySelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchCompany} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="companyName" 
      valueKey="id"             
      placeholder="Seleccione una empresa"
    />
  );
};

export default CompanySelect;
