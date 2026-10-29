'use client';

import React, { useState, useEffect } from 'react';
import type { SystemService, UpgradePhase, InvestorGuide, TimeLeft, AdvisoryBookingFormData, NotificationFormData } from './components/types';

export interface MaintenancePageProps {
  /** Target restoration timestamp or ISO string. Defaults to Sunday, November 2, 2026 – 18:00 WAT */
  targetRestorationDate?: string | number;
  /** Initial completion percentage for the upgrade progress bar. Defaults to 65% */
  initialProgress?: number;
  /** Callback fired when an investor requests emergency call booking */
  onAdvisoryRequested?: (data: AdvisoryBookingFormData) => Promise<void> | void;
  /** Callback fired when an investor registers for restoration email alerts */
  onNotificationSignup?: (data: NotificationFormData) => Promise<void> | void;
  /** Official support email. Defaults to info@kosippppa.kogistate.gov.ng */
  supportEmail?: string;
  /** Official facilitation phone numbers. Defaults to +234 803 615 7486, +234 803 655 4498 */
  supportPhone?: string;
}

export const DEFAULT_SERVICES: SystemService[] = [
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

export default function MaintenancePage({
  targetRestorationDate = "2026-11-02T18:00:00+01:00",
  initialProgress = 20,
  onAdvisoryRequested,
  onNotificationSignup,
  supportEmail = "info@kosippppa.kogistate.gov.ng",
  supportPhone = "+234 803 615 7486, +234 803 655 4498",
}: MaintenancePageProps) {
  const targetTimestamp = typeof targetRestorationDate === 'number'
    ? targetRestorationDate
    : new Date(targetRestorationDate).getTime();

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 6,
    hours: 17,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });

  const [serviceFilter, setServiceFilter] = useState<'all' | 'maintenance' | 'operational'>('all');
  const [showMilestones, setShowMilestones] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isAdvisoryModalOpen, setIsAdvisoryModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [sectorInput, setSectorInput] = useState('Agribusiness & Food Processing');
  const [notifySuccess, setNotifySuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const calc = () => {
      const now = Date.now();
      const diff = targetTimestamp - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true });
      } else {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
          isComplete: false,
        });
      }
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [targetTimestamp]);

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setIsSubmitting(true);
    if (onNotificationSignup) {
      await onNotificationSignup({ email: emailInput, sector: sectorInput, notifyBySms: false });
    }
    setTimeout(() => {
      setIsSubmitting(false);
      setNotifySuccess(`Priority notice registered for ${emailInput}. You will be alerted immediately upon restoration.`);
      setEmailInput('');
      setTimeout(() => setNotifySuccess(null), 6000);
    }, 800);
  };

  const filtered = DEFAULT_SERVICES.filter((svc) => {
    if (serviceFilter === 'all') return true;
    return svc.status === serviceFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#15803D] selection:text-white flex flex-col justify-between">
      {/* Top Sovereign Banner */}
      <div className="bg-[#0A192F] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#15803D] text-[10px] text-white font-bold">✓</span>
            <span>Official Portal of the <strong className="text-white">Government of Kogi State</strong></span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-300">Mon – Thu: 8:00 am – 4:00 pm WAT</span>
            <span className="text-slate-600">|</span>
            <span className="text-[#D97706] font-mono bg-[#0F223D] px-2 py-0.5 rounded border border-[#1E3A8A]">
              Development Period: 2 Months + 2 Weeks
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="flex-shrink-0">
              <img
                src="/images/kiosc_logo.png"
                alt="Kogi Invest One Stop Centre (KIOSC) Official Logo"
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
                <span className="text-[10px] sm:text-[11px] text-slate-500">Digital Investment Gateway</span>
              </div>
              <h1 className="text-xs sm:text-sm font-bold text-[#0A192F] leading-tight mt-0.5">
                Kogi State Investment Promotion and Public Private Partnership Agency (KOSIPPPPA)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D97706]"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                ⚡ Gate 2 In Progress
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="bg-gradient-to-b from-[#0A192F] via-[#0F223D] to-[#0A192F] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Elevating Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-200">Investment Experience</span>
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              The Kogi Invest One Stop Centre (KIOSC) portal is undergoing a scheduled system upgrade to enhance performance, security, and digital service delivery.
            </p>

            {/* Countdown Grid */}
            <div className="mt-10 bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#0A192F] border border-slate-700 rounded-xl p-4">
                  <div className="text-3xl sm:text-5xl font-mono font-bold text-white">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mt-1">Days</div>
                </div>
                <div className="bg-[#0A192F] border border-slate-700 rounded-xl p-4">
                  <div className="text-3xl sm:text-5xl font-mono font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mt-1">Hours</div>
                </div>
                <div className="bg-[#0A192F] border border-slate-700 rounded-xl p-4">
                  <div className="text-3xl sm:text-5xl font-mono font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mt-1">Minutes</div>
                </div>
                <div className="bg-[#0A192F] border border-slate-700 rounded-xl p-4">
                  <div className="text-3xl sm:text-5xl font-mono font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mt-1">Seconds</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300 font-semibold">Gate 2: Solution &amp; UI/UX Design (Week 2 of 10)</span>
                  <span className="text-amber-400 font-bold font-mono">{initialProgress}% Completed</span>
                </div>
                <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-[#15803D] via-[#22C55E] to-[#D97706] rounded-full transition-all duration-700"
                    style={{ width: `${initialProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Service Availability Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#0A192F]">Live System Status &amp; Schedule</h3>
              <p className="text-xs text-slate-500 mt-0.5">Start: Saturday, Nov 1, 00:00 WAT • Target: Sunday, Nov 2, 18:00 WAT</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setServiceFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${serviceFilter === 'all' ? 'bg-[#0A192F] text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                All (6)
              </button>
              <button
                onClick={() => setServiceFilter('maintenance')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${serviceFilter === 'maintenance' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                Impacted (3)
              </button>
              <button
                onClick={() => setServiceFilter('operational')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${serviceFilter === 'operational' ? 'bg-[#15803D] text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                Operational (3)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filtered.map((service) => (
              <div
                key={service.id}
                className={`p-5 rounded-2xl border ${
                  service.status === 'maintenance' ? 'bg-amber-50/50 border-amber-200' : 'bg-emerald-50/40 border-emerald-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500">{service.category}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${service.status === 'maintenance' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {service.status === 'maintenance' ? 'Offline / Upgrade' : 'Operational'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#0A192F] mt-2">{service.name}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Priority Alternative Channels */}
        <section className="bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#15803D]">Continuous Investor Support</span>
              <h3 className="text-2xl font-bold text-[#0A192F] mt-1">Alternative Action Channels</h3>
              <p className="text-xs text-slate-600 mt-1">Our executive teams remain accessible through verified channels during maintenance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-[#0A192F]">Urgent Submissions</h4>
                  <p className="text-xs text-slate-600 mt-2">Email your time-sensitive filings or inquiries directly to our priority support desk.</p>
                </div>
                <a
                  href={`mailto:${supportEmail}`}
                  className="mt-6 block text-center py-2.5 px-4 bg-[#0A192F] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Email {supportEmail}
                </a>
              </div>

              <div className="bg-white p-6 rounded-2xl border-2 border-[#15803D] shadow-md flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded">High Priority</span>
                  <h4 className="text-base font-bold text-[#0A192F] mt-2">Schedule an Advisory Call</h4>
                  <p className="text-xs text-slate-600 mt-2">Book a direct bilateral consultation with our Senior Investment Officers.</p>
                </div>
                <button
                  onClick={() => setIsAdvisoryModalOpen(true)}
                  className="mt-6 w-full py-2.5 px-4 bg-[#15803D] text-white text-xs font-bold rounded-xl hover:bg-[#064E3B] transition-colors"
                >
                  Request Advisory Session
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-[#0A192F]">Download Guides</h4>
                  <p className="text-xs text-slate-600 mt-2">Access offline concession guides for Agribusiness, Mining, and Infrastructure.</p>
                </div>
                <a
                  href="/docs/kogi_investment_guide.pdf"
                  className="mt-6 block text-center py-2.5 px-4 bg-slate-200 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-300 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Official guides are downloadable. Linking to offline PDF repository.');
                  }}
                >
                  Download Prospectus (PDF)
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Notification Alert Card */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-[#0A192F] to-[#064E3B] rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold">Get Notified Upon Restoration</h3>
            <p className="text-xs text-slate-300 mt-1">Receive an instant alert when the Kogi Invest One Stop Centre (KIOSC) returns online.</p>

            {notifySuccess && (
              <div className="mt-4 p-3 bg-emerald-800/80 border border-emerald-400 rounded-lg text-xs text-white">
                {notifySuccess}
              </div>
            )}

            <form onSubmit={handleNotifySubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="investor@organization.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <select
                value={sectorInput}
                onChange={(e) => setSectorInput(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-white text-xs"
              >
                <option value="Agribusiness & Food Processing">Agribusiness</option>
                <option value="Solid Minerals & Mining">Solid Minerals</option>
                <option value="Power & Infrastructure">Power &amp; Infrastructure</option>
                <option value="General Enterprise">General Enterprise</option>
              </select>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#15803D] hover:bg-[#16A34A] text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                {isSubmitting ? 'Registering...' : 'Notify Me'}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A192F] text-slate-400 text-xs py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
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
            <p className="text-[11px] text-slate-400">© {new Date().getFullYear()} Kogi State Investment Promotion and Public Private Partnership Agency (KOSIPPPPA). All Rights Reserved.</p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Email: {supportEmail}</span>
            <span>•</span>
            <span>Hotline: {supportPhone}</span>
            <span>•</span>
            <span>Mon – Thu, 8:00 am – 4:00 pm</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
