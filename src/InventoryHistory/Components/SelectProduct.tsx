import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { ProductTypes } from '../Types/InventoryHistoryTypes';
import { GetAllProductNoPage } from '../API/InventoryHistoryAPI';

const fetchProducts = async (): Promise<ProductTypes[]> => {
  const ProductData = await GetAllProductNoPage();
  return ProductData || [];
};

const ProductSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchProducts} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="productName" 
      valueKey="id"             
      placeholder="Seleccione una producto"
    />
  );
};

export default ProductSelect;
