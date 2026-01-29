import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { PendingOrderTypes } from '../../PendingOrder/Types/PendingOrderTypes';
import { GetAllPendingOrderNoPage } from '../../PendingOrder/API/PendingOrderAPI';

interface PendingOrderOption extends PendingOrderTypes {
  displayLabel: string;
}

const fetchPendingOrders = async (): Promise<PendingOrderOption[]> => {
  const PendingOrdersData = await GetAllPendingOrderNoPage();
  return (PendingOrdersData || []).map(order => ({
    ...order,
    displayLabel: `Pedido #${order.id} - ${order.customerName}`
  }));
};

interface PendingOrdersSelectProps {
  selectedValue: number;
  onChange: (newValue: number, orderData?: PendingOrderTypes) => void;
}

const PendingOrdersSelect: React.FC<PendingOrdersSelectProps> = ({ 
  selectedValue, 
  onChange 
}) => {
  const handleChange = (newValue: number, fullData?: any) => {
    onChange(newValue, fullData);
  };

  return (
    <GenericSelect
      fetchData={fetchPendingOrders} 
      selectedValue={selectedValue}
      onChange={handleChange}
      labelKey="displayLabel"
      valueKey="id"             
      placeholder="Seleccione un pedido"
    />
  );
};

export default PendingOrdersSelect;