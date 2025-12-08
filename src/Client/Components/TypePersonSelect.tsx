import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { TypePersonTypes } from '../Types/TypePersonType';
import { GetAllTypePerson } from '../API/ClientAPI';


const fetchTypePersons = async (): Promise<TypePersonTypes[]> => {
  const TypePersonData = await GetAllTypePerson();
  return TypePersonData || [];
};


const TypePersonSelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchTypePersons} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="description" 
      valueKey="typePersonId"             
      placeholder="Seleccione un tipo de identificacion"
    />
  );
};

export default TypePersonSelect;
