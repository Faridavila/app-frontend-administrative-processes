import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { ClientTypes } from '../../Client/Types/ClientTypes';
import { GetAllClientNoPage } from '../../Client/API/ClientAPI';

const fetchClients = async (): Promise<ClientTypes[]> => {
  const ClientsData = await GetAllClientNoPage();
  return ClientsData || [];
};

const ClientsSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchClients} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="name" 
      valueKey="id"             
      placeholder="Seleccione un cliente"
    />
  );
};

export default ClientsSelect;
