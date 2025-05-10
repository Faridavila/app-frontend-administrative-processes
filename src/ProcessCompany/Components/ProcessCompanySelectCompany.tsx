import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { GetCompany } from '../../Company/API/CompanyAPI';  

export interface CompanyOption {
  value: number;
  label: string;
}

interface CompanySelectProps {
  selectedValue: number;
  onChange: (newValue: number) => void;
}

const CompanySelect: React.FC<CompanySelectProps> = ({ selectedValue, onChange }) => {
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companyData = await GetCompany();
        if (Array.isArray(companyData)) {
          const companyOptions = companyData.map((company: any) => ({
            value: company.id,
            label: company.companyName,  
          }));

          setCompanies(companyOptions);
          setSelectedCompany(companyOptions.find((company: any) => company.value === selectedValue) || null);
        } else {
          console.warn('La API no devolvió un array.');
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
  
    fetchCompanies();
  }, [selectedValue]);

  const handleCompanyChange = (option: any) => {
    setSelectedCompany(option);
    onChange(option?.value);
  };

  return (
    <div>
      <Select
        options={companies}
        value={selectedCompany}
        onChange={handleCompanyChange}
        placeholder="Seleccione una empresa"
      />
    </div>
  );
};

export default CompanySelect;
