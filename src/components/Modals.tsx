import React from 'react';
import { CampaignData } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignData;
  onShowToast: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  campaign,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const publicLink = 'https://eventpulse.ai/share/techsummit25';

  const copySnippet = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`${label} copied to clipboard!`);
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
            className="text-[#424751] hover:text-[#131b2e] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Link Strip */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#131b2e]">
            Direct Attendee Link
          </label>
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#f2f3ff] border border-[#c2c6d2]/30">
            <input
              readOnly
              value={publicLink}
              className="bg-transparent px-2 font-mono text-[13px] text-[#003f74] flex-1 focus:outline-none"
            />
            <button
              onClick={() => copySnippet(publicLink, 'Share link')}
              className="px-3 py-1.5 rounded-lg bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] text-[12px] font-semibold cursor-pointer"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Email Badge Template */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#131b2e]">
            HTML Email / Confirmation Badge Snippet
          </label>
          <div className="p-3 rounded-xl bg-[#f2f3ff] text-[12px] font-mono text-[#424751] border border-[#c2c6d2]/30 relative group">
            <p className="line-clamp-3">
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

        {/* Slack / Teams Announcement */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#131b2e]">
            Slack / Teams Broadcast Text
          </label>
          <div className="p-3 rounded-xl bg-[#f2f3ff] text-[12px] text-[#131b2e] border border-[#c2c6d2]/30 flex flex-col gap-1">
            <p>
              🚀 Attendees! Share your biggest takeaways from {campaign.name} in 30 seconds using our attendee LinkedIn assistant: {publicLink}
            </p>
            <button
              onClick={() =>
                copySnippet(
                  `🚀 Attendees! Share your biggest takeaways from ${campaign.name} in 30 seconds using our attendee LinkedIn assistant: ${publicLink}`,
                  'Broadcast message'
                )
              }
              className="mt-1 text-[#02569b] font-semibold hover:underline text-[12px] flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">content_copy</span>
              <span>Copy Message</span>
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
        `Total Posts Shared,1248`,
        `Estimated Impressions,${campaign.impressions}`,
        `Engagement Rate,${campaign.engagementRate}`,
        `Top Hashtags,"${campaign.hashtags.join(';')}"`,
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eventpulse-analytics-${campaign.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Downloaded campaign analytics report (.csv)');
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
          <button
            onClick={onClose}
            className="text-[#424751] hover:text-[#131b2e] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-[#f2f3ff] rounded-xl">
            <span className="text-[11px] text-[#424751]">Total Posts</span>
            <div className="text-[18px] font-bold text-[#131b2e]">1,248</div>
            <span className="text-[10px] text-[#02569b]">↑ 182 today</span>
          </div>
          <div className="p-3 bg-[#f2f3ff] rounded-xl">
            <span className="text-[11px] text-[#424751]">Impressions</span>
            <div className="text-[18px] font-bold text-[#131b2e]">
              {campaign.impressions}
            </div>
            <span className="text-[10px] text-[#2420b6]">Top 5% reach</span>
          </div>
          <div className="p-3 bg-[#f2f3ff] rounded-xl">
            <span className="text-[11px] text-[#424751]">Brand Uniformity</span>
            <div className="text-[18px] font-bold text-[#131b2e]">
              {campaign.brandUniformityScore}%
            </div>
            <span className="text-[10px] text-[#02569b]">Zero drift detected</span>
          </div>
          <div className="p-3 bg-[#f2f3ff] rounded-xl">
            <span className="text-[11px] text-[#424751]">Engagement Rate</span>
            <div className="text-[18px] font-bold text-[#131b2e]">
              {campaign.engagementRate}
            </div>
            <span className="text-[10px] text-[#02569b]">Industry high</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eaedff]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[#424751] text-[13px] font-semibold hover:bg-[#f2f3ff] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={downloadCSV}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] text-[13px] font-semibold shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#283044] text-[#eef0ff] shadow-xl border border-[#c2c6d2]/20">
      <span className="material-symbols-outlined text-[20px] text-[#a4c9ff]">
        check_circle
      </span>
      <span className="font-['DM_Sans'] text-[13px] font-semibold">{message}</span>
    </div>
  );
};
