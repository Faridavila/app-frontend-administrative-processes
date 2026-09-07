import React, { useCallback } from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { ClientFilterField, GetClientsByField } from '../../Client/API/ClientAPI';
import { Client } from '../Types/InvoiceType';

type ClientSearchCriterion = 'nombre' | 'celular' | 'direccion' | 'barrio';

interface ClientSelectProps {
  selectedValue: number | null;
  onChange: (newValue: number | null, selectedClient?: Client) => void;
  clientes: Client[];
  searchCriterion: ClientSearchCriterion;
}

const fieldByCriterion: Record<ClientSearchCriterion, ClientFilterField> = {
  nombre: 'name',
  celular: 'phone',
  direccion: 'address',
  barrio: 'neighborhood',
};

const ClientSelect: React.FC<ClientSelectProps> = ({ 
  selectedValue, 
  onChange,
  clientes,
  searchCriterion,
}) => {
  const formatClients = useCallback((clientList: Client[]) => {
    return clientList.map(client => {
      const criterionValue = {
        nombre: client.name,
        celular: client.phone,
        direccion: client.address,
        barrio: client.neighborhood,
      }[searchCriterion];

      return {
        ...client,
        displayLabel: searchCriterion === 'nombre'
          ? client.name
          : `${criterionValue || 'Sin información'} - ${client.name}`,
      };
    });
  }, [searchCriterion]);

  const fetchClients = useCallback(async () => {
    return formatClients(clientes);
  }, [clientes, formatClients]);

  const searchClients = useCallback(async (searchTerm: string) => {
    const results = await GetClientsByField(
      fieldByCriterion[searchCriterion],
      searchTerm,
    );
    const normalizedClients: Client[] = results.map(client => {
      const loadedClient = clientes.find(item => item.id === client.id);

      return {
        id: client.id,
        name: client.name,
        phone: client.phone,
        identification: client.identification,
        address: client.address,
        neighborhood: client.neighborhood,
        cityName: client.municipality || client.neighborhood || '',
        commission: Boolean(client.commission ?? loadedClient?.commission),
      };
    });
    return formatClients(normalizedClients);
  }, [clientes, formatClients, searchCriterion]);

  return (
    <GenericSelect
      fetchData={fetchClients}
      searchData={searchClients}
      selectedValue={selectedValue || 0}
      onChange={onChange}
      labelKey="displayLabel"
      valueKey="id"
      placeholder="Seleccione un cliente"
    />
  );
};

export default ClientSelect;