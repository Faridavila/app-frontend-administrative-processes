// src/components/Warehouse/WarehouseTypeSelectWrapper.tsx
import React from "react";
import GenericSelect from "../../GeneralComponents/GeneralCrud/SelectGeneral";
import { GetAllWarehouseTypesNoPage } from "../../WarehouseType/API/WarehousesTypesAPI";

// Función para obtener los tipos de bodega sin paginación
const fetchWarehouseTypes = async (): Promise<
  { id: number; description: string }[]
> => {
  try {
    const warehouseTypeData = await GetAllWarehouseTypesNoPage();
    return warehouseTypeData || [];
  } catch (error) {
    console.error("Error al obtener los tipos de bodega:", error);
    return [];
  }
};

const WarehouseTypeSelectWrapper: React.FC<{
  selectedValue: number;
  onChange: (newValue: number) => void;
}> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchWarehouseTypes}
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="description"
      valueKey="id"
      placeholder="Seleccione el tipo de bodega"
    />
  );
};

export default WarehouseTypeSelectWrapper;
