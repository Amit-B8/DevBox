'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, CircleDot } from 'lucide-react';

type GateType = 'AND' | 'OR' | 'NAND' | 'NOR' | 'XOR';

export default function LogicSimulator() {
  const [gateType, setGateType] = useState<GateType>('AND');
  const [inputA, setInputA] = useState(0);
  const [inputB, setInputB] = useState(0);

  const calculateOutput = (gate: GateType, a: number, b: number): number => {
    switch (gate) {
      case 'AND':
        return a & b;
      case 'OR':
        return a | b;
      case 'NAND':
        return ~(a & b) & 1;
      case 'NOR':
        return ~(a | b) & 1;
      case 'XOR':
        return a ^ b;
      default:
        return 0;
    }
  };

  const output = calculateOutput(gateType, inputA, inputB);

  // Truth tables for each gate
  const truthTables = {
    AND: [
      { a: 0, b: 0, output: 0 },
      { a: 0, b: 1, output: 0 },
      { a: 1, b: 0, output: 0 },
      { a: 1, b: 1, output: 1 },
    ],
    OR: [
      { a: 0, b: 0, output: 0 },
      { a: 0, b: 1, output: 1 },
      { a: 1, b: 0, output: 1 },
      { a: 1, b: 1, output: 1 },
    ],
    NAND: [
      { a: 0, b: 0, output: 1 },
      { a: 0, b: 1, output: 1 },
      { a: 1, b: 0, output: 1 },
      { a: 1, b: 1, output: 0 },
    ],
    NOR: [
      { a: 0, b: 0, output: 1 },
      { a: 0, b: 1, output: 0 },
      { a: 1, b: 0, output: 0 },
      { a: 1, b: 1, output: 0 },
    ],
    XOR: [
      { a: 0, b: 0, output: 0 },
      { a: 0, b: 1, output: 1 },
      { a: 1, b: 0, output: 1 },
      { a: 1, b: 1, output: 0 },
    ],
  };

  const gateDescriptions = {
    AND: 'Output is 1 only if both inputs are 1',
    OR: 'Output is 1 if at least one input is 1',
    NAND: 'NOT AND - Output is 0 only if both inputs are 1',
    NOR: 'NOT OR - Output is 1 only if both inputs are 0',
    XOR: 'Exclusive OR - Output is 1 if inputs differ',
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Back Button */}
        <Link
          href="/engineering"
          className="inline-flex items-center text-slate-400 hover:text-slate-200 transition-colors mb-8 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Engineering & Systems
        </Link>

        {/* Header */}
        <header className="mb-10 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <CircleDot className="w-7 h-7 text-slate-300" />
            <h1 className="text-3xl font-bold tracking-tight">Logic Gate Simulator</h1>
          </div>
          <p className="text-gray-400">Simulate digital logic gates with configurable inputs. Visualize truth tables and understand gate behavior for circuit design and digital electronics.</p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Simulator Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gate Selection */}
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Logic Gate
                </label>
                <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
                  {(['AND', 'OR', 'NAND', 'NOR', 'XOR'] as GateType[]).map((gate) => (
                    <button
                      key={gate}
                      onClick={() => setGateType(gate)}
                      className={`px-3 py-2 rounded font-mono text-sm font-semibold transition-all ${
                        gateType === gate
                          ? 'bg-blue-600 text-white border border-blue-500'
                          : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      {gate}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-800 rounded border border-gray-700">
                <p className="text-xs text-gray-400 mb-2">Gate Description</p>
                <p className="text-sm text-gray-200">{gateDescriptions[gateType]}</p>
              </div>
            </div>

            {/* Input Controls */}
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 space-y-6">
              <h2 className="text-lg font-semibold text-gray-100">Inputs</h2>

              {/* Input A */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Input A
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded border-2 flex items-center justify-center font-bold ${
                        inputA === 1
                          ? 'bg-green-900 border-green-600 text-green-400'
                          : 'bg-gray-800 border-gray-700 text-gray-500'
                      }`}
                    >
                      {inputA}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setInputA(0)}
                    className={`flex-1 px-4 py-2 rounded font-medium transition-all ${
                      inputA === 0
                        ? 'bg-blue-600 text-white border border-blue-500'
                        : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    0 (Low)
                  </button>
                  <button
                    onClick={() => setInputA(1)}
                    className={`flex-1 px-4 py-2 rounded font-medium transition-all ${
                      inputA === 1
                        ? 'bg-blue-600 text-white border border-blue-500'
                        : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    1 (High)
                  </button>
                </div>
              </div>

              {/* Input B */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Input B
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded border-2 flex items-center justify-center font-bold ${
                        inputB === 1
                          ? 'bg-green-900 border-green-600 text-green-400'
                          : 'bg-gray-800 border-gray-700 text-gray-500'
                      }`}
                    >
                      {inputB}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setInputB(0)}
                    className={`flex-1 px-4 py-2 rounded font-medium transition-all ${
                      inputB === 0
                        ? 'bg-blue-600 text-white border border-blue-500'
                        : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    0 (Low)
                  </button>
                  <button
                    onClick={() => setInputB(1)}
                    className={`flex-1 px-4 py-2 rounded font-medium transition-all ${
                      inputB === 1
                        ? 'bg-blue-600 text-white border border-blue-500'
                        : 'bg-gray-800 border border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    1 (High)
                  </button>
                </div>
              </div>
            </div>

            {/* Output Display */}
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-sm text-gray-400 mb-4">Output</p>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">Result</p>
                  <div
                    className={`w-16 h-16 rounded-lg border-4 flex items-center justify-center font-bold text-4xl ${
                      output === 1
                        ? 'bg-green-900 border-green-600 text-green-400'
                        : 'bg-red-900 border-red-600 text-red-400'
                    }`}
                  >
                    {output}
                  </div>
                </div>
                <div>
                  <p className="text-gray-300 font-mono">
                    {inputA} {gateType} {inputB} = <span className={output === 1 ? 'text-green-400' : 'text-red-400'}>{output}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {output === 1 ? 'Output: HIGH (Logic 1)' : 'Output: LOW (Logic 0)'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Truth Table Sidebar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Truth Table</h3>
            <div className="overflow-x-auto border border-gray-800 rounded-lg bg-gray-900">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-3 py-2 text-left text-gray-300">A</th>
                    <th className="px-3 py-2 text-left text-gray-300">B</th>
                    <th className="px-3 py-2 text-left text-gray-300">Out</th>
                  </tr>
                </thead>
                <tbody>
                  {truthTables[gateType].map((row, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-gray-800 transition ${
                        row.a === inputA && row.b === inputB
                          ? 'bg-blue-900/30 border-blue-700'
                          : 'hover:bg-gray-800/50'
                      }`}
                    >
                      <td className="px-3 py-2 font-mono text-gray-300">{row.a}</td>
                      <td className="px-3 py-2 font-mono text-gray-300">{row.b}</td>
                      <td className={`px-3 py-2 font-mono font-bold ${
                        row.output === 1 ? 'text-green-400' : 'text-gray-500'
                      }`}>
                        {row.output}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Gate Symbols Reference */}
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-xs font-semibold text-gray-300 mb-3">Digital Logic</p>
              <div className="space-y-2 text-xs text-gray-400">
                <p><span className="text-gray-300">Bit 0:</span> Logic LOW</p>
                <p><span className="text-gray-300">Bit 1:</span> Logic HIGH</p>
                <p className="mt-3 text-gray-500">Universal gates: NAND, NOR can implement any logic function.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
