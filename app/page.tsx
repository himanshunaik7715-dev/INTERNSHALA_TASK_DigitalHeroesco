"use client";
import { useState, useEffect } from "react";
import {
  ArrowRight, Check, Bell, Shield, Zap,
  BarChart3, Users, FileSearch, CheckCircle2, Search
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/* ── Pipeline candidates ── */
const CANDIDATES = [
  { name: "Priya Sharma", role: "Sr. Frontend Dev",  score: 91 },
  { name: "Alex Chen",    role: "React Engineer",     score: 87 },
  { name: "Marco R.",     role: "Full Stack Dev",     score: 74 },
];

function scoreColor(s : number) {
  if (s >= 90) return { bar: "bg-green-500",  text: "text-green-600" };
  if (s >= 80) return { bar: "bg-blue-500",   text: "text-blue-600"  };
  return { bar: "bg-yellow-500", text: "text-yellow-600" };
}

/* ── Animated pipeline widget ── */
function PipelineWidget() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md w-72 flex-shrink-0">
      {/* macOS chrome */}
      <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400  inline-block" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
        <span className="ml-2 text-xs text-gray-400 font-mono">
          Senior Frontend Engineer
        </span>
      </div>

      <div className="p-3">
        {/* Stage label */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Applied
          </span>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-1.5 py-0.5 rounded">
            3
          </span>
        </div>

        {/* Candidate cards */}
        <div className="space-y-2">
          {CANDIDATES.map((c, i) => {
            const col = scoreColor(c.score);
            return (
              <div
                key={c.name}
                className="bg-gray-50 border border-gray-100 rounded-lg p-2.5"
                style={{
                  opacity:    show ? 1 : 0,
                  transform:  show ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity .4s ease ${i * 100}ms, transform .4s ease ${i * 100}ms`,
                }}
              >
                <p className="text-xs font-bold text-gray-900 leading-tight">{c.name}</p>
                <p className="text-xs text-gray-400 mb-2">{c.role}</p>
                {/* Score row */}
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 font-mono" style={{ fontSize: 10 }}>ATS Match</span>
                  <span className={`font-bold font-mono ${col.text}`} style={{ fontSize: 10 }}>
                    {c.score}%
                  </span>
                </div>
                {/* Bar */}
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${col.bar}`}
                    style={{
                      width:      show ? `${c.score}%` : "0%",
                      transition: `width 1.2s cubic-bezier(.4,0,.2,1) ${400 + i * 120}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Features data ── */
const FEATURES = [
  {
    icon: FileSearch,
    title: "ATS score, not gut feel",
    body: "Every resume is scored against your JD using semantic analysis. The ranking is objective, reproducible, and auditable — not whoever got reviewed on a Tuesday afternoon.",
  },
  {
    icon: Bell,
    title: "Instant candidate alerts",
    body: "When a 90%+ match applies, your hiring manager knows within 60 seconds. Not at next week's team sync.",
  },
  {
    icon: BarChart3,
    title: "Pipeline analytics that mean something",
    body: "Stage conversion rates, time-in-stage, source quality — measured per role, not company-wide averages that hide the problem.",
  },
  {
    icon: Users,
    title: "Multi-seat review workflows",
    body: "Assign scorecards to interviewers, aggregate scores, and surface disagreements automatically. No more chasing feedback in Slack.",
  },
  {
    icon: Shield,
    title: "Bias-reduction built in",
    body: "Names and photos are hidden during the initial AI ranking phase. Structured questions enforce consistency across every candidate in a role.",
  },
  {
    icon: Zap,
    title: "Connects to your stack in 5 minutes",
    body: "Native integrations with Greenhouse, Lever, and Workday. HRIS sync, SSO, and custom webhooks for anything else.",
  },
];

/* ── Pricing data ── */
const PLANS = [
  {
    name: "Starter", price: "$49", per: "/mo",
    desc: "For lean teams hiring fewer than 10 roles at a time.",
    features: ["5 active job posts", "AI matching & scoring", "Basic pipeline view", "Email notifications", "CSV export"],
    cta: "Start free trial", featured: false,
  },
  {
    name: "Growth", price: "$149", per: "/mo",
    desc: "For scaling teams that need structured interviews and analytics.",
    features: ["25 active job posts", "Everything in Starter", "Structured scorecards", "Pipeline analytics", "Greenhouse / Lever", "Priority support"],
    cta: "Start free trial", featured: true,
  },
  {
    name: "Enterprise", price: "Custom", per: "",
    desc: "For orgs with compliance requirements, multi-region hiring, or HRIS needs.",
    features: ["Unlimited job posts", "Everything in Growth", "SSO & SCIM", "Bias audit reports", "Dedicated CSM", "SLA & DPA"],
    cta: "Talk to sales", featured: false,
  },
];

/* ── HOW IT WORKS steps ── */
const STEPS = [
  {
    step: "Post",
    title: "Paste your JD and go live",
    body: "Drop your job description — requirements, nice-to-haves, everything. ResumeMatch extracts the criteria automatically. Review, adjust weights, publish.",
  },
  {
    step: "Match",
    title: "Every applicant gets a score",
    body: "When someone applies, their resume is parsed, compared against your criteria, and scored. You see a ranked list, not a time-ordered inbox.",
  },
  {
    step: "Hire",
    title: "Move fast on the right people",
    body: "One-click shortlist emails, structured scorecards, calendar sync for interviews. The offer goes out before your competitors finish reviewing the pile.",
  },
];

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function ResumeMatchLanding() {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; box-sizing: border-box; }
        .font-mono, .mono { font-family: 'JetBrains Mono', monospace !important; }
      `}</style>

      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
          Made by Himanshu Basant Naik
        </div>

        <div className="flex items-start gap-14">
          {/* Left */}
          <div className="flex-1 min-w-0">
            <h1 className="text-8xl font-extrabold tracking-tight leading-none text-blue-600 mb-5">
              Faster than<br />a shortlist.
            </h1>
            <p className="text-gray-500 text-base leading-relaxed max-w-xl mb-8">
              ResumeMatch ranks every applicant against your job description the moment
              they apply. No more stack-ranking spreadsheets at 11pm.
            </p>
            <div className="flex gap-3 mb-10">
              <Link href="/dashboard">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
                Try it free <ArrowRight size={14} />
              </button>
              </Link>
              <Link href="#features">
              <button className="text-sm font-semibold text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-600 px-5 py-2.5 rounded-lg transition-colors">
                See a live demo
              </button>
              </Link>
            </div>
            <div className="flex gap-8">
              {[["4.9/5", "G2 rating"], ["<2 min", "avg setup time"], ["94%", "faster time-to-hire"]].map(
                ([v, l]) => (
                  <div key={l}>
                    <p className="text-sm font-bold mono text-gray-900">{v}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{l}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right — Pipeline widget */}
          <PipelineWidget />
        </div>
      </section>

      {/* ── LOGO STRIP ── */}
      <div className="border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-10 overflow-x-auto">
          <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
            Trusted by teams at
          </span>
          {["Notion", "Linear", "Vercel", "Stripe", "Figma", "Loom"].map((n) => (
            <span key={n} className="text-sm font-bold text-gray-300 tracking-tight whitespace-nowrap">
              {n}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
          What ResumeMatch does
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 leading-tight mb-12">
          Built for the recruiting workflow,<br />not the RFP checklist.
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-white border border-gray-200 hover:border-blue-200 rounded-xl p-6 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Icon size={16} className="text-blue-600" />
              </div>
              <p className="text-sm font-bold text-gray-900 mb-2">{title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <div className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-12">
            From job post to offer letter.
          </h2>
          <div className="grid grid-cols-3 divide-x divide-gray-200">
            {STEPS.map(({ step, title, body }, i) => (
              <div key={step} className={`${i === 0 ? "pr-8" : i === 2 ? "pl-8" : "px-8"}`}>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                  {step}
                </p>
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRICING ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Pricing</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-12">
          Pay for what you use.
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl p-7 border ${
                plan.featured
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-gray-200"
              }`}
            >
              <p className={`text-sm font-bold mb-1 ${plan.featured ? "text-blue-200" : "text-gray-500"}`}>
                {plan.name}
              </p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`text-4xl font-extrabold tracking-tight ${plan.featured ? "text-white" : "text-gray-900"}`}>
                  {plan.price}
                </span>
                {plan.per && (
                  <span className={`text-sm ${plan.featured ? "text-blue-200" : "text-gray-400"}`}>
                    {plan.per}
                  </span>
                )}
              </div>
              <p className={`text-xs leading-relaxed mb-6 ${plan.featured ? "text-blue-100" : "text-gray-400"}`}>
                {plan.desc}
              </p>
              <ul className="space-y-2.5 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs">
                    <Check
                      size={13}
                      className={`mt-0.5 flex-shrink-0 ${plan.featured ? "text-blue-200" : "text-green-500"}`}
                    />
                    <span className={plan.featured ? "text-blue-50" : "text-gray-600"}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  plan.featured
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-gray-900 rounded-2xl px-16 py-14 flex items-center justify-between gap-10">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug mb-2">
              Your next best hire applied<br />three days ago.
            </h2>
            <p className="text-sm text-gray-400">Set up takes 2 minutes. No credit card required.</p>
          </div>
          <Link href="/dashboard">
          <button className="flex items-center gap-2 bg-white hover:opacity-90 text-gray-900 font-bold text-sm px-6 py-3 rounded-lg transition-opacity whitespace-nowrap flex-shrink-0">
            Start for free <ArrowRight size={14} />
          </button>
          </Link>
          
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-200 bg-white">
  <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-3 gap-10">

    {/* LEFT - Brand */}
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {/* Logo */}
        {/* <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">RM</span>
        </div> */}

          <span className="font-extrabold text-sm tracking-tight">
            <Link href="https://digitalheroesco.com/">
              Build for<span className="text-blue-600">  Digitalheroesco.com</span>
            </Link>
          </span>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">
        We craft tailored digital solutions — design, development, marketing — that drive real growth.
      </p>

      {/* <span className="text-xs text-gray-400">
        © 2025 ResumeMatch AI
      </span> */}
    </div>

    {/* MIDDLE - Links (no anchor tags, using Link) */}
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold text-gray-900 mb-1">Navigation</p>

      <Link href="/privacy" className="text-xs text-gray-500 hover:text-blue-600">
        Privacy
      </Link>

      <Link href="/terms" className="text-xs text-gray-500 hover:text-blue-600">
        Terms
      </Link>

      <Link href="/security" className="text-xs text-gray-500 hover:text-blue-600">
        Security
      </Link>

      <Link href="/status" className="text-xs text-gray-500 hover:text-blue-600">
        Status
      </Link>
    </div>

    {/* RIGHT - Contact */}
    <div className="space-y-3 text-right">
      <p className="text-xs font-bold text-gray-900">Contact</p>

      <div className="text-xs text-gray-500">
        Himanshu Basant Naik
      </div>

      <div className="text-xs text-blue-600">
        <Link href="mailto:himanshunaik7715@gmail.com" className="text-xs text-gray-500 hover:text-blue-600">
          himanshunaik7715@gmail.com
        </Link>
      </div>

      <div className="flex justify-end mt-2">
        <div className="flex items-center gap-2">
          {/* <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-[10px] font-bold text-gray-600">HN</span>
          </div> */}
          <span className="text-xs text-gray-500">
            Built by Himanshu Basant Naik
          </span>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Built for Digitalheroesco.com
      </div>
    </div>

  </div>
</footer>
    </div>
  );
}
