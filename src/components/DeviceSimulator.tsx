/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Music,
  Presentation,
  Mic,
  Wifi, 
  Battery, 
  ShieldCheck, 
  RefreshCw,
  Heart,
  Users,
  Sparkles,
  FileText
} from 'lucide-react';

type TabApp = 'loopera' | 'decksy' | 'triphoy';

export default function DeviceSimulator() {
  const [activeApp, setActiveApp] = useState<TabApp>('loopera');
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:41');
  
  const [onlineCount, setOnlineCount] = useState(142);
  const [loopCount, setLoopCount] = useState(200);
  const [likesToday, setLikesToday] = useState(24);
  const [agentProgress, setAgentProgress] = useState(34);
  const [slidesGenerated, setSlidesGenerated] = useState(12);
  const [triphoyTracks, setTriphoyTracks] = useState(10);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const delta = isSimulating ? Math.floor(Math.random() * 8) + 2 : Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return next < 120 ? 120 : next > 200 ? 200 : next;
      });
      setLoopCount(prev => prev + (isSimulating ? 3 : Math.floor(Math.random() * 2)));
      setLikesToday(prev => prev + (isSimulating ? 2 : Math.floor(Math.random() * 2)));
      setAgentProgress(prev => {
        if (isSimulating) return prev >= 100 ? 12 : prev + 8;
        return prev < 5 ? 34 : prev + Math.floor(Math.random() * 3) - 1;
      });
      setSlidesGenerated(prev => prev + (isSimulating ? 1 : 0));
      setTriphoyTracks(prev => (isSimulating && prev < 10 ? prev : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const triggerDiagnosticOverride = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 6000);
  };

  return (
    <div id="device-simulator-component" className="w-full max-w-4xl mx-auto rounded-3xl bg-apple-gray-50 border border-apple-gray-100 p-6 shadow-2xl overflow-hidden">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div id="ios-hardware-bezel" className="relative w-full max-w-[340px] aspect-[9/18.5] bg-neutral-900 rounded-[50px] p-3.5 shadow-2xl border-4 border-neutral-800 ring-1 ring-neutral-700/50">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-3xl z-40 flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 ring-2 ring-neutral-800"></div>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isSimulating ? 'bg-apple-orange animate-pulse' : 'bg-emerald-400'}`}></span>
              <span className="text-[9px] font-semibold text-neutral-400 font-sans tracking-widest uppercase">
                {isSimulating ? 'LIVE' : 'ОНЛАЙН'}
              </span>
            </div>
            <div className="w-3 h-3 rounded-full bg-blue-900 border-2 border-stone-800"></div>
          </div>

          <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-white flex flex-col justify-between select-none">
            <div className="px-6 pt-7 pb-2 flex justify-between items-center text-xs font-semibold text-apple-gray-900/90 z-30 bg-white/60 backdrop-blur-sm">
              <span className="font-sans leading-none">{currentTime}</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[10px] tracking-tight">5G</span>
                <Battery className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
              </div>
            </div>

            <div className="flex-1 w-full overflow-y-auto px-4 py-2 flex flex-col justify-start">
              <div className="mt-2 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-apple-gray-300 font-mono">MATVEEV GROUP</p>
                  <h4 className="text-lg font-bold text-apple-gray-900">Портфель</h4>
                </div>
                <button 
                  onClick={triggerDiagnosticOverride}
                  className="p-1.5 rounded-full bg-apple-gray-50 border border-apple-gray-100 hover:bg-apple-gray-100 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-apple-blue ${isSimulating ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeApp === 'loopera' && (
                  <motion.div
                    key="app-loopera"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-3.5"
                  >
                    <div className="bg-[#faeffc] border border-[#ece0ef] rounded-2.5xl p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white text-[10px] font-medium text-purple-600 border border-[#ece0ef]/60">
                          <Music className="w-3 h-3" /> Loopera
                        </span>
                        <span className="text-[10px] font-mono text-emerald-500">{onlineCount} онлайн</span>
                      </div>

                      <div>
                        <p className="text-xs text-apple-gray-300">Библиотека лупов</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-apple-gray-900 font-sans tracking-tight">
                            {loopCount}+
                          </span>
                          <span className="text-xs font-semibold text-apple-gray-300">лупов</span>
                        </div>
                      </div>

                      <div className="h-10 w-full flex items-end gap-1 px-1 bg-white/40 rounded-lg">
                        {Array.from({ length: 22 }).map((_, index) => {
                          const heightFactor = isSimulating 
                            ? (index % 4 === 0 ? 90 : (index % 2 === 0 ? 30 : 15)) 
                            : (index % 6 === 0 ? 70 : (index % 3 === 0 ? 40 : 20));
                          return (
                            <div 
                              key={index} 
                              className="flex-1 rounded-t-sm transition-all duration-300"
                              style={{ 
                                height: `${heightFactor}%`, 
                                backgroundColor: isSimulating ? '#bf5af2' : '#d4a5f5',
                                opacity: index / 22 + 0.2
                              }}
                            />
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="bg-white/70 p-2.5 rounded-xl border border-apple-gray-100/50">
                          <span className="text-[9px] text-apple-gray-300 block">Лайков сегодня</span>
                          <span className="font-bold text-xs text-purple-600">+{likesToday}</span>
                        </div>
                        <div className="bg-white/70 p-2.5 rounded-xl border border-apple-gray-100/50">
                          <span className="text-[9px] text-apple-gray-300 block">Продюсеров</span>
                          <span className="font-bold text-xs text-apple-gray-900">500+</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-apple-gray-50 border border-apple-gray-100 rounded-2xl p-3 flex gap-3 items-center">
                      <div className="w-9 h-9 rounded-full bg-[#f0f6fc] flex items-center justify-center border border-[#d6e4f5]">
                        <Heart className="w-5 h-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-bold text-apple-gray-900">Горячие лупы</p>
                        <p className="text-[10px] text-apple-gray-300">Тренды по лайкам и свежести.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeApp === 'decksy' && (
                  <motion.div
                    key="app-decksy"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-3.5"
                  >
                    <div className="bg-[#f0f6fc] border border-[#d6e4f5] rounded-2.5xl p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white text-[10px] font-medium text-apple-blue border border-[#d6e4f5]/60">
                          <Presentation className="w-3 h-3" /> Decksy Agent
                        </span>
                        <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> AI
                        </span>
                      </div>

                      <div>
                        <p className="text-xs text-apple-gray-300">Генерация pitch deck</p>
                        <div className="flex justify-between items-baseline mt-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold text-apple-gray-900 font-sans tracking-tight">
                              {agentProgress}%
                            </span>
                            <span className="text-xs font-semibold text-apple-blue font-mono">готово</span>
                          </div>
                          <span className="text-xs font-bold text-apple-gray-900">{slidesGenerated} слайдов</span>
                        </div>
                      </div>

                      <div className="w-full bg-apple-gray-100 h-2 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-apple-blue rounded-full"
                          animate={{ width: `${agentProgress}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </div>

                      <div className="bg-white/80 rounded-xl p-3 border border-apple-gray-100">
                        <p className="text-[10px] text-apple-gray-300 uppercase font-mono tracking-wider mb-2">Зоны агента</p>
                        <div className="flex flex-col gap-1.5 text-xs text-apple-gray-900 font-mono">
                          <div className="flex justify-between">
                            <span>Prompt</span>
                            <span className="text-emerald-500 font-semibold">[OK]</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Agent Output</span>
                            <span className="text-apple-blue font-semibold animate-pulse">[GEN]</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Files</span>
                            <span className="text-apple-gray-300 font-semibold">[WAIT]</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeApp === 'triphoy' && (
                  <motion.div
                    key="app-triphoy"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-3.5"
                  >
                    <div className="bg-[#fff9f0] border border-[#ffead0] rounded-2.5xl p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white text-[10px] font-medium text-[#c45100] border border-[#ffead0]/60">
                          <Mic className="w-3 h-3" /> Triphoy
                        </span>
                        <span className="text-[10px] font-mono text-apple-gray-300">Лейбл</span>
                      </div>

                      <div>
                        <p className="text-xs text-apple-gray-300">Релизов от лейбла</p>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-3xl font-extrabold text-apple-gray-900 font-sans tracking-tight">
                            ~{triphoyTracks}
                          </span>
                          <span className="text-xs font-semibold text-apple-gray-300">треков</span>
                        </div>
                      </div>

                      <div className="bg-white/80 p-3 rounded-xl border border-apple-gray-100 flex flex-col gap-1.5">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-apple-gray-300">Продакшн:</span>
                          <span className="font-bold text-[#c45100]">rap-исполнители</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-apple-gray-300">Telegram:</span>
                          <span className="font-bold text-apple-gray-900">@triphoy_prod</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white/80 p-2.5 rounded-xl border border-apple-gray-100 flex flex-col">
                          <span className="text-[10px] text-apple-gray-300">Направление</span>
                          <span className="font-extrabold text-apple-gray-900 mt-1">hip-hop / trap</span>
                        </div>
                        <div className="bg-white/80 p-2.5 rounded-xl border border-apple-gray-100 flex flex-col">
                          <span className="text-[10px] text-apple-gray-300">Статус</span>
                          <span className="font-extrabold text-emerald-500 mt-1">активен</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-auto mb-4 bg-apple-gray-50/80 backdrop-blur-md rounded-2.5xl p-2.5 flex justify-center gap-3 border border-apple-gray-100/60 z-30">
                <button
                  onClick={() => setActiveApp('loopera')}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${activeApp === 'loopera' ? 'bg-white shadow-md scale-105 border border-apple-gray-100' : 'hover:bg-white/50 bg-transparent'}`}
                >
                  <Music className="w-5 h-5 text-purple-500" />
                </button>
                <button
                  onClick={() => setActiveApp('decksy')}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${activeApp === 'decksy' ? 'bg-white shadow-md scale-105 border border-apple-gray-100' : 'hover:bg-white/50 bg-transparent'}`}
                >
                  <Presentation className="w-5 h-5 text-apple-blue" />
                </button>
                <button
                  onClick={() => setActiveApp('triphoy')}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${activeApp === 'triphoy' ? 'bg-white shadow-md scale-105 border border-apple-gray-100' : 'hover:bg-white/50 bg-transparent'}`}
                >
                  <Mic className="w-5 h-5 text-apple-orange" />
                </button>
              </div>
            </div>

            <div className="pb-3 pt-1 flex justify-center w-full z-30">
              <div className="w-32 h-1 bg-apple-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col justify-center">
          <span className="text-[11px] font-extrabold font-mono tracking-wider text-apple-blue uppercase mb-2">Обзор портфеля</span>
          <h3 className="text-3xl font-extrabold text-apple-gray-900 tracking-tight mb-4">
            Три направления — одна группа.
          </h3>
          <p className="text-apple-gray-300 text-sm leading-relaxed mb-6">
            Matveev Group объединяет Loopera (платформа), Decksy (AI-продукт) и Triphoy (лейбл). Каждое направление развивается автономно.
          </p>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setActiveApp('loopera')}
              className={`text-left p-3.5 rounded-2xl border transition-all ${activeApp === 'loopera' ? 'bg-white shadow-md border-purple-400 font-semibold text-apple-gray-900' : 'bg-transparent border-apple-gray-100 hover:bg-white/40'}`}
            >
              <div className="flex items-center gap-2.5">
                <Music className="w-4 h-4 text-purple-500" />
                <span className="text-sm">Loopera — музыкальная платформа</span>
              </div>
            </button>

            <button 
              onClick={() => setActiveApp('decksy')}
              className={`text-left p-3.5 rounded-2xl border transition-all ${activeApp === 'decksy' ? 'bg-white shadow-md border-apple-blue font-semibold text-apple-gray-900' : 'bg-transparent border-apple-gray-100 hover:bg-white/40'}`}
            >
              <div className="flex items-center gap-2.5">
                <Presentation className="w-4 h-4 text-apple-blue" />
                <span className="text-sm">Decksy — AI-продукт</span>
              </div>
            </button>

            <button 
              onClick={() => setActiveApp('triphoy')}
              className={`text-left p-3.5 rounded-2xl border transition-all ${activeApp === 'triphoy' ? 'bg-white shadow-md border-apple-orange font-semibold text-apple-gray-900' : 'bg-transparent border-apple-gray-100 hover:bg-white/40'}`}
            >
              <div className="flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-apple-orange" />
                <span className="text-sm">Triphoy — лейбл и бренд</span>
              </div>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-apple-gray-100/60 flex items-center justify-between">
            <span className="text-xs font-mono text-apple-gray-300">
              {isSimulating ? "Симуляция данных..." : "Статус: активно"}
            </span>
            <button 
              onClick={triggerDiagnosticOverride}
              className="text-xs font-semibold text-apple-blue flex items-center gap-1 hover:underline"
            >
              {isSimulating ? "Обновление..." : "Обновить показатели →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
