import { useState, useEffect } from 'react';
import { CampaignData, AttendeeProfile } from './types';
import { Header } from './components/Header';
import { OrganizerWorkbench } from './components/OrganizerWorkbench';
import { AttendeeView } from './components/AttendeeView';
import { CampaignsView } from './components/CampaignsView';
import { ShareModal, ExportAnalyticsModal, Toast } from './components/Modals';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'organizer' | 'attendee' | 'campaigns'>('organizer');

  const [campaign, setCampaign] = useState<CampaignData>({
    id: 'GTS-2025-Q3',
    name: 'Global Tech Summit 2025: AI & Future of Work',
    organizer: 'Apex Innovations & TechVentures Alliance',
    date: 'OCT 24-26, 2025',
    location: 'San Francisco, CA & Virtual',
    badgeType: 'Flagship Summit',
    hashtags: ['#TechSummit2025', '#AIFuture', '#ProductInnovation'],
    channels: {
      linkedInCompany: 'linkedin.com/company/apex',
      twitter: '@ApexTechSummit',
      eventPortal: 'https://techsummit2025.io',
    },
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
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sync initial campaign data with backend if available
  useEffect(() => {
    fetch('/api/campaign')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.campaign) {
          setCampaign(data.campaign);
        }
      })
      .catch(() => {
        // use local defaults
      });
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
    }).catch(() => {
      // ignore offline errors
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col font-['DM_Sans'] text-[#131b2e] antialiased selection:bg-[#d5e3fc] selection:text-[#003f74]">
      {/* Top Fixed Header */}
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
      />

      {/* Main Container with 64px offset for fixed header */}
      <main className="w-full pt-16 flex-1 bg-[#faf8ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {currentTab === 'organizer' && (
            <OrganizerWorkbench
              campaign={campaign}
              onUpdateCampaign={handleUpdateCampaign}
              onNavigateToAttendee={() => setCurrentTab('attendee')}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'attendee' && (
            <AttendeeView
              campaign={campaign}
              attendee={attendee}
              onChangeAttendee={(updated) => setAttendee({ ...attendee, ...updated })}
              onShowToast={showToast}
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
            />
          )}
        </div>
      </main>

      {/* Global Footer */}
      <footer className="w-full border-t border-[#c2c6d2]/30 bg-[#ffffff] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="font-['Manrope'] text-[16px] font-bold text-[#003f74]">
              EventPulse
            </span>
            <span className="font-['DM_Sans'] text-[12px] text-[#424751]">
              © 2025 EventPulse Inc. Strategic Executive Distribution.
            </span>
          </div>

          <div className="flex items-center gap-5 font-['DM_Sans'] text-[12px] font-semibold text-[#424751]">
            <a
              onClick={() => showToast('Platform Policies: Executive Data Privacy')}
              className="hover:text-[#131b2e] transition-colors cursor-pointer"
            >
              Platform Policies
            </a>
            <a
              onClick={() => showToast('Algorithm Insights: High-affinity B2B reach')}
              className="hover:text-[#131b2e] transition-colors cursor-pointer"
            >
              Algorithm Insights
            </a>
            <a
              onClick={() => showToast('Support contact: support@eventpulse.ai')}
              className="hover:text-[#131b2e] transition-colors cursor-pointer"
            >
              Support
            </a>
          </div>
        </div>
      </footer>

      {/* Global Modals & Toast notifications */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        campaign={campaign}
        onShowToast={showToast}
      />

      <ExportAnalyticsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        campaign={campaign}
        onShowToast={showToast}
      />

      <Toast message={toastMessage} />
    </div>
  );
}
