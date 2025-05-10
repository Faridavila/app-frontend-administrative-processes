import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { PositionTypes } from '../../Position/Types/PositionTypes';
import { GetAllPositionNoPage } from '../../Position/API/PositionAPI';

const fetchPosition = async (): Promise<PositionTypes[]> => {
  const response = await GetAllPositionNoPage();


  if (response && 'data' in response && Array.isArray(response.data)) {
    return response.data;  
  }else if (Array.isArray(response)) {
    return response;
  }
  return [];
};

const PositionSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchPosition} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="description" 
      valueKey="id"             
      placeholder="Seleccione una opcion del Position"
    />
  );
};

export default PositionSelect;
