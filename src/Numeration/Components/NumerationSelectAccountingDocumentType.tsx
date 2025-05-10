import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { AccountingDocumentTypesTypes } from '../../AccountingDocumentTypes/Types/AccountingDocumentTypesTypes';
import { GetAllAccountingDocumentTypesNoPage } from '../../AccountingDocumentTypes/API/AccountingDocumentTypesAPI';

const fetchAccountingDocumentTypess = async (): Promise<AccountingDocumentTypesTypes[]> => {
  const AccountingDocumentTypesData = await GetAllAccountingDocumentTypesNoPage();
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
