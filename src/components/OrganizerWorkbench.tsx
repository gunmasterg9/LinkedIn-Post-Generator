import React, { useState } from 'react';
import { CampaignData, ActivityFeedItem } from '../types';

interface OrganizerWorkbenchProps {
  campaign: CampaignData;
  onUpdateCampaign: (updated: Partial<CampaignData>) => void;
  onNavigateToAttendee: () => void;
  onOpenExportModal: () => void;
  onShowToast: (message: string) => void;
}

export const OrganizerWorkbench: React.FC<OrganizerWorkbenchProps> = ({
  campaign,
  onUpdateCampaign,
  onNavigateToAttendee,
  onOpenExportModal,
  onShowToast,
}) => {
  const [eventName, setEventName] = useState(campaign.name);
  const [organizer, setOrganizer] = useState(campaign.organizer);
  const [hashtags, setHashtags] = useState<string[]>(campaign.hashtags);
  const [aiPrompt, setAiPrompt] = useState(campaign.aiPromptDirectives);
  const [channels, setChannels] = useState(campaign.channels);
  const [copied, setCopied] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [isPushingLive, setIsPushingLive] = useState(false);

  const defaultFeedItems: ActivityFeedItem[] = [
    {
      id: '1',
      name: 'Elena Rostova',
      role: 'VP of AI Architecture @ NeuralSphere',
      timeAgo: '4m ago',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC_RV9yxgtuiZPYtYANGYVBAei6rxrGkc26emH69t0s6AzomaYKz-vev_DTpkRkVdr1d_51AEQWS-PGadwZu_-KbczaEfeDJWYhUU7BusUmEf5wumjjZ_u4bV1_wJXxJ0NvVctZRlP2dY0Vt9R8m0S3cxsDKeEcMgkppomiP-JBuIK5PWovX7coAlfMP3fKKw5L_KCZ476o-l3QHrOv2nMCQbXzHhnbahsbuwCsIQHSRlQgGONpuEmD',
      quote:
        'Day 1 at #TechSummit2025 blown away by the edge-compute panel. Here are 3 tactical frameworks for scaling model latency down to sub-10ms...',
      likes: 84,
    },
    {
      id: '2',
      name: 'Marcus Vance',
      role: 'Principal Lead @ ScaledSystems',
      timeAgo: '18m ago',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCwZsxD2lY-203la1b3qcyF_jZ1R44AIrhQcVYcTsxV955FmamX3_quR9C3LPoEZKDno0i_jl9lvNYys3qJ4hbe91Yda2fIV1n_1oqPfEEiOWJJ8HnltkaMMFubfd0151g6BbTE5EmVpGQYWeLLlK8wqBEbcWpby25_3xqXNm4E1AzQIpU46cwuF44pHkVz3DhR6w4tHCPZ6hhsf-81eufuK3pdoiDqAosQxe00nB75OHdfEq1bJsnP',
      quote:
        'Honored to speak on the future of enterprise autonomous agents with apex innovators! #AIFuture #TechSummit2025',
      likes: 129,
    },
    {
      id: '3',
      name: 'Devon Patel',
      role: 'Founder & CEO @ Synthetica',
      timeAgo: '32m ago',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDuPh8ow5JUvcnsoklP_V4GeLL2yxScpq0Q-KlgpLjnp_Q-6eC4EdkuJxsKYeMegity9yVSURJ2FztM6hlVlYU5V1hULMjKaqhlATs8uVzLlkfG1a51xdhjBnQa2K919kserCLjWQ4T5oJP1ptlmPWeA_XLi6HnyU34wd95ZFt3SPg13TLI6rp0M-N8_uU26KPoAhSe_CBD5piWPFmqwFmw3ckP6YXgk2OOmf-Ea2cdyFyXbhTcYatu',
      quote:
        'Excited to partner with @ApexTechSummit for our next chapter. Unveiled our new model benchmark today.',
      likes: 67,
    },
  ];

  const handleCopyLink = () => {
    const url = 'https://eventpulse.ai/share/techsummit25';
    navigator.clipboard.writeText(url).then(() => {
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
      channels,
    });
    setSavedFeedback(true);
    onShowToast('Campaign parameters saved & synchronized!');
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleResetDefaults = () => {
    const defaultName = 'Global Tech Summit 2025: AI & Future of Work';
    const defaultOrg = 'Apex Innovations & TechVentures Alliance';
    const defaultTags = ['#TechSummit2025', '#AIFuture', '#ProductInnovation'];
    const defaultPrompt =
      'Emphasize high-value networking, actionable AI framework takeaways from keynote sessions, and visionary multi-cloud scalability challenges discussed on Day 2.';
    setEventName(defaultName);
    setOrganizer(defaultOrg);
    setHashtags(defaultTags);
    setAiPrompt(defaultPrompt);
    onUpdateCampaign({
      name: defaultName,
      organizer: defaultOrg,
      hashtags: defaultTags,
      aiPromptDirectives: defaultPrompt,
    });
    onShowToast('Form reset to default parameters.');
  };

  const handleAddTag = () => {
    const tag = prompt('Enter a new hashtag (without #):', 'NextGenTech');
    if (tag && tag.trim()) {
      const formatted = '#' + tag.trim().replace(/^#/, '');
      if (!hashtags.includes(formatted)) {
        const next = [...hashtags, formatted];
        setHashtags(next);
        onShowToast(`Added ${formatted}`);
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((t) => t !== tagToRemove));
  };

  const handlePushLive = () => {
    setIsPushingLive(true);
    setTimeout(() => {
      setIsPushingLive(false);
      onShowToast('Campaign successfully pushed live across badge & display syncs!');
    }, 800);
  };

  const handleDownloadQRSVG = (e: React.MouseEvent) => {
    e.preventDefault();
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="400" height="400">
      <rect width="100" height="100" fill="#ffffff" />
      <rect x="0" y="0" width="28" height="28" rx="4" fill="#131b2e" />
      <rect x="6" y="6" width="16" height="16" fill="#ffffff" />
      <rect x="10" y="10" width="8" height="8" fill="#131b2e" />
      <rect x="72" y="0" width="28" height="28" rx="4" fill="#131b2e" />
      <rect x="78" y="6" width="16" height="16" fill="#ffffff" />
      <rect x="82" y="10" width="8" height="8" fill="#131b2e" />
      <rect x="0" y="72" width="28" height="28" rx="4" fill="#131b2e" />
      <rect x="6" y="78" width="16" height="16" fill="#ffffff" />
      <rect x="10" y="82" width="8" height="8" fill="#131b2e" />
      <rect x="36" y="6" width="8" height="8" fill="#131b2e" />
      <rect x="52" y="6" width="12" height="6" fill="#131b2e" />
      <rect x="36" y="22" width="6" height="14" fill="#131b2e" />
      <rect x="48" y="24" width="16" height="6" fill="#131b2e" />
      <rect x="6" y="36" width="14" height="6" fill="#131b2e" />
      <rect x="6" y="48" width="8" height="16" fill="#131b2e" />
      <rect x="24" y="40" width="18" height="18" fill="#131b2e" />
      <rect x="48" y="40" width="8" height="8" fill="#131b2e" />
      <rect x="62" y="36" width="16" height="8" fill="#131b2e" />
      <rect x="84" y="40" width="10" height="10" fill="#131b2e" />
      <rect x="40" y="66" width="14" height="6" fill="#131b2e" />
      <rect x="60" y="60" width="8" height="16" fill="#131b2e" />
      <rect x="76" y="66" width="18" height="8" fill="#131b2e" />
      <rect x="40" y="80" width="8" height="14" fill="#131b2e" />
      <rect x="56" y="84" width="20" height="8" fill="#131b2e" />
      <rect x="84" y="82" width="10" height="12" fill="#131b2e" />
    </svg>`;
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eventpulse-qr-${campaign.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Downloaded high-resolution QR Code SVG');
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* 1. Header Banner & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d5e3fc] text-[#003f74] font-['DM_Sans'] text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#02569b] animate-pulse"></span>
              Active Campaign
            </span>
            <span className="font-['DM_Sans'] text-[12px] text-[#424751] font-mono font-medium">
              ID: {campaign.id}
            </span>
          </div>
          <h1 className="font-['Manrope'] text-[28px] sm:text-[32px] font-bold text-[#131b2e] tracking-tight mt-1">
            Event Campaign Manager
          </h1>
          <p className="font-['DM_Sans'] text-[14px] text-[#424751]">
            Configure customized LinkedIn post generators, viral prompts, and distribution kits for attendees.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center flex-wrap">
          <button
            onClick={onNavigateToAttendee}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] text-[#003f74] font-['DM_Sans'] text-[13px] font-semibold transition-all shadow-2xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            <span>View Public Link</span>
          </button>
          <button
            onClick={onOpenExportModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] text-[#131b2e] font-['DM_Sans'] text-[13px] font-semibold transition-all shadow-2xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#515f74]">download</span>
            <span>Export Analytics</span>
          </button>
          <button
            onClick={handlePushLive}
            disabled={isPushingLive}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#003f74] text-[#ffffff] shadow-sm hover:bg-[#02569b] active:scale-[0.99] font-['DM_Sans'] text-[13px] font-semibold transition-all cursor-pointer"
            type="button"
          >
            <span className={`material-symbols-outlined text-[18px] ${isPushingLive ? 'animate-spin' : ''}`}>
              rocket_launch
            </span>
            <span>{isPushingLive ? 'Syncing...' : 'Push Live'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Event Configuration */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-[#ffffff] rounded-2xl p-6 shadow-sm border border-[#c2c6d2]/30 flex flex-col gap-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#003f74]">
                  <span className="material-symbols-outlined text-[22px]">tune</span>
                </div>
                <div>
                  <h2 className="font-['Manrope'] text-[18px] font-semibold text-[#131b2e]">
                    Event Details &amp; Branding
                  </h2>
                  <p className="font-['DM_Sans'] text-[13px] text-[#424751]">
                    Core parameters injected into every attendee post draft.
                  </p>
                </div>
              </div>
              <span className="font-['DM_Sans'] text-[11px] font-semibold px-2 py-1 rounded bg-[#f2f3ff] text-[#515f74] font-mono">
                v2.4 Engine
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Event Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-['DM_Sans'] text-[13px] font-semibold text-[#131b2e] flex items-center justify-between">
                  <span>Event Name</span>
                  <span className="font-normal text-[11px] text-[#424751]">Official title</span>
                </label>
                <input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] font-['DM_Sans'] text-[14px] text-[#131b2e] border border-transparent focus:border-[#02569b] focus:bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#02569b]/20 transition-all"
                  type="text"
                />
              </div>

              {/* Organizer Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-['DM_Sans'] text-[13px] font-semibold text-[#131b2e] flex items-center justify-between">
                  <span>Organizer / Host Entity</span>
                  <span className="font-normal text-[11px] text-[#424751]">Appears as sponsor</span>
                </label>
                <input
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f2f3ff] font-['DM_Sans'] text-[14px] text-[#131b2e] border border-transparent focus:border-[#02569b] focus:bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#02569b]/20 transition-all"
                  type="text"
                />
              </div>

              {/* Campaign Hashtags */}
              <div className="flex flex-col gap-2">
                <label className="font-['DM_Sans'] text-[13px] font-semibold text-[#131b2e] flex items-center justify-between">
                  <span>Campaign Hashtags</span>
                  <span className="font-normal text-[11px] text-[#424751]">Auto-appended to drafts</span>
                </label>
                <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-[#f2f3ff] min-h-[46px] border border-[#c2c6d2]/20">
                  {hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d5e3fc] text-[#003f74] font-['DM_Sans'] text-[13px] font-semibold"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-[#ba1a1a] transition-colors flex items-center cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={handleAddTag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] text-[#424751] font-['DM_Sans'] text-[13px] font-semibold transition-all cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    <span>Add tag</span>
                  </button>
                </div>
              </div>

              {/* Target Distribution Channels */}
              <div className="flex flex-col gap-2 pt-1">
                <span className="font-['DM_Sans'] text-[13px] font-semibold text-[#131b2e]">
                  Target Distribution Channels
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-[#424751] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#02569b]">link</span>
                      LinkedIn Company
                    </span>
                    <input
                      value={channels.linkedInCompany}
                      onChange={(e) =>
                        setChannels({ ...channels, linkedInCompany: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#f2f3ff] text-[13px] text-[#131b2e] border border-transparent focus:border-[#02569b] focus:bg-[#ffffff] focus:outline-none transition-all"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-[#424751] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#515f74]">
                        alternate_email
                      </span>
                      X / Twitter
                    </span>
                    <input
                      value={channels.twitter}
                      onChange={(e) =>
                        setChannels({ ...channels, twitter: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#f2f3ff] text-[13px] text-[#131b2e] border border-transparent focus:border-[#02569b] focus:bg-[#ffffff] focus:outline-none transition-all"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-[#424751] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#2420b6]">
                        language
                      </span>
                      Event Portal
                    </span>
                    <input
                      value={channels.eventPortal}
                      onChange={(e) =>
                        setChannels({ ...channels, eventPortal: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#f2f3ff] text-[13px] text-[#131b2e] border border-transparent focus:border-[#02569b] focus:bg-[#ffffff] focus:outline-none transition-all"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              {/* Default AI Prompt Directives */}
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="font-['DM_Sans'] text-[13px] font-semibold text-[#131b2e] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#2420b6]">
                      auto_awesome
                    </span>
                    <span>Default AI Prompt Directives</span>
                  </label>
                  <span className="font-['DM_Sans'] text-[11px] text-[#424751]">
                    Used by AI generation engine
                  </span>
                </div>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[#f2f3ff] font-['DM_Sans'] text-[13px] text-[#131b2e] border border-transparent focus:border-[#02569b] focus:bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#02569b]/20 transition-all resize-none leading-relaxed"
                  rows={3}
                />
              </div>

              {/* Auto-Enrichment Enabled Banner */}
              <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#c2c6d2]/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#02569b] mt-0.5 text-[22px]">
                  verified_user
                </span>
                <div className="flex flex-col">
                  <span className="font-['DM_Sans'] text-[13px] font-semibold text-[#131b2e]">
                    Auto-Enrichment Enabled
                  </span>
                  <span className="font-['DM_Sans'] text-[13px] text-[#424751]">
                    Speaker profiles, session timestamps, and executive badges are automatically cross-referenced when attendees type their role.
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between pt-3 border-t border-[#eaedff]">
              <button
                onClick={handleResetDefaults}
                className="font-['DM_Sans'] text-[13px] font-semibold text-[#424751] hover:text-[#131b2e] px-2 py-2 rounded-lg transition-colors cursor-pointer"
                type="button"
              >
                Reset to Defaults
              </button>
              <div className="flex items-center gap-3">
                <span
                  className={`font-['DM_Sans'] text-[12px] font-medium text-[#02569b] transition-opacity duration-300 ${
                    savedFeedback ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  Saved successfully!
                </span>
                <button
                  onClick={handleSaveCampaign}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] font-['DM_Sans'] text-[13px] font-semibold shadow-sm transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Save Campaign Changes</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Counter Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#ffffff] rounded-2xl p-5 shadow-sm border border-[#c2c6d2]/30 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#02569b]">
                <span className="material-symbols-outlined text-[26px]">groups</span>
              </div>
              <div>
                <div className="font-['Manrope'] text-[24px] font-bold text-[#131b2e] tracking-tight">
                  {campaign.registeredDelegates.toLocaleString()}
                </div>
                <div className="font-['DM_Sans'] text-[12px] text-[#424751]">
                  Registered Delegates
                </div>
              </div>
            </div>

            <div className="bg-[#ffffff] rounded-2xl p-5 shadow-sm border border-[#c2c6d2]/30 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#eaedff] flex items-center justify-center text-[#2420b6]">
                <span className="material-symbols-outlined text-[26px]">hub</span>
              </div>
              <div>
                <div className="font-['Manrope'] text-[24px] font-bold text-[#131b2e] tracking-tight">
                  {campaign.brandUniformityScore}%
                </div>
                <div className="font-['DM_Sans'] text-[12px] text-[#424751]">
                  Brand Uniformity Score
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Distribution Kit & Metrics */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Attendee Distribution Kit */}
          <div className="bg-[#ffffff] rounded-2xl p-6 shadow-sm border border-[#c2c6d2]/30 flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#003f74]">
                  <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                </div>
                <span className="font-['Manrope'] text-[18px] font-semibold text-[#131b2e]">
                  Attendee Distribution Kit
                </span>
              </div>
              <span className="font-['DM_Sans'] text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#d5e3fc] text-[#3a485b]">
                Instant Live
              </span>
            </div>

            {/* Share Link Strip */}
            <div className="p-4 rounded-xl bg-[#eaedff] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-['DM_Sans'] text-[11px] font-bold text-[#424751] uppercase tracking-wider">
                  Unique Attendee Link
                </span>
                <span className="font-['DM_Sans'] text-[11px] font-semibold text-[#003f74] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#02569b] animate-pulse"></span>
                  Live Sync
                </span>
              </div>

              <div className="flex items-center gap-1 bg-[#ffffff] p-1.5 rounded-xl shadow-2xs">
                <div className="flex-1 px-2.5 font-mono text-[13px] text-[#003f74] truncate select-all">
                  https://eventpulse.ai/share/techsummit25
                </div>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] font-['DM_Sans'] text-[12px] font-semibold transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copied ? 'done' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 font-['DM_Sans'] text-[12px] text-[#424751]">
                <span>Scan to post directly from mobile</span>
                <button
                  onClick={handleDownloadQRSVG}
                  className="text-[#003f74] hover:underline inline-flex items-center gap-0.5 font-medium cursor-pointer"
                  type="button"
                >
                  Download QR SVG
                  <span className="material-symbols-outlined text-[14px]">download</span>
                </button>
              </div>
            </div>

            {/* QR Code and Quick Channels */}
            <div className="grid grid-cols-12 gap-4 items-center pt-1">
              <div className="col-span-4 bg-[#f2f3ff] p-3 rounded-xl flex flex-col items-center justify-center aspect-square shadow-2xs border border-[#c2c6d2]/20">
                <svg className="w-full h-full text-[#131b2e]" fill="currentColor" viewBox="0 0 100 100">
                  <rect height="28" rx="4" width="28" x="0" y="0"></rect>
                  <rect fill="white" height="16" width="16" x="6" y="6"></rect>
                  <rect height="8" width="8" x="10" y="10"></rect>
                  <rect height="28" rx="4" width="28" x="72" y="0"></rect>
                  <rect fill="white" height="16" width="16" x="78" y="6"></rect>
                  <rect height="8" width="8" x="82" y="10"></rect>
                  <rect height="28" rx="4" width="28" x="0" y="72"></rect>
                  <rect fill="white" height="16" width="16" x="6" y="78"></rect>
                  <rect height="8" width="8" x="10" y="82"></rect>
                  <rect height="8" width="8" x="36" y="6"></rect>
                  <rect height="6" width="12" x="52" y="6"></rect>
                  <rect height="14" width="6" x="36" y="22"></rect>
                  <rect height="6" width="16" x="48" y="24"></rect>
                  <rect height="6" width="14" x="6" y="36"></rect>
                  <rect height="16" width="8" x="6" y="48"></rect>
                  <rect height="18" width="18" x="24" y="40"></rect>
                  <rect height="8" width="8" x="48" y="40"></rect>
                  <rect height="8" width="16" x="62" y="36"></rect>
                  <rect height="10" width="10" x="84" y="40"></rect>
                  <rect height="6" width="14" x="40" y="66"></rect>
                  <rect height="16" width="8" x="60" y="60"></rect>
                  <rect height="8" width="18" x="76" y="66"></rect>
                  <rect height="14" width="8" x="40" y="80"></rect>
                  <rect height="8" width="20" x="56" y="84"></rect>
                  <rect height="12" width="10" x="84" y="82"></rect>
                </svg>
                <span className="font-['DM_Sans'] text-[10px] text-[#424751] font-mono mt-1 font-semibold">
                  GTS25-LINK
                </span>
              </div>

              <div className="col-span-8 flex flex-col gap-2">
                <span className="font-['DM_Sans'] text-[13px] font-semibold text-[#131b2e]">
                  Share Fast via Workspace:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://eventpulse.ai/share/techsummit25');
                      onShowToast('LinkedIn distribution link copied!');
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors gap-1 text-center cursor-pointer border border-[#c2c6d2]/20"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px] text-[#003f74]">
                      campaign
                    </span>
                    <span className="font-['DM_Sans'] text-[11px] font-semibold text-[#131b2e] leading-tight">
                      LinkedIn
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = `mailto:?subject=${encodeURIComponent(
                        campaign.name
                      )}&body=${encodeURIComponent(
                        'Post your event highlights in seconds on LinkedIn: https://eventpulse.ai/share/techsummit25'
                      )}`;
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors gap-1 text-center cursor-pointer border border-[#c2c6d2]/20"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px] text-[#515f74]">
                      mail
                    </span>
                    <span className="font-['DM_Sans'] text-[11px] font-semibold text-[#131b2e] leading-tight">
                      Email Blast
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `📢 Join fellow attendees posting on LinkedIn with AI: https://eventpulse.ai/share/techsummit25`
                      );
                      onShowToast('Slack/Teams broadcast message copied!');
                    }}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors gap-1 text-center cursor-pointer border border-[#c2c6d2]/20"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px] text-[#2420b6]">
                      forum
                    </span>
                    <span className="font-['DM_Sans'] text-[11px] font-semibold text-[#131b2e] leading-tight">
                      Slack/Teams
                    </span>
                  </button>
                </div>
                <p className="font-['DM_Sans'] text-[11px] text-[#424751] mt-0.5">
                  Recommended for badges, conference screens &amp; email confirmations.
                </p>
              </div>
            </div>
          </div>

          {/* Viral Distribution Metrics */}
          <div className="bg-[#ffffff] rounded-2xl p-6 shadow-sm border border-[#c2c6d2]/30 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#02569b]">
                  <span className="material-symbols-outlined text-[18px]">query_stats</span>
                </div>
                <div>
                  <h3 className="font-['Manrope'] text-[18px] font-semibold text-[#131b2e]">
                    Viral Distribution Metrics
                  </h3>
                  <span className="font-['DM_Sans'] text-[12px] text-[#424751]">
                    Live telemetry from attendee feeds
                  </span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[#02569b] bg-[#eaedff] px-2 py-1 rounded">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +24% today
              </span>
            </div>

            {/* 4 Telemetry Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex flex-col border border-[#c2c6d2]/20">
                <span className="font-['DM_Sans'] text-[11px] font-medium text-[#424751]">
                  Total Posts Shared
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="font-['Manrope'] text-[24px] font-bold text-[#131b2e] tracking-tight">
                    1,248
                  </span>
                  <span className="font-['DM_Sans'] text-[12px] font-semibold text-[#02569b]">
                    ↑ 182
                  </span>
                </div>
                <span className="font-['DM_Sans'] text-[11px] text-[#424751] mt-0.5">
                  36% of active badge holders
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex flex-col border border-[#c2c6d2]/20">
                <span className="font-['DM_Sans'] text-[11px] font-medium text-[#424751]">
                  Estimated Impressions
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="font-['Manrope'] text-[24px] font-bold text-[#131b2e] tracking-tight">
                    482.5K
                  </span>
                  <span className="font-['DM_Sans'] text-[11px] font-semibold px-1.5 py-0.2 bg-[#d5e3fc] rounded text-[#2420b6]">
                    Top 5%
                  </span>
                </div>
                <span className="font-['DM_Sans'] text-[11px] text-[#424751] mt-0.5">
                  Based on average network size
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex flex-col border border-[#c2c6d2]/20">
                <span className="font-['DM_Sans'] text-[11px] font-medium text-[#424751]">
                  Engagement Rate
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="font-['Manrope'] text-[24px] font-bold text-[#131b2e] tracking-tight">
                    68.4%
                  </span>
                  <span className="font-['DM_Sans'] text-[11px] font-semibold text-[#02569b]">
                    High
                  </span>
                </div>
                <span className="font-['DM_Sans'] text-[11px] text-[#424751] mt-0.5">
                  Likes, Comments &amp; Reposts
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex flex-col border border-[#c2c6d2]/20">
                <span className="font-['DM_Sans'] text-[11px] font-medium text-[#424751]">
                  Top Shared Tone
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="font-['Manrope'] text-[18px] font-bold text-[#131b2e] truncate">
                    Takeaways
                  </span>
                  <span className="font-['DM_Sans'] text-[11px] font-semibold text-[#02569b]">
                    52%
                  </span>
                </div>
                <span className="font-['DM_Sans'] text-[11px] text-[#424751] mt-0.5 truncate">
                  Followed by 'Speaker Buzz' (31%)
                </span>
              </div>
            </div>

            {/* Hourly Viral Velocity Chart */}
            <div className="p-3 rounded-xl bg-[#f2f3ff] flex items-center justify-between border border-[#c2c6d2]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#515f74]">
                  show_chart
                </span>
                <span className="font-['DM_Sans'] text-[13px] font-semibold text-[#131b2e]">
                  Hourly Viral Velocity
                </span>
              </div>
              <div className="flex items-end gap-1.5 h-7">
                {[
                  { h: 'h-2', active: false },
                  { h: 'h-3', active: false },
                  { h: 'h-4', active: false },
                  { h: 'h-3', active: false },
                  { h: 'h-5', active: true },
                  { h: 'h-7', active: true },
                  { h: 'h-4', active: true },
                ].map((bar, i) => (
                  <span
                    key={i}
                    className={`w-2 ${bar.h} rounded-t transition-all ${
                      bar.active ? 'bg-[#02569b]' : 'bg-[#b9c7df]'
                    }`}
                  ></span>
                ))}
              </div>
            </div>

            {/* Recent Attendee Feed Activity */}
            <div className="flex flex-col gap-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-['DM_Sans'] text-[13px] font-semibold text-[#131b2e]">
                  Recent Attendee Feed Activity
                </span>
                <button
                  onClick={onOpenExportModal}
                  className="font-['DM_Sans'] text-[12px] font-medium text-[#003f74] hover:underline cursor-pointer"
                  type="button"
                >
                  View All
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {defaultFeedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] transition-all flex items-start gap-3 border border-[#c2c6d2]/20"
                  >
                    <img
                      className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-[#c2c6d2]/40"
                      src={item.avatar}
                      alt={item.name}
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-['DM_Sans'] text-[13px] font-semibold text-[#131b2e] truncate">
                          {item.name}
                        </span>
                        <span className="font-['DM_Sans'] text-[11px] text-[#424751] shrink-0">
                          {item.timeAgo}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#424751] truncate">
                        {item.role}
                      </span>
                      <p className="font-['DM_Sans'] text-[12px] text-[#131b2e] line-clamp-1 mt-1">
                        "{item.quote}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
