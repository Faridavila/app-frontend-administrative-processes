import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { TaxLiabilityTypes } from '../Types/TaxLiabilityTypes';
import { GetAllTaxLiability } from '../API/ClientAPI';


const fetchTaxLiabilitys = async (): Promise<TaxLiabilityTypes[]> => {
  const TaxLiabilityData = await GetAllTaxLiability();
  return TaxLiabilityData || [];
};



const TaxLiabilitySelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchTaxLiabilitys} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="name" 
      valueKey="id"             
      placeholder="Seleccione un tipo de identificacion"
    />
  );
};

export default TaxLiabilitySelect;
