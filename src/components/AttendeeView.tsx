import React, { useState } from 'react';
import { CampaignData, AttendeeProfile, AttachedPhoto } from '../types';

interface AttendeeViewProps {
  campaign: CampaignData;
  attendee: AttendeeProfile;
  onChangeAttendee: (updated: Partial<AttendeeProfile>) => void;
  onShowToast: (message: string) => void;
}

export const AttendeeView: React.FC<AttendeeViewProps> = ({
  campaign,
  attendee,
  onChangeAttendee,
  onShowToast,
}) => {
  const [takeaways, setTakeaways] = useState(
    'Mind blown by the keynote on autonomous AI agents by @SarahChen. Incredible discussions on ethical AI governance. Great catching up with old colleagues and meeting new partners!'
  );
  const [tone, setTone] = useState<'Professional' | 'Grateful Attendee' | 'Key Takeaways'>(
    'Grateful Attendee'
  );
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(42);
  const [copied, setCopied] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [postPhotos, setPostPhotos] = useState<AttachedPhoto[]>([
    {
      id: 'photo-1',
      label: 'Stage',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLm3d9uE_UU0mxKSg3Td7tIzBjZ5inP0qk0S7o6XBNOZgm7mV6Pi670BNHcP2j0MLVexTeAV7lfMHhwGFynnyq1YpY3J8PGnPfo1GPbBM47GbSQcRc3q6TZAqxZpBmzcsgt8bMWTyceZZUDm59wv7MeY3FxXfEl6GL2Jg8iuy0HA81CdDe32kkD6m0jzGi-bWh-1rhNc_vwwUwomrlcUJk8vvrCbhga_fUKzV8mRfIeiTTZm9vQvxw',
      alt: 'Modern tech keynote stage with dramatic cyan and indigo lighting',
    },
    {
      id: 'photo-2',
      label: 'Badge',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYZe5C0JUQgBj3viF-tygegObfscoWVK_9DPnxY_F552sy88-r7MPUH4DxL9gVWiKf0Azkwi8XLfmV4df9HDy5HlfxHu2ktR78w8bsuze9VG9Yyn15ECvk86FR1PhhIb8YT7mDVV6uPrl0k-I1p7uu4nw07j_dIz21lvKVlONyPHQH8r0R0Rau4R0ZpuzU0x68Y7AcUmwnlSplCKEFaUdw7hJ-X41FMV18Trcw5jvmMTXIhGdD1R97',
      alt: 'Close up of attendee conference badge lanyard',
    },
    {
      id: 'photo-3',
      label: 'Panel',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSEZpKommwc0Zmsf8_Cgwajthuo1XBSvA8gPAn0GEvFfqcxtVvEmXSXyHCklLpCigdphv220v0zPLFFuUGw7dHct44DhVB9qwgMXjvWbu8gteFH2_JjFwA_OjsoQzrGntHQ8kEv1r9Ssgw9BPwx2UGdoIpacZVAMTkpdr7q3_bCVD_4sNRTu7Im1uX0KpvhFtlA1iG9QbZ3M6-6Yil9QlcVoihVmZ8RYDnbRerQE6_qzeST-7ZXtXX',
      alt: 'Engaging conference panel discussion with executive speakers',
    },
  ]);

  const [postText, setPostText] = useState(`Still buzzing from an incredible 3 days at #TechSummit2025! 🚀

Three big takeaways that will shape our Q4 strategy:

1️⃣ Autonomous AI agents are rapidly transitioning from experimental prototypes to core enterprise architecture.
2️⃣ Ethical governance, guardrails, and data privacy must be baked into LLM workflows from day zero—not as an afterthought.
3️⃣ Nothing beats the spontaneous serendipity and energy of authentic peer collaboration in person.

Huge thanks to @Apex Innovations and the entire organizing team for curating such a world-class gathering. Grateful for the insightful conversations with fellow leaders!

#AIFuture #TechSummit2025 #ProductLeadership #ArtificialIntelligence`);

  const [viralScore, setViralScore] = useState(94);
  const [reachReasoning, setReachReasoning] = useState(
    'Includes 3 high-affinity event tags, 1 speaker mention, and authentic imagery.'
  );

  const handleRemovePhoto = (id: string) => {
    setPostPhotos(postPhotos.filter((p) => p.id !== id));
    onShowToast('Removed photo from draft');
  };

  const handleAddSamplePhoto = () => {
    const extraPhotos = [
      {
        id: `photo-${Date.now()}`,
        label: 'Auditorium',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqZXOLECKf1HvZSZpY1tkZnenJVQSr0EWIuomB1Cgo-NRBHoFCw2wU5Oyr4oJQGbMpbRGyTuiBQyUtDmQki_g1mOQpy0SmiKh9aK14dMsABZJEa8SQjW3mfZ-fiOKIkhPcJz9W-rLc7KLjOBeARBo4zHT_kmQ0cJR_OgIg5rorwrCWTnA9l-IPq_xHSXmPH0HPOhcXcXFUjEwB_P4I4Yw9oypqE3BgLeOx4Z00A5_LAETCc2rlWag0',
        alt: 'Wide angle keynote auditorium hall view',
      },
      {
        id: `photo-${Date.now() + 1}`,
        label: 'Networking',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKB6YWh17l4Q3_fxpDSZOGM_MnvmtPDHwnDV1IJKCM2Z-75xG9gSyZ5AT__-A8HTTbvJhAbPXNzmw33caIFAi-yTxb72HuJjVi1JqEooKBMC8xKnmdBERqkh8Bucg4Mlhg1k2VXdRd4bIN-DwFp7B_HHUvLiCndptHnt5xv7XAwaKP0ncNNrzSW8-VVPY9JcvhOMXk_Zrs2YVIo31OD3lxE_cWc8jIuz13at3yh92lsZeFxvzj1Cfi',
        alt: 'Attendee networking session',
      },
    ];
    const nextPhoto = extraPhotos[postPhotos.length % extraPhotos.length];
    setPostPhotos([...postPhotos, nextPhoto]);
    onShowToast(`Added ${nextPhoto.label} photo`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setPostPhotos([
          ...postPhotos,
          {
            id: `upload-${Date.now()}`,
            label: 'Upload',
            url,
            alt: file.name,
          },
        ]);
        onShowToast(`Uploaded ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBulletPoints = () => {
    const bulletSnippet = `\n• Keynote insight on agentic workflows\n• Practical governance frameworks\n• Great conversations with engineering peers`;
    setTakeaways((prev) => (prev.trim() ? `${prev}\n${bulletSnippet}` : bulletSnippet.trim()));
    onShowToast('Added structured takeaways');
  };

  const handleGeneratePost = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: campaign.name,
          organizer: campaign.organizer,
          hashtags: campaign.hashtags,
          directives: campaign.aiPromptDirectives,
          attendeeName: attendee.name,
          attendeeTitle: attendee.headline,
          takeaways,
          tone,
          photoLabels: postPhotos.map((p) => p.label),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.postText) {
          setPostText(data.postText);
          if (data.viralScore) setViralScore(data.viralScore);
          if (data.reachReasoning) setReachReasoning(data.reachReasoning);
          onShowToast('LinkedIn post synthesized with AI!');
        }
      } else {
        throw new Error('Server returned error status');
      }
    } catch {
      // Offline / fallback generation
      setTimeout(() => {
        const orgShort = campaign.organizer.split('&')[0].trim();
        const fallbackText = `Reflecting on an incredible experience at ${campaign.hashtags[0] || campaign.name}! 🚀

Key highlights that stood out:
1️⃣ Autonomous enterprise AI architecture is moving at breakneck speed.
2️⃣ Ethical guardrails and data privacy must be built in from day zero.
3️⃣ In-person collaboration remains unmatched for high-trust innovation.

${takeaways ? `Personal takeaway: "${takeaways}"\n\n` : ''}Huge thanks to @${orgShort} for curating a world-class program.

${campaign.hashtags.join(' ')} #ProductInnovation #Leadership`;
        setPostText(fallbackText);
        setViralScore(95);
        onShowToast('Post generated successfully!');
      }, 700);
    } finally {
      setTimeout(() => setIsGenerating(false), 600);
    }
  };

  const handleCopyPost = () => {
    navigator.clipboard.writeText(postText).then(() => {
      setCopied(true);
      onShowToast('Formatted LinkedIn post text copied to clipboard!');
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const handleOpenLinkedIn = () => {
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(
      postText
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
      onShowToast('Liked preview post');
    }
  };

  // Helper to format body text with highlighted hashtags and @mentions
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, lineIdx) => {
      if (!line.trim()) {
        return <div key={lineIdx} className="h-3" />;
      }
      const words = line.split(' ');
      return (
        <p key={lineIdx} className="leading-[22px]">
          {words.map((word, wordIdx) => {
            const isHashtag = word.startsWith('#');
            const isMention = word.startsWith('@');
            if (isHashtag || isMention) {
              return (
                <span
                  key={wordIdx}
                  className="text-[#02569b] font-semibold hover:underline cursor-pointer"
                  onClick={() => onShowToast(`Filter by ${word}`)}
                >
                  {word}{' '}
                </span>
              );
            }
            return word + ' ';
          })}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* 1. Top Event Banner Card */}
      <section className="w-full bg-[#ffffff] rounded-2xl shadow-sm p-4 sm:p-6 border border-[#c2c6d2]/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Event Context */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Calendar Pill Badge */}
          <div className="flex flex-col items-center justify-center bg-[#003f74] text-[#ffffff] px-4 py-2.5 rounded-xl shadow-inner min-w-[100px] text-center shrink-0">
            <span className="font-['DM_Sans'] text-[11px] font-bold text-[#aaccff] uppercase tracking-wider">
              Date
            </span>
            <span className="font-['Manrope'] text-[18px] font-bold leading-tight mt-0.5">
              OCT 24-26
            </span>
            <span className="font-['DM_Sans'] text-[11px] opacity-90">2025</span>
          </div>

          {/* Event Details */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#d5e3fc] text-[#3a485b] font-['DM_Sans'] text-[11px] font-semibold">
                {campaign.badgeType || 'Flagship Summit'}
              </span>
              <span className="font-['DM_Sans'] text-[11px] text-[#424751] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#515f74]">
                  verified
                </span>
                Official Partner
              </span>
            </div>

            <h1 className="font-['Manrope'] text-[20px] sm:text-[24px] font-bold text-[#131b2e] tracking-tight mt-0.5">
              {campaign.name}
            </h1>

            <p className="font-['DM_Sans'] text-[13px] text-[#424751] flex items-center gap-1.5 flex-wrap">
              <span>
                Hosted by <strong className="text-[#131b2e] font-semibold">{campaign.organizer.split('&')[0].trim()}</strong>
              </span>
              <span className="text-[#c2c6d2]">•</span>
              <span className="flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[15px] text-[#515f74]">
                  location_on
                </span>
                {campaign.location}
              </span>
            </p>
          </div>
        </div>

        {/* Right: Clickable Social Tags & Auto-tag Pill */}
        <div className="flex flex-col sm:items-end gap-2 w-full lg:w-auto">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* LinkedIn Tag */}
            <span
              onClick={() => onShowToast(`Tagging @${campaign.organizer.split('&')[0].trim()}`)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d5e3fc] text-[#003f74] font-['DM_Sans'] text-[13px] font-semibold hover:bg-[#b9c7df] transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
              </svg>
              <span>@{campaign.organizer.split('&')[0].trim()}</span>
            </span>

            {/* Hashtags */}
            {campaign.hashtags.map((tag) => (
              <span
                key={tag}
                onClick={() => onShowToast(`Included ${tag}`)}
                className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#eaedff] text-[#424751] font-['DM_Sans'] text-[13px] font-semibold hover:text-[#003f74] hover:bg-[#e2e7ff] transition-colors cursor-pointer"
              >
                {tag}
              </span>
            ))}

            {/* Portal Link */}
            <a
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f2f3ff] text-[#131b2e] hover:text-[#003f74] font-['DM_Sans'] text-[13px] font-semibold transition-colors"
              href={campaign.channels.eventPortal}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>techsummit2025.io</span>
              <span className="material-symbols-outlined text-[14px]">north_east</span>
            </a>
          </div>

          {/* Auto-tag Reminder */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#eaedff] text-[#424751] font-['DM_Sans'] text-[11px] font-medium">
            <span className="material-symbols-outlined text-[16px] text-[#2420b6]">
              auto_awesome
            </span>
            <span>Auto-tagged in your post for maximum reach &amp; organizer reshares</span>
          </div>
        </div>
      </section>

      {/* 2. Main Work Area: 2-Column Responsive Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Post Generator Inputs */}
        <div className="lg:col-span-6 flex flex-col gap-5 bg-[#ffffff] rounded-2xl shadow-sm p-5 sm:p-6 border border-[#c2c6d2]/30">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h2 className="font-['Manrope'] text-[18px] font-bold text-[#131b2e] flex items-center gap-2">
                <span>Create Your Post</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#eaedff] font-['DM_Sans'] text-[11px] font-semibold text-[#515f74]">
                  Step 1 of 2
                </span>
              </h2>

              <button
                onClick={() => setShowEditProfile(!showEditProfile)}
                className="text-[12px] font-medium text-[#003f74] hover:underline flex items-center gap-1 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">badge</span>
                <span>{showEditProfile ? 'Close profile' : 'Edit Author'}</span>
              </button>
            </div>
            <p className="font-['DM_Sans'] text-[13px] text-[#424751]">
              Upload your event photos and let AI craft an engaging LinkedIn update in seconds.
            </p>
          </div>

          {/* Optional: Attendee Identity Form */}
          {showEditProfile && (
            <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#c2c6d2]/30 flex flex-col gap-2.5 animate-in fade-in duration-150">
              <span className="font-['DM_Sans'] text-[12px] font-bold text-[#131b2e]">
                Attendee Profile Mockup Settings
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-[#424751]">Name</label>
                  <input
                    value={attendee.name}
                    onChange={(e) => onChangeAttendee({ name: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#ffffff] text-[13px] text-[#131b2e] border border-[#c2c6d2]/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-[#424751]">Headline / Role</label>
                  <input
                    value={attendee.headline}
                    onChange={(e) => onChangeAttendee({ headline: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#ffffff] text-[13px] text-[#131b2e] border border-[#c2c6d2]/40 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Event Photos Upload Zone */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-['DM_Sans'] text-[13px] font-semibold text-[#131b2e]">
                Event Photos
              </label>
              <span className="font-['DM_Sans'] text-[11px] text-[#424751]">
                {postPhotos.length} attached • max 10MB
              </span>
            </div>

            {/* Dropzone container */}
            <label className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#f2f3ff] hover:bg-[#d5e3fc]/40 border-2 border-dashed border-[#c2c6d2]/60 hover:border-[#02569b] transition-all cursor-pointer group text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-full bg-[#ffffff] shadow-2xs flex items-center justify-center text-[#003f74] group-hover:scale-105 transition-transform mb-1.5">
                <span className="material-symbols-outlined text-[22px]">cloud_upload</span>
              </div>
              <p className="font-['DM_Sans'] text-[13px] text-[#131b2e]">
                Drag &amp; drop event photos here, or{' '}
                <span className="text-[#02569b] font-semibold underline">browse files</span>
              </p>
              <span className="font-['DM_Sans'] text-[11px] text-[#424751] mt-0.5">
                Supports PNG, JPG, WebP up to 10MB each
              </span>
            </label>

            {/* Attached Photo Thumbnails */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {postPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group rounded-lg overflow-hidden bg-[#eaedff] aspect-square shadow-2xs border border-[#c2c6d2]/30"
                >
                  <img
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    src={photo.url}
                    alt={photo.alt}
                  />
                  <button
                    onClick={() => handleRemovePhoto(photo.id)}
                    aria-label="Remove image"
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#283044]/80 hover:bg-[#283044] text-[#ffffff] flex items-center justify-center transition-all opacity-90 group-hover:opacity-100 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                  <div className="absolute bottom-1 left-1 px-1 rounded bg-[#283044]/70 text-[#ffffff] font-['DM_Sans'] text-[9px] font-semibold leading-tight">
                    {photo.label}
                  </div>
                </div>
              ))}

              {/* Add More Button Slot */}
              <button
                onClick={handleAddSamplePhoto}
                className="flex flex-col items-center justify-center rounded-lg bg-[#f2f3ff] hover:bg-[#eaedff] text-[#424751] hover:text-[#003f74] aspect-square transition-all gap-1 border border-dashed border-[#c2c6d2]/60 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  add_photo_alternate
                </span>
                <span className="font-['DM_Sans'] text-[11px] font-semibold">+ Add</span>
              </button>
            </div>
          </div>

          {/* Key Highlights / Takeaways Textarea */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                className="font-['DM_Sans'] text-[13px] font-semibold text-[#131b2e]"
                htmlFor="takeaways-input"
              >
                Key Highlights / Takeaways
              </label>
              <button
                onClick={handleAddBulletPoints}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d5e3fc] text-[#003f74] font-['DM_Sans'] text-[11px] font-semibold hover:bg-[#b9c7df] transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px] text-[#2420b6]">
                  auto_awesome
                </span>
                <span>Add bullet points</span>
              </button>
            </div>

            <div className="relative rounded-xl bg-[#f2f3ff] focus-within:bg-[#ffffff] border border-[#c2c6d2]/30 focus-within:border-[#02569b] shadow-inner transition-colors">
              <textarea
                id="takeaways-input"
                value={takeaways}
                onChange={(e) => setTakeaways(e.target.value.slice(0, 500))}
                className="w-full bg-transparent px-3.5 py-3 font-['DM_Sans'] text-[14px] text-[#131b2e] placeholder:text-[#727782] focus:outline-none resize-none leading-relaxed"
                placeholder="What did you learn or enjoy most? e.g. Met amazing founders, loved the keynote on Agentic AI by Sarah Chen, and demoed our new product!"
                rows={4}
              />
              <div className="flex items-center justify-between px-3.5 py-2 text-[#424751] font-['DM_Sans'] text-[11px] bg-[#eaedff]/40 rounded-b-xl border-t border-[#c2c6d2]/20">
                <span className="flex items-center gap-1 text-[#515f74]">
                  <span className="material-symbols-outlined text-[15px]">tips_and_updates</span>
                  Tip: Tag speakers to increase reach by up to 3x
                </span>
                <span className="tabular-nums font-semibold">
                  {takeaways.length} / 500
                </span>
              </div>
            </div>
          </div>

          {/* Tone Selector Chips */}
          <div className="flex flex-col gap-2">
            <label className="font-['DM_Sans'] text-[13px] font-semibold text-[#131b2e] flex items-center justify-between">
              <span>Writing Voice &amp; Tone</span>
              <span className="font-['DM_Sans'] text-[11px] text-[#424751]">
                Influences cadence &amp; hooks
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Professional */}
              <button
                onClick={() => setTone('Professional')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-['DM_Sans'] text-[13px] font-semibold transition-all text-left cursor-pointer border ${
                  tone === 'Professional'
                    ? 'bg-[#003f74] text-[#ffffff] border-[#003f74] shadow-sm'
                    : 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] border-transparent'
                }`}
                type="button"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    tone === 'Professional' ? 'text-[#ffffff]' : 'text-[#515f74]'
                  }`}
                >
                  {tone === 'Professional' ? 'check_circle' : 'business_center'}
                </span>
                <span>Professional</span>
              </button>

              {/* Grateful Attendee */}
              <button
                onClick={() => setTone('Grateful Attendee')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-['DM_Sans'] text-[13px] font-semibold transition-all text-left cursor-pointer border ${
                  tone === 'Grateful Attendee'
                    ? 'bg-[#003f74] text-[#ffffff] border-[#003f74] shadow-sm'
                    : 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] border-transparent'
                }`}
                type="button"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    tone === 'Grateful Attendee' ? 'text-[#ffffff]' : 'text-[#515f74]'
                  }`}
                >
                  {tone === 'Grateful Attendee' ? 'check_circle' : 'sentiment_satisfied'}
                </span>
                <span>Grateful Attendee</span>
              </button>

              {/* Key Takeaways */}
              <button
                onClick={() => setTone('Key Takeaways')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-['DM_Sans'] text-[13px] font-semibold transition-all text-left cursor-pointer border ${
                  tone === 'Key Takeaways'
                    ? 'bg-[#003f74] text-[#ffffff] border-[#003f74] shadow-sm'
                    : 'bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] border-transparent'
                }`}
                type="button"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    tone === 'Key Takeaways' ? 'text-[#ffffff]' : 'text-[#515f74]'
                  }`}
                >
                  {tone === 'Key Takeaways' ? 'check_circle' : 'lightbulb'}
                </span>
                <span>Key Takeaways</span>
              </button>
            </div>
          </div>

          {/* Primary Action CTA Button */}
          <div className="pt-2">
            <button
              onClick={handleGeneratePost}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] font-['Manrope'] text-[16px] font-bold shadow-md hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer disabled:opacity-80"
              type="button"
            >
              <span
                className={`material-symbols-outlined text-[20px] text-[#c5c5ff] ${
                  isGenerating ? 'animate-spin' : 'animate-pulse'
                }`}
              >
                auto_awesome
              </span>
              <span>{isGenerating ? 'Synthesizing with AI...' : 'Generate LinkedIn Post'}</span>
              <span className="material-symbols-outlined text-[18px] opacity-80">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Live LinkedIn Post Mockup & Actions */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {/* Live Preview Top Control Bar Card */}
          <div className="bg-[#ffffff] rounded-2xl shadow-sm px-5 py-3 border border-[#c2c6d2]/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-['Manrope'] text-[16px] font-bold text-[#131b2e]">
                LinkedIn Post Preview
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#d5e3fc] text-[#003f74] font-['DM_Sans'] text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#02569b] animate-ping"></span>
                Ready to publish
              </span>
            </div>

            {/* Viewport Switcher */}
            <div className="inline-flex items-center p-1 rounded-lg bg-[#eaedff]">
              <button
                onClick={() => setViewportMode('desktop')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewportMode === 'desktop'
                    ? 'bg-[#ffffff] text-[#003f74] shadow-2xs font-semibold'
                    : 'text-[#424751] hover:text-[#131b2e]'
                }`}
                title="Desktop Feed View"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] block">
                  desktop_windows
                </span>
              </button>
              <button
                onClick={() => setViewportMode('mobile')}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewportMode === 'mobile'
                    ? 'bg-[#ffffff] text-[#003f74] shadow-2xs font-semibold'
                    : 'text-[#424751] hover:text-[#131b2e]'
                }`}
                title="Mobile App View"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] block">
                  phone_iphone
                </span>
              </button>
            </div>
          </div>

          {/* Authentic LinkedIn Feed Card Mockup */}
          <div
            className={`bg-[#ffffff] rounded-2xl shadow-md border border-[#c2c6d2]/40 overflow-hidden flex flex-col transition-all mx-auto w-full ${
              viewportMode === 'mobile' ? 'max-w-[400px]' : 'max-w-none'
            }`}
          >
            {/* Post Author Header */}
            <div className="p-4 sm:p-5 flex items-start justify-between gap-3 border-b border-[#eaedff]/40">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img
                    alt={attendee.name}
                    className="w-12 h-12 rounded-full object-cover shadow-2xs"
                    src={attendee.avatarUrl}
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#003f74] rounded-full flex items-center justify-center text-[9px] font-bold text-[#ffffff] shadow-2xs">
                    in
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-['Manrope'] text-[15px] font-bold text-[#131b2e] hover:text-[#02569b] cursor-pointer leading-tight">
                      {attendee.name}
                    </span>
                    <span className="font-['DM_Sans'] text-[12px] text-[#424751] font-normal">
                      • {attendee.connectionLevel}
                    </span>
                  </div>
                  <span className="font-['DM_Sans'] text-[12px] text-[#424751] line-clamp-1 leading-tight mt-0.5">
                    {attendee.headline}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#424751] mt-1">
                    <span>Just now</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">public</span>
                      <span>Edited</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#424751]">
                <button
                  className="p-1 rounded-full hover:bg-[#eaedff] text-[#424751] transition-colors cursor-pointer"
                  title="More post actions"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                </button>
              </div>
            </div>

            {/* Post Body Content */}
            <div className="px-4 sm:px-5 py-3 font-['DM_Sans'] text-[14px] leading-[22px] text-[#131b2e] space-y-2.5">
              {renderFormattedText(postText)}
            </div>

            {/* Attached Media Showcase */}
            {postPhotos.length > 0 && (
              <div className="px-4 sm:px-5 pb-3">
                <div className="relative w-full rounded-xl overflow-hidden bg-[#eaedff] max-h-[340px] shadow-inner group border border-[#c2c6d2]/20">
                  <img
                    className="w-full h-full object-cover max-h-[340px] group-hover:scale-[1.01] transition-transform duration-300"
                    src={postPhotos[0].url}
                    alt={postPhotos[0].alt}
                  />
                  {postPhotos.length > 1 && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-[#283044]/85 backdrop-blur-sm text-[#ffffff] font-['DM_Sans'] text-[11px] font-semibold flex items-center gap-1.5 shadow-md">
                      <span className="material-symbols-outlined text-[14px]">
                        photo_library
                      </span>
                      <span>+{postPhotos.length - 1} photos</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social Proof Metrics Bar */}
            <div className="px-4 sm:px-5 py-2.5 bg-[#f2f3ff] flex items-center justify-between text-[#424751] font-['DM_Sans'] text-[12px] border-t border-b border-[#c2c6d2]/20">
              {/* Reactions Breakdown */}
              <div
                onClick={toggleLike}
                className="flex items-center gap-1.5 cursor-pointer hover:underline select-none"
              >
                <div className="flex items-center -space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#02569b] text-[#ffffff] flex items-center justify-center text-[10px] shadow-2xs">
                    👍
                  </span>
                  <span className="w-5 h-5 rounded-full bg-[#3f40cd] text-[#ffffff] flex items-center justify-center text-[10px] shadow-2xs">
                    👏
                  </span>
                  <span className="w-5 h-5 rounded-full bg-[#ba1a1a] text-[#ffffff] flex items-center justify-center text-[10px] shadow-2xs">
                    ❤️
                  </span>
                </div>
                <span className="font-semibold text-[#131b2e]">
                  {isLiked ? 'You and ' : ''}
                  {likeCount} others
                </span>
              </div>

              {/* Comments & Reposts Counter */}
              <div className="flex items-center gap-2">
                <span className="hover:underline cursor-pointer">12 comments</span>
                <span>•</span>
                <span className="hover:underline cursor-pointer">5 reposts</span>
              </div>
            </div>

            {/* Interactive Action Bar (Like, Comment, Repost, Send) */}
            <div className="grid grid-cols-4 px-2 py-1 bg-[#ffffff]">
              {/* Like */}
              <button
                onClick={toggleLike}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-colors cursor-pointer ${
                  isLiked
                    ? 'text-[#02569b] font-bold bg-[#eaedff]'
                    : 'text-[#424751] hover:bg-[#eaedff] hover:text-[#003f74]'
                }`}
                type="button"
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    isLiked ? 'fill-1' : ''
                  }`}
                >
                  thumb_up
                </span>
                <span className="font-['DM_Sans'] text-[13px] font-semibold hidden sm:inline">
                  {isLiked ? 'Liked' : 'Like'}
                </span>
              </button>

              {/* Comment */}
              <button
                onClick={() => onShowToast('Comments open on live LinkedIn publication')}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-[#424751] hover:bg-[#eaedff] hover:text-[#003f74] transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chat_bubble_outline
                </span>
                <span className="font-['DM_Sans'] text-[13px] font-semibold hidden sm:inline">
                  Comment
                </span>
              </button>

              {/* Repost */}
              <button
                onClick={() => onShowToast('Repost prompt open')}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-[#424751] hover:bg-[#eaedff] hover:text-[#003f74] transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">repeat</span>
                <span className="font-['DM_Sans'] text-[13px] font-semibold hidden sm:inline">
                  Repost
                </span>
              </button>

              {/* Send */}
              <button
                onClick={handleCopyPost}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-[#424751] hover:bg-[#eaedff] hover:text-[#003f74] transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span className="font-['DM_Sans'] text-[13px] font-semibold hidden sm:inline">
                  Send
                </span>
              </button>
            </div>
          </div>

          {/* Action Buttons Row below the preview card */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              {/* Copy Post */}
              <button
                onClick={handleCopyPost}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ffffff] hover:bg-[#f2f3ff] text-[#131b2e] font-['DM_Sans'] text-[13px] font-semibold shadow-sm border border-[#c2c6d2]/30 transition-all cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-[#515f74]">
                  {copied ? 'done' : 'content_copy'}
                </span>
                <span className={copied ? 'text-[#02569b] font-bold' : ''}>
                  {copied ? 'Copied!' : 'Copy Text'}
                </span>
              </button>

              {/* Regenerate */}
              <button
                onClick={handleGeneratePost}
                disabled={isGenerating}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ffffff] hover:bg-[#f2f3ff] text-[#131b2e] font-['DM_Sans'] text-[13px] font-semibold shadow-sm border border-[#c2c6d2]/30 transition-all cursor-pointer disabled:opacity-60"
                type="button"
              >
                <span
                  className={`material-symbols-outlined text-[18px] text-[#515f74] ${
                    isGenerating ? 'animate-spin' : ''
                  }`}
                >
                  refresh
                </span>
                <span>Regenerate</span>
              </button>
            </div>

            {/* Open in LinkedIn Primary CTA */}
            <button
              onClick={handleOpenLinkedIn}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] font-['DM_Sans'] text-[13px] font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
              type="button"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
              </svg>
              <span>Open LinkedIn</span>
              <span className="material-symbols-outlined text-[16px]">north_east</span>
            </button>
          </div>

          {/* Viral Performance Predictor Strip */}
          <div className="p-4 rounded-2xl bg-[#d5e3fc]/40 border border-[#c2c6d2]/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#d5e3fc] flex items-center justify-center text-[#003f74]">
                <span className="material-symbols-outlined text-[20px]">trending_up</span>
              </div>
              <div>
                <div className="font-['Manrope'] text-[14px] font-bold text-[#131b2e]">
                  Predicted Reach Index: {viralScore} / 100
                </div>
                <div className="font-['DM_Sans'] text-[12px] text-[#424751]">
                  {reachReasoning}
                </div>
              </div>
            </div>

            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-[#ffffff] font-['DM_Sans'] text-[11px] font-bold text-[#003f74] shadow-2xs border border-[#c2c6d2]/20">
              High Viral Score
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
