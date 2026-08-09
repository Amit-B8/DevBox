"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function DataAnonymizer() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  
  // Toggles for which data to scrub
  const [scrubEmail, setScrubEmail] = useState(true);
  const [scrubPhone, setScrubPhone] = useState(true);
  const [scrubSSN, setScrubSSN] = useState(true);

  const handleAnonymize = () => {
    let processedText = inputText;

    if (scrubEmail) {
      // Matches standard email formats
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      processedText = processedText.replace(emailRegex, '[REDACTED_EMAIL]');
    }

    if (scrubPhone) {
      // Matches various US phone formats like (123) 456-7890, 123-456-7890, 123.456.7890
      const phoneRegex = /\b(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\b/g;
      processedText = processedText.replace(phoneRegex, '[REDACTED_PHONE]');
    }

    if (scrubSSN) {
      // Matches standard 9-digit US Social Security Numbers
      const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
      processedText = processedText.replace(ssnRegex, '[REDACTED_SSN]');
    }

    setOutputText(processedText);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };