import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { ProductTypes } from '../Types/InventoryTypes';
import { GetAllProductNoPage } from '../API/InventoryAPI';

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
      placeholder="Seleccione un producto"
    />
  );
};

export default ProductSelect;
