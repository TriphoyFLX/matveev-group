/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calculator, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function VentureCalculator() {
  const [arr, setArr] = useState<number>(250000);
  const [growth, setGrowth] = useState<number>(75);
  const [neededCapital, setNeededCapital] = useState<number>(1000000);
  const [sector, setSector] = useState<string>('music');

  const computeStandaloneValuation = (): number => {
    const baseMult = sector === 'music' ? 8 : sector === 'ai' ? 14 : sector === 'saas' ? 11 : 9;
    const growthFactor = 1 + (growth / 100) * 0.4;
    return Math.round(arr * baseMult * growthFactor);
  };

  const computeGroupValuation = (): number => {
    const baseVal = computeStandaloneValuation();
    const synergyPremium = 1.25;
    return Math.round(baseVal * synergyPremium);
  };

  const computeDilution = (valuation: number): number => {
    if (valuation <= 0) return 0;
    const share = (neededCapital / (valuation + neededCapital)) * 100;
    return parseFloat(share.toFixed(1));
  };

  const standaloneVal = computeStandaloneValuation();
  const groupVal = computeGroupValuation();
  const standaloneDilution = computeDilution(standaloneVal);
  const groupDilution = computeDilution(groupVal);

  const getPartnerRecommendation = () => {
    switch (sector) {
      case 'music': return { name: 'Loopera + Triphoy', desc: 'Платформа и лейбл в единой музыкальной экосистеме группы.' };
      case 'ai': return { name: 'Decksy', desc: 'AI-продукт группы для подготовки инвестиционных материалов.' };
      case 'saas': return { name: 'Decksy + Loopera', desc: 'Технологический и creator-направления портфеля.' };
      default: return { name: 'Matveev Group', desc: 'Совместное развитие проектов в рамках группы.' };
    }
  };

  return (
    <div id="venture-calculator-container" className="w-full max-w-4xl mx-auto bg-white border border-apple-gray-100 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-apple-gray-50 border border-apple-gray-100 flex items-center justify-center">
          <Calculator className="w-4 h-4 text-apple-blue" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-apple-gray-300 block">Аналитическая модель</span>
          <h4 className="text-xl font-bold text-apple-gray-900">Синергия портфеля группы</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <p className="text-xs text-apple-gray-300">
            Условная модель демонстрирует потенциальный эффект объединения проектов в структуре Matveev Group по аналогии с холдинговыми моделями.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-apple-gray-900 flex justify-between">
              <span>Направление</span>
              <span className="text-[10px] font-mono text-apple-blue uppercase">выбрано</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'music', label: 'Музыка / лейбл' },
                { id: 'ai', label: 'AI / технологии' },
                { id: 'saas', label: 'SaaS / B2B' },
                { id: 'brand', label: 'Бренд / медиа' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSector(item.id)}
                  className={`py-3 px-4 rounded-xl text-left border text-xs transition-all ${sector === item.id ? 'bg-apple-gray-900 border-apple-gray-900 text-white font-medium' : 'bg-apple-gray-50 hover:bg-apple-gray-100 border-apple-gray-100/60 text-apple-gray-400'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-apple-gray-900">
              <span>Годовая выручка (ARR)</span>
              <span className="font-mono text-apple-blue">${arr.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min={50000} 
              max={2500000} 
              step={25000}
              value={arr} 
              onChange={(e) => setArr(parseInt(e.target.value))}
              className="w-full h-1 bg-apple-gray-100 rounded-lg appearance-none cursor-pointer accent-apple-blue"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-apple-gray-900">
              <span>Темп роста (YoY)</span>
              <span className="font-mono text-emerald-500">+{growth}%</span>
            </div>
            <input 
              type="range" 
              min={10} 
              max={300} 
              step={5}
              value={growth} 
              onChange={(e) => setGrowth(parseInt(e.target.value))}
              className="w-full h-1 bg-apple-gray-100 rounded-lg appearance-none cursor-pointer accent-apple-blue"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-apple-gray-900">
              <span>Объём привлечения</span>
              <span className="font-mono text-apple-orange">${neededCapital.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min={150000} 
              max={5000000} 
              step={50000}
              value={neededCapital} 
              onChange={(e) => setNeededCapital(parseInt(e.target.value))}
              className="w-full h-1 bg-apple-gray-100 rounded-lg appearance-none cursor-pointer accent-apple-blue"
            />
          </div>
        </div>

        <div className="bg-apple-gray-50 border border-apple-gray-100/70 rounded-2.5xl p-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h5 className="text-xs font-bold uppercase tracking-widest text-apple-gray-400 font-mono">
              Сравнительный анализ
            </h5>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-apple-gray-300">Отдельный проект</span>
                  <span className="font-bold text-apple-gray-900">${standaloneVal.toLocaleString()}</span>
                </div>
                <div className="relative w-full bg-apple-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 bg-apple-gray-400 h-full rounded-full w-[65%]" />
                </div>
                <p className="text-[10px] text-apple-gray-300 mt-1">
                  Доля при привлечении: <strong>{standaloneDilution}%</strong>
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-apple-blue font-semibold">В составе Matveev Group</span>
                  <span className="font-bold text-apple-blue">${groupVal.toLocaleString()}</span>
                </div>
                <div className="relative w-full bg-apple-blue/10 h-3 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 bg-apple-blue h-full rounded-full w-full" />
                </div>
                <p className="text-[10px] text-apple-blue/80 mt-1">
                  Доля при привлечении: <strong className="font-extrabold">{groupDilution}%</strong> (экономия {(standaloneDilution - groupDilution).toFixed(1)} п.п.)
                </p>
              </div>
            </div>

            <div className="bg-white border border-apple-gray-100 rounded-xl p-3.5 space-y-2">
              <span className="text-[9px] font-bold text-apple-orange font-mono uppercase">Эффект группы</span>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  Объединение проектов в группу создаёт синергию: Loopera (платформа), Triphoy (лейбл), Decksy (технологии).
                </span>
              </div>
            </div>

            <div className="border-t border-apple-gray-100 pt-4">
              <span className="text-[9px] font-bold text-apple-gray-300 font-mono uppercase block mb-1">Релевантное направление</span>
              <div className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-apple-gray-900">{getPartnerRecommendation().name}</p>
                  <p className="text-[11px] text-apple-gray-300">{getPartnerRecommendation().desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-apple-gray-200" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-apple-gray-100/60 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-apple-gray-300">
              <Lock className="w-3 h-3" /> Условная модель
            </div>
            <a 
              href="#incorporation-portal"
              className="text-center py-2 px-4 rounded-lg bg-apple-gray-950 text-white text-[11px] font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1"
            >
              Предложить сотрудничество <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
