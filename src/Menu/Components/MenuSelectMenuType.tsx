import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { MenuTypeTypes } from '../Types/MenuTypeTypes';
import { GetAllMenuTypeNoPage } from '../API/MenuTypeAPI';

const fetchMenuType = async (): Promise<MenuTypeTypes[]> => {
  const MenuTypeData = await GetAllMenuTypeNoPage();
  return MenuTypeData || [];
};

const MenuTypeSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchMenuType} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="description" 
      valueKey="id"             
      placeholder="Seleccione el tipo de menu"
    />
  );
};

export default MenuTypeSelect;
