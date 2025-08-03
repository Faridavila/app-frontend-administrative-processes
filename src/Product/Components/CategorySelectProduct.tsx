import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { CategoryTypes } from '../../Category/Types/CategoryTypes';
import { GetAllCategoryNoPage } from '../../Category/API/Category';

const fetchCatogorys = async (): Promise<CategoryTypes[]> => {
  const CatogoryData = await GetAllCategoryNoPage();
  return CatogoryData || [];
};

const CategorySelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchCatogorys} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="nameCategory" 
      valueKey="id"             
      placeholder="Seleccione una categoría"
    />
  );
};

export default CategorySelect;
