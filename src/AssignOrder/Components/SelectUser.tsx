import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { UserTypes } from '../../User/Types/UserTypes';
import { GetAllUserByUser } from '../../User/API/UserAPI';

const fetchUser = async (): Promise<UserTypes[]> => {
  const UserData = await GetAllUserByUser();
  return UserData || [];
};

const SelectUser: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchUser} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="name" 
      valueKey="id"             
      placeholder="Seleccione una trasnportador"
    />
  );
};

export default SelectUser;
