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
  const [copyError, setCopyError] = useState(false);
  const [includeOwnText, setIncludeOwnText] = useState(false);
  const [ownText, setOwnText] = useState('');
  const prefix = includeOwnText ? ownText : '';
  const randomLength = length - Array.from(prefix).length;
  const groupCount = [includeUppercase, includeLowercase, includeNumbers, includeSymbols].filter(Boolean).length;
  const textError = randomLength < Math.max(1, groupCount)
    ? `Shorten your text or increase the length to leave room for at least ${Math.max(1, groupCount)} random characters.`
    : '';

  const generatePassword = useCallback(() => {
    setCopyError(false);
    if (textError) {
      setPassword('');
      setCopied(false);
      return;
    }
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

    const newPassword = prefix + createPassword(randomLength, characterGroups);

    setPassword(newPassword);
    setCopied(false);
  }, [
    prefix,
    randomLength,
    textError,
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
    // Browser-only randomness must run after hydration, including when options change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generatePassword();
  }, [generatePassword]);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    if (
      textError || !password ||
      password === EMPTY_SELECTION_MESSAGE
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(password);

      setCopied(true);
      setCopyError(false);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 bg-gray-950 text-white flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col">

        <Link
          href="/utilities"
          className="text-blue-400 hover:text-blue-300 text-sm mb-6 inline-block"
        >
            &larr; All utilities
        </Link>

        <header className="mb-5">
          <h1 className="text-3xl font-bold tracking-tight">
            Secure Password Generator
          </h1>

          <p className="text-gray-400 mt-1">
            Create a random password, choose your options, and copy it in one click.
          </p>
          <p className="text-sm text-emerald-400 mt-3">
            Free to use. No sign-up. Generated in your browser.
          </p>
        </header>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 md:p-8 shadow-xl mb-6">

          {/* Password Display */}
          <div className="mb-8">
            <label htmlFor="generated-password" className="block text-sm font-medium text-gray-300 mb-2">
              Your password
            </label>
            <textarea
              id="generated-password"
              readOnly
              spellCheck={false}
              rows={2}
              value={textError || password === EMPTY_SELECTION_MESSAGE ? '' : password}
              placeholder="Your password will appear here"
              onFocus={(event) => event.currentTarget.select()}
              className="block w-full resize-none bg-gray-800 border border-gray-600 rounded-lg p-4 text-xl md:text-2xl font-mono text-emerald-400 break-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            />

            <div className="mt-3 grid grid-cols-1 min-[360px]:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={generatePassword}
              disabled={!!textError || groupCount === 0}
              className="w-full bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white px-3 py-3 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              Generate password
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={
                !!textError || !password ||
                password === EMPTY_SELECTION_MESSAGE
              }
              className={`w-full py-3 px-4 rounded-md font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 ${
                copied
                  ? 'bg-emerald-600 text-white border border-emerald-500'
                  : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {copied ? 'Copied!' : 'Copy password'}
            </button>
            </div>
            <p role="status" className="mt-2 text-sm text-gray-300">
              {textError ? textError : password === EMPTY_SELECTION_MESSAGE
                ? 'Choose at least one character type below to generate a password.'
                : copyError
                  ? 'Copy was blocked by your browser. Select the password above and copy it manually.'
                  : copied
                    ? 'Password copied to clipboard.'
                    : 'Options below update your password automatically.'}
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-6">

            <div>
              <button
                type="button"
                aria-expanded={includeOwnText}
                aria-controls="own-text-options"
                onClick={() => setIncludeOwnText(!includeOwnText)}
                className="text-sm font-semibold text-blue-400 hover:text-blue-300 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                {includeOwnText ? 'Remove your own text' : '+ Include your own text'}
              </button>
              {includeOwnText && (
                <div id="own-text-options" className="mt-2 space-y-2">
                  <label htmlFor="own-text" className="block text-sm text-gray-300">Start the password with</label>
                  <input
                    id="own-text"
                    type="text"
                    value={ownText}
                    onChange={(event) => setOwnText(event.target.value)}
                    maxLength={64}
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="e.g. car08"
                    aria-describedby="own-text-help own-text-count"
                    aria-invalid={!!textError}
                    className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-3 font-mono text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                  />
                  <p id="own-text-count" className="text-sm text-gray-300">
                    {textError || `${Array.from(prefix).length} typed + ${randomLength} random = ${length} characters.`}
                  </p>
                  <p id="own-text-help" className="text-sm text-gray-400">
                    We keep your text at the start and add random characters using the options below. Fully random passwords are harder to guess.
                  </p>
                </div>
              )}
            </div>

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


        <p className="mt-5 text-sm text-gray-400 text-center">
          Use a different password for each account and save it in your password manager.
        </p>

      </div>
    </main>
  );
}
