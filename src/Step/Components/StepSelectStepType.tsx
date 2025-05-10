import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { StepTypeTypes } from '../../StepType/Types/StepTypeTypes';
import { GetAllStepTypeNoPage } from '../../StepType/API/StepTypeAPI';

const fetchStepType = async (): Promise<StepTypeTypes[]> => {
  const StepTypeData = await GetAllStepTypeNoPage();
  return StepTypeData || [];
};

const StepTypeSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchStepType} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="description" 
      valueKey="id"             
      placeholder="Seleccione el tipo de paso"
    />
  );
};

export default StepTypeSelect;
