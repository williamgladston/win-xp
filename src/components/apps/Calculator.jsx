import React, { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) setDisplay(display + '.');
  };

  const clearAll = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const toggleSign = () => {
    setDisplay(String(-parseFloat(display)));
  };

  const inputPercent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const performOperation = (nextOperator) => {
    const current = parseFloat(display);

    if (prevValue !== null && operator && !waitingForOperand) {
      let result;
      switch (operator) {
        case '+': result = prevValue + current; break;
        case '-': result = prevValue - current; break;
        case '*': result = prevValue * current; break;
        case '/': result = current !== 0 ? prevValue / current : 'Error'; break;
        default: result = current;
      }
      setDisplay(String(result));
      setPrevValue(typeof result === 'number' ? result : null);
    } else {
      setPrevValue(current);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  };

  const calculate = () => {
    performOperation(null);
    setOperator(null);
  };

  const backspace = () => {
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };

  const sqrt = () => {
    const val = parseFloat(display);
    setDisplay(val >= 0 ? String(Math.sqrt(val)) : 'Error');
  };

  const inverse = () => {
    const val = parseFloat(display);
    setDisplay(val !== 0 ? String(1 / val) : 'Error');
  };

  const Btn = ({ label, onClick, className = '', span = 1 }) => (
    <button
      className={`xp-button text-xs font-bold h-[26px] ${className}`}
      style={{ gridColumn: span > 1 ? `span ${span}` : undefined }}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8]">
      {/* Menu bar */}
      <div className="xp-menubar">
        <span className="xp-menubar-item">Edit</span>
        <span className="xp-menubar-item">View</span>
        <span className="xp-menubar-item">Help</span>
      </div>

      <div className="p-2 flex flex-col gap-2 flex-1">
        {/* Display */}
        <div className="bg-white border-2 border-gray-400 p-1 text-right text-lg font-bold tracking-wide"
          style={{ fontFamily: 'Courier New, monospace', minHeight: '28px' }}>
          {display}
        </div>

        {/* Memory and Control Rows */}
        <div className="grid grid-cols-5 gap-1">
          <Btn label="MC" onClick={() => setMemory(0)} className="text-red-700" />
          <Btn label="MR" onClick={() => { setDisplay(String(memory)); setWaitingForOperand(true); }} className="text-red-700" />
          <Btn label="MS" onClick={() => setMemory(parseFloat(display))} className="text-red-700" />
          <Btn label="M+" onClick={() => setMemory(memory + parseFloat(display))} className="text-red-700" />
          <Btn label="⌫" onClick={backspace} className="text-red-700" />
        </div>

        <div className="grid grid-cols-5 gap-1">
          <Btn label="CE" onClick={clearEntry} className="text-red-700" />
          <Btn label="C" onClick={clearAll} className="text-red-700" />
          <Btn label="±" onClick={toggleSign} className="text-blue-800" />
          <Btn label="√" onClick={sqrt} className="text-blue-800" />
          <Btn label="/" onClick={() => performOperation('/')} className="text-red-700" />
        </div>

        {/* Number pad */}
        <div className="grid grid-cols-5 gap-1">
          <Btn label="7" onClick={() => inputDigit(7)} className="text-blue-900" />
          <Btn label="8" onClick={() => inputDigit(8)} className="text-blue-900" />
          <Btn label="9" onClick={() => inputDigit(9)} className="text-blue-900" />
          <Btn label="×" onClick={() => performOperation('*')} className="text-red-700" />
          <Btn label="%" onClick={inputPercent} className="text-blue-800" />
        </div>
        <div className="grid grid-cols-5 gap-1">
          <Btn label="4" onClick={() => inputDigit(4)} className="text-blue-900" />
          <Btn label="5" onClick={() => inputDigit(5)} className="text-blue-900" />
          <Btn label="6" onClick={() => inputDigit(6)} className="text-blue-900" />
          <Btn label="-" onClick={() => performOperation('-')} className="text-red-700" />
          <Btn label="1/x" onClick={inverse} className="text-blue-800" />
        </div>
        <div className="grid grid-cols-5 gap-1">
          <Btn label="1" onClick={() => inputDigit(1)} className="text-blue-900" />
          <Btn label="2" onClick={() => inputDigit(2)} className="text-blue-900" />
          <Btn label="3" onClick={() => inputDigit(3)} className="text-blue-900" />
          <Btn label="+" onClick={() => performOperation('+')} className="text-red-700" />
          <Btn label="=" onClick={calculate} className="text-red-700" />
        </div>
        <div className="grid grid-cols-5 gap-1">
          <Btn label="0" onClick={() => inputDigit(0)} span={2} className="text-blue-900" />
          <Btn label="." onClick={inputDot} className="text-blue-900" />
          <div /><div />
        </div>
      </div>
    </div>
  );
}
