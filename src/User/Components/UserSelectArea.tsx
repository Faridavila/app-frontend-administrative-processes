import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { AreaTypes } from '../../Area/Types/AreaTypes';
import { GetAllAreaNoPage } from '../../Area/API/AreaAPI';

const fetchArea = async (): Promise<AreaTypes[]> => {
  const response = await GetAllAreaNoPage();


  if (response && 'data' in response && Array.isArray(response.data)) {
    return response.data;  
  }else if (Array.isArray(response)) {
    return response;
  }
  return [];
};

const AreaSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchArea} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="description" 
      valueKey="id"             
      placeholder="Seleccione una opcion del Area"
    />
  );
};

export default AreaSelect;
