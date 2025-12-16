import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { GetAllClientNoPage } from '../../Client/API/ClientAPI';

interface ClientSelectProps {
  selectedValue: number;
  onChange: (newValue: number) => void;
}

const ClientSelect: React.FC<ClientSelectProps> = ({ selectedValue, onChange }) => {
  // Función que formatea los datos del departamento
  const fetchClients = async () => {
    try {
      const ClientData = await GetAllClientNoPage();
      
      if (ClientData && Array.isArray(ClientData)) {
        // Transformamos los datos para que tengan el formato correcto
        return ClientData.map(dep => ({
          id: dep.id,
          displayLabel: `${dep.name}-${dep.identification}`,
        }));
      }
      return null;
    } catch (error) {
      console.error('Error fetching Clients:', error);
      return null;
    }
  };

  return (
    <GenericSelect
      fetchData={fetchClients}
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="displayLabel"
      valueKey="id"
      placeholder="Seleccione un cliente"
    />
  );
};

export default ClientSelect;