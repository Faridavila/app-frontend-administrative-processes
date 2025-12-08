import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { GetAllCityNoPage } from '../../City/API/CityAPI';

interface CitySelectProps {
  selectedValue: number;
  onChange: (newValue: number) => void;
}

const CitySelect: React.FC<CitySelectProps> = ({ selectedValue, onChange }) => {
  // Función que formatea los datos del departamento
  const fetchCitys = async () => {
    try {
      const CityData = await GetAllCityNoPage();
      
      if (CityData && Array.isArray(CityData)) {
        // Transformamos los datos para que tengan el formato correcto
        return CityData.map(dep => ({
          id: dep.id,
          displayLabel: `${dep.cityCode}-${dep.cityName}`,
        }));
      }
      return null;
    } catch (error) {
      console.error('Error fetching Citys:', error);
      return null;
    }
  };

  return (
    <GenericSelect
      fetchData={fetchCitys}
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="displayLabel"
      valueKey="id"
      placeholder="Seleccione un municipio"
    />
  );
};

export default CitySelect;