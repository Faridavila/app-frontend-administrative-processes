import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { GetAllEconomicActivityNoPage } from '../../EconomicActivity/API/EconomicActivity';

interface EconomicActivitySelectProps {
  selectedValue: number;
  onChange: (newValue: number) => void; // Solo recibe el ID como número
}

const EconomicActivitySelect: React.FC<EconomicActivitySelectProps> = ({ selectedValue, onChange }) => {

  const fetchEconomicActivitys = async () => {
    try {
      const EconomicActivityData = await GetAllEconomicActivityNoPage();
      
      if (EconomicActivityData && Array.isArray(EconomicActivityData)) {
        return EconomicActivityData.map(act => ({
          id: act.id,
          displayLabel: `${act.ciiuCode} - ${act.description}`,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching EconomicActivitys:', error);
      return [];
    }
  };

  return (
    <GenericSelect
      fetchData={fetchEconomicActivitys}
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="displayLabel"
      valueKey="id"
      placeholder="Seleccione una actividad económica"
    />
  );
};

export default EconomicActivitySelect;