import React, { useState } from 'react';
import { CampaignData, AttendeeProfile } from '../types';

interface HeaderProps {
  currentTab: 'organizer' | 'attendee' | 'campaigns';
  onSelectTab: (tab: 'organizer' | 'attendee' | 'campaigns') => void;
  campaign: CampaignData;
  attendee: AttendeeProfile;
  onChangeAttendee: (attendee: AttendeeProfile) => void;
  onOpenShareModal: () => void;
  onOpenQRModal: () => void;
  onOpenPrivacyModal: () => void;
  onOpenShortcutsModal: () => void;
  onOpenAdminModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  campaign,
  attendee,
  onChangeAttendee,
  onOpenShareModal,
  onOpenQRModal,
  onOpenPrivacyModal,
  onOpenShortcutsModal,
  onOpenAdminModal,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const sampleProfiles: AttendeeProfile[] = [
    {
      name: 'Sarah Chen',
      headline: 'VP of AI Products @ NexaTech • Keynote Speaker',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDKB6YWh17l4Q3_fxpDSZOGM_MnvmtPDHwnDV1IJKCM2Z-75xG9gSyZ5AT__-A8HTTbvJhAbPXNzmw33caIFAi-yTxb72HuJjVi1JqEooKBMC8xKnmdBERqkh8Bucg4Mlhg1k2VXdRd4bIN-DwFp7B_HHUvLiCndptHnt5xv7XAwaKP0ncNNrzSW8-VVPY9JcvhOMXk_Zrs2YVIo31OD3lxE_cWc8jIuz13at3yh92lsZeFxvzj1Cfi',
      connectionLevel: '1st',
    },
    {
      name: 'Elena Rostova',
      headline: 'VP of AI Architecture @ NeuralSphere',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC_RV9yxgtuiZPYtYANGYVBAei6rxrGkc26emH69t0s6AzomaYKz-vev_DTpkRkVdr1d_51AEQWS-PGadwZu_-KbczaEfeDJWYhUU7BusUmEf5wumjjZ_u4bV1_wJXxJ0NvVctZRlP2dY0Vt9R8m0S3cxsDKeEcMgkppomiP-JBuIK5PWovX7coAlfMP3fKKw5L_KCZ476o-l3QHrOv2nMCQbXzHhnbahsbuwCsIQHSRlQgGONpuEmD',
      connectionLevel: '1st',
    },
    {
      name: 'Marcus Vance',
      headline: 'Principal Lead @ ScaledSystems',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCwZsxD2lY-203la1b3qcyF_jZ1R44AIrhQcVYcTsxV955FmamX3_quR9C3LPoEZKDno0i_jl9lvNYys3qJ4hbe91Yda2fIV1n_1oqPfEEiOWJJ8HnltkaMMFubfd0151g6BbTE5EmVpGQYWeLLlK8wqBEbcWpby25_3xqXNm4E1AzQIpU46cwuF44pHkVz3DhR6w4tHCPZ6hhsf-81eufuK3pdoiDqAosQxe00nB75OHdfEq1bJsnP',
      connectionLevel: '2nd',
    },
    {
      name: 'Devon Patel',
      headline: 'Founder & CEO @ Synthetica',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDuPh8ow5JUvcnsoklP_V4GeLL2yxScpq0Q-KlgpLjnp_Q-6eC4EdkuJxsKYeMegity9yVSURJ2FztM6hlVlYU5V1hULMjKaqhlATs8uVzLlkfG1a51xdhjBnQa2K919kserCLjWQ4T5oJP1ptlmPWeA_XLi6HnyU34wd95ZFt3SPg13TLI6rp0M-N8_uU26KPoAhSe_CBD5piWPFmqwFmw3ckP6YXgk2OOmf-Ea2cdyFyXbhTcYatu',
      connectionLevel: '1st',
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#ffffff] border-b border-[#c2c6d2]/40 shadow-[0_1px_6px_rgba(15,23,42,0.04)]">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onSelectTab('organizer')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <img
              alt="EventPulse Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UXuSNaRmZP7ikLERu-4J9c7MPD9wVwj9fDW5nEa7fwOFBfXlPqOtdx-hUwxyiYos00_ZR2OIBpBZ94fKL7xiJvOrxiOfRJXEQBgmKHM7ReOFeNoZw8uRuB1aV75cOVeojVfvPYxeyc1FwdEPkiIlNJMhHrMnM8tig3tXJrW9pCUC4aqrvrSE4Z4xaqq9-dBQHUnPAnKddSC1yGllEYwUrkXOF5JplEavgXlU5T7vczasq_vc5GiqytQKo"
            />
            <span className="font-['Manrope'] text-[18px] font-bold text-[#003f74] tracking-tight">
              EventPulse
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#d5e3fc] text-[#003f74] font-['DM_Sans'] text-[11px] font-bold">
            #0A66C2 Viralizer
          </span>
        </div>

        {/* View Switcher Navigation */}
        <nav className="flex items-center p-1 rounded-full bg-[#eaedff]">
          <button
            onClick={() => onSelectTab('organizer')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all cursor-pointer ${
              currentTab === 'organizer'
                ? 'bg-[#ffffff] text-[#003f74] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                : 'text-[#424751] hover:text-[#131b2e]'
            }`}
          >
            Organizer
          </button>
          <button
            onClick={() => onSelectTab('attendee')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all cursor-pointer ${
              currentTab === 'attendee'
                ? 'bg-[#ffffff] text-[#003f74] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                : 'text-[#424751] hover:text-[#131b2e]'
            }`}
          >
            Attendee View
          </button>
          <button
            onClick={() => onSelectTab('campaigns')}
            className={`hidden md:inline-block px-3 sm:px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all cursor-pointer ${
              currentTab === 'campaigns'
                ? 'bg-[#ffffff] text-[#003f74] shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
                : 'text-[#424751] hover:text-[#131b2e]'
            }`}
          >
            Campaigns
          </button>
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Shortcuts Button */}
          <button
            onClick={onOpenShortcutsModal}
            className="p-1.5 rounded-lg text-[#515f74] hover:text-[#003f74] hover:bg-[#f2f3ff] transition-colors cursor-pointer"
            title="Keyboard shortcuts"
          >
            <span className="material-symbols-outlined text-[20px]">keyboard</span>
          </button>

          {/* Privacy Controls Button */}
          <button
            onClick={onOpenPrivacyModal}
            className="p-1.5 rounded-lg text-[#515f74] hover:text-[#003f74] hover:bg-[#f2f3ff] transition-colors cursor-pointer"
            title="Privacy & data controls"
          >
            <span className="material-symbols-outlined text-[20px]">lock</span>
          </button>

          {/* Engine Admin Settings */}
          <button
            onClick={onOpenAdminModal}
            className="p-1.5 rounded-lg text-[#515f74] hover:text-[#003f74] hover:bg-[#f2f3ff] transition-colors cursor-pointer"
            title="Developer engine settings"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>

          {/* Share Button */}
          <button
            onClick={onOpenShareModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#c2c6d2]/60 bg-[#ffffff] hover:bg-[#f2f3ff] font-['DM_Sans'] text-[13px] font-semibold text-[#131b2e] transition-colors shadow-2xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#003f74]">
              ios_share
            </span>
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* User Profile / Persona Selector */}
          <div className="relative">
            <div
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 pl-2 border-l border-[#c2c6d2]/40 cursor-pointer select-none"
            >
              <img
                alt={attendee.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#c2c6d2]/50"
                src={attendee.avatarUrl}
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="font-['DM_Sans'] text-[13px] font-semibold text-[#131b2e] leading-tight">
                  {attendee.name}
                </span>
                <span className="font-['DM_Sans'] text-[10px] text-[#424751] leading-none">
                  Active Persona
                </span>
              </div>
              <span className="material-symbols-outlined text-[18px] text-[#515f74]">
                expand_more
              </span>
            </div>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#ffffff] border border-[#c2c6d2]/40 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-[#eaedff]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#515f74]">
                    Switch Profile / Persona
                  </span>
                </div>
                <div className="py-1">
                  {sampleProfiles.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => {
                        onChangeAttendee(p);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 flex items-center gap-2.5 text-left hover:bg-[#f2f3ff] transition-colors cursor-pointer ${
                        p.name === attendee.name ? 'bg-[#eaedff]' : ''
                      }`}
                    >
                      <img
                        src={p.avatarUrl}
                        alt={p.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[13px] font-semibold text-[#131b2e] truncate">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-[#424751] truncate">
                          {p.headline}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
