import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { ActionTypes } from '../../Action/Types/ActionTypes';
import { GetAllActionNoPage } from '../../Action/API/ActionAPI';

const fetchAction = async (): Promise<ActionTypes[]> => {
  const ActionData = await GetAllActionNoPage();
  return ActionData || [];
};

const ActionSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchAction} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="nameAction" 
      valueKey="id"             
      placeholder="Seleccione un accion"
    />
  );
};

export default ActionSelect;
