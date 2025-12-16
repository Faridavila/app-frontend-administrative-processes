import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { GetAllNumerationNoPage } from "../../Numeration/API/NumerationAPI"; 

interface NumerationSelectProps {
  selectedValue: number;
  onChange: (newValue: number) => void;
}

const NumerationSelect: React.FC<NumerationSelectProps> = ({ selectedValue, onChange }) => {
  const fetchNumerations = async () => {
    try {
      const NumerationData = await GetAllNumerationNoPage();
      
      if (NumerationData && Array.isArray(NumerationData)) {
        return NumerationData.map(dep => ({
          id: dep.id,
          displayLabel: `${dep.prefix}(${dep.initialNumber}-${dep.finalNumber})`,
        }));
      }
      return null;
    } catch (error) {
      console.error('Error fetching Numerations:', error);
      return null;
    }
  };

  return (
    <GenericSelect
      fetchData={fetchNumerations}
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="displayLabel"
      valueKey="id"
      placeholder="Seleccione un rango de numeración"
    />
  );
};

export default NumerationSelect;