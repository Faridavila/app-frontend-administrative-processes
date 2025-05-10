import { GetAllCityNoPage } from '../../City/API/CityAPI';
import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';

export interface MunicipalityOption {
  value: number;
  label: string;
}

interface MunicipalitySelectProps {
  selectedValue: number;
  departmentId: number;  
  onChange: (newValue: string) => void;
}

const MunicipalitySelect: React.FC<MunicipalitySelectProps> = ({
  selectedValue,
  departmentId, 
  onChange,
}) => {
  const [municipalities, setMunicipalities] = useState<MunicipalityOption[]>([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState<MunicipalityOption | null>(null);

  useEffect(() => {
    const fetchMunicipalities = async () => {
      try {
        const municipalityData = await GetAllCityNoPage();
        if (municipalityData) {
          const filteredMunicipalities = municipalityData.filter(
            (mun) => mun.departmentId === departmentId  
          );

          const municipalityOptions: MunicipalityOption[] = filteredMunicipalities.map((mun) => ({
            value: mun.id,
            label: `${mun.cityCode}-${mun.cityName}`,
          }));
          setMunicipalities(municipalityOptions);
          setSelectedMunicipality(
            municipalityOptions.find((mun) => mun.value === selectedValue) || null
          );
        } else {
          throw new Error('No se pudieron obtener los datos de los municipios');
        }
      } catch (error) {
        console.error('Error fetching municipalities', error);
      }
    };

    if (departmentId) { 
      fetchMunicipalities();  
    }
  }, [selectedValue, departmentId]); 

  const handleMunicipalityChange = (option: SingleValue<MunicipalityOption>) => {
    setSelectedMunicipality(option);
    onChange(option ? option.value.toString() : '');  
  };

  return (
    <Select
      options={municipalities}
      value={selectedMunicipality}
      onChange={handleMunicipalityChange}
      placeholder="Seleccione un municipio"
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value.toString()}
    />
  );
};

export default MunicipalitySelect;
