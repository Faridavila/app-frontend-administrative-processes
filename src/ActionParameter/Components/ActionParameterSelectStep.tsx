import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { ParameterTypes } from '../../Parameter/Types/ParameterTypes';
import { GetAllParameterNoPage } from '../../Parameter/API/ParameterAPI';

const fetchActionParameter = async (): Promise<ParameterTypes[]> => {
  const ActionParameterData = await GetAllParameterNoPage();
  return ActionParameterData || [];
};

const ParameterSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchActionParameter} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="parameterName" 
      valueKey="id"             
      placeholder="Seleccione un paso"
    />
  );
};

export default ParameterSelect;
