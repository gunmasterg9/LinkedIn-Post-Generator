import React, { useState } from 'react';
import { CampaignData } from '../types';

interface CampaignsViewProps {
  currentCampaign: CampaignData;
  onSelectCampaign: (campaign: CampaignData) => void;
  onShowToast: (message: string) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  currentCampaign,
  onSelectCampaign,
  onShowToast,
}) => {
  const [campaignList, setCampaignList] = useState<CampaignData[]>([
    currentCampaign,
    {
      id: 'AI-EXEC-2025',
      name: 'AI Executive Retreat 2025: Governance & Scale',
      organizer: 'TechVentures Strategic Institute',
      date: 'NOV 12-14, 2025',
      location: 'Napa Valley, CA',
      badgeType: 'Executive Forum',
      hashtags: ['#AIExecutiveRetreat', '#EnterpriseAI', '#BoardGovernance'],
      channels: {
        linkedInCompany: 'linkedin.com/company/techventures-inst',
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
      id: 'CLOUD-WORLD-2025',
      name: 'CloudScale World Summit: Distributed Infra',
      organizer: 'Apex Innovations',
      date: 'DEC 03-05, 2025',
      location: 'Austin, TX & Online',
      badgeType: 'Developer & Architect Summit',
      hashtags: ['#CloudScaleWorld', '#Kubernetes', '#MultiCloud'],
      channels: {
        linkedInCompany: 'linkedin.com/company/apex',
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
  ]);

  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOrg, setNewOrg] = useState('');

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCampaign: CampaignData = {
      id: `CAMP-${Date.now().toString().slice(-4)}`,
      name: newTitle.trim(),
      organizer: newOrg.trim() || 'Apex Innovations',
      date: 'Q1 2026',
      location: 'San Francisco, CA',
      badgeType: 'Tech Conference',
      hashtags: ['#' + newTitle.replace(/[^a-zA-Z0-9]/g, '').slice(0, 14), '#TechEvent'],
      channels: {
        linkedInCompany: 'linkedin.com/company/apex',
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

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="font-['Manrope'] text-[28px] font-bold text-[#131b2e] tracking-tight">
            Event Campaigns Portfolio
          </h1>
          <p className="font-['DM_Sans'] text-[14px] text-[#424751]">
            Manage brand guardrails, attendee viral funnels, and distribution kits across all your summits.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] font-['DM_Sans'] text-[13px] font-semibold shadow-sm transition-all self-start sm:self-center cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Create New Campaign</span>
        </button>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaignList.map((c) => {
          const isActive = c.id === currentCampaign.id;
          return (
            <div
              key={c.id}
              className={`bg-[#ffffff] rounded-2xl p-6 shadow-sm border transition-all flex flex-col justify-between gap-5 ${
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
                        : 'bg-[#eaedff] text-[#424751]'
                    }`}
                  >
                    {isActive ? '● Currently Active' : c.badgeType}
                  </span>
                  <span className="font-mono text-[11px] text-[#424751]">{c.id}</span>
                </div>

                <h3 className="font-['Manrope'] text-[18px] font-bold text-[#131b2e] leading-snug line-clamp-2">
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

              <div className="pt-4 border-t border-[#eaedff] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-['Manrope'] text-[16px] font-bold text-[#131b2e]">
                    {c.postsGenerated.toLocaleString()} posts
                  </span>
                  <span className="text-[11px] text-[#424751]">{c.impressions} impressions</span>
                </div>

                {isActive ? (
                  <span className="text-[13px] font-semibold text-[#02569b] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Active
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      onSelectCampaign(c);
                      onShowToast(`Switched active campaign to ${c.name}`);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#eaedff] hover:bg-[#003f74] hover:text-[#ffffff] text-[#003f74] text-[12px] font-semibold transition-all cursor-pointer"
                    type="button"
                  >
                    Set Active
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Campaign Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c2c6d2]/30 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
              <h2 className="font-['Manrope'] text-[18px] font-bold text-[#131b2e]">
                Create New Campaign
              </h2>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-[#424751] hover:text-[#131b2e] cursor-pointer"
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
                  className="px-5 py-2 rounded-xl bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] text-[13px] font-semibold shadow-sm cursor-pointer"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
