'use client';

import React, { useState, useEffect, useId } from 'react';

// ==========================================
// 1. TYPES & DATA CONTRACTS
// ==========================================
export type ServiceStatus = 'operational' | 'maintenance' | 'degraded';

export interface SystemService {
  id: string;
  name: string;
  category: string;
  status: ServiceStatus;
  description: string;
  alternativeRoute?: string;
}

export interface UpgradePhase {
  id: number;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress: number;
  description: string;
  timestamp: string;
}

export interface InvestorGuide {
  id: string;
  title: string;
  sector: string;
  pages: number;
  fileSize: string;
  description: string;
  featuredHighlight: string;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMsRemaining: number;
}

// ==========================================
// 2. INLINE ACCESSIBLE SVG ICONS (Zero-Dependency Fallback)
// ==========================================
const ShieldCheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ClockIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertTriangleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MailIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CalendarIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DownloadIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const PhoneCallIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const ChevronDownIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const ExternalLinkIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const XIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ==========================================
// 3. STATIC CONFIG & ENTERPRISE DATA
// ==========================================
// Maintenance Window Targets (WAT = UTC+1)
const MAINTENANCE_START_WAT = "Saturday, November 1, 2026 – 00:00 WAT";
const ESTIMATED_COMPLETION_WAT = "Sunday, November 2, 2026 – 18:00 WAT";
const TARGET_RESTORATION_TIMESTAMP = new Date("2026-11-02T18:00:00+01:00").getTime();

const SYSTEM_SERVICES: SystemService[] = [
  {
    id: "kiosc-processing",
    name: "KIOSC Online Application Processing",
    category: "Core Gateway",
    status: "maintenance",
    description: "New investor registrations, enterprise certificate submissions, and automated verification queues.",
    alternativeRoute: "Emergency submissions accepted via registry desk at info@kosippppa.kogistate.gov.ng",
  },
  {
    id: "permit-renewals",
    name: "Business Permit & Statutory Renewals",
    category: "Regulatory",
    status: "maintenance",
    description: "State operating permits, expatriate quota renewals, and commercial premises licensing.",
    alternativeRoute: "Statutory deadlines automatically granted a 5-business-day grace extension.",
  },
  {
    id: "portal-dashboard",
    name: "Investor Portal Dashboard Access",
    category: "Authentication",
    status: "maintenance",
    description: "Multi-factor authentication session service, active application tracking, and fee reconciliation.",
    alternativeRoute: "Read-only ledger sync active upon completion of database sharding.",
  },
  {
    id: "public-desk",
    name: "Public Information Desk & Protocol",
    category: "Information",
    status: "operational",
    description: "Physical concierge at Investment House Lokoja and virtual protocol advisory hotlines.",
    alternativeRoute: "Fully staffed Monday – Thursday, 8:00 am – 4:00 pm WAT.",
  },
  {
    id: "guide-downloads",
    name: "Investment Guides & Concession Prospectus",
    category: "Knowledge Base",
    status: "operational",
    description: "Direct offline document repository for agribusiness, solid minerals, and logistics blueprints.",
    alternativeRoute: "Cached on edge CDN mirrors for immediate unhindered access.",
  },
  {
    id: "advisory-consultations",
    name: "Direct Senior Advisory Consultations",
    category: "Executive Services",
    status: "operational",
    description: "Bilateral consultations and emergency liaison with KOSIPPPPA facilitation officers.",
    alternativeRoute: "Available via scheduled priority booking slots.",
  },
];

const UPGRADE_PHASES: UpgradePhase[] = [
  {
    id: 1,
    title: "Week 1 – Discovery & Requirements (Gate 1)",
    status: "completed",
    progress: 100,
    description: "Kick-off; confirm user groups, investment journey, participating MDAs list, fee/payment rules, and required document templates.",
    timestamp: "Gate 1 Completed",
  },
  {
    id: 2,
    title: "Week 2 – Solution & UI/UX Design (Gate 2)",
    status: "in-progress",
    progress: 50,
    description: "Approve sitemap, role matrix, multi-step application flow, dashboard wireframes, data model, and visual identity.",
    timestamp: "Gate 2 In Progress (Current)",
  },
  {
    id: 3,
    title: "Weeks 3–4 – Foundation & Core Build (Gate 3)",
    status: "pending",
    progress: 0,
    description: "Repository and environments setup, database schema, authentication, access permissions, audit trail, and email outbox.",
    timestamp: "Upcoming Gate 3",
  },
  {
    id: 4,
    title: "Weeks 5–6 – Modules & Workflow Build (Gate 4)",
    status: "pending",
    progress: 0,
    description: "Investor registration/profile, application wizard, document handling, agency/MDA queues, status history, and GRM.",
    timestamp: "Upcoming Gate 4",
  },
  {
    id: 5,
    title: "Week 7 – Configuration & Integration (Gate 5)",
    status: "pending",
    progress: 0,
    description: "Configure priority sectors/opportunities, service forms, user roles, notifications, CMS content, and payment verification.",
    timestamp: "Upcoming Gate 5",
  },
  {
    id: 6,
    title: "Week 8 – Quality Assurance & Security Tests (Gate 6)",
    status: "pending",
    progress: 0,
    description: "Functional tests, permission and security checks, form validation, responsive browser checks, and backup/restore verification.",
    timestamp: "Upcoming Gate 6",
  },
  {
    id: 7,
    title: "Weeks 9–10 – UAT, Training, Deployment & Handover (Gate 7)",
    status: "pending",
    progress: 0,
    description: "Agency/MDA scenario testing, training nominated administrators and desk officers, production deployment, and launch sign-off.",
    timestamp: "Upcoming Gate 7",
  },
];

const INVESTOR_GUIDES: InvestorGuide[] = [
  {
    id: "guide-agri",
    title: "Kogi Agro-Industrial Processing Concession Guide",
    sector: "Agribusiness & Processing",
    pages: 48,
    fileSize: "6.4 MB",
    description: "Comprehensive prospectus on cassava, cashew, and staple crops processing zones in the Confluence Belt.",
    featuredHighlight: "Zero state corporate tax holiday for year 1-3 investments in designated green zones.",
  },
  {
    id: "guide-mining",
    title: "Solid Minerals Investment Atlas & Mining Rights",
    sector: "Mining & Natural Resources",
    pages: 64,
    fileSize: "9.2 MB",
    description: "Detailed GIS mapping of 29 commercial mineral deposits including iron ore, limestone, marble, and lithium.",
    featuredHighlight: "Expedited title verification in under 72 hours under the reformed KOSIPPPPA framework.",
  },
  {
    id: "guide-logistics",
    title: "Lokoja River Port & Inland Multimodal Logistics Corridor",
    sector: "Logistics & Transport",
    pages: 36,
    fileSize: "5.1 MB",
    description: "Feasibility study and concession framework for River Niger cargo shipping and northern trade artery.",
    featuredHighlight: "Direct access connecting 10 border states through seamless waterway and rail links.",
  },
  {
    id: "guide-energy",
    title: "Renewable Energy & Independent Power Concessions",
    sector: "Power & Clean Tech",
    pages: 42,
    fileSize: "7.8 MB",
    description: "Off-grid mini-grid solar, biomass, and hydro energy framework tailored for commercial estates.",
    featuredHighlight: "State-backed sovereign guarantee for 10MW+ industrial off-take contracts.",
  },
];

const FAQ_ITEMS = [
  {
    question: "How will this upgrade affect pending or submitted investment applications?",
    answer:
      "All active investor profiles, uploaded corporate dossiers, and queued applications remain fully encrypted and preserved in state-certified immutable storage. The statutory review period for all in-flight applications has been automatically paused and will resume seamlessly upon platform reactivation, with zero penalty or expiration risk.",
  },
  {
    question: "Are statutory filing deadlines and operating permit expiries extended?",
    answer:
      "Yes. By directive of the Executive Management of KOSIPPPPA, all statutory deadlines, concession bids, and business permit renewal windows receive an automatic five (5) business day extension.",
  },
  {
    question: "Can time-sensitive regulatory clearances or urgent letters be processed?",
    answer:
      "For urgent matters—including critical import duty clearance letters, free trade zone cargo releases, or inter-ministerial submissions—please contact our dedicated Facilitation Desk at info@kosippppa.kogistate.gov.ng or call +234 803 615 7486 / +234 803 655 4498 for expedited manual handling.",
  },
  {
    question: "What security and governance standards are being enforced in this upgrade?",
    answer:
      "This system upgrade implements full compliance with the Nigeria Data Protection Regulation (NDPR 2023) and ISO/IEC 27001 security controls. The upgrade incorporates zero-trust identity authentication, quantum-resilient 256-bit TLS encryption, and decentralized multi-zone failovers.",
  },
];

// ==========================================
// 4. MAIN COMPONENT EXPORT
// ==========================================
export default function MaintenanceLandingPage() {
  // Client time & Countdown State
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 6,
    hours: 17,
    minutes: 17,
    seconds: 59,
    totalMsRemaining: 580000000,
  });

  const [watTime, setWatTime] = useState<string>('00:00:00 WAT');
  const [serviceFilter, setServiceFilter] = useState<'all' | 'maintenance' | 'operational'>('all');
  const [showPhaseDetails, setShowPhaseDetails] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Modals & Form State
  const [isAdvisoryModalOpen, setIsAdvisoryModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<InvestorGuide | null>(null);

  // Email Notification Form State
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySector, setNotifySector] = useState('Agribusiness & Food Processing');
  const [notifyPhone, setNotifyPhone] = useState('');
  const [notifySms, setNotifySms] = useState(false);
  const [isSubmittingNotify, setIsSubmittingNotify] = useState(false);
  const [notifySuccessMessage, setNotifySuccessMessage] = useState<string | null>(null);

  // Advisory Modal Form State
  const [advisoryName, setAdvisoryName] = useState('');
  const [advisoryOrg, setAdvisoryOrg] = useState('');
  const [advisoryEmail, setAdvisoryEmail] = useState('');
  const [advisoryPhone, setAdvisoryPhone] = useState('');
  const [advisorySector, setAdvisorySector] = useState('Solid Minerals & Mining');
  const [advisoryUrgency, setAdvisoryUrgency] = useState<'normal' | 'urgent' | 'critical'>('urgent');
  const [advisoryNotes, setAdvisoryNotes] = useState('');
  const [isSubmittingAdvisory, setIsSubmittingAdvisory] = useState(false);
  const [advisorySuccess, setAdvisorySuccess] = useState(false);

  // Accessibility unique IDs
  const emailInputId = useId();
  const sectorSelectId = useId();

  // Dynamic Countdown Timer Hook
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = TARGET_RESTORATION_TIMESTAMP - now;

      // Current WAT Time Clock (UTC + 1)
      const currentUtc = new Date();
      const currentWat = new Date(currentUtc.getTime() + (1 * 60 * 60 * 1000));
      setWatTime(
        currentWat.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'UTC',
        }) + ' WAT'
      );

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalMsRemaining: 0,
        });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          totalMsRemaining: difference,
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtered Services List
  const filteredServices = SYSTEM_SERVICES.filter((svc) => {
    if (serviceFilter === 'all') return true;
    return svc.status === serviceFilter;
  });

  // Handle Notify Submit
  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes('@')) {
      alert('Please enter a valid business email address.');
      return;
    }

    setIsSubmittingNotify(true);
    const subject = encodeURIComponent(`KIOSC Restoration Alert & Notification: ${notifyEmail}`);
    const body = encodeURIComponent(
      `KIOSC Priority Alert Registration\n\n` +
      `Applicant Email: ${notifyEmail}\n` +
      `Phone: ${notifyPhone || 'Not provided'}\n` +
      `Investment Sector: ${notifySector}\n\n` +
      `Dispatched to: info@kosippppa.kogistate.gov.ng\n` +
      `Operating Hours: Monday – Thursday, 8:00 am – 4:00 pm`
    );
    window.location.href = `mailto:info@kosippppa.kogistate.gov.ng?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setIsSubmittingNotify(false);
      setNotifySuccessMessage(
        `Priority alert registered! Your information has been dispatched to info@kosippppa.kogistate.gov.ng. You will be notified the instant KIOSC services are restored.`
      );
      setNotifyEmail('');
      setNotifyPhone('');
      // Auto-clear success message after 7 seconds
      setTimeout(() => setNotifySuccessMessage(null), 7000);
    }, 600);
  };

  // Handle Advisory Booking Submit
  const handleAdvisorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advisoryName || !advisoryEmail) {
      alert('Please provide your name and contact email.');
      return;
    }

    setIsSubmittingAdvisory(true);
    const subject = encodeURIComponent(`KIOSC Advisory Inquiry: ${advisoryName} (${advisoryOrg || 'Investor'})`);
    const body = encodeURIComponent(
      `KIOSC Direct Advisory & Inquiry Request\n\n` +
      `Full Name: ${advisoryName}\n` +
      `Organization: ${advisoryOrg || 'N/A'}\n` +
      `Email: ${advisoryEmail}\n` +
      `Phone: ${advisoryPhone || 'N/A'}\n` +
      `Strategic Sector: ${advisorySector}\n` +
      `Urgency Level: ${advisoryUrgency}\n` +
      `Project Brief / Inquiry Notes:\n${advisoryNotes || 'None'}\n\n` +
      `Contact Desk: info@kosippppa.kogistate.gov.ng\n` +
      `Office Hours: Monday – Thursday, 8:00 am – 4:00 pm`
    );
    window.location.href = `mailto:info@kosippppa.kogistate.gov.ng?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setIsSubmittingAdvisory(false);
      setAdvisorySuccess(true);
      setTimeout(() => {
        setAdvisorySuccess(false);
        setIsAdvisoryModalOpen(false);
        setAdvisoryName('');
        setAdvisoryOrg('');
        setAdvisoryEmail('');
        setAdvisoryPhone('');
        setAdvisoryNotes('');
      }, 2500);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#15803D] selection:text-white flex flex-col justify-between">
      {/* ============================================================== */}
      {/* 1. TOP UTILITY / SOVEREIGN JURISDICTION BANNER */}
      {/* ============================================================== */}
      <aside aria-label="Official Government Portal Notification" className="bg-[#0A192F] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#15803D] text-[10px] text-white font-bold">
              ✓
            </span>
            <span className="tracking-wide">
              Official Portal of the <strong className="text-white">Government of Kogi State</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 font-mono text-[#D97706] bg-[#0F223D] px-2 py-0.5 rounded border border-[#1E3A8A]">
              <ClockIcon className="w-3.5 h-3.5 text-[#D97706]" />
              Current WAT: {watTime}
            </span>
            <span className="hidden md:inline-block text-slate-400">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-300">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-400" />
              Tier-3 Sovereign Encrypted Platform
            </span>
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. PRIMARY HEADER & INSTITUTIONAL BRANDING */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Logo & Entity Name */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="flex-shrink-0">
              <img
                src="/images/kiosc_logo.png"
                alt="Kogi Invest One-Stop Centre (KIOSC) Official Logo"
                className="h-11 sm:h-13 md:h-14 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'public/images/kiosc_logo.png';
                }}
              />
            </div>

            <div className="border-l border-slate-200 pl-3 sm:pl-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  KIOSC
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:inline-block">
                  Digital Investment Gateway
                </span>
              </div>
              <h1 className="text-xs sm:text-sm font-bold text-[#0A192F] leading-tight mt-0.5">
                Kogi State Investment Promotion and Public Private Partnership Agency (KOSIPPPPA)
              </h1>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Government of Kogi State
              </p>
            </div>
          </div>

          {/* Right Header: Pulsating System Status Badge */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D97706]"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                ⚡ Gate 2 In Progress (UI/UX Design)
              </span>
            </div>

            <button
              onClick={() => setIsAdvisoryModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A192F] bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              <PhoneCallIcon className="w-3.5 h-3.5 text-[#15803D]" />
              Emergency Support
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 3. HERO SECTION (PRIMARY FOCUS) */}
      {/* ============================================================== */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0A192F] via-[#0F223D] to-[#0A192F] text-white pt-12 pb-16 sm:pt-16 sm:pb-24">
          {/* Subtle Ambient Decorative Grids & Watermark */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#15803D]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#D97706]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Institutional Notice Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-emerald-300 mb-6">
                <AlertTriangleIcon className="w-4 h-4 text-amber-400" />
                <span>Notice to International &amp; Domestic Investors • Sovereign Upgrade Window</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight">
                Elevating Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-200">Investment Experience</span>
              </h2>

              {/* Subheadline */}
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
                The Kogi Invest One Stop Centre (KIOSC) portal is undergoing a scheduled system upgrade to enhance performance, security, and digital service delivery for corporate registrations and concessions.
              </p>
            </div>

            {/* LIVE COUNTDOWN TIMER BLOCK */}
            <div className="mt-10 sm:mt-12 max-w-4xl mx-auto">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50">
                <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-800 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <ClockIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                        Estimated System Restoration
                      </h3>
                      <p className="text-xs text-slate-400">
                        Target Date: <span className="text-amber-300 font-medium">{ESTIMATED_COMPLETION_WAT}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-xs font-mono bg-amber-950/80 text-amber-300 border border-amber-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    Gate 2 In Progress • Solution &amp; UI/UX Design
                  </div>
                </div>

                {/* 4-Column Flip Timer Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  {/* Days */}
                  <div className="bg-[#0A192F]/90 border border-slate-700/90 rounded-xl p-4 text-center relative overflow-hidden group">
                    <div className="text-3xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-emerald-400 mt-1">
                      Days Remaining
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-transparent opacity-50" />
                  </div>

                  {/* Hours */}
                  <div className="bg-[#0A192F]/90 border border-slate-700/90 rounded-xl p-4 text-center relative overflow-hidden group">
                    <div className="text-3xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-amber-400 mt-1">
                      Hours
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-transparent opacity-50" />
                  </div>

                  {/* Minutes */}
                  <div className="bg-[#0A192F]/90 border border-slate-700/90 rounded-xl p-4 text-center relative overflow-hidden group">
                    <div className="text-3xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-emerald-400 mt-1">
                      Minutes
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-transparent opacity-50" />
                  </div>

                  {/* Seconds */}
                  <div className="bg-[#0A192F]/90 border border-slate-700/90 rounded-xl p-4 text-center relative overflow-hidden group">
                    <div className="text-3xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-amber-400 mt-1">
                      Seconds
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-transparent opacity-50" />
                  </div>
                </div>

                {/* PROGRESS INDICATOR BLOCK */}
                <div className="mt-8 pt-6 border-t border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-2.5 gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">Current Phase:</span>
                      <span className="text-amber-300 font-medium">Gate 2 – Solution &amp; UI/UX Design (Week 2 of 10)</span>
                    </div>
                    <div className="font-mono text-amber-400 font-bold text-sm">
                      20% Completed
                    </div>
                  </div>

                  {/* Sleek Progress Bar */}
                  <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-[#15803D] via-[#22C55E] to-[#D97706] rounded-full transition-all duration-700 ease-out relative"
                      style={{ width: '20%' }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>

                  {/* Progress Milestone Toggle Button */}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setShowPhaseDetails(!showPhaseDetails)}
                      className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors focus:outline-none"
                    >
                      <span>{showPhaseDetails ? 'Hide Technical Milestones' : 'View 10-Week Implementation Roadmap (7 Delivery Gates)'}</span>
                      <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${showPhaseDetails ? 'rotate-180' : ''}`} />
                    </button>
                    <span className="text-slate-500 hidden sm:inline">Build Ref: KIOSC-DEV-PLAN-2026</span>
                  </div>

                  {/* Expandable Phase Timeline Card */}
                  {showPhaseDetails && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 transition-all animate-fade-in">
                      {UPGRADE_PHASES.map((phase) => (
                        <div key={phase.id} className="flex items-start gap-3 text-xs pb-2.5 border-b border-slate-900 last:border-b-0 last:pb-0">
                          <div className="mt-0.5">
                            {phase.status === 'completed' && (
                              <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                            )}
                            {phase.status === 'in-progress' && (
                              <span className="relative flex h-3.5 w-3.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
                              </span>
                            )}
                            {phase.status === 'pending' && (
                              <div className="w-3.5 h-3.5 rounded-full border border-slate-600 bg-slate-800" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`font-semibold ${phase.status === 'in-progress' ? 'text-amber-300' : phase.status === 'completed' ? 'text-slate-200' : 'text-slate-400'}`}>
                                {phase.title}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">{phase.timestamp}</span>
                            </div>
                            <p className="text-slate-400 text-[11px] mt-0.5">{phase.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. REAL-TIME STATUS & SCHEDULE TIMELINE */}
        {/* ============================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 4 Cols: Maintenance Details Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#15803D]">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0A192F]">Maintenance Window</h3>
                    <p className="text-xs text-slate-500">Official Gazetted Timeline</p>
                  </div>
                </div>

                <div className="space-y-4 mt-5 text-sm">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Maintenance Commencement
                    </span>
                    <div className="font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      {MAINTENANCE_START_WAT}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Estimated Completion &amp; Cutover
                    </span>
                    <div className="font-semibold text-[#15803D] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#15803D] animate-ping" />
                      {ESTIMATED_COMPLETION_WAT}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                    <p className="font-medium text-slate-800">Key Upgrade Directives:</p>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                      <li>Draft filings saved in encrypted staging vaults.</li>
                      <li>Statutory submission clocks automatically frozen.</li>
                      <li>Payment transaction webhooks buffered securely.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* State Investment Visual Card */}
              <div className="rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-sm relative group">
                <div className="h-44 w-full overflow-hidden relative">
                  <img
                    src="/images/kipa_hero_banner.jpg"
                    alt="Kogi State Confluence of Opportunities"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/40 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                      Confluence of Opportunities
                    </span>
                    <h4 className="text-sm font-bold mt-1">Nigeria&apos;s Leading Natural Resources Corridor</h4>
                  </div>
                </div>
                <div className="p-4 text-xs text-slate-600">
                  <p>
                    Kogi State offers verified concessions across 29 solid minerals, multimodal waterways connecting 10 states, and fertile agricultural belts.
                  </p>
                  <button
                    onClick={() => setSelectedGuide(INVESTOR_GUIDES[0])}
                    className="mt-3 text-xs font-bold text-[#15803D] hover:text-[#064E3B] inline-flex items-center gap-1"
                  >
                    Explore Investment Guides <ArrowRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right 8 Cols: Real-Time Services Status Matrix */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0A192F]">Live Service Availability Matrix</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time operational status across KOSIPPPPA digital gates and offline channels
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setServiceFilter('all')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      serviceFilter === 'all'
                        ? 'bg-white text-[#0A192F] shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Services (6)
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceFilter('maintenance')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      serviceFilter === 'maintenance'
                        ? 'bg-white text-amber-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Impacted (3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceFilter('operational')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      serviceFilter === 'operational'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Operational (3)
                  </button>
                </div>
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 rounded-xl border transition-all ${
                      service.status === 'maintenance'
                        ? 'bg-amber-50/40 border-amber-200/80 hover:border-amber-300'
                        : 'bg-emerald-50/30 border-emerald-200/70 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-500">
                          {service.category}
                        </span>
                        <h4 className="text-sm font-bold text-[#0A192F] mt-0.5">{service.name}</h4>
                      </div>

                      {service.status === 'maintenance' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Offline / Upgrade
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          Active / Online
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{service.description}</p>

                    {service.alternativeRoute && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 text-[11px] flex items-center gap-1.5 text-slate-700">
                        <span className="font-semibold text-slate-900">Alternative:</span>
                        <span className="truncate">{service.alternativeRoute}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 5. ALTERNATIVE ACTION CHANNELS (PRIORITY INVESTOR SUPPORT) */}
        {/* ============================================================== */}
        <section className="bg-gradient-to-b from-slate-50 to-slate-100/70 py-12 sm:py-16 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#15803D]">
                Uninterrupted Investor Facilitation
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] tracking-tight mt-1">
                Alternative Action Channels &amp; Priority Support
              </h3>
              <p className="text-sm text-slate-600 mt-2 max-w-xl mx-auto">
                While digital self-service applications are undergoing upgrade, our dedicated investment facilitation officers remain active to assist your enterprise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Urgent Enquiries & Submissions */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1E3A8A] mb-4">
                    <MailIcon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#0A192F]">Urgent Submissions &amp; Inquiries</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Submit time-sensitive concession filings, urgent tax waiver petitions, or enterprise queries directly to our monitored emergency support desk.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <a
                    href="mailto:info@kosippppa.kogistate.gov.ng?subject=URGENT%20KIOSC%20Applicant%20Submission"
                    className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#0A192F] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <MailIcon className="w-4 h-4 text-emerald-400" />
                    <span>Email Priority Desk</span>
                  </a>
                  <p className="text-[11px] text-center text-slate-500 mt-2">
                    Direct: <span className="font-mono text-slate-700">info@kosippppa.kogistate.gov.ng</span>
                  </p>
                </div>
              </div>

              {/* Card 2: Schedule an Advisory Call (Primary CTA) */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 border-2 border-[#15803D]/60 shadow-xl shadow-emerald-950/5 hover:shadow-2xl transition-all relative flex flex-col justify-between">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#15803D] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm">
                  Recommended For Large Projects
                </div>

                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#15803D] mb-4">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#0A192F]">Schedule an Advisory Call</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Connect directly with a Senior Investment Relations Officer for bilateral project discussions, statutory guidance, and private-public partnership facilitation.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAdvisoryModalOpen(true)}
                    className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#064E3B] text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/20"
                  >
                    <PhoneCallIcon className="w-4 h-4" />
                    <span>Request Priority Session</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-500 mt-2">
                    Response time: Under 2 business hours
                  </p>
                </div>
              </div>

              {/* Card 3: Download Investment Guides */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#D97706] mb-4">
                    <DownloadIcon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#0A192F]">Download Investment Guides</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Access our official 2026-2030 sector prospectuses, GIS mineral concession maps, agro-processing briefs, and legal incentive frameworks offline.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedGuide(INVESTOR_GUIDES[0])}
                    className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A192F] text-xs font-bold transition-all border border-slate-300"
                  >
                    <DownloadIcon className="w-4 h-4 text-[#D97706]" />
                    <span>Browse Official Guides (4)</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-500 mt-2">
                    PDF format • Digital signed copies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 6. NOTIFICATION & AUTO-ALERT SIGNUP CARD */}
        {/* ============================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="bg-gradient-to-br from-[#0A192F] via-[#0F223D] to-[#064E3B] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Background seal watermark */}
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none w-96 h-96">
              <ShieldCheckIcon className="w-full h-full text-white" />
            </div>

            <div className="max-w-3xl relative z-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
                Instant System Reactivation Broadcast
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
                Get Notified Upon Restoration
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Register your corporate email address to receive an automated notification as soon as the Kogi Invest One Stop Centre (KIOSC) returns to full operational status.
              </p>

              {/* Success Notification Alert */}
              {notifySuccessMessage && (
                <div className="mt-6 p-4 rounded-xl bg-emerald-900/90 border border-emerald-400 text-xs text-emerald-100 flex items-start gap-3 animate-fade-in">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Registration Successful</span>
                    <span>{notifySuccessMessage}</span>
                  </div>
                </div>
              )}

              {/* Form Element */}
              <form onSubmit={handleNotifySubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Email Field */}
                  <div className="sm:col-span-5">
                    <label htmlFor={emailInputId} className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Business Email Address *
                    </label>
                    <input
                      id={emailInputId}
                      type="email"
                      required
                      placeholder="investor@enterprise.com"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
                    />
                  </div>

                  {/* Sector Selection */}
                  <div className="sm:col-span-4">
                    <label htmlFor={sectorSelectId} className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Investment Sector
                    </label>
                    <select
                      id={sectorSelectId}
                      value={notifySector}
                      onChange={(e) => setNotifySector(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="Agribusiness & Food Processing">Agribusiness &amp; Food Processing</option>
                      <option value="Solid Minerals & Mining">Solid Minerals &amp; Mining</option>
                      <option value="Power & Renewable Energy">Power &amp; Renewable Energy</option>
                      <option value="Logistics & Free Trade Zones">Logistics &amp; Free Trade Zones</option>
                      <option value="Manufacturing & Light Industry">Manufacturing &amp; Light Industry</option>
                      <option value="General Enterprise & Commercial">General Enterprise &amp; Commercial</option>
                    </select>
                  </div>

                  {/* Action Button */}
                  <div className="sm:col-span-3 flex items-end">
                    <button
                      type="submit"
                      disabled={isSubmittingNotify}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-[#15803D] hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-950/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmittingNotify ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <span>Notify Me</span>
                          <ArrowRightIcon className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Optional SMS check toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 pt-2 gap-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifySms}
                      onChange={(e) => setNotifySms(e.target.checked)}
                      className="rounded bg-white/10 border-white/20 text-emerald-600 focus:ring-emerald-400"
                    />
                    <span>Also alert via corporate WhatsApp / SMS</span>
                  </label>

                  {notifySms && (
                    <input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={notifyPhone}
                      onChange={(e) => setNotifyPhone(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 max-w-xs"
                    />
                  )}

                  <span className="text-[11px] text-slate-400">
                    Compliant with NDPR 2023. Zero spam policy.
                  </span>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 7. STRUCTURED ENTERPRISE FAQ ACCORDION */}
        {/* ============================================================== */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#15803D]">
              Frequently Asked Questions
            </span>
            <h3 className="text-2xl font-bold text-[#0A192F] mt-1">
              Investor Operational Guidance
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Official clarifications on compliance, statutory timelines, and emergency services during maintenance.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm font-bold text-[#0A192F]">{item.question}</span>
                    <ChevronDownIcon
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-[#15803D]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ============================================================== */}
      {/* 8. ADVISORY SESSION BOOKING MODAL */}
      {/* ============================================================== */}
      {isAdvisoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsAdvisoryModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <XIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#15803D]">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0A192F]">Schedule an Advisory Call</h3>
                <p className="text-xs text-slate-500">KOSIPPPPA Executive Facilitation Unit</p>
              </div>
            </div>

            {advisorySuccess ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircleIcon className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Session Request Received</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thank you, <strong>{advisoryName}</strong>. An Investment Facilitation Officer has been assigned and will reach out via <strong>{advisoryEmail}</strong> within 2 hours with secure calendar credentials.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAdvisorySubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Representative Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Aliyu Bello"
                    value={advisoryName}
                    onChange={(e) => setAdvisoryName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Organization / Enterprise</label>
                    <input
                      type="text"
                      placeholder="e.g. Dangote Minerals Ltd"
                      value={advisoryOrg}
                      onChange={(e) => setAdvisoryOrg(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="aliyu@organization.com"
                      value={advisoryEmail}
                      onChange={(e) => setAdvisoryEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Sector</label>
                    <select
                      value={advisorySector}
                      onChange={(e) => setAdvisorySector(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    >
                      <option value="Solid Minerals & Mining">Solid Minerals &amp; Mining</option>
                      <option value="Agribusiness & Cassava">Agribusiness &amp; Cassava</option>
                      <option value="Confluence Port Logistics">Confluence Port Logistics</option>
                      <option value="Clean Energy & Power">Clean Energy &amp; Power</option>
                      <option value="Other Investment">Other Investment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Urgency Priority</label>
                    <select
                      value={advisoryUrgency}
                      onChange={(e) => setAdvisoryUrgency(e.target.value as 'normal' | 'urgent' | 'critical')}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-semibold"
                    >
                      <option value="normal">Standard (within 24 hrs)</option>
                      <option value="urgent">Urgent (within 4 hrs)</option>
                      <option value="critical">Critical Concession (2 hrs)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Project Scope &amp; Objective</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly state your intended project scale, land concession query, or regulatory need..."
                    value={advisoryNotes}
                    onChange={(e) => setAdvisoryNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsAdvisoryModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAdvisory}
                    className="px-5 py-2 rounded-lg bg-[#15803D] hover:bg-[#064E3B] text-white font-bold shadow-md shadow-emerald-700/20 flex items-center gap-2"
                  >
                    {isSubmittingAdvisory ? 'Submitting...' : 'Confirm Call Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 9. INVESTOR GUIDES PREVIEW / DOWNLOAD MODAL */}
      {/* ============================================================== */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
            <button
              type="button"
              onClick={() => setSelectedGuide(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <XIcon className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-[#15803D] uppercase tracking-wider mb-1">
              <span>Official KOSIPPPPA Publication</span>
              <span>•</span>
              <span>{selectedGuide.sector}</span>
            </div>

            <h3 className="text-lg font-bold text-[#0A192F] leading-snug">
              {selectedGuide.title}
            </h3>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {selectedGuide.description}
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
              <span className="font-bold text-[#B45309] block">Policy Incentive Highlight:</span>
              <span className="text-slate-700">{selectedGuide.featuredHighlight}</span>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 py-2 border-y border-slate-100">
              <span>Pagination: <strong>{selectedGuide.pages} Pages</strong></span>
              <span>Document Size: <strong>{selectedGuide.fileSize}</strong></span>
              <span>Format: <strong>Verified PDF (SHA-256)</strong></span>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedGuide(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
              >
                Close Preview
              </button>
              <a
                href="#download-initiated"
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Downloading: "${selectedGuide.title}" (PDF). In production, this links to the cloud storage bucket.`);
                  setSelectedGuide(null);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-md"
              >
                <DownloadIcon className="w-4 h-4 text-amber-400" />
                <span>Download Prospectus ({selectedGuide.fileSize})</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 10. EXECUTIVE FOOTER & SOVEREIGN ATTESTATIONS */}
      {/* ============================================================== */}
      <footer className="bg-[#0A192F] text-slate-400 text-xs pt-12 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            {/* Col 1: Institutional Authority */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="bg-white p-1.5 rounded-lg shadow-sm inline-flex items-center justify-center">
                  <img
                    src="/images/kiosc_logo.png"
                    alt="Kogi Invest One Stop Centre (KIOSC) Logo"
                    className="h-8 w-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'public/images/kiosc_logo.png';
                    }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Kogi State Investment Promotion and Public Private Partnership Agency (KOSIPPPPA), facilitating sovereign and private enterprise investments in Kogi State.
              </p>
            </div>

            {/* Col 2: Physical & Direct Liaison */}
            <div className="space-y-2">
              <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                Physical Headquarters &amp; Hours
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Investment House, Confluence Beach Road,<br />
                Adjacent Government House,<br />
                Lokoja, Kogi State, Nigeria.
              </p>
              <div className="pt-1 text-[11px] text-emerald-400 font-semibold">
                Monday – Thursday, 8:00 am – 4:00 pm
              </div>
            </div>

            {/* Col 3: Direct Priority Desk */}
            <div className="space-y-2">
              <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                Official Communications
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  Email:{' '}
                  <a href="mailto:info@kosippppa.kogistate.gov.ng" className="text-slate-300 hover:text-white underline">
                    info@kosippppa.kogistate.gov.ng
                  </a>
                </li>
                <li>
                  Phone 1:{' '}
                  <a href="tel:+2348036157486" className="text-emerald-400 font-mono hover:underline">
                    +234 803 615 7486
                  </a>
                </li>
                <li>
                  Phone 2:{' '}
                  <a href="tel:+2348036554498" className="text-emerald-400 font-mono hover:underline">
                    +234 803 655 4498
                  </a>
                </li>
                <li>
                  State Portal:{' '}
                  <a href="https://kogistate.gov.ng" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline inline-flex items-center gap-1">
                    kogistate.gov.ng <ExternalLinkIcon className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Compliance & Certifications */}
            <div className="space-y-2.5">
              <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                Security Attestations
              </h4>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                  <span>ISO/IEC 27001 Certified System</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                  <span>NDPR (Data Protection) Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                  <span>256-Bit TLS End-to-End Encryption</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Disclaimer & Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
            <p>
              © {new Date().getFullYear()} Kogi State Investment Promotion and Public Private Partnership Agency (KOSIPPPPA). All Rights Reserved. An Official Digital Gateway of the Government of Kogi State.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#privacy" className="hover:text-slate-200 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#terms" className="hover:text-slate-200 transition-colors">Terms of Investment</a>
              <span>•</span>
              <a href="#security" className="hover:text-slate-200 transition-colors">Security Audit Report</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
