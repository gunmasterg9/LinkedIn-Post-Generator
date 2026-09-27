import { useState, useEffect } from 'react';
import { CampaignData, AttendeeProfile, PostDraft } from './types';
import { Header } from './components/Header';
import { OrganizerWorkbench } from './components/OrganizerWorkbench';
import { AttendeeView } from './components/AttendeeView';
import { CampaignsView } from './components/CampaignsView';
import {
  ShareModal,
  QRModal,
  ExportAnalyticsModal,
  PrivacySettingsModal,
  DraftsHistoryModal,
  KeyboardShortcutsModal,
  AdminSettingsModal,
  Toast,
} from './components/Modals';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'organizer' | 'attendee' | 'campaigns'>('attendee');

  const [campaign, setCampaign] = useState<CampaignData>({
    id: 'gts-9f2a41d8',
    name: 'Global Tech Summit 2025: AI & Future of Work',
    organizer: 'Apex Innovations & TechVentures Alliance',
    date: 'OCT 24-26, 2025',
    location: 'San Francisco, CA & Virtual',
    badgeType: 'Flagship Summit',
    status: 'active',
    accessMode: 'public',
    hashtags: ['#TechSummit2025', '#AIFuture', '#ProductInnovation'],
    channels: {
      linkedInCompany: 'https://linkedin.com/company/apex-innovations',
      twitter: '@ApexTechSummit',
      eventPortal: 'https://techsummit2025.io',
    },
    mentions: [
      { id: 'm-1', type: 'Company', displayName: 'Apex Innovations', url: 'https://linkedin.com/company/apex-innovations' },
      { id: 'm-2', type: 'Speaker', displayName: 'Sarah Chen', linkedInHandle: 'sarahchen-ai' },
    ],
    aiPromptDirectives:
      'Emphasize high-value networking, actionable AI framework takeaways from keynote sessions, and visionary multi-cloud scalability challenges discussed on Day 2.',
    autoEnrichment: true,
    registeredDelegates: 3450,
    brandUniformityScore: 94.2,
    postsGenerated: 1420,
    impressions: '482.5K',
    engagementRate: '68.4%',
  });

  const [attendee, setAttendee] = useState<AttendeeProfile>({
    name: 'Sarah Chen',
    headline: 'VP of AI Products @ NexaTech • Keynote Speaker',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKB6YWh17l4Q3_fxpDSZOGM_MnvmtPDHwnDV1IJKCM2Z-75xG9gSyZ5AT__-A8HTTbvJhAbPXNzmw33caIFAi-yTxb72HuJjVi1JqEooKBMC8xKnmdBERqkh8Bucg4Mlhg1k2VXdRd4bIN-DwFp7B_HHUvLiCndptHnt5xv7XAwaKP0ncNNrzSW8-VVPY9JcvhOMXk_Zrs2YVIo31OD3lxE_cWc8jIuz13at3yh92lsZeFxvzj1Cfi',
    connectionLevel: '1st',
    writingSample: '',
  });

  // Drafts collection
  const [draftsList, setDraftsList] = useState<PostDraft[]>(() => {
    try {
      const saved = localStorage.getItem('eventpulse_drafts_collection');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal Visibility States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Sync campaign data from backend if available
  useEffect(() => {
    fetch('/api/campaign')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.campaign) {
          setCampaign(data.campaign);
        }
      })
      .catch(() => {});
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2800);
  };

  const handleUpdateCampaign = (updated: Partial<CampaignData>) => {
    const nextCampaign = { ...campaign, ...updated };
    setCampaign(nextCampaign);
    fetch('/api/campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextCampaign),
    }).catch(() => {});
  };

  const handleSaveDraft = (draft: PostDraft) => {
    const next = [draft, ...draftsList.filter((d) => d.id !== draft.id)].slice(0, 30);
    setDraftsList(next);
    localStorage.setItem('eventpulse_drafts_collection', JSON.stringify(next));
  };

  const handleDeleteDraft = (id: string) => {
    const next = draftsList.filter((d) => d.id !== id);
    setDraftsList(next);
    localStorage.setItem('eventpulse_drafts_collection', JSON.stringify(next));
  };

  const handleClearAllDrafts = () => {
    setDraftsList([]);
    localStorage.removeItem('eventpulse_drafts_collection');
    localStorage.removeItem(`eventpulse_draft_${campaign.id}`);
  };

  const handleClearAllPhotos = () => {
    // Clear photo caches in localStorage if any
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith('eventpulse_photo_')) localStorage.removeItem(k);
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col font-['DM_Sans'] text-[#131b2e] antialiased selection:bg-[#d5e3fc] selection:text-[#003f74]">
      {/* Fixed Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        campaign={campaign}
        attendee={attendee}
        onChangeAttendee={(profile) => {
          setAttendee(profile);
          showToast(`Active persona: ${profile.name}`);
        }}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenQRModal={() => setIsQRModalOpen(true)}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main Container */}
      <main className="w-full pt-20 pb-12 flex-1 bg-[#faf8ff] px-4 sm:px-6">
        {currentTab === 'organizer' && (
          <OrganizerWorkbench
            campaign={campaign}
            onUpdateCampaign={handleUpdateCampaign}
            onNavigateToAttendee={() => setCurrentTab('attendee')}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onOpenQRModal={() => setIsQRModalOpen(true)}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'attendee' && (
          <AttendeeView
            campaign={campaign}
            attendee={attendee}
            onChangeAttendee={(updated) => setAttendee({ ...attendee, ...updated })}
            onShowToast={showToast}
            onOpenDraftsModal={() => setIsDraftsModalOpen(true)}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {currentTab === 'campaigns' && (
          <CampaignsView
            currentCampaign={campaign}
            onSelectCampaign={(c) => {
              setCampaign(c);
              setCurrentTab('organizer');
            }}
            onShowToast={showToast}
            onOpenQRModal={() => setIsQRModalOpen(true)}
          />
        )}
      </main>

      {/* Global Footer */}
      <footer className="w-full border-t border-[#c2c6d2]/30 bg-[#ffffff] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="font-['Manrope'] text-[16px] font-bold text-[#003f74]">
              EventPulse
            </span>
            <span className="font-['DM_Sans'] text-[12px] text-[#424751]">
              © 2026 EventPulse Platform. B2B LinkedIn Viralization & Event Telemetry.
            </span>
          </div>

          <div className="flex items-center gap-5 font-['DM_Sans'] text-[12px] font-semibold text-[#424751]">
            <a
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hover:text-[#131b2e] transition-colors cursor-pointer"
            >
              Privacy Controls
            </a>
            <a
              onClick={() => setIsShortcutsModalOpen(true)}
              className="hover:text-[#131b2e] transition-colors cursor-pointer"
            >
              Shortcuts (Ctrl+Enter)
            </a>
            <a
              onClick={() => setIsAdminModalOpen(true)}
              className="hover:text-[#131b2e] transition-colors cursor-pointer"
            >
              Engine Settings
            </a>
          </div>
        </div>
      </footer>

      {/* Global Modals & Toasts */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        campaign={campaign}
        onShowToast={showToast}
        onOpenQRModal={() => setIsQRModalOpen(true)}
      />

      <QRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        campaign={campaign}
        onShowToast={showToast}
      />

      <ExportAnalyticsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        campaign={campaign}
        onShowToast={showToast}
      />

      <PrivacySettingsModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onClearDrafts={handleClearAllDrafts}
        onClearPhotos={handleClearAllPhotos}
        onShowToast={showToast}
      />

      <DraftsHistoryModal
        isOpen={isDraftsModalOpen}
        onClose={() => setIsDraftsModalOpen(false)}
        drafts={draftsList}
        onLoadDraft={(d) => {
          showToast(`Loaded draft for ${d.eventName}`);
        }}
        onDeleteDraft={handleDeleteDraft}
        onShowToast={showToast}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <AdminSettingsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onShowToast={showToast}
      />

      <Toast message={toastMessage} />
    </div>
  );
}
