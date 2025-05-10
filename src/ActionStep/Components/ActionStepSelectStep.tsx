import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { StepTypes } from '../../Step/Types/StepTypes';
import { GetAllStepNoPage } from '../../Step/API/StepAPI';

const fetchActionStep = async (): Promise<StepTypes[]> => {
  const ActionStepData = await GetAllStepNoPage();
  return ActionStepData || [];
};

const StepSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchActionStep} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="name" 
      valueKey="id"             
      placeholder="Seleccione un paso"
    />
  );
};

export default StepSelect;
