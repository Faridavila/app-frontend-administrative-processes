import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { IdentificationTypeTypes } from '../Types/IdentificacionTypeTypes';
import { GetAllIdentificationType } from '../API/ClientAPI';


const fetchIdentificationTypes = async (): Promise<IdentificationTypeTypes[]> => {
  const IdentificationTypeData = await GetAllIdentificationType();
  return IdentificationTypeData || [];
};


const IdentificationTypeSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchIdentificationTypes} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="name" 
      valueKey="identificationTypeId"             
      placeholder="Seleccione un tipo de identificacion"
    />
  );
};

export default IdentificationTypeSelect;
