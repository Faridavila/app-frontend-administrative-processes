import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { ProcessTypes } from '../../Process/Types/ProcessTypes';
import { GetAllProcessNoPage } from '../../Process/API/ProcessAPI';

const fetchProcess = async (): Promise<ProcessTypes[]> => {
  const ProcessData = await GetAllProcessNoPage();
  return ProcessData || [];
};

const ProcessSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchProcess} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="description" 
      valueKey="id"             
      placeholder="Seleccione un proceso"
    />
  );
};

export default ProcessSelect;
