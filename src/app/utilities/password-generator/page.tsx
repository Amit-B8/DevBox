"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

const EMPTY_SELECTION_MESSAGE = 'Select at least one option';

/**
 * Returns a cryptographically secure random index.
 */
function getRandomIndex(max: number) {
  const randomValues = new Uint32Array(1);

  // Prevent modulo bias.
  const limit = Math.floor(0x100000000 / max) * max;

  let randomValue = 0;

  do {
    crypto.getRandomValues(randomValues);
    randomValue = randomValues[0];
  } while (randomValue >= limit);

  return randomValue % max;
}

/**
 * Returns one secure random character from a character set.
 */
function getRandomCharacter(charset: string) {
  return charset[getRandomIndex(charset.length)];
}

/**
 * Creates a brand-new password.
 *
 * It also guarantees at least one character from every
 * selected character group.
 */
function createPassword(length: number, characterGroups: string[]) {
  const allCharacters = characterGroups.join('');
  const passwordCharacters: string[] = [];

  // Guarantee at least one character from each enabled group.
  for (const group of characterGroups) {
    passwordCharacters.push(getRandomCharacter(group));
  }

  // Fill the rest of the password.
  while (passwordCharacters.length < length) {
    passwordCharacters.push(getRandomCharacter(allCharacters));
  }

  // Shuffle so guaranteed characters are not always at the beginning.
  for (let i = passwordCharacters.length - 1; i > 0; i -= 1) {
    const randomIndex = getRandomIndex(i + 1);

    [passwordCharacters[i], passwordCharacters[randomIndex]] = [
      passwordCharacters[randomIndex],
      passwordCharacters[i],
    ];
  }

  return passwordCharacters.join('');
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);

  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const characterGroups: string[] = [];

    if (includeLowercase) {
      characterGroups.push(LOWERCASE);
    }

    if (includeUppercase) {
      characterGroups.push(UPPERCASE);
    }

    if (includeNumbers) {
      characterGroups.push(NUMBERS);
    }

    if (includeSymbols) {
      characterGroups.push(SYMBOLS);
    }

    if (characterGroups.length === 0) {
      setPassword(EMPTY_SELECTION_MESSAGE);
      setCopied(false);
      return;
    }

    const newPassword = createPassword(length, characterGroups);

    setPassword(newPassword);
    setCopied(false);
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  ]);

  /**
   * Generate a completely new password whenever
   * the length or any character option changes.
   */
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = async () => {
    if (
      !password ||
      password === EMPTY_SELECTION_MESSAGE
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(password);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-950 text-white flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col">

        <Link
          href="/utilities"
          className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block"
        >
          &larr; Back to Utilities Tools
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Secure Password Generator
          </h1>

          <p className="text-gray-400 mt-1">
            Generate strong, random passwords instantly in your browser.
          </p>
        </header>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 shadow-xl mb-6">

          {/* Password Display */}
          <div className="relative mb-8">
            <div className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 pr-24 text-xl md:text-2xl font-mono text-emerald-400 break-all min-h-[4rem] flex items-center">
              {password}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              disabled={
                !password ||
                password === EMPTY_SELECTION_MESSAGE
              }
              className={`absolute right-2 top-2 bottom-2 px-4 rounded-md font-semibold transition-all ${
                copied
                  ? 'bg-emerald-600 text-white border border-emerald-500'
                  : 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Controls */}
          <div className="space-y-6">

            {/* Length Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password-length"
                  className="text-sm font-semibold text-gray-400 uppercase tracking-wider"
                >
                  Password Length
                </label>

                <span className="text-xl font-bold text-blue-400">
                  {length}
                </span>
              </div>

              <input
                id="password-length"
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) =>
                  setLength(Number(e.target.value))
                }
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-800">

              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) =>
                    setIncludeUppercase(e.target.checked)
                  }
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800 cursor-pointer"
                />

                <span className="text-gray-300 group-hover:text-white transition-colors">
                  Uppercase (A-Z)
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) =>
                    setIncludeLowercase(e.target.checked)
                  }
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800 cursor-pointer"
                />

                <span className="text-gray-300 group-hover:text-white transition-colors">
                  Lowercase (a-z)
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) =>
                    setIncludeNumbers(e.target.checked)
                  }
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800 cursor-pointer"
                />

                <span className="text-gray-300 group-hover:text-white transition-colors">
                  Numbers (0-9)
                </span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) =>
                    setIncludeSymbols(e.target.checked)
                  }
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800 cursor-pointer"
                />

                <span className="text-gray-300 group-hover:text-white transition-colors">
                  Symbols (!@#$...)
                </span>
              </label>

            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={generatePassword}
          className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:border-blue-500 active:scale-[0.98]"
        >
          🔄 Generate New Password
        </button>

      </div>
    </main>
  );
}