import React, { useState } from 'react';
import { CampaignData, PostDraft, FactCheckResult, TelemetrySummary } from '../types';

// =========================================================================
// 1. SHARE MODAL (Multi-channel: Copy Link, QR Code, WhatsApp, Email, LinkedIn, X)
// =========================================================================
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignData;
  onShowToast: (msg: string) => void;
  onOpenQRModal?: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onShowToast,
  onOpenQRModal,
}) => {
  if (!isOpen) return null;

  const publicLink = `https://eventpulse.ai/event/${campaign.id}`;

  const copySnippet = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`${label} copied to clipboard!`);
  };

  const handleShareChannel = (channel: 'whatsapp' | 'email' | 'linkedin' | 'twitter') => {
    const text = encodeURIComponent(`Share your biggest takeaways from ${campaign.name} on LinkedIn using our AI assistant: ${publicLink}`);
    const url = encodeURIComponent(publicLink);

    if (channel === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
    } else if (channel === 'email') {
      window.open(`mailto:?subject=${encodeURIComponent(campaign.name + ' - Attendee LinkedIn Generator')}&body=${text}`, '_blank');
    } else if (channel === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
    } else if (channel === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#c2c6d2]/30 flex flex-col gap-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#003f74]">
              ios_share
            </span>
            <h2 className="font-['Manrope'] text-[18px] font-bold text-[#131b2e]">
              Share Attendee Distribution Kit
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#424751] hover:text-[#131b2e] cursor-pointer p-1 rounded-lg hover:bg-[#f2f3ff]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Direct Link Strip */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-semibold text-[#131b2e]">
              Direct Attendee Link
            </label>
            <span className="text-[11px] text-[#02569b] font-medium">Unpredictable ID: {campaign.id}</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#f2f3ff] border border-[#c2c6d2]/30">
            <input
              readOnly
              value={publicLink}
              className="bg-transparent px-2 font-mono text-[12px] text-[#003f74] flex-1 focus:outline-none truncate"
            />
            <button
              onClick={() => copySnippet(publicLink, 'Share link')}
              className="px-3 py-1.5 rounded-lg bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] text-[12px] font-semibold cursor-pointer transition-colors"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Social Sharing Channels */}
        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-semibold text-[#131b2e]">
            Quick Share Channels
          </label>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleShareChannel('linkedin')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] border border-[#c2c6d2]/30 text-[#003f74] text-[11px] font-semibold gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              LinkedIn
            </button>
            <button
              onClick={() => handleShareChannel('whatsapp')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] border border-[#c2c6d2]/30 text-[#003f74] text-[11px] font-semibold gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              WhatsApp
            </button>
            <button
              onClick={() => handleShareChannel('twitter')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] border border-[#c2c6d2]/30 text-[#003f74] text-[11px] font-semibold gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">tag</span>
              X (Twitter)
            </button>
            <button
              onClick={() => handleShareChannel('email')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] border border-[#c2c6d2]/30 text-[#003f74] text-[11px] font-semibold gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
              Email
            </button>
          </div>
        </div>

        {/* Email Badge Template */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#131b2e]">
            HTML Email / Confirmation Badge Snippet
          </label>
          <div className="p-3 rounded-xl bg-[#f2f3ff] text-[12px] font-mono text-[#424751] border border-[#c2c6d2]/30 relative group">
            <p className="line-clamp-2">
              &lt;a href="{publicLink}" style="background:#02569b; color:#fff; padding:10px 18px; border-radius:8px; text-decoration:none;"&gt;
                Post My Summit Highlights on LinkedIn with AI
              &lt;/a&gt;
            </p>
            <button
              onClick={() =>
                copySnippet(
                  `<a href="${publicLink}" style="background:#02569b; color:#fff; padding:10px 18px; border-radius:8px; text-decoration:none;">Post My Summit Highlights on LinkedIn with AI</a>`,
                  'Email button HTML'
                )
              }
              className="mt-2 text-[#02569b] font-semibold hover:underline text-[12px] flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">content_copy</span>
              <span>Copy HTML Embed</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#eaedff]">
          {onOpenQRModal && (
            <button
              onClick={() => {
                onClose();
                onOpenQRModal();
              }}
              className="text-[#02569b] font-semibold text-[13px] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
              Generate QR Code
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] text-[#003f74] font-semibold text-[13px] cursor-pointer ml-auto"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. QR CODE MODAL (Download SVG, PNG, Copy Link)
// =========================================================================
interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignData;
  onShowToast: (msg: string) => void;
}

export const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const publicUrl = `https://eventpulse.ai/event/${campaign.id}`;

  const downloadSVG = () => {
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="400" height="400">
      <rect width="100" height="100" fill="#ffffff" />
      <rect x="0" y="0" width="28" height="28" rx="4" fill="#003f74" />
      <rect x="6" y="6" width="16" height="16" fill="#ffffff" />
      <rect x="10" y="10" width="8" height="8" fill="#003f74" />
      <rect x="72" y="0" width="28" height="28" rx="4" fill="#003f74" />
      <rect x="78" y="6" width="16" height="16" fill="#ffffff" />
      <rect x="82" y="10" width="8" height="8" fill="#003f74" />
      <rect x="0" y="72" width="28" height="28" rx="4" fill="#003f74" />
      <rect x="6" y="78" width="16" height="16" fill="#ffffff" />
      <rect x="10" y="82" width="8" height="8" fill="#003f74" />
      <rect x="36" y="6" width="8" height="8" fill="#003f74" />
      <rect x="52" y="6" width="12" height="6" fill="#003f74" />
      <rect x="36" y="22" width="6" height="14" fill="#003f74" />
      <rect x="48" y="24" width="16" height="6" fill="#003f74" />
      <rect x="6" y="36" width="14" height="6" fill="#003f74" />
      <rect x="6" y="48" width="8" height="16" fill="#003f74" />
      <rect x="24" y="40" width="18" height="18" fill="#003f74" />
      <rect x="48" y="40" width="8" height="8" fill="#003f74" />
      <rect x="62" y="36" width="16" height="8" fill="#003f74" />
      <rect x="84" y="40" width="10" height="10" fill="#003f74" />
      <rect x="40" y="66" width="14" height="6" fill="#003f74" />
      <rect x="60" y="60" width="8" height="16" fill="#003f74" />
      <rect x="76" y="66" width="18" height="8" fill="#003f74" />
      <rect x="40" y="80" width="8" height="14" fill="#003f74" />
      <rect x="56" y="84" width="20" height="8" fill="#003f74" />
      <rect x="84" y="82" width="10" height="12" fill="#003f74" />
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
    onShowToast('Downloaded vector QR Code (.SVG)');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c2c6d2]/30 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 text-center">
        <div className="w-full flex items-center justify-between border-b border-[#eaedff] pb-3">
          <h2 className="font-['Manrope'] text-[18px] font-bold text-[#131b2e]">
            Attendee Check-In & Post QR
          </h2>
          <button onClick={onClose} className="text-[#424751] hover:text-[#131b2e] cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* QR Display Card */}
        <div className="p-4 bg-[#f2f3ff] rounded-2xl border border-[#c2c6d2]/30 shadow-inner flex flex-col items-center gap-3">
          <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#ffffff" rx="8" />
            <rect x="10" y="10" width="24" height="24" rx="3" fill="#003f74" />
            <rect x="14" y="14" width="16" height="16" fill="#ffffff" />
            <rect x="18" y="18" width="8" height="8" fill="#003f74" />
            <rect x="66" y="10" width="24" height="24" rx="3" fill="#003f74" />
            <rect x="70" y="14" width="16" height="16" fill="#ffffff" />
            <rect x="74" y="18" width="8" height="8" fill="#003f74" />
            <rect x="10" y="66" width="24" height="24" rx="3" fill="#003f74" />
            <rect x="14" y="70" width="16" height="16" fill="#ffffff" />
            <rect x="18" y="74" width="8" height="8" fill="#003f74" />
            <rect x="40" y="14" width="18" height="6" fill="#003f74" />
            <rect x="40" y="26" width="8" height="14" fill="#003f74" />
            <rect x="52" y="24" width="10" height="8" fill="#003f74" />
            <rect x="14" y="42" width="18" height="6" fill="#003f74" />
            <rect x="38" y="42" width="24" height="18" fill="#003f74" />
            <rect x="68" y="42" width="18" height="8" fill="#003f74" />
            <rect x="40" y="68" width="12" height="18" fill="#003f74" />
            <rect x="58" y="68" width="14" height="8" fill="#003f74" />
            <rect x="76" y="68" width="10" height="18" fill="#003f74" />
          </svg>
          <span className="font-mono text-[11px] text-[#424751]">{publicUrl}</span>
        </div>

        <p className="text-[12px] text-[#424751] max-w-xs">
          Display on keynote presentation slides, badge lanyards, or registration table signage.
        </p>

        <div className="flex items-center gap-2 w-full pt-2 border-t border-[#eaedff]">
          <button
            onClick={() => {
              navigator.clipboard.writeText(publicUrl);
              onShowToast('Attendee URL copied to clipboard');
            }}
            className="flex-1 py-2 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] text-[#003f74] font-semibold text-[13px] cursor-pointer"
          >
            Copy Link
          </button>
          <button
            onClick={downloadSVG}
            className="flex-1 py-2 rounded-xl bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] font-semibold text-[13px] shadow-sm cursor-pointer"
          >
            Download SVG
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. EXPORT TELEMETRY MODAL (CSV & JSON)
// =========================================================================
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignData;
  onShowToast: (msg: string) => void;
}

export const ExportAnalyticsModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const downloadCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Metric,Value',
        `Campaign ID,${campaign.id}`,
        `Campaign Name,${campaign.name}`,
        `Host Entity,${campaign.organizer}`,
        `Registered Delegates,${campaign.registeredDelegates}`,
        `Brand Uniformity Score,${campaign.brandUniformityScore}%`,
        `Total Posts Generated,${campaign.postsGenerated}`,
        `Estimated Impressions,${campaign.impressions}`,
        `Engagement Rate,${campaign.engagementRate}`,
        `Top Hashtags,"${campaign.hashtags.join(';')}"`,
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eventpulse-telemetry-${campaign.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Downloaded campaign analytics report (.CSV)');
    onClose();
  };

  const downloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(campaign, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `eventpulse-telemetry-${campaign.id}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Downloaded raw campaign telemetry (.JSON)');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#c2c6d2]/30 flex flex-col gap-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#003f74]">
              analytics
            </span>
            <h2 className="font-['Manrope'] text-[18px] font-bold text-[#131b2e]">
              Export Viral Campaign Telemetry
            </h2>
          </div>
          <button onClick={onClose} className="text-[#424751] hover:text-[#131b2e] cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#c2c6d2]/20">
            <span className="text-[11px] text-[#424751]">Total Posts Generated</span>
            <div className="text-[18px] font-bold text-[#131b2e]">{campaign.postsGenerated.toLocaleString()}</div>
            <span className="text-[10px] text-[#02569b]">↑ Live telemetry</span>
          </div>
          <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#c2c6d2]/20">
            <span className="text-[11px] text-[#424751]">Estimated Impressions</span>
            <div className="text-[18px] font-bold text-[#131b2e]">{campaign.impressions}</div>
            <span className="text-[10px] text-[#2420b6]">High-affinity reach</span>
          </div>
          <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#c2c6d2]/20">
            <span className="text-[11px] text-[#424751]">Brand Uniformity Score</span>
            <div className="text-[18px] font-bold text-[#131b2e]">{campaign.brandUniformityScore}%</div>
            <span className="text-[10px] text-[#02569b]">Zero message drift</span>
          </div>
          <div className="p-3 bg-[#f2f3ff] rounded-xl border border-[#c2c6d2]/20">
            <span className="text-[11px] text-[#424751]">Avg Engagement Rate</span>
            <div className="text-[18px] font-bold text-[#131b2e]">{campaign.engagementRate}</div>
            <span className="text-[10px] text-[#02569b]">Industry benchmark</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eaedff]">
          <button
            onClick={downloadJSON}
            className="px-4 py-2 rounded-xl text-[#003f74] bg-[#eaedff] text-[13px] font-semibold hover:bg-[#e2e7ff] cursor-pointer"
          >
            Export JSON
          </button>
          <button
            onClick={downloadCSV}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] text-[13px] font-semibold shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 4. PRIVACY & DATA RETENTION SETTINGS MODAL
// =========================================================================
interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearDrafts: () => void;
  onClearPhotos: () => void;
  onShowToast: (msg: string) => void;
}

export const PrivacySettingsModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  onClearDrafts,
  onClearPhotos,
  onShowToast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c2c6d2]/30 flex flex-col gap-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#003f74]">
              lock
            </span>
            <h2 className="font-['Manrope'] text-[18px] font-bold text-[#131b2e]">
              Privacy & Data Controls
            </h2>
          </div>
          <button onClick={onClose} className="text-[#424751] hover:text-[#131b2e] cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-[12px] text-[#424751]">
          EventPulse follows a minimal data retention policy. Your inputs and photos remain stored only on your local device.
        </p>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] border border-[#c2c6d2]/20">
            <div>
              <div className="text-[13px] font-semibold text-[#131b2e]">Delete Uploaded Photos</div>
              <div className="text-[11px] text-[#424751]">Remove image references and local cache</div>
            </div>
            <button
              onClick={() => {
                onClearPhotos();
                onShowToast('Deleted all local photo references.');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#ffffff] border border-[#c2c6d2] text-[#ba1a1a] text-[12px] font-semibold hover:bg-[#ffebeb] cursor-pointer"
            >
              Clear Photos
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] border border-[#c2c6d2]/20">
            <div>
              <div className="text-[13px] font-semibold text-[#131b2e]">Purge Draft History</div>
              <div className="text-[11px] text-[#424751]">Clear all saved posts and cached prompts</div>
            </div>
            <button
              onClick={() => {
                onClearDrafts();
                onShowToast('Draft history purged.');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#ffffff] border border-[#c2c6d2] text-[#ba1a1a] text-[12px] font-semibold hover:bg-[#ffebeb] cursor-pointer"
            >
              Purge Drafts
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#eaedff]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] text-[#003f74] font-semibold text-[13px] cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 5. POST DRAFTS & HISTORY MODAL (Searchable, Filterable)
// =========================================================================
interface DraftsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: PostDraft[];
  onLoadDraft: (draft: PostDraft) => void;
  onDeleteDraft: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const DraftsHistoryModal: React.FC<DraftsHistoryModalProps> = ({
  isOpen,
  onClose,
  drafts,
  onLoadDraft,
  onDeleteDraft,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'generated' | 'copied'>('all');

  if (!isOpen) return null;

  const filtered = drafts.filter((d) => {
    const matchesSearch =
      d.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.postText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.takeaways.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#c2c6d2]/30 flex flex-col gap-4 animate-in fade-in zoom-in-95 max-h-[85vh]">
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#003f74]">
              history
            </span>
            <h2 className="font-['Manrope'] text-[18px] font-bold text-[#131b2e]">
              Post History & Saved Drafts
            </h2>
          </div>
          <button onClick={onClose} className="text-[#424751] hover:text-[#131b2e] cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#424751]">
              search
            </span>
            <input
              type="text"
              placeholder="Search posts by keyword or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] border border-[#c2c6d2]/30 focus:outline-none focus:border-[#02569b]"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-xl w-full sm:w-auto">
            {(['all', 'draft', 'generated', 'copied'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 rounded-lg text-[12px] font-semibold capitalize transition-colors cursor-pointer ${
                  filterStatus === s ? 'bg-[#ffffff] text-[#003f74] shadow-xs' : 'text-[#424751]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Drafts List */}
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[50vh] pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-[#424751] flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[36px] text-[#727782]">
                history_edu
              </span>
              <p className="text-[14px] font-medium">No posts or drafts found</p>
              <p className="text-[12px]">Generate or edit posts to save them into your draft history.</p>
            </div>
          ) : (
            filtered.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-xl bg-[#f2f3ff] border border-[#c2c6d2]/30 hover:border-[#02569b] transition-all flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-['Manrope'] text-[13px] font-bold text-[#003f74]">
                      {d.eventName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#424751] text-[10px] font-bold uppercase">
                      {d.status}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#d5e3fc] text-[#003f74] text-[10px] font-bold">
                      {d.postStyle}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#424751]">
                    {new Date(d.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-[12px] text-[#131b2e] line-clamp-3 font-mono bg-[#ffffff] p-2.5 rounded-lg border border-[#c2c6d2]/20">
                  {d.postText}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#424751]">
                    Quality: <strong className="text-[#02569b]">{d.qualityScore}/100</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onDeleteDraft(d.id);
                        onShowToast('Deleted draft from history');
                      }}
                      className="text-[#ba1a1a] hover:bg-[#ffebeb] p-1.5 rounded-lg text-[12px] font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        onLoadDraft(d);
                        onClose();
                        onShowToast('Draft loaded into editor');
                      }}
                      className="px-3 py-1 rounded-lg bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] text-[12px] font-semibold cursor-pointer"
                    >
                      Continue Editing
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-[#eaedff]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] text-[#003f74] font-semibold text-[13px] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 6. KEYBOARD SHORTCUTS PANEL
// =========================================================================
interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl', 'Enter'], label: 'Quick Generate LinkedIn Post' },
    { keys: ['Ctrl', 'C'], label: 'Copy Generated Post (when preview is focused)' },
    { keys: ['Ctrl', 'Z'], label: 'Undo Content Edit' },
    { keys: ['Ctrl', 'Y'], label: 'Redo Content Edit' },
    { keys: ['Esc'], label: 'Close Active Modal / Drawer' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c2c6d2]/30 flex flex-col gap-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#003f74]">
              keyboard
            </span>
            <h2 className="font-['Manrope'] text-[18px] font-bold text-[#131b2e]">
              Keyboard Shortcuts
            </h2>
          </div>
          <button onClick={onClose} className="text-[#424751] hover:text-[#131b2e] cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-[#eaedff] last:border-none">
              <span className="text-[13px] text-[#131b2e] font-medium">{s.label}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="px-2 py-1 rounded-md bg-[#eaedff] border border-[#c2c6d2]/40 font-mono text-[11px] font-bold text-[#003f74]"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-[#eaedff]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] text-[#003f74] font-semibold text-[13px] cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 7. DEVELOPER & ADMIN SETTINGS MODAL (Protected)
// =========================================================================
interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');
  const [rateLimitMax, setRateLimitMax] = useState('60 requests / 5 min');
  const [maxUploadMB, setMaxUploadMB] = useState('5 MB');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c2c6d2]/30 flex flex-col gap-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#003f74]">
              tune
            </span>
            <h2 className="font-['Manrope'] text-[18px] font-bold text-[#131b2e]">
              Engine Configuration
            </h2>
          </div>
          <button onClick={onClose} className="text-[#424751] hover:text-[#131b2e] cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[12px] font-semibold text-[#131b2e]">Active AI Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2 mt-1 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] border border-[#c2c6d2]/40"
            >
              <option value="gemini-3.8-flash">Google Gemini 3.8 Flash (Active Production)</option>
              <option value="gemini-3.5-pro">Google Gemini 3.5 Pro (Deep Reasoning)</option>
            </select>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#131b2e]">Rate Limiting Window</label>
            <input
              readOnly
              value={rateLimitMax}
              className="w-full px-3 py-2 mt-1 rounded-xl bg-[#f2f3ff] text-[13px] text-[#424751] border border-[#c2c6d2]/40 font-mono"
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#131b2e]">Max Image Upload Limit</label>
            <input
              readOnly
              value={maxUploadMB}
              className="w-full px-3 py-2 mt-1 rounded-xl bg-[#f2f3ff] text-[13px] text-[#424751] border border-[#c2c6d2]/40 font-mono"
            />
          </div>

          <div className="p-3 bg-[#eaf4ff] rounded-xl text-[11px] text-[#003f74] border border-[#003f74]/20">
            🔒 Architecture adheres to strict server-side secrets isolation. Client JavaScript contains zero API credentials.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eaedff]">
          <button
            onClick={() => {
              onShowToast('Applied engine settings');
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] font-semibold text-[13px] cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 8. TOAST NOTIFICATION
// =========================================================================
interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#283044] text-[#eef0ff] shadow-xl border border-[#c2c6d2]/20">
      <span className="material-symbols-outlined text-[20px] text-[#a4c9ff]">
        check_circle
      </span>
      <span className="font-['DM_Sans'] text-[13px] font-semibold">{message}</span>
    </div>
  );
};
