import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';

interface ClientSelectProps {
  selectedValue: number | null;
  onChange: (newValue: number | null) => void;
  clientes: any[]; // ✅ NUEVO: Recibe los clientes como prop
}

const ClientSelect: React.FC<ClientSelectProps> = ({ 
  selectedValue, 
  onChange,
  clientes // ✅ NUEVO
}) => {

  // ✅ NUEVO: En lugar de fetchear, usa los datos que ya tienes
  const fetchClients = async () => {
    try {
      if (clientes && Array.isArray(clientes)) {
        return clientes.map(dep => ({
          id: dep.id,
          displayLabel: `${dep.identification || 'Sin ID'} - ${dep.name}`,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error processing Clients:', error);
      return [];
    }
  };

  return (
    <GenericSelect
      fetchData={fetchClients}
      selectedValue={selectedValue || 0}
      onChange={onChange}
      labelKey="displayLabel"
      valueKey="id"
      placeholder="Seleccione un cliente"
    />
  );
};

export default ClientSelect;