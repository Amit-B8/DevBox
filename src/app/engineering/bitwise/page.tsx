"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function BitwiseCalculator() {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operation, setOperation] = useState('AND');
}

  const calculate = () => {
    const val1 = parseInt(num1, 10);
    const val2 = parseInt(num2, 10);

    if (isNaN(val1)) return { dec: 0, bin: '0' };

    let result = 0;
    switch (operation) {
      case 'AND': result = val1 & (isNaN(val2) ? 0 : val2); break;
      case 'OR': result = val1 | (isNaN(val2) ? 0 : val2); break;
      case 'XOR': result = val1 ^ (isNaN(val2) ? 0 : val2); break;
      case 'NOT': result = ~val1; break;
      case 'LSHIFT': result = val1 << (isNaN(val2) ? 0 : val2); break;
      case 'RSHIFT': result = val1 >> (isNaN(val2) ? 0 : val2); break;
    }

    const unsignedResult = result >>> 0;
    
    return {
      dec: result,
      bin: unsignedResult.toString(2).padStart(8, '0')
    };
  };

  const result = calculate();