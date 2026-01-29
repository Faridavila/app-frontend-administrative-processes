import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { NeighborhoodRateTypes } from '../../NeighborhoodRate/Types/NeighborhoodRateTypes';
import { GetAllNeighborhoodRateNoPage } from '../../NeighborhoodRate/API/NeighborhoodRateAPI';

const fetchNeighborhoodRates = async (): Promise<NeighborhoodRateTypes[]> => {
  const NeighborhoodRatesData = await GetAllNeighborhoodRateNoPage();
  return NeighborhoodRatesData || [];
};

const NeighborhoodRatesSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchNeighborhoodRates} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="neighborhood" 
      valueKey="id"             
      placeholder="Seleccione una barrio"
    />
  );
};

export default NeighborhoodRatesSelect;
