import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { CategoryTypes } from '../../Category/Types/CategoryTypes';
import { GetAllCategoryNoPage } from '../../Category/API/Category';

const fetchCategory = async (): Promise<CategoryTypes[]> => {
  const response = await GetAllCategoryNoPage()
  if (response && 'data' in response && Array.isArray(response.data)) {
    return response.data;  
  }else if (Array.isArray(response)) {
    return response;
  }
  return [];
};

const CategorySelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchCategory} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="nameCategory" 
      valueKey="id"             
      placeholder="Seleccione una cargo"
    />
  );
};

export default CategorySelect;
