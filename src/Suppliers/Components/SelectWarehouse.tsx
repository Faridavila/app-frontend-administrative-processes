import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { WarehouseTypes } from '../../Warehouse/Types/WarehouseTypes';
import { GetAllWarehousesNoPage } from '../../Warehouse/API/WarehousesAPI';

const fetchWarehouses = async (): Promise<WarehouseTypes[]> => {
  const WarehouseData = await GetAllWarehousesNoPage();
  return WarehouseData || [];
};

const WarehouseSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchWarehouses} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="warehouseName" 
      valueKey="id"             
      placeholder="Seleccione una bodega"
    />
  );
};

export default WarehouseSelect;
