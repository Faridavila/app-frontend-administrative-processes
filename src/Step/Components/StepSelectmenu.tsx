import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { MenuTypes } from '../../Menu/Types/MenuTypes';
import { GetAllMenuesNoPage } from '../../Menu/API/MenuAPI';

const fetchMenu = async (): Promise<MenuTypes[]> => {
  const response = await GetAllMenuesNoPage();


  if (response && 'data' in response && Array.isArray(response.data)) {
    return response.data;  
  }else if (Array.isArray(response)) {
    return response;
  }
  return [];
};

const MenuSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchMenu} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="name" 
      valueKey="id"             
      placeholder="Seleccione una opcion del menu"
    />
  );
};

export default MenuSelect;
