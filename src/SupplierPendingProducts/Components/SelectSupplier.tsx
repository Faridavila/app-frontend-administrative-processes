import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { SupplierTypes } from '../../Suppliers/Types/SuppliersTypes';
import { GetAllSuppliersNoPage } from '../../Suppliers/API/SuppliersAPI';

const fetchSuppliers = async (): Promise<SupplierTypes[]> => {
  const SuppliersData = await GetAllSuppliersNoPage();
  return SuppliersData || [];
};

const SuppliersSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchSuppliers} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="SuppliersName" 
      valueKey="id"             
      placeholder="Seleccione una proveedor"
    />
  );
};

export default SuppliersSelect;
