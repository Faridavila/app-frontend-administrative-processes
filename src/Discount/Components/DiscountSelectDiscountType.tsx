import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { DiscountTypeTypes } from '../../DiscountType/Types/DiscountTypeTypes';
import { GetAllDiscountTypeNoPage } from '../../DiscountType/API/DiscountTypeAPI';

const fetchAccountingDocumentTypess = async (): Promise<DiscountTypeTypes[]> => {
  const AccountingDocumentTypesData = await GetAllDiscountTypeNoPage();
  return AccountingDocumentTypesData || [];
};

const AccountingDocumentTypesSelectWrapper: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchAccountingDocumentTypess} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="description" 
      valueKey="id"             
      placeholder="Seleccione un tipo de documento"
    />
  );
};

export default AccountingDocumentTypesSelectWrapper;
