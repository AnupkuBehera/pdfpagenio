"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, HelpCircle, ShieldCheck, Zap, Sparkles, ArrowRight } from "lucide-react";

export default function PricingPage() {
  const [currency, setCurrency] = useState<"INR" | "USD" | "BRL" | "IDR">("INR");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const getFreePrice = () => {
    if (currency === "INR") return "₹0";
    if (currency === "BRL") return "R$ 0";
    if (currency === "IDR") return "Rp 0";
    return "$0";
  };

  const getProPrice = () => {
    if (currency === "INR") {
      return billingCycle === "yearly"
        ? { amount: "₹25", period: "/ month (₹299 billed yearly)" }
        : { amount: "₹49", period: "/ month (cancel anytime)" };
    }
    if (currency === "BRL") {
      return billingCycle === "yearly"
        ? { amount: "R$ 6,90", period: "/ mês (R$ 82,80 cobrado anual)" }
        : { amount: "R$ 9,90", period: "/ mês" };
    }
    if (currency === "IDR") {
      return billingCycle === "yearly"
        ? { amount: "Rp 14.000", period: "/ bulan (Rp 168.000 tahunan)" }
        : { amount: "Rp 19.000", period: "/ bulan" };
    }
    return billingCycle === "yearly"
      ? { amount: "$4", period: "/ month (billed annually)" }
      : { amount: "$7", period: "/ month" };
  };

  const getBusinessPrice = () => {
    if (currency === "INR") {
      return billingCycle === "yearly"
        ? { amount: "₹125", period: "/ user / month" }
        : { amount: "₹199", period: "/ user / month" };
    }
    if (currency === "BRL") {
      return billingCycle === "yearly"
        ? { amount: "R$ 25", period: "/ usuário / mês" }
        : { amount: "R$ 35", period: "/ usuário / mês" };
    }
    if (currency === "IDR") {
      return billingCycle === "yearly"
        ? { amount: "Rp 45.000", period: "/ pengguna / bulan" }
        : { amount: "Rp 65.000", period: "/ pengguna / bulan" };
    }
    return billingCycle === "yearly"
      ? { amount: "$7", period: "/ user / month" }
      : { amount: "$10", period: "/ user / month" };
  };

  const getProCta = () => {
    if (currency === "INR") return "Pay with UPI (GPay / PhonePe / Paytm)";
    if (currency === "BRL") return "Pagar com Pix Instantâneo";
    if (currency === "IDR") return "Bayar via QRIS / GoPay";
    return "Start 7-Day Free Trial";
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Transparent, Fair Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            Pick the perfect plan for your documents
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Enjoy full access to standard PDF tools completely free, or unlock unlimited batch processing and OCR with Premium.
          </p>

          {/* Currency Switcher */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-2">Select Region:</span>
            {[
              { id: "INR", label: "🇮🇳 India (₹ UPI)" },
              { id: "USD", label: "🇺🇸 Global ($ USD)" },
              { id: "BRL", label: "🇧🇷 Brazil (R$ Pix)" },
              { id: "IDR", label: "🇮🇩 Indonesia (Rp QRIS)" },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCurrency(c.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  currency === c.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {currency === "INR" && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold animate-in fade-in">
              <span>🇮🇳 Special Student & Exam Aspirant Pricing: Save up to 85% with Instant UPI (GPay, PhonePe, Paytm).</span>
            </div>
          )}

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-200/70 shadow-inner">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-brand-600 text-white shadow-md shadow-brand-500/25"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Yearly billing</span>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase">
                Save 33%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-stretch">
          {/* FREE PLAN */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-9 shadow-sm flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-4">
                Starter Tier
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">Free</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                Standard client-side tools for everyday PDF needs.
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-slate-900">{getFreePrice()}</span>
                <span className="text-xs font-bold text-slate-400">/ forever free</span>
              </div>

              <ul className="space-y-4 text-xs font-medium text-slate-600 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Access to all 32 PDF tools</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Process up to 3 files in bulk</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Standard compression</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>100% private in-browser processing</span>
                </li>
              </ul>
            </div>

            <Link
              href="/"
              className="mt-8 w-full btn-secondary py-3.5 text-xs sm:text-sm rounded-2xl font-bold"
            >
              Get Started Free
            </Link>
          </div>

          {/* PREMIUM PRO (Highlighted) */}
          <div className="bg-white rounded-3xl border-2 border-brand-500 p-8 sm:p-9 shadow-2xl relative flex flex-col justify-between scale-105 z-10">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
              Most Popular
            </span>

            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-4">
                Premium Individual
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">Premium Pro</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                Unlimited batch power, OCR, and AI document capabilities.
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-slate-900">
                  {getProPrice().amount}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {getProPrice().period}
                </span>
              </div>

              <ul className="space-y-4 text-xs text-slate-700 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-3 font-semibold">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Unlimited batch file processing</span>
                </li>
                <li className="flex items-center gap-3 font-semibold">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>OCR Searchable PDF layer generation</span>
                </li>
                <li className="flex items-center gap-3 font-semibold">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Smart Ghostscript high-ratio compression</span>
                </li>
                <li className="flex items-center gap-3 font-semibold">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>AI Document Summaries & Interactive Chat</span>
                </li>
                <li className="flex items-center gap-3 font-semibold">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Large files up to 2 GB each</span>
                </li>
                <li className="flex items-center gap-3 font-semibold">
                  <Check className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Priority 24/7 dedicated customer support</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => alert(`Connecting to ${currency === "INR" ? "Razorpay UPI" : currency === "BRL" ? "Pix" : currency === "IDR" ? "QRIS" : "Stripe"} billing checkout...`)}
              className="mt-8 w-full btn-primary py-3.5 text-xs sm:text-sm rounded-2xl font-bold shadow-xl shadow-brand-500/30 animate-shimmer"
            >
              {getProCta()}
            </button>
          </div>

          {/* BUSINESS / TEAMS */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-9 shadow-sm flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-4">
                Organizations & Teams
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">Business</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">
                For organizations needing shared signatures and team controls.
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-slate-900">
                  {getBusinessPrice().amount}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {getBusinessPrice().period}
                </span>
              </div>

              <ul className="space-y-4 text-xs font-medium text-slate-600 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Everything in Premium plan</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Team workspace & role permissions</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Centralized billing & invoice management</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Custom contract & 99.9% uptime SLA</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => alert("Contact Sales: Enter your team size to receive an instant volume discount.")}
              className="mt-8 w-full btn-secondary py-3.5 text-xs sm:text-sm rounded-2xl font-bold"
            >
              Contact Sales
            </button>
          </div>
        </div>

        {/* Guarantees Strip */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-8 h-8 text-brand-600 shrink-0" />
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm mb-1">
                  14-Day Money Back Guarantee
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  If you are not 100% satisfied with our service, contact us within 14 days for a full refund.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Zap className="w-8 h-8 text-brand-600 shrink-0" />
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm mb-1">
                  Cancel Anytime
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  No hidden lock-ins. Cancel your subscription anytime with one click directly from your dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-brand-600 shrink-0" />
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm mb-1">
                  Global Payment Methods
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  We support Visa, Mastercard, American Express, Apple Pay, Google Pay, PayPal, UPI, and Pix.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
