import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { RolTypes } from '../../Rol/Types/RolTypes';
import { GetAllRolNoPage } from '../../Rol/API/RolAPI';

const fetchRol = async (): Promise<RolTypes[]> => {
  const response = await GetAllRolNoPage();


  if (response && 'data' in response && Array.isArray(response.data)) {
    return response.data;  
  }else if (Array.isArray(response)) {
    return response;
  }
  return [];
};

const RolSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchRol} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="name" 
      valueKey="id"             
      placeholder="Seleccione una opcion del Rol"
    />
  );
};

export default RolSelect;
