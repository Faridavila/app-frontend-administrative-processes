import React, { useState } from 'react';
import './Calculator.css';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [lastCalculation, setLastCalculation] = useState<string>('');

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setLastCalculation('');
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '%':
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(String(inputValue));
      setLastCalculation('');
    } else if (operation) {
      const currentValue = previousValue || '0';
      const newValue = calculate(parseFloat(currentValue), inputValue, operation);
      
      if (nextOperation === '=') {
        setLastCalculation(`${currentValue} ${operation} ${inputValue} =`);
      }
      
      setDisplay(String(newValue));
      setPreviousValue(String(newValue));
    }

    setWaitingForOperand(true);
    
    if (nextOperation === '=') {
      setOperation(null);
      setPreviousValue(null);
    } else {
      setOperation(nextOperation);
      setLastCalculation('');
    }
  };

  const toggleSign = () => {
    const newValue = parseFloat(display) * -1;
    setDisplay(String(newValue));
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  interface ButtonProps {
    value: string | React.ReactNode;
    onClick: () => void;
    className?: string;
    span?: number;
  }

  const Button: React.FC<ButtonProps> = ({ value, onClick, className = '', span = 1 }) => (
    <button
      className={`calc-button ${className}`}
      onClick={onClick}
      style={span > 1 ? { gridColumn: `span ${span}` } : {}}
    >
      {value}
    </button>
  );

  return (
    <div className="calculator-wrapper">
      <div className="calculator-container">
        <div className="calculator-card">
          <div className="calculator-header">
            <div className="calculator-icon">
              <span>🧮</span>
            </div>
            <h2 className="calculator-title">Calculadora</h2>
          </div>

          <div className="calculator-display">
            <div className="display-operation">
              {lastCalculation || (previousValue && operation ? `${previousValue} ${operation}` : '')}
            </div>
            <div className="display-value">{display}</div>
          </div>

          <div className="calculator-keypad">
            <Button value="C" onClick={clear} className="function" />
            <Button value="⌫" onClick={backspace} className="function" />
            <Button value="%" onClick={inputPercent} className="function" />
            <Button value="÷" onClick={() => performOperation('÷')} className="operator" />

            <Button value="7" onClick={() => inputDigit('7')} />
            <Button value="8" onClick={() => inputDigit('8')} />
            <Button value="9" onClick={() => inputDigit('9')} />
            <Button value="×" onClick={() => performOperation('×')} className="operator" />

            <Button value="4" onClick={() => inputDigit('4')} />
            <Button value="5" onClick={() => inputDigit('5')} />
            <Button value="6" onClick={() => inputDigit('6')} />
            <Button value="-" onClick={() => performOperation('-')} className="operator" />

            <Button value="1" onClick={() => inputDigit('1')} />
            <Button value="2" onClick={() => inputDigit('2')} />
            <Button value="3" onClick={() => inputDigit('3')} />
            <Button value="+" onClick={() => performOperation('+')} className="operator" />

            <Button value="±" onClick={toggleSign} />
            <Button value="0" onClick={() => inputDigit('0')} />
            <Button value="." onClick={inputDecimal} />
            <Button value="=" onClick={() => performOperation('=')} className="equals" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;