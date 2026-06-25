/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  CreditCard, 
  HeartPulse, 
  Navigation, 
  Zap, 
  TrendingUp, 
  Shield, 
  Sun,
  Moon,
  ChevronRight, 
  Info, 
  Lock, 
  Activity, 
  Eye, 
  Leaf, 
  Coins, 
  Clock, 
  Wifi, 
  ShieldAlert, 
  Feather, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  Building2, 
  ExternalLink, 
  Calculator, 
  Sliders, 
  Globe, 
  Sparkles, 
  Menu, 
  X,
  ChevronDown,
  Calendar,
  Plus,
  Pen,
  Award,
  Network,
  Download,
  Trash2,
  Music,
  Presentation,
  Mic
} from 'lucide-react';

import { STARTUPS, PRODUCTS, CORPMILESTONES, COREPILLARS, CONTACT } from './data';
import { Startup, Product, Milestone, Pillar, FeedbackSubmission } from './types';
import DeviceSimulator from './components/DeviceSimulator';
import VentureCalculator from './components/VentureCalculator';
import MatveevLogo from './components/MatveevLogo';
import { useTheme } from './theme';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [selectedStartup, setSelectedStartup] = useState<Startup>(STARTUPS[0]);
  const [activeProductTab, setActiveProductTab] = useState<string>('');
  const [activePillarTab, setActivePillarTab] = useState<string>(COREPILLARS[0].id);
  const [milestoneFilter, setMilestoneFilter] = useState<string>('Все');
  
  // Mobile Nav toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Investor Application State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formType, setFormType] = useState<'Investment' | 'Partnership' | 'Venture Pitch' | 'Other'>('Partnership');
  const [formTier, setFormTier] = useState<'collab' | 'invest' | 'other'>('collab');
  const [formMessage, setFormMessage] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>([]);
  const [submittedHash, setSubmittedHash] = useState<string | null>(null);

  // Digital Signature Canvas Ref and States
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // Set initial product tab when active startup changes
  useEffect(() => {
    const matchingProducts = PRODUCTS.filter(p => p.startupId === selectedStartup.id);
    if (matchingProducts.length > 0) {
      setActiveProductTab(matchingProducts[0].id);
    } else {
      setActiveProductTab('');
    }
  }, [selectedStartup]);

  // Load submissions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('matveev_submissions');
    if (saved) {
      try {
        setSubmissions(JSON.parse(saved));
      } catch (e) {
        console.error("Could not parse saved submissions", e);
      }
    }
  }, []);

  // Canvas drawing handshakes
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = theme === 'light' ? '#1d1d1f' : '#f5f5f7';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const coords = getEventCoords(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setHasSigned(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getEventCoords(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const getEventCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Scale coords to match internal canvas density
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !agreedToTerms) {
      alert("Заполните обязательные поля.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Create dataURL signature representation
      let signatureData = 'Предзаполнено';
      if (canvasRef.current && hasSigned) {
        signatureData = canvasRef.current.toDataURL();
      }

      const hash = `MTVV-${Math.floor(Math.random() * 900000 + 100000)}-${Date.now().toString().slice(-4)}`;

      const newSubmission: FeedbackSubmission = {
        id: hash,
        fullName: formName,
        email: formEmail,
        companyName: formCompany || 'Частное лицо',
        interestType: formType,
        message: formMessage || 'Запрос на связь.',
        investmentTier: formTier === 'collab' ? 'Партнёрство' : formTier === 'invest' ? 'Инвестиции' : 'Иное',
        agreedToTerms,
        signature: signatureData,
        timestamp: new Date().toISOString()
      };

      const nextSubmissions = [newSubmission, ...submissions];
      setSubmissions(nextSubmissions);
      localStorage.setItem('matveev_submissions', JSON.stringify(nextSubmissions));
      setSubmittedHash(hash);
      
      // Reset forms
      setFormName('');
      setFormEmail('');
      setFormCompany('');
      setFormMessage('');
      setAgreedToTerms(false);
      clearCanvas();
      
      setIsSubmitting(false);

      // Smooth scroll to submitted ticket
      setTimeout(() => {
        document.getElementById('submitted-tickets')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);

    }, 1500);
  };

  const deleteSubmission = (id: string) => {
    const updated = submissions.filter(s => s.id !== id);
    setSubmissions(updated);
    localStorage.setItem('matveev_submissions', JSON.stringify(updated));
  };

  // Helper mapping logo icons
  const renderLogoIcon = (iconName: string, className: string = "w-6 h-6") => {
    switch (iconName) {
      case 'Cpu': return <Cpu className={className} />;
      case 'CreditCard': return <CreditCard className={className} />;
      case 'HeartPulse': return <HeartPulse className={className} />;
      case 'Navigation': return <Navigation className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Feather': return <Feather className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Leaf': return <Leaf className={className} />;
      case 'Music': return <Music className={className} />;
      case 'Presentation': return <Presentation className={className} />;
      case 'Mic': return <Mic className={className} />;
      default: return <Building2 className={className} />;
    }
  };

  const categoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      Product: 'Продукт',
      Expansion: 'Рост',
      Funding: 'Фандинг',
      Acquisition: 'M&A',
      'Carbon-Zero': 'Экология',
    };
    return map[cat] || cat;
  };

  const interestLabel = (type: string) => {
    const map: Record<string, string> = {
      Investment: 'Инвестиции',
      Partnership: 'Партнёрство',
      'Venture Pitch': 'Совместный проект',
      Other: 'Другое',
    };
    return map[type] || type;
  };

  // Filtered Milestones
  const filteredMilestones = CORPMILESTONES.filter(m => {
    if (milestoneFilter === 'Все') return true;
    const map: Record<string, string> = {
      'Продукт': 'Product',
      'Фандинг': 'Funding',
      'Рост': 'Expansion',
      'Экология': 'Carbon-Zero',
      'M&A': 'Acquisition',
    };
    return m.category === map[milestoneFilter] || m.category === milestoneFilter;
  });

  return (
    <div id="matveev-root-layout" className="min-h-screen bg-mv-page text-apple-gray-900 selection:bg-apple-blue selection:text-white transition-colors duration-300">
      
      {/* Translucent Global iOS Navigation Bar */}
      <nav id="top-nav-bar" className="sticky top-0 w-full z-50 bg-mv-page/85 backdrop-blur-md border-b border-apple-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <a href="#hero-banner" className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-mv-card-muted border border-mv-border shrink-0">
              <MatveevLogo className="h-4 w-auto" />
            </span>
            <span className="text-sm font-extrabold tracking-[0.12em] text-apple-gray-900 font-sans uppercase hidden sm:inline">
              Matveev Group
            </span>
          </a>

          {/* Nav items for Desktop */}
          <div className="hidden md:flex items-center gap-8 text-[11px] font-medium text-apple-gray-300">
            <a href="#portfolio-bento" className="hover:text-apple-gray-900 transition-colors">Проекты</a>
            <a href="#offerings-specs" className="hover:text-apple-gray-900 transition-colors">Продукты</a>
            <a href="#device-studio" className="hover:text-apple-gray-900 transition-colors">Демо</a>
            <a href="#corporate-pillars" className="hover:text-apple-gray-900 transition-colors">О группе</a>
            <a href="#newsroom-chronology" className="hover:text-apple-gray-900 transition-colors">Хронология</a>
            <a href="#synergy-calculator" className="hover:text-apple-gray-900 transition-colors">Портфель</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full border border-apple-gray-100 bg-mv-card-muted text-apple-gray-300 hover:text-apple-gray-900 transition-colors"
              aria-label={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a 
              href="#incorporation-portal"
              className="px-3.5 py-1 text-xs font-semibold mv-btn-primary rounded-full transition-colors shadow-sm"
            >
              Сотрудничество
            </a>
          </div>

          {/* Mobile Menu Actions */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1 text-apple-gray-900"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-apple-gray-100 bg-mv-card px-6 py-4 flex flex-col gap-4 text-xs font-medium text-apple-gray-400"
            >
              <a onClick={() => setIsMobileMenuOpen(false)} href="#portfolio-bento" className="hover:text-apple-gray-900 py-1 border-b border-apple-gray-50">Проекты</a>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#offerings-specs" className="hover:text-apple-gray-900 py-1 border-b border-apple-gray-50">Продукты</a>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#device-studio" className="hover:text-apple-gray-900 py-1 border-b border-apple-gray-50">Демо</a>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#corporate-pillars" className="hover:text-apple-gray-900 py-1 border-b border-apple-gray-50">О группе</a>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#newsroom-chronology" className="hover:text-apple-gray-900 py-1 border-b border-apple-gray-50">Хронология</a>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#synergy-calculator" className="hover:text-apple-gray-900 py-1 border-b border-apple-gray-50 font-semibold text-apple-blue">Портфель</a>
              <button
                type="button"
                onClick={() => { toggleTheme(); }}
                className="flex items-center justify-center gap-2 py-2 border-b border-apple-gray-50 text-apple-gray-400 hover:text-apple-gray-900"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
              </button>
              <a onClick={() => setIsMobileMenuOpen(false)} href="#incorporation-portal" className="text-center mv-btn-primary py-2.5 rounded-xl">Сотрудничество</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Banner Section */}
      <header id="hero-banner" className="relative w-full overflow-hidden bg-mv-page pt-20 pb-16 md:py-32 flex flex-col items-center">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-mv-card-muted border border-mv-border shadow-lg">
              <MatveevLogo className="h-10 md:h-12 w-auto" />
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-gray-50 border border-apple-gray-100 text-xs font-medium text-apple-gray-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-300" /> Дмитрий Матвеев · Омск · Matveev Group
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-apple-gray-900 tracking-tight leading-none">
            Matveev <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 via-neutral-300 to-apple-gray-900 font-extrabold">
              Group.
            </span>
          </h1>

          <p className="text-sm md:text-base font-semibold text-apple-gray-400 tracking-wide">
            Матвеев Дмитрий — основатель · Омск, Россия
          </p>

          <p className="max-w-2xl mx-auto text-apple-gray-300 text-base md:text-lg leading-relaxed font-sans">
            Группа проектов под руководством <strong className="text-apple-gray-900">Дмитрия Матвеева</strong>. 
            Объединяем самостоятельные направления: <strong className="text-apple-gray-900">Loopera</strong> (музыкальная платформа), 
            <strong className="text-apple-gray-900"> Decksy</strong> (AI-продукт), 
            <strong className="text-apple-gray-900"> Triphoy</strong> (лейбл и бренд).
            Группа не является IT-компанией и не оказывает услуги разработки — открыта к партнёрству и сотрудничеству.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <a 
              href="#portfolio-bento"
              className="px-6 py-3 rounded-full mv-btn-primary font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm"
            >
              Портфель проектов <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="#incorporation-portal"
              className="px-6 py-3 rounded-full bg-apple-gray-50 border border-apple-gray-200 text-apple-gray-400 font-semibold text-xs hover:bg-apple-gray-100 transition-colors"
            >
              Предложить сотрудничество
            </a>
          </div>
        </div>

        {/* Minimal iOS Floating Dashboard Graphic */}
        <div className="mt-14 w-full max-w-5xl mx-auto px-6">
          <div className="relative aspect-[16/8] bg-apple-gray-50 border border-apple-gray-100 rounded-3xl p-4 md:p-8 flex flex-col justify-between overflow-hidden shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-apple-gray-300 block">Структура группы</span>
                <span className="text-sm font-bold text-apple-gray-900">Matveev Group · 3 направления</span>
              </div>
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-[10px] font-mono text-emerald-500 font-bold">АКТИВНЫЕ ПРОЕКТЫ</span>
              </div>
            </div>

            {/* Custom SVG visualization representing core network flow */}
            <div className="flex-1 w-full my-6 flex items-center justify-center">
              <svg className="w-full h-full max-h-[140px] text-apple-gray-900" viewBox="0 0 800 150" fill="none">
                <path d="M 50 120 C 150 120, 100 30, 200 30 C 300 30, 250 100, 350 100 C 450 100, 400 50, 500 50 C 600 50, 550 130, 650 130 C 750 130, 700 80, 750 80" stroke="#0071e3" strokeWidth="2.5" strokeDasharray="5,5" />
                <path d="M 50 120 C 150 120, 100 30, 200 30 C 300 30, 250 100, 350 100 C 450 100, 400 50, 500 50 C 600 50, 550 130, 650 130" stroke="#30d158" strokeWidth="1.5" />
                
                {/* Node Circles represent startup links */}
                <circle cx="50" cy="120" r="6" fill="currentColor" className="text-apple-gray-900" />
                <text x="18" y="124" fontSize="9" fill="currentColor" className="text-apple-gray-900" fontWeight="bold">Matveev</text>

                <circle cx="200" cy="30" r="7" fill="#bf5af2" stroke="var(--mv-page)" strokeWidth="2" />
                <text x="212" y="34" fontSize="10" fill="currentColor" fontWeight="bold">Loopera</text>

                <circle cx="350" cy="100" r="7" fill="#0071e3" stroke="var(--mv-page)" strokeWidth="2" />
                <text x="362" y="104" fontSize="10" fill="currentColor" fontWeight="bold">Decksy</text>

                <circle cx="500" cy="50" r="7" fill="#ff9f0a" stroke="var(--mv-page)" strokeWidth="2" />
                <text x="512" y="54" fontSize="10" fill="currentColor" fontWeight="bold">Triphoy</text>

                <circle cx="650" cy="130" r="7" fill="#30d158" stroke="var(--mv-page)" strokeWidth="2" />
                <text x="662" y="134" fontSize="10" fill="currentColor" fontWeight="bold">Омск</text>
              </svg>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-4 border-t border-apple-gray-100">
              <div className="flex flex-col">
                <span className="text-apple-gray-300">Loopera — лупов</span>
                <span className="font-extrabold text-apple-gray-900">200+</span>
              </div>
              <div className="flex flex-col">
                <span className="text-apple-gray-300">Triphoy — релизов</span>
                <span className="font-extrabold text-apple-gray-900">~10 треков</span>
              </div>
              <div className="flex flex-col">
                <span className="text-apple-gray-300">Штаб-квартира</span>
                <span className="font-extrabold text-apple-gray-900">Омск, Россия</span>
              </div>
              <div className="flex flex-col">
                <span className="text-apple-gray-300">Руководитель</span>
                <span className="font-extrabold text-apple-gray-900">Д. Матвеев</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Startups Portfolio Bento Grid */}
      <section id="portfolio-bento" className="py-20 bg-apple-gray-50 border-y border-apple-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold font-mono tracking-wider text-apple-blue uppercase block mb-1">
                Портфель Matveev Group
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-apple-gray-900 tracking-tight">
                Проекты группы.
              </h2>
            </div>
            <p className="max-w-md text-sm text-apple-gray-300">
              Три самостоятельных направления в единой структуре. Каждый проект развивается под собственным брендом.
            </p>
          </div>

          {/* Interactive Selection Tabs representing the companies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            {STARTUPS.map((startup) => {
              const worksAsActive = selectedStartup.id === startup.id;
              return (
                <button
                  key={startup.id}
                  onClick={() => setSelectedStartup(startup)}
                  className={`py-4 px-5 rounded-2xl text-left border transition-all flex flex-col justify-between aspect-[4/3] ${worksAsActive ? 'bg-mv-card shadow-xl border-apple-gray-200/50 scale-[1.03]' : 'bg-mv-card/40 hover:bg-mv-card border-apple-gray-100'}`}
                >
                  <div className="p-2.5 rounded-xl bg-apple-gray-50 border border-apple-gray-100 inline-flex" style={{ color: startup.color }}>
                    {renderLogoIcon(startup.icon)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-apple-gray-900 leading-tight">{startup.name}</h3>
                    <p className="text-[10px] text-apple-gray-300 leading-none mt-1 truncate">{startup.category}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Startup Workspace (Apple hardware-page feel) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStartup.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="bg-mv-card border border-apple-gray-200/70 rounded-3xl p-6 md:p-10 shadow-xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left column info */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3">
                    <span 
                      className="inline-flex py-1 px-3 text-[10px] font-mono tracking-wider uppercase font-semibold text-white rounded-full bg-apple-gray-900"
                    >
                      {selectedStartup.category}
                    </span>
                    <span className="text-xs text-apple-gray-300 font-mono">С {selectedStartup.metrics.founded}</span>
                  </div>

                  <h3 className="text-4xl md:text-5xl font-extrabold text-apple-gray-900 tracking-tight leading-none">
                    {selectedStartup.name} <br />
                    <span className="text-apple-gray-300 text-3xl font-bold">{selectedStartup.tagline}</span>
                  </h3>

                  <p className="text-apple-gray-400 text-sm leading-relaxed">
                    {selectedStartup.longDescription}
                  </p>

                  {selectedStartup.url && (
                    <a
                      href={selectedStartup.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-apple-blue hover:underline"
                    >
                      Открыть сайт <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <div className="bg-apple-gray-50/70 border border-apple-gray-100 rounded-2xl p-6 space-y-3.5">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-apple-gray-900 font-mono">
                      Ключевые достижения
                    </h4>
                    <ul className="space-y-2">
                      {selectedStartup.achievements.map((ach, idx) => (
                        <li key={idx} className="flex gap-2.5 text-xs text-apple-gray-300">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column Metrics Panel */}
                <div className="lg:col-span-5 flex flex-col justify-between bg-apple-gray-50 border border-apple-gray-100 rounded-2.5xl p-6 md:p-8">
                  <div className="space-y-6">
                    <h4 className="text-xs font-extrabold uppercase tracking-wide text-apple-gray-900 font-mono pb-2 border-b border-apple-gray-200">
                      Метрики проекта
                    </h4>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-xs font-sans">
                      <div>
                        <span className="text-apple-gray-300 block mb-0.5">Стадия</span>
                        <span className="text-xl font-bold text-apple-gray-900">{selectedStartup.metrics.stage}</span>
                      </div>
                      <div>
                        <span className="text-apple-gray-300 block mb-0.5">Команда</span>
                        <span className="text-xl font-bold text-apple-gray-900">{selectedStartup.metrics.team} чел.</span>
                      </div>
                      <div>
                        <span className="text-apple-gray-300 block mb-0.5">Рынок</span>
                        <span className="text-sm font-bold text-apple-gray-900 leading-tight">{selectedStartup.metrics.marketSize}</span>
                      </div>
                      <div>
                        <span className="text-apple-gray-300 block mb-0.5">Статус</span>
                        <span className="text-xs font-mono font-bold text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-500/10 inline-block">
                          {selectedStartup.metrics.efficiencyRating}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-apple-gray-200/80">
                      <span className="text-apple-gray-300 text-[10px] uppercase font-mono tracking-wider block mb-1">Запуск</span>
                      <p className="text-sm font-semibold text-apple-gray-950 flex items-center gap-1">
                        <Globe className="w-4 h-4 text-apple-blue" />
                        {selectedStartup.metrics.founded}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-apple-gray-200 flex items-center justify-between">
                    <span className="text-xs text-apple-gray-300 font-mono">Matveev Group</span>
                    <a 
                      href="#incorporation-portal"
                      className="text-xs font-bold text-apple-blue hover:underline flex items-center gap-0.5"
                    >
                      Сотрудничество <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Linked Hardware Products nested tabs block */}
              {PRODUCTS.filter(p => p.startupId === selectedStartup.id).length > 0 && (
                <div id="offerings-specs" className="mt-12 pt-10 border-t border-apple-gray-100">
                  <div className="mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-apple-gray-300 block">Продукты</span>
                    <h4 className="text-lg font-bold text-apple-gray-900">Фичи {selectedStartup.name}</h4>
                  </div>

                  <div className="flex gap-2.5 mb-6 overflow-x-auto pb-2">
                    {PRODUCTS.filter(p => p.startupId === selectedStartup.id).map(prod => (
                      <button
                        key={prod.id}
                        onClick={() => setActiveProductTab(prod.id)}
                        className={`py-2.5 px-4 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${activeProductTab === prod.id ? 'bg-apple-gray-900 border-apple-gray-900 text-white shadow-sm' : 'bg-apple-gray-50 border-apple-gray-100 text-apple-gray-300'}`}
                      >
                        {prod.name}
                      </button>
                    ))}
                  </div>

                  {/* Render Core Specs for Active Product */}
                  {(() => {
                    const currentProd = PRODUCTS.find(p => p.id === activeProductTab);
                    if (!currentProd) return null;
                    return (
                      <div className="bg-apple-gray-50 border border-apple-gray-100 rounded-2.5xl p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                          
                          {/* Left specifications list */}
                          <div className="lg:col-span-7 space-y-6">
                            <div>
                              <span className="text-[10px] font-mono text-apple-blue uppercase tracking-widest block mb-1">{currentProd.category}</span>
                              <h5 className="text-xl font-bold text-apple-gray-900">{currentProd.name}</h5>
                              <p className="text-xs text-apple-gray-300 mt-1">{currentProd.tagline}</p>
                            </div>

                            <p className="text-xs text-apple-gray-300 leading-relaxed">
                              {currentProd.description}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                              {currentProd.features.map((feat, fIdx) => (
                                <div key={fIdx} className="bg-mv-card p-4 rounded-2xl border border-apple-gray-100 shadow-sm flex flex-col justify-between aspect-square">
                                  <div className="p-2 rounded-lg bg-apple-gray-50 border border-apple-gray-100 w-fit text-apple-blue">
                                    {renderLogoIcon(feat.icon, "w-4 h-4")}
                                  </div>
                                  <div>
                                    <h6 className="text-xs font-extrabold text-apple-gray-900 mb-1">{feat.title}</h6>
                                    <p className="text-[10px] text-apple-gray-300 leading-snug">{feat.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right side Detailed Spec sheet (Apple iPad hardware list style) */}
                          <div className="lg:col-span-5 bg-mv-card border border-apple-gray-100 rounded-2xl p-6">
                            <h6 className="text-[10px] font-mono text-apple-gray-300 uppercase tracking-widest pb-3 border-b border-apple-gray-100 block mb-4">
                              Характеристики
                            </h6>
                            <div className="space-y-4">
                              {currentProd.specifications.map((spec, sIdx) => (
                                <div key={sIdx} className="flex justify-between items-start text-xs border-b border-apple-gray-50 pb-3">
                                  <span className="text-apple-gray-300 shrink-0 pr-4">{spec.label}</span>
                                  <span className="text-right text-apple-gray-900 font-medium">{spec.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })()}

                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Interactive Core Device Workspace (Mocking Holo / Aether / Velo App links) */}
      <section id="device-studio" className="py-24 bg-mv-page">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[11px] font-extrabold font-mono tracking-wider text-apple-blue uppercase block">
              Обзор портфеля
            </span>
            <h2 className="text-4xl font-extrabold text-apple-gray-900 tracking-tight">
              Направления группы.
            </h2>
            <p className="text-sm text-apple-gray-300 max-w-lg mx-auto">
              Краткий обзор ключевых показателей проектов Matveev Group.
            </p>
          </div>

          <DeviceSimulator />
        </div>
      </section>

      {/* Corporate Standards / Philosophy (Pillars Layout with clean Tabs) */}
      <section id="corporate-pillars" className="py-24 bg-apple-gray-50 border-t border-apple-gray-100/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14 text-center space-y-2">
            <span className="text-[11px] font-extrabold font-mono tracking-wider text-apple-blue uppercase block">
              О группе
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-apple-gray-900 tracking-tight">
              Matveev Group.
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-stretch">
            {/* Left Pillars Selection Column */}
            <div className="lg:w-1/3 flex flex-col gap-3 justify-center">
              {COREPILLARS.map((pillar) => {
                const isActive = activePillarTab === pillar.id;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => setActivePillarTab(pillar.id)}
                    className={`text-left p-5 rounded-2xl border transition-all flex items-center justify-between ${isActive ? 'bg-mv-card shadow-lg border-apple-gray-200/60 scale-[1.02]' : 'bg-mv-card/40 border-apple-gray-100/50 hover:bg-mv-card'}`}
                  >
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-mono text-apple-gray-300 mb-1">Принцип</p>
                      <h4 className="font-extrabold text-sm text-apple-gray-900">{pillar.title}</h4>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'translate-x-1 text-apple-blue' : 'text-apple-gray-200'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Pillars Showcase Panel (Apple Store quote styling) */}
            <div className="lg:w-2/3">
              <AnimatePresence mode="wait">
                {(() => {
                  const targetPillar = COREPILLARS.find(p => p.id === activePillarTab);
                  if (!targetPillar) return null;
                  return (
                    <motion.div
                      key={targetPillar.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="h-full bg-mv-card border border-apple-gray-100 rounded-3xl p-8 md:p-12 flex flex-col justify-between shadow-md"
                    >
                      <div className="space-y-8">
                        {/* Quote section */}
                        <div className="border-l-2 border-apple-blue pl-6 py-1">
                          <p className="text-xl md:text-2xl font-semibold italic text-apple-gray-900 leading-snug">
                            "{targetPillar.quote}"
                          </p>
                          <span className="text-xs font-mono uppercase tracking-wider text-apple-gray-300 block mt-2">
                            — {targetPillar.author}
                          </span>
                        </div>

                        {/* Description paragraphs */}
                        <div className="space-y-4">
                          <h4 className="text-lg font-bold text-apple-gray-900">{targetPillar.title}</h4>
                          <p className="text-xs text-apple-gray-300 leading-relaxed">
                            {targetPillar.description}
                          </p>
                        </div>

                        {/* Dynamic list detail cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {targetPillar.details.map((det, dIdx) => (
                            <div key={dIdx} className="bg-apple-gray-50/80 rounded-xl p-4 border border-apple-gray-100">
                              <span className="text-xs font-semibold text-apple-gray-900 leading-tight block">
                                {det}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 pt-4 border-t border-apple-gray-100 flex items-center justify-between text-xs text-apple-gray-300 font-mono">
                        <span>Статус: актуально</span>
                        <span>Омск, Россия</span>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Press announcements / Milestones Timeline Hub */}
      <section id="newsroom-chronology" className="py-24 bg-mv-page border-t border-apple-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-2 mb-12">
            <span className="text-[11px] font-extrabold font-mono tracking-wider text-apple-blue uppercase block">
              Хронология
            </span>
            <h2 className="text-3xl font-extrabold text-apple-gray-900 tracking-tight">
              История развития группы.
            </h2>
            <p className="text-xs text-apple-gray-300">
              Ключевые этапы формирования портфеля и запуска проектов.
            </p>
          </div>

          {/* Filtering tabs */}
          <div className="flex gap-2 justify-center mb-8 border-b border-apple-gray-50 pb-4">
            {['Все', 'Продукт', 'Рост'].map((cat) => (
              <button
                key={cat}
                onClick={() => setMilestoneFilter(cat)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-semibold transition-all ${milestoneFilter === cat ? 'bg-apple-gray-900 text-white' : 'hover:bg-apple-gray-50 text-apple-gray-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Iterative Timelines */}
          <div className="space-y-8 relative before:absolute before:top-0 before:bottom-0 before:left-4 md:before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-apple-gray-100">
            {filteredMilestones.map((m, mIdx) => {
              const worksOnLeft = mIdx % 2 === 0;
              return (
                <div 
                  key={m.id} 
                  className={`relative flex flex-col md:flex-row items-start ${worksOnLeft ? 'md:flex-row-reverse' : ''}`}
                >
                  
                  {/* Circle locator indicator */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-apple-gray-900 border-4 border-white ring-2 ring-apple-gray-100 z-10" />

                  {/* Empty divider block for beautiful responsive side layout */}
                  <div className="hidden md:block w-1/2" />

                  {/* Active milestone summary ticket */}
                  <div className="w-full md:w-1/2 pl-10 md:pl-0 md:px-8">
                    <div className="bg-apple-gray-50 border border-apple-gray-100 p-5 rounded-2xl hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase text-apple-blue bg-mv-card px-2 py-0.5 rounded-md border border-apple-gray-100">
                          {categoryLabel(m.category)}
                        </span>
                        <span className="text-[10px] font-mono text-apple-gray-300">{m.date} ({m.quarter})</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-apple-gray-900 leading-tight mb-1">{m.title}</h4>
                      <p className="text-[11px] font-bold text-apple-gray-400 mb-2">{m.tagline}</p>
                      <p className="text-xs text-apple-gray-300 leading-relaxed">{m.summary}</p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Venture Acceleration Calculator */}
      <section id="synergy-calculator" className="py-24 bg-apple-gray-50 border-t border-apple-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <span className="text-[11px] font-extrabold font-mono tracking-wider text-apple-blue uppercase block">
              Синергия портфеля
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-apple-gray-900 tracking-tight">
              Взаимосвязь проектов группы.
            </h2>
            <p className="text-sm text-apple-gray-300">
              Loopera, Decksy и Triphoy дополняют друг друга в рамках единой структуры Matveev Group — музыка, технологии и бренд.
            </p>
          </div>

          <VentureCalculator />
        </div>
      </section>

      {/* Digital Inquiries Portal / Digital Form with hand signature canvas */}
      <section id="incorporation-portal" className="py-24 bg-mv-page border-t border-apple-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-[11px] font-extrabold font-mono tracking-wider text-apple-blue uppercase block">
              Партнёрство
            </span>
            <h2 className="text-4xl font-extrabold text-apple-gray-900 tracking-tight">
              Сотрудничество с группой
            </h2>
            <p className="text-xs text-apple-gray-300 max-w-xl mx-auto">
              Matveev Group не оказывает IT-услуги и не занимается аутсорс-разработкой. 
              Мы рассматриваем предложения о партнёрстве, совместных проектах и коллаборациях.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-2 text-xs text-apple-gray-400">
              <a href={`mailto:${CONTACT.email}`} className="hover:text-apple-blue transition-colors">{CONTACT.email}</a>
              <span className="text-apple-gray-200">·</span>
              <a href={CONTACT.telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-apple-blue transition-colors">@{CONTACT.telegram}</a>
              <span className="text-apple-gray-200">·</span>
              <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-apple-blue transition-colors">@{CONTACT.instagram}</a>
            </div>
          </div>

          <div id="registration-ticket-form" className="bg-apple-gray-50 border border-apple-gray-100 rounded-3xl p-6 md:p-10 shadow-lg">
            
            <form onSubmit={handleInquirySubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Field 1: Name */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-apple-gray-900 block">
                    Имя *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formName} 
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Дмитрий Матвеев"
                    className="w-full bg-mv-card border border-apple-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-apple-blue focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-apple-gray-900 block">
                    Email *
                  </label>
                  <input 
                    type="email" 
                    required
                    value={formEmail} 
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-mv-card border border-apple-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-apple-blue focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Field 3: Company */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-apple-gray-900 block">
                    Компания / проект
                  </label>
                  <input 
                    type="text" 
                    value={formCompany} 
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="Название компании"
                    className="w-full bg-mv-card border border-apple-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-apple-blue focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-apple-gray-900 block">
                    Тема обращения
                  </label>
                  <select 
                    value={formType} 
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-mv-card border border-apple-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-apple-blue focus:outline-none"
                  >
                    <option value="Partnership">Партнёрство / коллаборация</option>
                    <option value="Investment">Инвестиционное предложение</option>
                    <option value="Venture Pitch">Совместный проект</option>
                    <option value="Other">Иное</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-apple-gray-900 block">
                  Формат взаимодействия
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'collab' as const, label: 'Партнёрство', sub: 'коллаборация' },
                    { id: 'invest' as const, label: 'Инвестиции', sub: 'в проект группы' },
                    { id: 'other' as const, label: 'Иное', sub: 'другое предложение' },
                  ].map((tierOption) => (
                    <button
                      type="button"
                      key={tierOption.id}
                      onClick={() => setFormTier(tierOption.id)}
                      className={`text-left p-3 rounded-xl border text-[11px] transition-all flex flex-col justify-between aspect-[12/4] ${formTier === tierOption.id ? 'mv-btn-primary border-mv-border font-semibold' : 'bg-mv-card border-apple-gray-100 hover:bg-mv-card-muted text-apple-gray-300'}`}
                    >
                      <span>{tierOption.label}</span>
                      <span className="text-[9px] font-mono opacity-80 uppercase block mt-1">{tierOption.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-apple-gray-900 block">
                  Сообщение
                </label>
                <textarea 
                  value={formMessage} 
                  onChange={(e) => setFormMessage(e.target.value)}
                  rows={4}
                  placeholder="Опишите предложение о сотрудничестве..."
                  className="w-full bg-mv-card border border-apple-gray-200 rounded-xl p-4 text-xs focus:ring-1 focus:ring-apple-blue focus:outline-none resize-none"
                />
              </div>

              {/* Field 7: Elegant Digital Signature Panel */}
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center text-xs font-semibold text-apple-gray-900">
                  <span className="flex items-center gap-1">
                    <Pen className="w-3.5 h-3.5 text-apple-blue" /> Подпись (необязательно)
                  </span>
                  <button 
                    type="button" 
                    onClick={clearCanvas}
                    className="text-xs font-semibold text-[#c45100] flex items-center gap-1 hover:underline"
                  >
                    <Trash2 className="w-3 h-3" /> Очистить
                  </button>
                </div>
                <div className="relative bg-mv-card border border-apple-gray-200 rounded-2xl overflow-hidden aspect-[12/3] cursor-pointer">
                  
                  {/* Canvas block */}
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={200}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="absolute inset-0 w-full h-full bg-mv-card"
                  />
                  
                  {!hasSigned && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-apple-gray-300/80 pointer-events-none select-none">
                      <p className="text-xs italic">Нарисуй подпись мышкой или пальцем</p>
                    </div>
                  )}

                  <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-md bg-apple-gray-50 border border-apple-gray-100 text-[9px] text-apple-gray-300 pointer-events-none select-none">
                    {hasSigned ? "ПОДПИСЬ_ЕСТЬ" : "ЖДУ_ВВОД"}
                  </div>
                </div>
              </div>

              {/* Acknowledge terms inside ticket */}
              <div className="flex items-center gap-2.5 pt-2">
                <input 
                  type="checkbox" 
                  id="agree-checkbox" 
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 text-apple-blue bg-mv-card border-apple-gray-200 rounded cursor-pointer accent-apple-blue"
                />
                <label htmlFor="agree-checkbox" className="text-[11px] text-apple-gray-300 cursor-pointer select-none">
                  Даю согласие на обработку персональных данных для рассмотрения обращения. *
                </label>
              </div>

              {/* Submit Trigger in form row */}
              <div className="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <span className="text-[10px] text-apple-gray-300 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" /> Данные хранятся локально в браузере.
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 rounded-full mv-btn-primary hover:opacity-90 font-semibold text-xs transition-colors flex items-center justify-center gap-2.5 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <span>Отправка...</span>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </>
                  ) : (
                    <>
                      <span>Отправить</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Active submitted ledger entries display */}
          {submissions.length > 0 && (
            <div id="submitted-tickets" className="mt-16 space-y-6 pt-12 border-t border-apple-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-bold text-apple-gray-900">Отправленные заявки</h4>
                  <p className="text-[11px] text-apple-gray-300">Сохраняются локально в браузере (демо).</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-extrabold uppercase">
                  {submissions.length} шт.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submissions.map((sub) => (
                  <div key={sub.id} className="relative bg-apple-gray-50 border border-apple-gray-100 rounded-2.5xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                    
                    <button 
                      onClick={() => deleteSubmission(sub.id)}
                      className="absolute top-4 right-4 text-apple-gray-300 hover:text-red-500 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono text-apple-blue bg-mv-card border border-apple-gray-100 px-2 py-0.5 rounded uppercase font-bold">
                            {interestLabel(sub.interestType)}
                          </span>
                          <span className="text-[10px] text-apple-gray-300 block mt-1 font-mono">{sub.id}</span>
                        </div>
                      </div>

                      <div className="text-xs space-y-1">
                        <p><strong className="text-apple-gray-900">Имя:</strong> {sub.fullName}</p>
                        <p><strong className="text-apple-gray-900">Email:</strong> {sub.email}</p>
                        <p><strong className="text-apple-gray-900">Компания:</strong> {sub.companyName}</p>
                        <p><strong className="text-apple-gray-900">Формат:</strong> {sub.investmentTier}</p>
                      </div>

                      <div className="bg-mv-card/70 p-3 rounded-lg border border-apple-gray-100/50 text-[11px] text-apple-gray-300">
                        <span className="font-bold text-apple-gray-400 block mb-0.5">Сообщение:</span>
                        "{sub.message}"
                      </div>
                    </div>

                    {/* Show extracted signature */}
                    <div className="mt-4 pt-3 border-t border-apple-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-apple-gray-300 block font-mono">Подпись</span>
                        {sub.signature.startsWith('data:') ? (
                          <img src={sub.signature} alt="Sign" className="h-6 mt-1 opacity-70 border border-apple-gray-150 rounded" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-[9px] font-serif text-apple-gray-900 font-bold block mt-1">{sub.signature}</span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-500 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ОТПРАВЛЕНО
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Flagship Apple-style Footer / Clean links */}
      <footer className="bg-apple-gray-50 border-t border-apple-gray-100 py-16 text-xs text-apple-gray-300 leading-relaxed font-sans mt-auto">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          
          {/* Notes disclaimer representing typical Apple footnotes */}
          <div className="space-y-2 border-b border-apple-gray-200 pb-8 text-[11px]">
            <p>1. Matveev Group — группа проектов (Loopera, Decksy, Triphoy). Не является IT-компанией и не оказывает услуги разработки.</p>
            <p>2. Руководитель группы — Дмитрий Матвеев, Омск, Россия. Формат взаимодействия — партнёрство и сотрудничество.</p>
            <p>3. Контакты: {CONTACT.email} · Telegram @{CONTACT.telegram} · Instagram @{CONTACT.instagram}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2.5">
              <h5 className="font-bold text-apple-gray-900 font-mono text-[10px] uppercase tracking-wider">Проекты</h5>
              <div className="flex flex-col gap-1.5 text-apple-gray-400">
                <a href="https://loopera.ru" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-apple-gray-900">Loopera</a>
                <a href="https://decksy.ru" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-apple-gray-900">Decksy</a>
                <a href={CONTACT.telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-apple-gray-900">Triphoy</a>
              </div>
            </div>

            <div className="space-y-2.5">
              <h5 className="font-bold text-apple-gray-900 font-mono text-[10px] uppercase tracking-wider">Группа</h5>
              <div className="flex flex-col gap-1.5 text-apple-gray-400">
                <a href="#portfolio-bento" className="hover:underline hover:text-apple-gray-900">Портфель</a>
                <a href="#corporate-pillars" className="hover:underline hover:text-apple-gray-900">О группе</a>
                <a href="#newsroom-chronology" className="hover:underline hover:text-apple-gray-900">Хронология</a>
                <a href="#incorporation-portal" className="hover:underline hover:text-apple-gray-900">Сотрудничество</a>
              </div>
            </div>

            <div className="space-y-2.5">
              <h5 className="font-bold text-apple-gray-900 font-mono text-[10px] uppercase tracking-wider">Контакты</h5>
              <div className="flex flex-col gap-1.5 text-apple-gray-400">
                <a href={`mailto:${CONTACT.email}`} className="hover:underline hover:text-apple-gray-900">{CONTACT.email}</a>
                <a href={CONTACT.telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-apple-gray-900">@{CONTACT.telegram}</a>
                <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-apple-gray-900">@{CONTACT.instagram}</a>
              </div>
            </div>

            <div className="space-y-2.5 flex flex-col justify-between">
              <div>
                <h5 className="font-bold text-apple-gray-900 font-mono text-[10px] uppercase tracking-wider mb-2">Юридическая информация</h5>
                <p className="text-[11px] text-apple-gray-400">
                  Matveev Group <br />
                  Дмитрий Матвеев, основатель <br />
                  Омск, Россия
                </p>
              </div>
              <span className="text-[10px] text-apple-gray-300 block font-mono">
                loopera · decksy · triphoy
              </span>
            </div>
          </div>

          <div className="pt-8 border-t border-apple-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-apple-gray-300 font-sans">
            <div>
              <p>© 2026 Matveev Group. Все права защищены.</p>
            </div>
            <div className="flex gap-4 text-apple-gray-300">
              <a href="#top" className="hover:underline">Политика конфиденциальности</a>
              <span>|</span>
              <a href="#incorporation-portal" className="hover:underline">Сотрудничество</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
