import React, { useState } from 'react';
import { CampaignData } from '../types';

interface CampaignsViewProps {
  currentCampaign: CampaignData;
  onSelectCampaign: (campaign: CampaignData) => void;
  onShowToast: (message: string) => void;
  onOpenQRModal: (campaign: CampaignData) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  currentCampaign,
  onSelectCampaign,
  onShowToast,
  onOpenQRModal,
}) => {
  const [campaignList, setCampaignList] = useState<CampaignData[]>([
    currentCampaign,
    {
      id: 'aiexec-7c3e12b4',
      name: 'AI Executive Retreat 2025: Governance & Scale',
      organizer: 'TechVentures Strategic Institute',
      date: 'NOV 12-14, 2025',
      location: 'Napa Valley, CA',
      badgeType: 'Executive Forum',
      status: 'upcoming',
      accessMode: 'link-only',
      hashtags: ['#AIExecutiveRetreat', '#EnterpriseAI', '#BoardGovernance'],
      channels: {
        linkedInCompany: 'https://linkedin.com/company/techventures-inst',
        twitter: '@AIExecRetreat',
        eventPortal: 'https://aiexec2025.com',
      },
      aiPromptDirectives: 'Highlight high-level fiduciary responsibility, agentic risk posture, and confidential peer roundtables.',
      autoEnrichment: true,
      registeredDelegates: 280,
      brandUniformityScore: 98.4,
      postsGenerated: 495,
      impressions: '189.2K',
      engagementRate: '74.2%',
    },
    {
      id: 'cloud-4d8b99ef',
      name: 'CloudScale World Summit: Distributed Infra',
      organizer: 'Apex Innovations',
      date: 'DEC 03-05, 2025',
      location: 'Austin, TX & Online',
      badgeType: 'Developer & Architect Summit',
      status: 'upcoming',
      accessMode: 'public',
      hashtags: ['#CloudScaleWorld', '#Kubernetes', '#MultiCloud'],
      channels: {
        linkedInCompany: 'https://linkedin.com/company/apex-innovations',
        twitter: '@CloudScaleSummit',
        eventPortal: 'https://cloudscale2025.io',
      },
      aiPromptDirectives: 'Focus on zero-downtime migrations, Kubernetes multi-cluster resilience, and open-source contributions.',
      autoEnrichment: true,
      registeredDelegates: 5120,
      brandUniformityScore: 91.8,
      postsGenerated: 2180,
      impressions: '840.1K',
      engagementRate: '61.5%',
    },
    {
      id: 'devhack-3a1e9981',
      name: 'Global Agentic AI Hackathon 2025',
      organizer: 'OpenAI Builders & DevVentures',
      date: 'AUG 10-12, 2025',
      location: 'Seattle, WA & Virtual',
      badgeType: 'Engineering Sprint',
      status: 'past',
      accessMode: 'public',
      hashtags: ['#AgenticHack', '#BuildWithAI', '#DevSprint'],
      channels: {
        linkedInCompany: 'https://linkedin.com/company/devventures',
        twitter: '@DevSprintAI',
        eventPortal: 'https://agentichack2025.dev',
      },
      aiPromptDirectives: 'Spotlight 48-hour prototype builds, open-source demos, and tech stacks.',
      autoEnrichment: true,
      registeredDelegates: 1840,
      brandUniformityScore: 96.2,
      postsGenerated: 940,
      impressions: '310.4K',
      engagementRate: '69.1%',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming' | 'past' | 'draft' | 'archived'>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newBadge, setNewBadge] = useState('Tech Conference');

  const filteredCampaigns = campaignList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'active') return matchesSearch && (c.id === currentCampaign.id || c.status === 'active');
    return matchesSearch && c.status === statusFilter;
  });

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const newCampaign: CampaignData = {
      id: `evt-${randomSuffix}`,
      name: newTitle.trim(),
      organizer: newOrg.trim() || 'Apex Innovations',
      date: 'Q2 2026',
      location: 'San Francisco, CA',
      badgeType: newBadge,
      status: 'active',
      accessMode: 'public',
      hashtags: ['#' + newTitle.replace(/[^a-zA-Z0-9]/g, '').slice(0, 14), '#TechEvent'],
      channels: {
        linkedInCompany: 'https://linkedin.com/company/apex-innovations',
        twitter: '@EventPulse',
        eventPortal: 'https://eventpulse.ai',
      },
      aiPromptDirectives: 'Focus on keynote takeaways, peer connections, and technological transformation.',
      autoEnrichment: true,
      registeredDelegates: 1200,
      brandUniformityScore: 95.0,
      postsGenerated: 0,
      impressions: '0',
      engagementRate: '0%',
    };

    setCampaignList([newCampaign, ...campaignList]);
    onSelectCampaign(newCampaign);
    setShowNewModal(false);
    setNewTitle('');
    setNewOrg('');
    onShowToast(`Created & switched to "${newCampaign.name}"`);
  };

  const handleDuplicateCampaign = (campaign: CampaignData) => {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const duplicated: CampaignData = {
      ...campaign,
      id: `evt-${randomSuffix}`,
      name: `${campaign.name} (Copy)`,
      postsGenerated: 0,
      impressions: '0',
      status: 'draft',
    };
    setCampaignList([duplicated, ...campaignList]);
    onShowToast(`Duplicated "${campaign.name}" as draft`);
  };

  const handleArchiveCampaign = (id: string) => {
    setCampaignList(
      campaignList.map((c) => (c.id === id ? { ...c, status: 'archived' } : c))
    );
    onShowToast('Campaign archived');
  };

  const handleCopyLink = (id: string) => {
    const link = `https://eventpulse.ai/event/${id}`;
    navigator.clipboard.writeText(link).then(() => {
      onShowToast('Attendee link copied to clipboard!');
    });
  };

  return (
    <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="font-['Manrope'] text-[26px] font-bold text-[#131b2e] tracking-tight">
            My Events & Viral Funnels
          </h1>
          <p className="font-['DM_Sans'] text-[14px] text-[#424751]">
            Manage brand guardrails, attendee distribution links, and telemetry across all summits.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] font-['DM_Sans'] text-[13px] font-semibold shadow-xs transition-all self-start sm:self-center cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Create New Event</span>
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#ffffff] p-3 rounded-2xl border border-[#c2c6d2]/30 shadow-2xs">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#424751]">
            search
          </span>
          <input
            type="text"
            placeholder="Search events by title, organizer, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] border border-[#c2c6d2]/30 focus:outline-none focus:border-[#02569b]"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {(['all', 'active', 'upcoming', 'past', 'draft', 'archived'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-lg text-[12px] font-semibold capitalize transition-all cursor-pointer shrink-0 ${
                statusFilter === filter
                  ? 'bg-[#003f74] text-[#ffffff] shadow-2xs'
                  : 'text-[#424751] hover:text-[#131b2e]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign Cards Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="bg-[#ffffff] rounded-2xl border border-[#c2c6d2]/30 p-12 text-center flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[42px] text-[#727782]">
            event_busy
          </span>
          <h3 className="font-['Manrope'] text-[16px] font-bold text-[#131b2e]">
            No events match your criteria
          </h3>
          <p className="text-[13px] text-[#424751] max-w-sm">
            Try adjusting your search terms or create a new event campaign.
          </p>
          <button
            onClick={() => setShowNewModal(true)}
            className="mt-2 px-4 py-2 rounded-xl bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] text-[13px] font-semibold cursor-pointer"
          >
            Create Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((c) => {
            const isActive = c.id === currentCampaign.id;
            return (
              <div
                key={c.id}
                className={`bg-[#ffffff] rounded-2xl p-6 shadow-sm border transition-all flex flex-col justify-between gap-4 ${
                  isActive
                    ? 'border-[#02569b] ring-2 ring-[#02569b]/20'
                    : 'border-[#c2c6d2]/30 hover:border-[#c2c6d2]'
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-['DM_Sans'] text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#003f74] text-[#ffffff]'
                          : c.status === 'past'
                          ? 'bg-[#eaedff] text-[#727782]'
                          : 'bg-[#d5e3fc] text-[#003f74]'
                      }`}
                    >
                      {isActive ? '● Currently Active' : c.badgeType}
                    </span>
                    <span className="font-mono text-[11px] text-[#727782]">{c.id}</span>
                  </div>

                  <h3 className="font-['Manrope'] text-[17px] font-bold text-[#131b2e] leading-snug line-clamp-2">
                    {c.name}
                  </h3>

                  <p className="font-['DM_Sans'] text-[12px] text-[#424751]">
                    Organized by <strong className="text-[#131b2e]">{c.organizer}</strong>
                    <br />
                    {c.date} • {c.location}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {c.hashtags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-[#f2f3ff] text-[#003f74] text-[11px] font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions & Telemetry Footer */}
                <div className="pt-3 border-t border-[#eaedff] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-['Manrope'] text-[15px] font-bold text-[#131b2e]">
                        {c.postsGenerated.toLocaleString()} posts
                      </span>
                      <span className="text-[11px] text-[#727782]">{c.impressions} impressions</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyLink(c.id)}
                        className="p-1.5 rounded-lg hover:bg-[#f2f3ff] text-[#003f74] cursor-pointer"
                        title="Copy attendee link"
                      >
                        <span className="material-symbols-outlined text-[18px]">link</span>
                      </button>
                      <button
                        onClick={() => onOpenQRModal(c)}
                        className="p-1.5 rounded-lg hover:bg-[#f2f3ff] text-[#003f74] cursor-pointer"
                        title="View QR code"
                      >
                        <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                      </button>
                      <button
                        onClick={() => handleDuplicateCampaign(c)}
                        className="p-1.5 rounded-lg hover:bg-[#f2f3ff] text-[#727782] cursor-pointer"
                        title="Duplicate event"
                      >
                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                      </button>
                      <button
                        onClick={() => handleArchiveCampaign(c.id)}
                        className="p-1.5 rounded-lg hover:bg-[#ffebeb] text-[#ba1a1a] cursor-pointer"
                        title="Archive event"
                      >
                        <span className="material-symbols-outlined text-[18px]">archive</span>
                      </button>
                    </div>
                  </div>

                  {isActive ? (
                    <div className="w-full py-1.5 rounded-lg bg-[#eaf4ff] text-[#02569b] text-[12px] font-semibold text-center">
                      Currently Active in Workspace
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        onSelectCampaign(c);
                        onShowToast(`Switched active campaign to "${c.name}"`);
                      }}
                      className="w-full py-1.5 rounded-lg bg-[#eaedff] hover:bg-[#003f74] hover:text-[#ffffff] text-[#003f74] text-[12px] font-semibold transition-all cursor-pointer text-center"
                      type="button"
                    >
                      Set Active Event
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Campaign Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c2c6d2]/30 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
              <h2 className="font-['Manrope'] text-[18px] font-bold text-[#131b2e]">
                Create New Event Campaign
              </h2>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-[#727782] hover:text-[#131b2e] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-semibold text-[#131b2e]">Event Title</label>
                <input
                  required
                  placeholder="e.g. NextGen AI Summit 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] border border-[#c2c6d2]/40 focus:outline-none focus:border-[#02569b]"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#131b2e]">Host / Entity</label>
                <input
                  placeholder="e.g. Apex Innovations"
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] border border-[#c2c6d2]/40 focus:outline-none focus:border-[#02569b]"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#131b2e]">Badge Category</label>
                <select
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] border border-[#c2c6d2]/40"
                >
                  <option value="Tech Conference">Tech Conference</option>
                  <option value="Engineering Sprint">Engineering Sprint</option>
                  <option value="Masterclass">Masterclass / Workshop</option>
                  <option value="Executive Forum">Executive Forum</option>
                  <option value="Community Mixer">Community Mixer</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#eaedff]">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-[#424751] text-[13px] font-semibold hover:bg-[#f2f3ff] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] text-[13px] font-semibold shadow-xs cursor-pointer"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
