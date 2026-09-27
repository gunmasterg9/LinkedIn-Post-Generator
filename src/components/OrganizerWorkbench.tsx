import React, { useState } from 'react';
import { CampaignData, ActivityFeedItem, EventTemplate, MentionItem, TelemetrySummary } from '../types';

interface OrganizerWorkbenchProps {
  campaign: CampaignData;
  onUpdateCampaign: (updated: Partial<CampaignData>) => void;
  onNavigateToAttendee: () => void;
  onOpenExportModal: () => void;
  onOpenQRModal: () => void;
  onShowToast: (message: string) => void;
}

export const OrganizerWorkbench: React.FC<OrganizerWorkbenchProps> = ({
  campaign,
  onUpdateCampaign,
  onNavigateToAttendee,
  onOpenExportModal,
  onOpenQRModal,
  onShowToast,
}) => {
  // Onboarding guide
  const [showOrganizerOnboarding, setShowOrganizerOnboarding] = useState(() => {
    return localStorage.getItem('eventpulse_organizer_onboarding_dismissed') !== 'true';
  });

  // Active Tab within Workbench: 'settings' | 'templates' | 'mentions' | 'analytics'
  const [workbenchTab, setWorkbenchTab] = useState<'settings' | 'templates' | 'mentions' | 'analytics'>('settings');

  // Campaign editable state
  const [eventName, setEventName] = useState(campaign.name);
  const [organizer, setOrganizer] = useState(campaign.organizer);
  const [hashtags, setHashtags] = useState<string[]>(campaign.hashtags || []);
  const [aiPrompt, setAiPrompt] = useState(campaign.aiPromptDirectives);
  const [accessMode, setAccessMode] = useState<'public' | 'link-only' | 'password'>(campaign.accessMode || 'public');
  const [accessCode, setAccessCode] = useState(campaign.accessCode || '');
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mentions list
  const [mentions, setMentions] = useState<MentionItem[]>(
    campaign.mentions || [
      { id: 'm-1', type: 'Company', displayName: 'Apex Innovations', url: 'https://linkedin.com/company/apex-innovations' },
      { id: 'm-2', type: 'Speaker', displayName: 'Sarah Chen', linkedInHandle: 'sarahchen-ai' },
      { id: 'm-3', type: 'Event', displayName: 'Global Tech Summit', url: 'https://techsummit2025.io' },
    ]
  );
  const [newMentionName, setNewMentionName] = useState('');
  const [newMentionType, setNewMentionType] = useState<'Company' | 'Speaker' | 'Event' | 'Community'>('Speaker');
  const [newMentionLink, setNewMentionLink] = useState('');

  // Templates
  const [templates, setTemplates] = useState<EventTemplate[]>([
    {
      id: 'tpl-tech-conf',
      name: 'Tech Conference',
      badgeType: 'Flagship Summit',
      description: 'Optimized for multi-day developer, AI, and enterprise technology conferences.',
      defaultHashtags: ['#TechSummit2025', '#Innovation', '#TechLeadership'],
      defaultTone: 'Grateful Attendee',
      defaultStyle: 'Storytelling',
      directives: 'Emphasize actionable keynote takeaways, breakthrough architectures, and high-value networking.',
      icon: 'hub',
    },
    {
      id: 'tpl-hackathon',
      name: 'Hackathon & Buildathon',
      badgeType: 'Engineering Sprint',
      description: 'Spotlight project demos, tech stacks, GitHub repos, and 48-hour build achievements.',
      defaultHashtags: ['#Hackathon2025', '#BuildInPublic', '#DevCommunity'],
      defaultTone: 'Developer',
      defaultStyle: 'Technical',
      directives: 'Highlight tools used, MVP demo link, teammates, and architectural problem solved.',
      icon: 'code',
    },
    {
      id: 'tpl-workshop',
      name: 'Technical Workshop',
      badgeType: 'Masterclass',
      description: 'Ideal for hands-on labs, framework tutorials, and certification masterclasses.',
      defaultHashtags: ['#TechWorkshop', '#ContinuousLearning', '#Upskilling'],
      defaultTone: 'Educational',
      defaultStyle: 'Educational',
      directives: 'Synthesize 3 tactical workflows learned during the instructor-led labs.',
      icon: 'school',
    },
    {
      id: 'tpl-networking',
      name: 'Executive Mixer & Dinner',
      badgeType: 'Executive Forum',
      description: 'Designed for intimate leadership roundtables, VIP summits, and founder gatherings.',
      defaultHashtags: ['#ExecutiveLeadership', '#Networking', '#Strategy'],
      defaultTone: 'Professional',
      defaultStyle: 'Professional',
      directives: 'Celebrate peer camaraderie, strategic forecasts, and high-trust collaborations.',
      icon: 'groups',
    },
  ]);

  // Analytics Telemetry state
  const [telemetry, setTelemetry] = useState<TelemetrySummary>({
    visits: 4210,
    postsGenerated: campaign.postsGenerated || 1420,
    imagesUploaded: 1980,
    copyActions: 1195,
    regenerations: 430,
    chartData: [
      { date: 'Mon', posts: 140, attendees: 320 },
      { date: 'Tue', posts: 280, attendees: 610 },
      { date: 'Wed', posts: 510, attendees: 1140 },
      { date: 'Thu', posts: 320, attendees: 780 },
      { date: 'Fri', posts: 170, attendees: 420 },
    ],
  });

  const publicLink = `https://eventpulse.ai/event/${campaign.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink).then(() => {
      setCopied(true);
      onShowToast('Attendee Share Link copied to clipboard');
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const handleSaveCampaign = () => {
    onUpdateCampaign({
      name: eventName,
      organizer,
      hashtags,
      aiPromptDirectives: aiPrompt,
      accessMode,
      accessCode,
      mentions,
    });
    setSavedFeedback(true);
    onShowToast('Campaign parameters saved & synchronized!');
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleApplyTemplate = (tpl: EventTemplate) => {
    setHashtags(tpl.defaultHashtags);
    setAiPrompt(tpl.directives);
    onUpdateCampaign({
      badgeType: tpl.badgeType,
      hashtags: tpl.defaultHashtags,
      aiPromptDirectives: tpl.directives,
    });
    onShowToast(`Applied "${tpl.name}" template parameters!`);
  };

  const handleAddMention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMentionName.trim()) return;

    const newM: MentionItem = {
      id: `m-${Date.now()}`,
      type: newMentionType,
      displayName: newMentionName.trim(),
      url: newMentionLink.trim() || undefined,
    };

    const updated = [...mentions, newM];
    setMentions(updated);
    onUpdateCampaign({ mentions: updated });
    setNewMentionName('');
    setNewMentionLink('');
    onShowToast(`Added @${newM.displayName} mention`);
  };

  const handleRemoveMention = (id: string) => {
    const updated = mentions.filter((m) => m.id !== id);
    setMentions(updated);
    onUpdateCampaign({ mentions: updated });
    onShowToast('Removed mention');
  };

  const handleAddTag = () => {
    const tag = prompt('Enter a new hashtag (without #):', 'NextGenAI');
    if (tag && tag.trim()) {
      const formatted = '#' + tag.trim().replace(/^#/, '');
      if (!hashtags.includes(formatted)) {
        const next = [...hashtags, formatted];
        setHashtags(next);
        onUpdateCampaign({ hashtags: next });
        onShowToast(`Added ${formatted}`);
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const next = hashtags.filter((t) => t !== tagToRemove);
    setHashtags(next);
    onUpdateCampaign({ hashtags: next });
  };

  return (
    <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto">
      {/* 0. Onboarding Guide */}
      {showOrganizerOnboarding && (
        <div className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#eaf4ff] via-[#f2f3ff] to-[#eaedff] border border-[#c2c6d2]/40 shadow-xs flex items-start justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#003f74] text-[#ffffff] flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[22px]">campaign</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-['Manrope'] text-[15px] font-bold text-[#003f74]">
                Organizer Control Hub — Amplify Your Event Reach
              </h3>
              <p className="font-['DM_Sans'] text-[13px] text-[#424751] leading-relaxed max-w-3xl">
                1. Configure event hashtags & prompt directives → 2. Share the attendee link / QR code on slides & badges → 3. Watch hundreds of delegates publish viral LinkedIn posts with zero message drift.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowOrganizerOnboarding(false);
              localStorage.setItem('eventpulse_organizer_onboarding_dismissed', 'true');
            }}
            className="text-[#515f74] hover:text-[#131b2e] p-1 rounded-lg hover:bg-[#ffffff]/60 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      )}

      {/* 1. Header Banner & Global Actions */}
      <section className="w-full bg-[#ffffff] rounded-2xl p-4 sm:p-6 border border-[#c2c6d2]/30 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d5e3fc] text-[#003f74] text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#02569b] animate-pulse"></span>
              Active Campaign
            </span>
            <span className="font-mono text-[11px] text-[#727782]">{campaign.id}</span>
          </div>
          <h1 className="font-['Manrope'] text-[22px] sm:text-[24px] font-bold text-[#131b2e] leading-snug">
            {campaign.name}
          </h1>
          <span className="text-[12px] text-[#424751]">
            Organized by <strong className="text-[#131b2e]">{campaign.organizer}</strong> • {campaign.location}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenQRModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#c2c6d2]/40 bg-[#ffffff] hover:bg-[#f2f3ff] text-[#131b2e] font-semibold text-[13px] shadow-2xs cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#003f74]">qr_code_2</span>
            <span>QR Code</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#c2c6d2]/40 bg-[#ffffff] hover:bg-[#f2f3ff] text-[#131b2e] font-semibold text-[13px] shadow-2xs cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#003f74]">
              {copied ? 'check' : 'link'}
            </span>
            <span>{copied ? 'Copied' : 'Attendee Link'}</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] font-semibold text-[13px] shadow-xs cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">analytics</span>
            <span>Telemetry</span>
          </button>
        </div>
      </section>

      {/* 2. Workbench Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#eaedff] pb-2 overflow-x-auto">
        {[
          { id: 'settings', label: 'Campaign Parameters', icon: 'settings' },
          { id: 'templates', label: 'Event Templates', icon: 'bookmark' },
          { id: 'mentions', label: 'Mention Management', icon: 'alternate_email' },
          { id: 'analytics', label: 'Telemetry & Analytics', icon: 'insights' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setWorkbenchTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              workbenchTab === tab.id
                ? 'bg-[#003f74] text-[#ffffff] shadow-xs'
                : 'bg-[#ffffff] text-[#424751] hover:text-[#131b2e] border border-[#c2c6d2]/30'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. TAB CONTENTS */}

      {/* ------------------------------------------------------------- */}
      {/* TAB A: CAMPAIGN PARAMETERS & SECURITY */}
      {/* ------------------------------------------------------------- */}
      {workbenchTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Configuration Form */}
          <div className="lg:col-span-8 bg-[#ffffff] rounded-2xl p-5 sm:p-6 border border-[#c2c6d2]/30 shadow-xs flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
              <h3 className="font-['Manrope'] text-[16px] font-bold text-[#131b2e]">
                Event Details & AI Brand Guardrails
              </h3>
              <span className="text-[11px] text-[#727782]">Synchronizes with Attendee View</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-semibold text-[#131b2e]">Event Title</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3.5 py-2 mt-1 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] border border-[#c2c6d2]/30 focus:outline-none focus:border-[#02569b]"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#131b2e]">Host / Entity</label>
                <input
                  type="text"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  className="w-full px-3.5 py-2 mt-1 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] border border-[#c2c6d2]/30 focus:outline-none focus:border-[#02569b]"
                />
              </div>
            </div>

            {/* Hashtag Management */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-semibold text-[#131b2e]">Mandatory Summit Hashtags</label>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="text-[11px] font-semibold text-[#02569b] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  Add Tag
                </button>
              </div>

              <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-[#f2f3ff] border border-[#c2c6d2]/30 min-h-[48px] items-center">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#ffffff] text-[#003f74] border border-[#c2c6d2]/30 text-[12px] font-semibold shadow-2xs"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-[#727782] hover:text-[#ba1a1a] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* AI Directives */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-semibold text-[#131b2e]">AI Prompt Directives & Talking Points</label>
                <span className="text-[11px] text-[#727782]">Injected subtly into attendee prompts</span>
              </div>
              <textarea
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] border border-[#c2c6d2]/30 focus:outline-none focus:border-[#02569b] resize-none"
              />
            </div>

            {/* Access Security */}
            <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#c2c6d2]/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#003f74]">security</span>
                  <span className="text-[13px] font-bold text-[#131b2e]">Attendee Access Security</span>
                </div>
                <span className="text-[11px] text-[#02569b] font-medium">Unpredictable ID Enabled</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['public', 'link-only', 'password'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAccessMode(mode)}
                    className={`py-2 px-3 rounded-xl text-[12px] font-semibold capitalize border transition-all cursor-pointer ${
                      accessMode === mode
                        ? 'bg-[#003f74] text-[#ffffff] border-[#003f74]'
                        : 'bg-[#ffffff] text-[#424751] border-[#c2c6d2]/30'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {accessMode === 'password' && (
                <input
                  type="password"
                  placeholder="Set Attendee Access Code (e.g. VIP2025)"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#ffffff] text-[13px] border border-[#c2c6d2]/40"
                />
              )}
            </div>

            {/* Save & Synchronize */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#eaedff]">
              <button
                type="button"
                onClick={handleSaveCampaign}
                className="px-6 py-2.5 rounded-xl bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] font-semibold text-[13px] shadow-xs cursor-pointer transition-colors"
              >
                {savedFeedback ? 'Saved & Synced!' : 'Save Parameters'}
              </button>
            </div>
          </div>

          {/* Right: Quick Preview & Delegate Funnel */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#c2c6d2]/30 shadow-xs flex flex-col gap-3.5">
              <h3 className="font-['Manrope'] text-[15px] font-bold text-[#131b2e]">
                Viral Distribution Funnel
              </h3>

              <div className="flex flex-col gap-3">
                <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#c2c6d2]/20 flex items-center justify-between">
                  <span className="text-[12px] text-[#424751]">Registered Delegates</span>
                  <span className="text-[15px] font-bold text-[#131b2e]">{campaign.registeredDelegates.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#c2c6d2]/20 flex items-center justify-between">
                  <span className="text-[12px] text-[#424751]">LinkedIn Posts Generated</span>
                  <span className="text-[15px] font-bold text-[#02569b]">{campaign.postsGenerated.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#c2c6d2]/20 flex items-center justify-between">
                  <span className="text-[12px] text-[#424751]">Brand Uniformity</span>
                  <span className="text-[15px] font-bold text-[#003f74]">{campaign.brandUniformityScore}%</span>
                </div>
              </div>

              <button
                onClick={onNavigateToAttendee}
                className="w-full py-2.5 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] text-[#003f74] font-semibold text-[13px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Switch to Attendee Experience</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB B: EVENT TEMPLATES LIBRARY */}
      {/* ------------------------------------------------------------- */}
      {workbenchTab === 'templates' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-['Manrope'] text-[18px] font-bold text-[#131b2e]">
                Event Templates Library
              </h3>
              <p className="text-[13px] text-[#424751]">
                Apply curated prompt blueprints and default hashtags to your active campaign in one click.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-[#ffffff] rounded-2xl p-5 border border-[#c2c6d2]/30 shadow-xs hover:border-[#02569b] transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#d5e3fc] text-[#003f74] text-[11px] font-bold">
                      {tpl.badgeType}
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-[#003f74]">{tpl.icon}</span>
                  </div>

                  <h4 className="font-['Manrope'] text-[16px] font-bold text-[#131b2e]">
                    {tpl.name}
                  </h4>
                  <p className="text-[12px] text-[#424751] leading-relaxed">
                    {tpl.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {tpl.defaultHashtags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-[#f2f3ff] text-[#003f74] text-[11px] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#eaedff]">
                  <span className="text-[11px] text-[#727782]">Default Style: {tpl.defaultStyle}</span>
                  <button
                    onClick={() => handleApplyTemplate(tpl)}
                    className="px-4 py-1.5 rounded-xl bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] text-[12px] font-semibold cursor-pointer"
                  >
                    Apply Blueprint
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB C: MENTION MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {workbenchTab === 'mentions' && (
        <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#c2c6d2]/30 shadow-xs flex flex-col gap-5">
          <div>
            <h3 className="font-['Manrope'] text-[18px] font-bold text-[#131b2e]">
              Official Mentions & LinkedIn Handles
            </h3>
            <p className="text-[13px] text-[#424751]">
              Configure verified speakers, organizer sponsors, and partners to reference naturally in generated posts without fake handles.
            </p>
          </div>

          {/* Add Mention Form */}
          <form onSubmit={handleAddMention} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#f2f3ff] border border-[#c2c6d2]/30">
            <div>
              <label className="text-[11px] font-semibold text-[#131b2e]">Category</label>
              <select
                value={newMentionType}
                onChange={(e) => setNewMentionType(e.target.value as any)}
                className="w-full px-3 py-1.5 mt-1 rounded-lg bg-[#ffffff] text-[12px] border border-[#c2c6d2]/40"
              >
                <option value="Speaker">Speaker / VIP</option>
                <option value="Company">Host / Company</option>
                <option value="Event">Event Official</option>
                <option value="Community">Community Partner</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-[#131b2e]">Display Name</label>
              <input
                type="text"
                placeholder="e.g. Dr. Elena Rostova"
                value={newMentionName}
                onChange={(e) => setNewMentionName(e.target.value)}
                className="w-full px-3 py-1.5 mt-1 rounded-lg bg-[#ffffff] text-[12px] border border-[#c2c6d2]/40"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-1.5 rounded-lg bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] text-[12px] font-semibold cursor-pointer"
              >
                Add Mention
              </button>
            </div>
          </form>

          {/* Mentions List */}
          <div className="flex flex-col gap-2">
            {mentions.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-[#ffffff] border border-[#c2c6d2]/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-md bg-[#eaedff] text-[#003f74] text-[10px] font-bold uppercase">
                    {m.type}
                  </span>
                  <span className="font-['Manrope'] text-[13px] font-bold text-[#131b2e]">
                    @{m.displayName}
                  </span>
                  {m.url && <span className="text-[11px] font-mono text-[#727782]">{m.url}</span>}
                </div>

                <button
                  onClick={() => handleRemoveMention(m.id)}
                  className="text-[#ba1a1a] hover:bg-[#ffebeb] p-1 rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB D: TELEMETRY & ANALYTICS */}
      {/* ------------------------------------------------------------- */}
      {workbenchTab === 'analytics' && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="p-4 bg-[#ffffff] rounded-2xl border border-[#c2c6d2]/30 shadow-xs">
              <span className="text-[11px] text-[#727782]">Attendee Visits</span>
              <div className="text-[20px] font-bold text-[#131b2e] mt-1">{telemetry.visits.toLocaleString()}</div>
              <span className="text-[10px] text-[#02569b]">Live URL telemetry</span>
            </div>
            <div className="p-4 bg-[#ffffff] rounded-2xl border border-[#c2c6d2]/30 shadow-xs">
              <span className="text-[11px] text-[#727782]">Posts Generated</span>
              <div className="text-[20px] font-bold text-[#02569b] mt-1">{telemetry.postsGenerated.toLocaleString()}</div>
              <span className="text-[10px] text-[#02569b]">↑ 14% today</span>
            </div>
            <div className="p-4 bg-[#ffffff] rounded-2xl border border-[#c2c6d2]/30 shadow-xs">
              <span className="text-[11px] text-[#727782]">Images Uploaded</span>
              <div className="text-[20px] font-bold text-[#131b2e] mt-1">{telemetry.imagesUploaded.toLocaleString()}</div>
              <span className="text-[10px] text-[#727782]">Valid MIME types</span>
            </div>
            <div className="p-4 bg-[#ffffff] rounded-2xl border border-[#c2c6d2]/30 shadow-xs">
              <span className="text-[11px] text-[#727782]">Copied to LinkedIn</span>
              <div className="text-[20px] font-bold text-[#003f74] mt-1">{telemetry.copyActions.toLocaleString()}</div>
              <span className="text-[10px] text-[#02569b]">84% conversion</span>
            </div>
            <div className="p-4 bg-[#ffffff] rounded-2xl border border-[#c2c6d2]/30 shadow-xs">
              <span className="text-[11px] text-[#727782]">AI Regenerations</span>
              <div className="text-[20px] font-bold text-[#131b2e] mt-1">{telemetry.regenerations.toLocaleString()}</div>
              <span className="text-[10px] text-[#727782]">Refinement loop</span>
            </div>
          </div>

          {/* Interactive Chart Visualizer */}
          <div className="bg-[#ffffff] rounded-2xl p-6 border border-[#c2c6d2]/30 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-['Manrope'] text-[16px] font-bold text-[#131b2e]">
                Daily Activity & Generation Velocity
              </h3>
              <span className="text-[11px] text-[#727782]">Aggregated Summit Telemetry</span>
            </div>

            <div className="flex items-end justify-between gap-4 h-48 pt-6 px-4 bg-[#f2f3ff] rounded-2xl border border-[#c2c6d2]/20">
              {telemetry.chartData.map((d) => (
                <div key={d.date} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1.5 h-36">
                    {/* Attendee Bar */}
                    <div
                      style={{ height: `${(d.attendees / 1200) * 100}%` }}
                      className="w-6 sm:w-10 rounded-t-md bg-[#d5e3fc] hover:bg-[#aaccff] transition-all relative group"
                      title={`${d.attendees} visits`}
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-[#131b2e] text-[#ffffff] px-1.5 py-0.5 rounded shadow-xs pointer-events-none">
                        {d.attendees}
                      </span>
                    </div>
                    {/* Posts Bar */}
                    <div
                      style={{ height: `${(d.posts / 600) * 100}%` }}
                      className="w-6 sm:w-10 rounded-t-md bg-[#02569b] hover:bg-[#003f74] transition-all relative group"
                      title={`${d.posts} posts`}
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-[#131b2e] text-[#ffffff] px-1.5 py-0.5 rounded shadow-xs pointer-events-none">
                        {d.posts}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#424751]">{d.date}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-6 text-[12px] font-semibold text-[#424751]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#d5e3fc]"></span>
                <span>Attendee Link Visits</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#02569b]"></span>
                <span>Generated Posts</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
