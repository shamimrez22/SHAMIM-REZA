import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Phone,
  MessageSquare,
  Linkedin,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';
import { PersonalInfo } from '../types/portfolio';
import { useTheme } from '../context/ThemeContext';

interface ContactProps {
  personalInfo: PersonalInfo;
}

export const Contact: React.FC<ContactProps> = ({ personalInfo }) => {
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Data Entry & Spreadsheet Project',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyValue = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate high-reliability message processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const contactCards = [
    {
      label: 'Email',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      icon: Mail,
      action: 'Send Email',
    },
    {
      label: 'Phone',
      value: personalInfo.phone,
      href: `tel:${personalInfo.phone}`,
      icon: Phone,
      action: 'Call Now',
    },
    {
      label: 'WhatsApp',
      value: personalInfo.whatsapp,
      href: `https://wa.me/${personalInfo.whatsapp.replace(/[^0-9]/g, '')}`,
      icon: MessageSquare,
      action: 'Chat on WhatsApp',
    },
    {
      label: 'LinkedIn',
      value: personalInfo.linkedin,
      href: `https://${personalInfo.linkedin}`,
      icon: Linkedin,
      action: 'Connect',
    },
    {
      label: 'Location',
      value: personalInfo.location,
      icon: MapPin,
      action: 'Location',
    },
  ];

  return (
    <section
      id="contact"
      className={`relative py-24 section-transition border-t ${
        theme === 'dark'
          ? 'bg-[#0b1120] border-slate-800 text-slate-100'
          : theme === 'orange'
          ? 'bg-[#0c0905] border-orange-950 text-amber-50'
          : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div
          className={`absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl ${
            theme === 'orange' ? 'bg-orange-600' : 'bg-blue-600'
          }`}
        />
        <div
          className={`absolute bottom-10 right-1/4 w-96 h-96 rounded-full blur-3xl ${
            theme === 'orange' ? 'bg-amber-500' : 'bg-cyan-500'
          }`}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header with Scroll Reveal */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border ${
              theme === 'orange'
                ? 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                : 'text-blue-600 dark:text-cyan-400 bg-blue-500/10 border-blue-500/20'
            }`}
          >
            START A CONVERSATION
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-3xl sm:text-5xl font-black tracking-tight ${
              theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
            }`}
          >
            LET&apos;S WORK TOGETHER
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`w-20 h-1 mx-auto mt-4 rounded-full ${
              theme === 'orange'
                ? 'bg-gradient-to-r from-orange-500 to-amber-400'
                : 'bg-gradient-to-r from-blue-500 to-cyan-400'
            }`}
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className={`text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed font-medium ${
              theme === 'orange'
                ? 'text-amber-200/80'
                : theme === 'dark'
                ? 'text-slate-300'
                : 'text-slate-600'
            }`}
          >
            Have a data entry or administrative task? Let&apos;s discuss how I can help.
          </motion.p>
        </div>

        {/* Dual Column Layout: Direct Contact Info + Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Column 1: Contact Details & Channels */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-4"
          >
            <h3
              className={`text-xl font-black tracking-tight mb-6 ${
                theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
              }`}
            >
              Executive Communication Channels
            </h3>

            {contactCards.map((channel, cIdx) => {
              const Icon = channel.icon;
              return (
                <div
                  key={cIdx}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                    theme === 'orange'
                      ? 'bg-[#181109]/95 border-orange-900/60 hover:border-orange-500/60 shadow-md shadow-black/30'
                      : theme === 'dark'
                      ? 'bg-slate-900/90 border-slate-700/80 hover:border-blue-500/50 shadow-md shadow-black/20'
                      : 'bg-white border-slate-200 hover:border-blue-500 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-all ${
                        theme === 'orange'
                          ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 group-hover:bg-orange-600 group-hover:text-white'
                          : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-cyan-400 group-hover:bg-blue-600 group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider block ${
                          theme === 'orange'
                            ? 'text-amber-300/70'
                            : theme === 'dark'
                            ? 'text-slate-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {channel.label}
                      </span>
                      <span
                        className={`text-sm font-bold tracking-tight ${
                          theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {channel.value}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => copyValue(channel.value, channel.label)}
                      title={`Copy ${channel.label}`}
                      className={`p-2 rounded-lg transition-colors ${
                        theme === 'orange'
                          ? 'text-amber-300/60 hover:text-orange-400 hover:bg-[#22150a]'
                          : 'text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {copiedField === channel.label ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    {channel.href && (
                      <a
                        href={channel.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`p-2 rounded-lg transition-colors ${
                          theme === 'orange'
                            ? 'text-amber-300/60 hover:text-white hover:bg-[#22150a]'
                            : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={channel.action}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Availability Box */}
            <div
              className={`p-5 rounded-2xl border mt-6 ${
                theme === 'orange'
                  ? 'bg-[#22150a] border-orange-900/60 text-amber-100'
                  : theme === 'dark'
                  ? 'bg-blue-950/30 border-blue-900/50 text-slate-200'
                  : 'bg-blue-50/80 border-blue-200 text-slate-800'
              }`}
            >
              <div
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1 ${
                  theme === 'orange' ? 'text-orange-400' : 'text-blue-600 dark:text-cyan-400'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Immediate Availability</span>
              </div>
              <p
                className={`text-xs leading-relaxed font-medium ${
                  theme === 'orange'
                    ? 'text-amber-200/80'
                    : theme === 'dark'
                    ? 'text-slate-300'
                    : 'text-slate-700'
                }`}
              >
                Accepting new spreadsheets, document digitization batches, and recurring virtual administrative support contracts.
              </p>
            </div>
          </motion.div>

          {/* Column 2: Professional Interactive Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div
              className={`p-6 sm:p-8 rounded-2xl border shadow-xl relative overflow-hidden ${
                theme === 'orange'
                  ? 'bg-[#181109]/95 border-orange-900/60 text-white'
                  : theme === 'dark'
                  ? 'bg-slate-900/95 border-slate-700/80 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3
                      className={`text-2xl font-black tracking-tight ${
                        theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
                      }`}
                    >
                      Message Dispatched Successfully!
                    </h3>
                    <p
                      className={`text-sm max-w-md mx-auto leading-relaxed font-medium ${
                        theme === 'orange'
                          ? 'text-amber-200/80'
                          : theme === 'dark'
                          ? 'text-slate-300'
                          : 'text-slate-600'
                      }`}
                    >
                      Thank you,{' '}
                      <span
                        className={`font-bold ${
                          theme === 'orange'
                            ? 'text-orange-400'
                            : 'text-blue-600 dark:text-cyan-400'
                        }`}
                      >
                        {formData.name}
                      </span>
                      . Your inquiry has been received. I will review your requirements and respond promptly.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          subject: 'Data Entry & Spreadsheet Project',
                          message: '',
                        });
                      }}
                      className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all mt-4 ${
                        theme === 'orange'
                          ? 'bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-600/30'
                          : 'bg-blue-600 hover:bg-blue-500'
                      }`}
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div
                      className={`flex items-center justify-between pb-3 border-b ${
                        theme === 'orange'
                          ? 'border-orange-950'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div>
                        <span
                          className={`text-[10px] font-bold tracking-widest uppercase ${
                            theme === 'orange'
                              ? 'text-orange-400'
                              : 'text-blue-600 dark:text-cyan-400'
                          }`}
                        >
                          DIRECT TRANSMISSION
                        </span>
                        <h4
                          className={`text-lg font-black tracking-tight ${
                            theme === 'dark' || theme === 'orange' ? 'text-white' : 'text-slate-950'
                          }`}
                        >
                          Send A Project Inquiry
                        </h4>
                      </div>
                      <span
                        className={`text-xs font-mono ${
                          theme === 'orange' ? 'text-amber-300/60' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        Response: &lt; 24h
                      </span>
                    </div>

                    {/* Name & Email Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                            theme === 'orange'
                              ? 'text-amber-200'
                              : 'text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          Your Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Eleanor Vance"
                          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                            theme === 'orange'
                              ? 'bg-[#0e0a06] border-orange-900/60 text-white placeholder-amber-200/30 focus:border-orange-500'
                              : theme === 'dark'
                              ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600'
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                            theme === 'orange'
                              ? 'text-amber-200'
                              : 'text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          Your Email *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. client@organization.com"
                          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                            theme === 'orange'
                              ? 'bg-[#0e0a06] border-orange-900/60 text-white placeholder-amber-200/30 focus:border-orange-500'
                              : theme === 'dark'
                              ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                              : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Subject Selector */}
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                          theme === 'orange'
                            ? 'text-amber-200'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Project Subject *
                      </label>
                      <select
                        id="contact-subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all cursor-pointer ${
                          theme === 'orange'
                            ? 'bg-[#0e0a06] border-orange-900/60 text-white focus:border-orange-500'
                            : theme === 'dark'
                            ? 'bg-slate-950 border-slate-700 text-white focus:border-blue-500'
                            : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'
                        }`}
                      >
                        <option value="Data Entry & Spreadsheet Project">Data Entry &amp; Spreadsheet Project</option>
                        <option value="Data Cleaning & Deduplication">Data Cleaning &amp; Deduplication</option>
                        <option value="PDF to Excel / Word Conversion">PDF to Excel / Word Conversion</option>
                        <option value="Web Research & Contact List">Web Research &amp; Contact List</option>
                        <option value="Ongoing Administrative Support">Ongoing Administrative Support</option>
                        <option value="Other Inquiries">Other Inquiries</option>
                      </select>
                    </div>

                    {/* Message Textarea */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="contact-message"
                          className={`text-xs font-bold uppercase tracking-wider ${
                            theme === 'orange'
                              ? 'text-amber-200'
                              : 'text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          Project Details / Specifications *
                        </label>
                        <span
                          className={`text-[10px] ${
                            theme === 'orange'
                              ? 'text-amber-300/60'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {formData.message.length} chars
                        </span>
                      </div>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Describe the estimated volume of records, target deadlines, source document types, or specific requirements..."
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-y ${
                          theme === 'orange'
                            ? 'bg-[#0e0a06] border-orange-900/60 text-white placeholder-amber-200/30 focus:border-orange-500'
                            : theme === 'dark'
                            ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-600'
                        }`}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider text-white active:scale-[0.99] disabled:opacity-70 transition-all flex items-center justify-center gap-2 ${
                        theme === 'orange'
                          ? 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-lg shadow-orange-600/30'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/20'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>SENDING INQUIRY...</span>
                        </>
                      ) : (
                        <>
                          <span>SEND MESSAGE</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
