import React, { useEffect } from 'react';
import Form from 'react-bootstrap/Form';

interface MainBranchCheckboxProps {
  value: string;
  onChange: (newValue: string) => void;
}

const MainBranchCheckbox: React.FC<MainBranchCheckboxProps> = ({ value, onChange }) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked ? 'principal' : 'no principal');
  };

  useEffect(() => {
    if (!value) {
      onChange('no principal');
    }
  }, [value, onChange]);

  return (
    <Form.Check
      type="checkbox"
      label="Principal"
      checked={value === 'principal'}
      onChange={handleCheckboxChange}
    />
  );
};

export default MainBranchCheckbox;
