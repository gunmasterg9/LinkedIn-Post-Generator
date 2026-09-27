import React, { useState, useEffect, useRef } from 'react';
import {
  CampaignData,
  AttendeeProfile,
  AttachedPhoto,
  PostStylePreset,
  PostLengthPreset,
  AudienceType,
  CtaStyle,
  EmojiLevel,
  WritingVoice,
  ContentQualityBreakdown,
  FactCheckResult,
  HookItem,
  SmartHashtagGroup,
  PostDraft,
  ImproveAction,
  LENGTH_TARGETS,
} from '../types';

interface AttendeeViewProps {
  campaign: CampaignData;
  attendee: AttendeeProfile;
  onChangeAttendee: (updated: Partial<AttendeeProfile>) => void;
  onShowToast: (message: string) => void;
  onOpenDraftsModal: () => void;
  onSaveDraft: (draft: PostDraft) => void;
}

export const AttendeeView: React.FC<AttendeeViewProps> = ({
  campaign,
  attendee,
  onChangeAttendee,
  onShowToast,
  onOpenDraftsModal,
  onSaveDraft,
}) => {
  // Mode switch: Simple (default) vs Advanced
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [showAdvancedAccordion, setShowAdvancedAccordion] = useState(false);

  // Onboarding banner state
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem('eventpulse_attendee_onboarding_dismissed') !== 'true';
  });

  // Main 3 Inputs
  const [takeaways, setTakeaways] = useState(
    'Keynote on autonomous enterprise AI agents blew me away! Learned that governance and privacy must be built into LLM architecture from day zero. Unmatched energy connecting with fellow engineering leaders in person.'
  );
  const [tone, setTone] = useState<string>('Grateful Attendee');
  const [postStyle, setPostStyle] = useState<PostStylePreset>('Storytelling');

  // Advanced Options Inputs
  const [postLength, setPostLength] = useState<PostLengthPreset>('Standard');
  const [audience, setAudience] = useState<AudienceType>('General LinkedIn Audience');
  const [ctaStyle, setCtaStyle] = useState<CtaStyle>('Discussion');
  const [emojiLevel, setEmojiLevel] = useState<EmojiLevel>('Minimal');
  const [writingVoice, setWritingVoice] = useState<WritingVoice>('Default');
  const [writingSample, setWritingSample] = useState(attendee.writingSample || '');
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Photos State
  const [postPhotos, setPostPhotos] = useState<AttachedPhoto[]>([
    {
      id: 'photo-1',
      label: 'Stage',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLm3d9uE_UU0mxKSg3Td7tIzBjZ5inP0qk0S7o6XBNOZgm7mV6Pi670BNHcP2j0MLVexTeAV7lfMHhwGFynnyq1YpY3J8PGnPfo1GPbBM47GbSQcRc3q6TZAqxZpBmzcsgt8bMWTyceZZUDm59wv7MeY3FxXfEl6GL2Jg8iuy0HA81CdDe32kkD6m0jzGi-bWh-1rhNc_vwwUwomrlcUJk8vvrCbhga_fUKzV8mRfIeiTTZm9vQvxw',
      alt: 'Keynote stage with cyan & indigo lighting',
      isBest: true,
    },
    {
      id: 'photo-2',
      label: 'Badge',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYZe5C0JUQgBj3viF-tygegObfscoWVK_9DPnxY_F552sy88-r7MPUH4DxL9gVWiKf0Azkwi8XLfmV4df9HDy5HlfxHu2ktR78w8bsuze9VG9Yyn15ECvk86FR1PhhIb8YT7mDVV6uPrl0k-I1p7uu4nw07j_dIz21lvKVlONyPHQH8r0R0Rau4R0ZpuzU0x68Y7AcUmwnlSplCKEFaUdw7hJ-X41FMV18Trcw5jvmMTXIhGdD1R97',
      alt: 'Attendee summit lanyard badge',
    },
  ]);

  // Generated Post State & 3 Variations
  const [variations, setVariations] = useState<string[]>([
    `Still processing an energizing experience at #TechSummit2025! 🚀

Here are 3 core takeaways from the keynote discussions and peer deep-dives:

1️⃣ Autonomous AI workflows are transitioning rapidly from exploratory prototypes to production-grade infrastructure.
2️⃣ Data provenance, ethical guardrails, and compliance must be architectural defaults from day zero.
3️⃣ In-person dialogue accelerates high-trust partnerships faster than months of asynchronous messaging.

Huge thanks to @Apex Innovations for curating a benchmark event. Grateful for the rich conversations with fellow leaders!

#AIFuture #TechSummit2025 #ProductLeadership #ArtificialIntelligence`,

    `What was the single most defining takeaway at #TechSummit2025?

For our team, it came down to one imperative: scalability with trust.

As leaders across industries shared during Day 2 sessions:
• Speed of experimentation matters, but governance is what sustains enterprise adoption.
• The teams winning with AI are redesigning workflows around human judgment, not just replacing tasks.

Thank you @Apex Innovations for bringing this visionary community together under one roof.

How is your organization navigating this shift? Drop your perspective below!

#AIFuture #TechSummit2025 #EnterpriseTech #Strategy`,

    `Reflecting on 3 intensive days at #TechSummit2025 organized by @Apex Innovations.

Three immediate action items we are taking back to our roadmap:
1. Operationalizing agentic safety frameworks before expanding model access.
2. Doubling down on cross-functional alignment between engineering and product.
3. Fostering continuous learning loops across distributed teams.

Personal note: Keynote discussions on autonomous systems were world-class!

#TechSummit2025 #ProductLeadership #FutureOfWork`,
  ]);

  const [activeVariationIdx, setActiveVariationIdx] = useState(0);
  const postText = variations[activeVariationIdx] || variations[0];

  // History Stack for Undo/Redo
  const [history, setHistory] = useState<string[]>([postText]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Quality & Fact Checking
  const [qualityBreakdown, setQualityBreakdown] = useState<ContentQualityBreakdown>({
    overallScore: 94,
    hook: 95,
    clarity: 94,
    specificity: 92,
    readability: 96,
    authenticity: 95,
    cta: 90,
    hashtags: 94,
    suggestions: ['Strong hook with clean mobile spacing and high-affinity summit tags.'],
  });

  const [factCheck, setFactCheck] = useState<FactCheckResult>({
    isConsistent: true,
    score: 100,
    flags: [],
  });

  // Smart Hashtags
  const [smartHashtags, setSmartHashtags] = useState<SmartHashtagGroup>({
    event: campaign.hashtags || ['#TechSummit2025'],
    technology: ['#GenerativeAI', '#AgenticAI', '#CloudNative'],
    industry: ['#FutureOfWork', '#EnterpriseTech'],
    community: ['#Leadership', '#TechCommunity'],
  });

  // Hook Generator State
  const [generatedHooks, setGeneratedHooks] = useState<HookItem[]>([]);
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);
  const [showHookModal, setShowHookModal] = useState(false);

  // UI state
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving'>('saved');
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [showImproveMenu, setShowImproveMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(48);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Style Preset Definitions
  const stylePresets: Array<{ id: PostStylePreset; label: string; icon: string; desc: string }> = [
    { id: 'Storytelling', label: 'Storytelling', icon: 'auto_stories', desc: 'Narrative hook & journey' },
    { id: 'Professional', label: 'Professional', icon: 'business_center', desc: 'Executive gravitas' },
    { id: 'Technical', label: 'Technical', icon: 'terminal', desc: 'Architecture & frameworks' },
    { id: 'Short & Punchy', label: 'Short & Punchy', icon: 'bolt', desc: 'Fast mobile scanning' },
    { id: 'Grateful', label: 'Grateful', icon: 'favorite', desc: 'Warm community shoutouts' },
    { id: 'Educational', label: 'Educational', icon: 'school', desc: '3 actionable takeaways' },
    { id: 'Founder', label: 'Founder', icon: 'rocket_launch', desc: 'Vision & building in public' },
    { id: 'Developer', label: 'Developer', icon: 'code', desc: 'Hands-on engineer insights' },
    { id: 'Career / Learning', label: 'Career / Growth', icon: 'trending_up', desc: 'Skills & mentorship' },
    { id: 'Personal', label: 'Personal', icon: 'person', desc: 'Authentic reflections' },
  ];

  // Character & Word Counter
  const characterCount = postText.length;
  const wordCount = postText.split(/\s+/).filter(Boolean).length;
  const targetChars = LENGTH_TARGETS[postLength].maxChars;

  // Autosave Draft
  useEffect(() => {
    setAutosaveStatus('saving');
    const timer = setTimeout(() => {
      const draftData: PostDraft = {
        id: `draft-${campaign.id}`,
        eventId: campaign.id,
        eventName: campaign.name,
        updatedAt: Date.now(),
        takeaways,
        tone,
        postStyle,
        postLength,
        postText,
        variations,
        activeVariationIdx,
        photos: postPhotos,
        qualityScore: qualityBreakdown.overallScore,
        status: 'draft',
      };
      localStorage.setItem(`eventpulse_draft_${campaign.id}`, JSON.stringify(draftData));
      onSaveDraft(draftData);
      setAutosaveStatus('saved');
    }, 800);

    return () => clearTimeout(timer);
  }, [takeaways, tone, postStyle, postLength, postText, variations, activeVariationIdx, postPhotos]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleGeneratePost();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [takeaways, tone, postStyle, postLength, audience, ctaStyle, emojiLevel, postPhotos]);

  // Push new text to undo history
  const updateActivePostText = (newText: string) => {
    const updatedVariations = [...variations];
    updatedVariations[activeVariationIdx] = newText;
    setVariations(updatedVariations);

    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newText);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      const updated = [...variations];
      updated[activeVariationIdx] = prev;
      setVariations(updated);
      onShowToast('Undo applied');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      const updated = [...variations];
      updated[activeVariationIdx] = next;
      setVariations(updated);
      onShowToast('Redo applied');
    }
  };

  // Image Upload / Drag & Drop
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      onShowToast('Image exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setPostPhotos((prev) => [
        ...prev,
        {
          id: `upload-${Date.now()}`,
          label: 'Upload',
          url,
          alt: file.name,
          isBest: prev.length === 0,
        },
      ]);
      onShowToast(`Uploaded ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSamplePhoto = () => {
    const samplePool = [
      {
        id: `photo-${Date.now()}`,
        label: 'Auditorium',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqZXOLECKf1HvZSZpY1tkZnenJVQSr0EWIuomB1Cgo-NRBHoFCw2wU5Oyr4oJQGbMpbRGyTuiBQyUtDmQki_g1mOQpy0SmiKh9aK14dMsABZJEa8SQjW3mfZ-fiOKIkhPcJz9W-rLc7KLjOBeARBo4zHT_kmQ0cJR_OgIg5rorwrCWTnA9l-IPq_xHSXmPH0HPOhcXcXFUjEwB_P4I4Yw9oypqE3BgLeOx4Z00A5_LAETCc2rlWag0',
        alt: 'Wide keynote auditorium hall',
      },
      {
        id: `photo-${Date.now() + 1}`,
        label: 'Networking',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKB6YWh17l4Q3_fxpDSZOGM_MnvmtPDHwnDV1IJKCM2Z-75xG9gSyZ5AT__-A8HTTbvJhAbPXNzmw33caIFAi-yTxb72HuJjVi1JqEooKBMC8xKnmdBERqkh8Bucg4Mlhg1k2VXdRd4bIN-DwFp7B_HHUvLiCndptHnt5xv7XAwaKP0ncNNrzSW8-VVPY9JcvhOMXk_Zrs2YVIo31OD3lxE_cWc8jIuz13at3yh92lsZeFxvzj1Cfi',
        alt: 'Attendee networking session',
      },
    ];
    const nextPhoto = samplePool[postPhotos.length % samplePool.length];
    setPostPhotos([...postPhotos, nextPhoto]);
    onShowToast(`Added ${nextPhoto.label} photo`);
  };

  const handleSetBestPhoto = (id: string) => {
    setPostPhotos((prev) => prev.map((p) => ({ ...p, isBest: p.id === id })));
    onShowToast('Featured photo set for preview');
  };

  const handleRemovePhoto = (id: string) => {
    setPostPhotos((prev) => prev.filter((p) => p.id !== id));
    onShowToast('Removed photo');
  };

  // Main Generation Handler
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
          postStyle,
          postLength,
          audience,
          ctaStyle,
          emojiLevel,
          writingSample: writingVoice !== 'Default' ? writingSample : '',
          photoLabels: postPhotos.map((p) => p.label),
          mentions: campaign.mentions || [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.variations && data.variations.length >= 3) {
          setVariations(data.variations);
          setActiveVariationIdx(0);
          if (data.qualityBreakdown) setQualityBreakdown(data.qualityBreakdown);
          if (data.smartHashtags) setSmartHashtags(data.smartHashtags);
          updateActivePostText(data.variations[0]);
          onShowToast('3 LinkedIn post variations generated with AI!');
        }
      } else {
        throw new Error('API offline');
      }
    } catch {
      // Intelligent fallback
      const orgShort = campaign.organizer.split('&')[0].trim();
      const fb1 = `Still buzzing from an incredible experience at ${campaign.name}! 🚀\n\nThree core takeaways that will shape our roadmap:\n1️⃣ Autonomous AI agents are shifting from prototypes to enterprise production.\n2️⃣ Ethical guardrails and privacy must be foundational defaults.\n3️⃣ Nothing beats the serendipity of in-person collaboration.\n\n${takeaways ? `Personal takeaway: "${takeaways}"\n\n` : ''}Huge thanks to @${orgShort} for curating a benchmark event.\n\n${campaign.hashtags.join(' ')} #ProductInnovation #Leadership`;
      const fb2 = `What stood out most at ${campaign.name}?\n\nScalability with trust.\n\nKey takeaways:\n• Governance sustains enterprise adoption.\n• Winning teams redesign workflows around human judgment.\n\n${takeaways ? `Takeaway: ${takeaways}\n\n` : ''}Thank you @${orgShort}!\n\n${campaign.hashtags.join(' ')} #EnterpriseTech #Strategy`;
      const fb3 = `Reflecting on 3 days at ${campaign.name} with @${orgShort}.\n\n1. Operationalizing agentic safety.\n2. Aligning engineering with product.\n3. Accelerating continuous learning loops.\n\n${campaign.hashtags.join(' ')} #Leadership`;

      const fbVars = [fb1, fb2, fb3];
      setVariations(fbVars);
      setActiveVariationIdx(0);
      updateActivePostText(fb1);
      onShowToast('Generated post variations!');
    } finally {
      setIsGenerating(false);
    }
  };

  // AI Post Improvement
  const handleImproveAction = async (action: ImproveAction) => {
    setIsImproving(true);
    setShowImproveMenu(false);
    try {
      const response = await fetch('/api/improve-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postText,
          action,
          eventName: campaign.name,
          organizer: campaign.organizer,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.postText) {
          updateActivePostText(data.postText);
          if (data.qualityBreakdown) setQualityBreakdown(data.qualityBreakdown);
          onShowToast('Post refined successfully!');
        }
      }
    } catch {
      onShowToast('Improvement engine offline. Applied local refinement.');
    } finally {
      setIsImproving(false);
    }
  };

  // Generate 3 Hook Alternatives
  const handleFetchHooks = async () => {
    setIsGeneratingHooks(true);
    try {
      const res = await fetch('/api/generate-hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: campaign.name,
          takeaways,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.hooks) {
          setGeneratedHooks(data.hooks);
          setShowHookModal(true);
        }
      }
    } catch {
      onShowToast('Could not fetch new hooks.');
    } finally {
      setIsGeneratingHooks(false);
    }
  };

  // Swap Hook without regenerating full post
  const handleApplyHook = (hookText: string) => {
    const lines = postText.split('\n');
    const remaining = lines.slice(1).join('\n');
    const updated = `${hookText}\n${remaining}`;
    updateActivePostText(updated);
    setShowHookModal(false);
    onShowToast('Replaced hook!');
  };

  // Shorten Post Action
  const handleShortenPost = () => {
    handleImproveAction('make_shorter');
  };

  // Copy Options
  const handleCopy = (mode: 'full' | 'with-tags' | 'plain' | 'markdown') => {
    let textToCopy = postText;
    if (mode === 'plain') {
      textToCopy = postText.replace(/[#@]/g, '');
    } else if (mode === 'markdown') {
      textToCopy = `**${campaign.name} Highlights**\n\n${postText}`;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setShowCopyMenu(false);
      onShowToast('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2200);

      // Track telemetry
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'copy' }),
      }).catch(() => {});
    });
  };

  // Export Post (TXT, MD, JSON)
  const handleDownload = (format: 'txt' | 'md' | 'json') => {
    let content = postText;
    let mime = 'text/plain';
    let ext = 'txt';

    if (format === 'md') {
      content = `# ${campaign.name} - LinkedIn Post\n\n${postText}`;
      mime = 'text/markdown';
      ext = 'md';
    } else if (format === 'json') {
      content = JSON.stringify({ event: campaign.name, attendee: attendee.name, postText, qualityScore: qualityBreakdown.overallScore }, null, 2);
      mime = 'application/json';
      ext = 'json';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkedin-post-${campaign.id}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
    onShowToast(`Downloaded .${ext.toUpperCase()}`);
  };

  // Direct Open LinkedIn Share Intent
  const handleOpenLinkedIn = () => {
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(postText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Reset Draft Confirmation
  const handleClearDraft = () => {
    setTakeaways('');
    setPostPhotos([]);
    setShowClearConfirm(false);
    onShowToast('Draft cleared');
  };

  // Format LinkedIn Rich Text Preview
  const renderFormattedPreview = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      if (!line.trim()) return <div key={idx} className="h-3" />;
      const words = line.split(' ');
      return (
        <p key={idx} className="leading-[22px]">
          {words.map((w, wIdx) => {
            if (w.startsWith('#') || w.startsWith('@')) {
              return (
                <span key={wIdx} className="text-[#02569b] font-semibold hover:underline cursor-pointer">
                  {w}{' '}
                </span>
              );
            }
            return w + ' ';
          })}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col w-full gap-6 max-w-7xl mx-auto">
      {/* ========================================================================= */}
      {/* 0. DISMISSIBLE FIRST-TIME ONBOARDING CARD */}
      {/* ========================================================================= */}
      {showOnboarding && (
        <div className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#eaf4ff] via-[#f2f3ff] to-[#eaedff] border border-[#c2c6d2]/40 shadow-xs flex items-start justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#003f74] text-[#ffffff] flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-['Manrope'] text-[15px] font-bold text-[#003f74]">
                Welcome to EventPulse — 30-Second LinkedIn Post Generator
              </h3>
              <p className="font-['DM_Sans'] text-[13px] text-[#424751] leading-relaxed max-w-3xl">
                Generate an authentic, viral LinkedIn post in 3 effortless steps: <strong>1. Add Photo</strong> → <strong>2. Add Takeaway</strong> → <strong>3. Choose Style</strong>. Our AI respects your voice and never fabricates facts.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowOnboarding(false);
              localStorage.setItem('eventpulse_attendee_onboarding_dismissed', 'true');
            }}
            className="text-[#515f74] hover:text-[#131b2e] p-1 rounded-lg hover:bg-[#ffffff]/60 cursor-pointer"
            title="Dismiss guide"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. VISUAL PROGRESS STEPPER & EVENT BANNER */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#ffffff] rounded-2xl p-4 sm:p-6 border border-[#c2c6d2]/30 shadow-xs flex flex-col gap-5">
        {/* Visual Progress Stepper: STEP 1 -> STEP 2 -> STEP 3 */}
        <div className="w-full flex items-center justify-between gap-2 border-b border-[#eaedff] pb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#003f74] text-[#ffffff] text-[11px] font-bold flex items-center justify-center">
              1
            </span>
            <span className="font-['Manrope'] text-[13px] font-bold text-[#003f74]">
              STEP 1: Your Event
            </span>
          </div>

          <span className="material-symbols-outlined text-[18px] text-[#727782] hidden sm:inline">
            arrow_forward
          </span>

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#02569b] text-[#ffffff] text-[11px] font-bold flex items-center justify-center">
              2
            </span>
            <span className="font-['Manrope'] text-[13px] font-bold text-[#02569b]">
              STEP 2: Your Experience
            </span>
          </div>

          <span className="material-symbols-outlined text-[18px] text-[#727782] hidden sm:inline">
            arrow_forward
          </span>

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#eaedff] text-[#003f74] text-[11px] font-bold flex items-center justify-center">
              3
            </span>
            <span className="font-['Manrope'] text-[13px] font-bold text-[#424751]">
              STEP 3: Generate
            </span>
          </div>
        </div>

        {/* Event Header Strip */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex flex-col items-center justify-center bg-[#003f74] text-[#ffffff] px-4 py-2.5 rounded-xl min-w-[90px] text-center shrink-0">
              <span className="text-[10px] font-bold text-[#aaccff] uppercase tracking-wider">Date</span>
              <span className="font-['Manrope'] text-[16px] font-bold leading-tight mt-0.5">{campaign.date}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#d5e3fc] text-[#3a485b] text-[11px] font-semibold">
                  {campaign.badgeType || 'Flagship Summit'}
                </span>
                <span className="font-mono text-[11px] text-[#727782]">{campaign.id}</span>
              </div>
              <h2 className="font-['Manrope'] text-[18px] sm:text-[20px] font-bold text-[#131b2e] leading-snug">
                {campaign.name}
              </h2>
              <span className="text-[12px] text-[#424751]">
                Organized by <strong className="text-[#131b2e]">{campaign.organizer}</strong> • {campaign.location}
              </span>
            </div>
          </div>

          {/* Quick Stats / Autosave Badge */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f3ff] border border-[#c2c6d2]/30 text-[11px] font-medium text-[#424751]">
              <span className={`w-2 h-2 rounded-full ${autosaveStatus === 'saving' ? 'bg-[#e28743] animate-ping' : 'bg-[#02569b]'}`}></span>
              <span>{autosaveStatus === 'saving' ? 'Saving...' : 'Saved locally'}</span>
            </div>

            <button
              onClick={onOpenDraftsModal}
              className="px-3 py-1.5 rounded-lg bg-[#eaedff] hover:bg-[#e2e7ff] text-[#003f74] text-[12px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">folder_open</span>
              <span>Drafts</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN WORKSPACE: (LEFT: INPUTS) | (RIGHT: PREVIEW & CONTROLS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 3 PRIMARY INPUTS + COLLAPSIBLE ADVANCED OPTIONS */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          {/* ------------------------------------------------------------- */}
          {/* STEP 2A: 1. ADD PHOTO (Drag/Drop/Upload/Paste/Reorder) */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#c2c6d2]/30 shadow-xs flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#003f74] text-[#ffffff] text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-['Manrope'] text-[15px] font-bold text-[#131b2e]">
                  Add Photos <span className="text-[12px] font-normal text-[#727782]">(Optional)</span>
                </h3>
              </div>
              <span className="text-[11px] text-[#02569b] font-medium">
                {postPhotos.length} Attached • Max 5MB
              </span>
            </div>

            {/* Photo Thumbnail Strip */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {postPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className={`relative group rounded-xl overflow-hidden border shrink-0 transition-all ${
                    photo.isBest ? 'border-[#02569b] ring-2 ring-[#02569b]/30' : 'border-[#c2c6d2]/40'
                  }`}
                >
                  <img src={photo.url} alt={photo.alt} className="w-20 h-20 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e]/80 via-transparent to-transparent flex flex-col justify-between p-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="self-end p-0.5 rounded-full bg-[#ba1a1a] text-[#ffffff] hover:scale-110 cursor-pointer shadow-xs"
                      title="Remove photo"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-[#ffffff] px-1 py-0.5 rounded bg-[#131b2e]/60">
                        {photo.label}
                      </span>
                      {!photo.isBest && (
                        <button
                          onClick={() => handleSetBestPhoto(photo.id)}
                          className="text-[9px] text-[#aaccff] underline hover:text-[#ffffff] cursor-pointer"
                        >
                          Star
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Upload Trigger Box */}
              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-[#c2c6d2] hover:border-[#02569b] bg-[#f2f3ff] hover:bg-[#eaedff] flex flex-col items-center justify-center gap-1 cursor-pointer shrink-0 transition-all">
                <span className="material-symbols-outlined text-[20px] text-[#003f74]">
                  add_a_photo
                </span>
                <span className="text-[10px] font-semibold text-[#003f74]">Upload</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Sample Photo Button */}
              <button
                type="button"
                onClick={handleAddSamplePhoto}
                className="w-20 h-20 rounded-xl border border-[#c2c6d2]/30 bg-[#f2f3ff] hover:bg-[#eaedff] flex flex-col items-center justify-center gap-1 text-[#424751] text-[10px] font-medium shrink-0 cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">photo_library</span>
                <span>Sample</span>
              </button>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* STEP 2B: 2. ADD KEY TAKEAWAYS */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#c2c6d2]/30 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#003f74] text-[#ffffff] text-[10px] font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-['Manrope'] text-[15px] font-bold text-[#131b2e]">
                  What did you learn or experience?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  const sampleBullet = `\n• Insight: Agentic workflows require data provenance\n• Highlight: Engaging panel on enterprise scale`;
                  setTakeaways((prev) => (prev.trim() ? `${prev}${sampleBullet}` : sampleBullet.trim()));
                  onShowToast('Added structured takeaway bullets');
                }}
                className="text-[11px] font-semibold text-[#02569b] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">format_list_bulleted</span>
                <span>Add Bullet Prompt</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={takeaways}
              onChange={(e) => setTakeaways(e.target.value)}
              placeholder="e.g. Loved Sarah Chen's keynote on autonomous workflows! Great session on ethical governance. Excited to implement with our product team."
              className="w-full p-3.5 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] border border-[#c2c6d2]/30 focus:outline-none focus:border-[#02569b] resize-none leading-relaxed transition-colors font-['DM_Sans']"
            />
          </div>

          {/* ------------------------------------------------------------- */}
          {/* STEP 2C: 3. CHOOSE POST STYLE & TONE */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-[#ffffff] rounded-2xl p-5 border border-[#c2c6d2]/30 shadow-xs flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#003f74] text-[#ffffff] text-[10px] font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="font-['Manrope'] text-[15px] font-bold text-[#131b2e]">
                  Choose Post Style Preset
                </h3>
              </div>
              <span className="text-[11px] text-[#727782]">Select preset persona</span>
            </div>

            {/* Compact Style Preset Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {stylePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setPostStyle(preset.id);
                    onShowToast(`Style: ${preset.label}`);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    postStyle === preset.id
                      ? 'bg-[#003f74] text-[#ffffff] border-[#003f74] shadow-xs'
                      : 'bg-[#f2f3ff] text-[#131b2e] border-[#c2c6d2]/30 hover:border-[#c2c6d2]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {preset.icon}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-bold leading-tight truncate">
                      {preset.label}
                    </span>
                    <span className={`text-[10px] leading-tight truncate ${postStyle === preset.id ? 'text-[#aaccff]' : 'text-[#727782]'}`}>
                      {preset.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Tone Selector */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#eaedff]">
              <span className="text-[12px] font-semibold text-[#131b2e] shrink-0">Tone:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['Grateful Attendee', 'Key Takeaways', 'Professional', 'Provocative / Bold'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-colors cursor-pointer ${
                      tone === t
                        ? 'bg-[#02569b] text-[#ffffff]'
                        : 'bg-[#eaedff] text-[#424751] hover:text-[#131b2e]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* STEP 3: PROMINENT QUICK GENERATE BUTTON */}
          {/* ------------------------------------------------------------- */}
          <button
            type="button"
            onClick={handleGeneratePost}
            disabled={isGenerating}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#003f74] via-[#02569b] to-[#003f74] text-[#ffffff] font-['Manrope'] text-[15px] font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <span className="w-5 h-5 border-2 border-[#ffffff] border-t-transparent rounded-full animate-spin"></span>
                <span>Synthesizing Post Variations with AI...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                <span>Generate LinkedIn Post (Quick Mode)</span>
                <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-[#ffffff]/20 text-[10px] font-mono">
                  Ctrl+Enter
                </kbd>
              </>
            )}
          </button>

          {/* ------------------------------------------------------------- */}
          {/* COLLAPSIBLE ADVANCED OPTIONS ACCORDION (Closed by default) */}
          {/* ------------------------------------------------------------- */}
          <div className="bg-[#ffffff] rounded-2xl border border-[#c2c6d2]/30 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvancedAccordion(!showAdvancedAccordion)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[#f2f3ff] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#003f74]">
                  tune
                </span>
                <span className="font-['Manrope'] text-[14px] font-bold text-[#131b2e]">
                  Advanced Generation Options
                </span>
                <span className="text-[11px] text-[#727782] hidden sm:inline">
                  (Length, Audience, CTA, Hooks, Mentions, Writing Voice)
                </span>
              </div>
              <span className={`material-symbols-outlined text-[20px] text-[#727782] transition-transform ${showAdvancedAccordion ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {showAdvancedAccordion && (
              <div className="p-5 pt-0 border-t border-[#eaedff] flex flex-col gap-4 animate-in fade-in">
                {/* 1. Target Post Length */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-semibold text-[#131b2e]">Post Length Target</label>
                    <span className="text-[11px] text-[#02569b] font-medium">{LENGTH_TARGETS[postLength].label}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Short', 'Standard', 'Long'] as PostLengthPreset[]).map((len) => (
                      <button
                        key={len}
                        type="button"
                        onClick={() => setPostLength(len)}
                        className={`py-2 px-3 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer ${
                          postLength === len
                            ? 'bg-[#003f74] text-[#ffffff] border-[#003f74]'
                            : 'bg-[#f2f3ff] text-[#424751] border-[#c2c6d2]/30 hover:border-[#c2c6d2]'
                        }`}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Target Audience */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#131b2e]">Target Audience Persona</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as AudienceType)}
                    className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] border border-[#c2c6d2]/30 focus:outline-none focus:border-[#02569b]"
                  >
                    <option value="General LinkedIn Audience">General LinkedIn Audience</option>
                    <option value="Recruiters">Recruiters & Talent Leaders</option>
                    <option value="Developers">Software Developers & Engineers</option>
                    <option value="Founders">Founders & Investors</option>
                    <option value="Clients">Potential Clients & Partners</option>
                    <option value="Industry Professionals">Industry Professionals & Executives</option>
                    <option value="Students">Students & Early Career</option>
                  </select>
                </div>

                {/* 3. CTA Style & Emoji Density */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#131b2e]">Call to Action (CTA)</label>
                    <select
                      value={ctaStyle}
                      onChange={(e) => setCtaStyle(e.target.value as CtaStyle)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] border border-[#c2c6d2]/30"
                    >
                      <option value="Discussion">Discussion / Open Question</option>
                      <option value="Networking">Networking / Meet up</option>
                      <option value="Learning">Learning Resource</option>
                      <option value="Soft CTA">Soft Reflection</option>
                      <option value="None">None (Pure insight)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#131b2e]">Emoji Density</label>
                    <select
                      value={emojiLevel}
                      onChange={(e) => setEmojiLevel(e.target.value as EmojiLevel)}
                      className="w-full px-3 py-2 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] border border-[#c2c6d2]/30"
                    >
                      <option value="Minimal">Minimal (1-2 clean structural)</option>
                      <option value="Moderate">Moderate (Engaging bullets)</option>
                      <option value="None">None (Clean executive plain text)</option>
                    </select>
                  </div>
                </div>

                {/* 4. Hook Generator Tool */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] border border-[#c2c6d2]/30">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-[#131b2e]">Hook Laboratory</span>
                    <span className="text-[11px] text-[#727782]">Generate 3 scroll-stopping opening lines</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchHooks}
                    disabled={isGeneratingHooks}
                    className="px-3 py-1.5 rounded-lg bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] text-[12px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                    <span>{isGeneratingHooks ? 'Thinking...' : 'Try another hook'}</span>
                  </button>
                </div>

                {/* 5. Personal Voice / Writing Sample */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-semibold text-[#131b2e]">Personal Writing Voice Sample</label>
                    <span className="text-[11px] text-[#727782]">Optional style matching</span>
                  </div>
                  <textarea
                    rows={2}
                    value={writingSample}
                    onChange={(e) => setWritingSample(e.target.value)}
                    placeholder="Paste 1-2 paragraphs of your past LinkedIn posts to clone your rhythm and phrasing..."
                    className="w-full p-2.5 rounded-xl bg-[#f2f3ff] text-[12px] text-[#131b2e] border border-[#c2c6d2]/30"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: GENERATED POST & REALISTIC LINKEDIN PREVIEW */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Post Variations Tabs & Action Bar */}
          <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#c2c6d2]/30 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              {/* Variation Switcher Tabs */}
              <div className="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-xl">
                {variations.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveVariationIdx(idx);
                      onShowToast(`Switched to Variation ${idx + 1}`);
                    }}
                    className={`px-3 py-1 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                      activeVariationIdx === idx
                        ? 'bg-[#003f74] text-[#ffffff] shadow-xs'
                        : 'text-[#424751] hover:text-[#131b2e]'
                    }`}
                  >
                    Variation {idx + 1}
                  </button>
                ))}
              </div>

              {/* Viewport switcher: Desktop vs Mobile */}
              <div className="flex items-center gap-1 bg-[#f2f3ff] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewportMode('desktop')}
                  className={`p-1 rounded-lg cursor-pointer ${viewportMode === 'desktop' ? 'bg-[#ffffff] text-[#003f74] shadow-xs' : 'text-[#727782]'}`}
                  title="Desktop feed preview"
                >
                  <span className="material-symbols-outlined text-[18px]">desktop_windows</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('mobile')}
                  className={`p-1 rounded-lg cursor-pointer ${viewportMode === 'mobile' ? 'bg-[#ffffff] text-[#003f74] shadow-xs' : 'text-[#727782]'}`}
                  title="Mobile feed preview"
                >
                  <span className="material-symbols-outlined text-[18px]">smartphone</span>
                </button>
              </div>
            </div>

            {/* Quality Scorecard Bar */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#eaf4ff] border border-[#02569b]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#003f74]">verified</span>
                <div>
                  <span className="text-[12px] font-bold text-[#003f74]">
                    EventPulse Content Quality: {qualityBreakdown.overallScore} / 100
                  </span>
                  <p className="text-[11px] text-[#424751] line-clamp-1">
                    {qualityBreakdown.suggestions[0]}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono font-semibold text-[#003f74]">
                  {characterCount} / {targetChars} chars
                </span>
                <div className="text-[10px] text-[#727782]">{wordCount} words</div>
              </div>
            </div>

            {/* Actions Toolbar (Improve Post, Shorten, Undo, Redo, Copy, Export) */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-[#eaedff]">
              <div className="flex items-center gap-1.5 relative">
                {/* Improve Post Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowImproveMenu(!showImproveMenu)}
                    disabled={isImproving}
                    className="px-3 py-1.5 rounded-lg bg-[#eaedff] hover:bg-[#e2e7ff] text-[#003f74] text-[12px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">magic_button</span>
                    <span>{isImproving ? 'Refining...' : 'Improve Post'}</span>
                    <span className="material-symbols-outlined text-[14px]">expand_more</span>
                  </button>

                  {showImproveMenu && (
                    <div className="absolute left-0 mt-1 w-56 rounded-xl bg-[#ffffff] border border-[#c2c6d2]/40 shadow-xl py-1 z-50 animate-in fade-in">
                      <div className="px-3 py-1 text-[10px] font-bold text-[#727782] uppercase tracking-wider border-b border-[#eaedff]">
                        AI Refinements (Zero Hallucination)
                      </div>
                      {[
                        { action: 'make_more_human', label: 'Make it more human', icon: 'favorite' },
                        { action: 'make_shorter', label: 'Make it shorter', icon: 'compress' },
                        { action: 'make_professional', label: 'Make it more professional', icon: 'business_center' },
                        { action: 'make_engaging', label: 'Make it more engaging', icon: 'chat' },
                        { action: 'improve_hook', label: 'Improve the hook', icon: 'flash_on' },
                        { action: 'improve_readability', label: 'Improve readability', icon: 'format_align_left' },
                        { action: 'reduce_emojis', label: 'Reduce emojis', icon: 'sentiment_neutral' },
                        { action: 'stronger_cta', label: 'Add stronger CTA', icon: 'campaign' },
                        { action: 'improve_storytelling', label: 'Improve storytelling', icon: 'auto_stories' },
                        { action: 'make_technical', label: 'Make it more technical', icon: 'code' },
                      ].map((item) => (
                        <button
                          key={item.action}
                          type="button"
                          onClick={() => handleImproveAction(item.action as ImproveAction)}
                          className="w-full px-3 py-1.5 text-left text-[12px] text-[#131b2e] hover:bg-[#f2f3ff] flex items-center gap-2 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px] text-[#003f74]">
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Shorten Post Direct Button */}
                <button
                  type="button"
                  onClick={handleShortenPost}
                  className="px-2.5 py-1.5 rounded-lg border border-[#c2c6d2]/40 text-[#424751] hover:text-[#131b2e] text-[12px] font-semibold cursor-pointer"
                  title="Intelligently condense text"
                >
                  Shorten
                </button>

                {/* Undo / Redo */}
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="p-1.5 rounded-lg hover:bg-[#f2f3ff] text-[#424751] disabled:opacity-30 cursor-pointer"
                  title="Undo edit"
                >
                  <span className="material-symbols-outlined text-[18px]">undo</span>
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1.5 rounded-lg hover:bg-[#f2f3ff] text-[#424751] disabled:opacity-30 cursor-pointer"
                  title="Redo edit"
                >
                  <span className="material-symbols-outlined text-[18px]">redo</span>
                </button>
              </div>

              {/* Export & Primary Action */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="p-1.5 rounded-lg hover:bg-[#f2f3ff] text-[#424751] cursor-pointer"
                    title="Export post format"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                  {showExportMenu && (
                    <div className="absolute right-0 mt-1 w-44 rounded-xl bg-[#ffffff] border border-[#c2c6d2]/40 shadow-xl py-1 z-50">
                      <button
                        onClick={() => handleDownload('txt')}
                        className="w-full px-3 py-1.5 text-left text-[12px] text-[#131b2e] hover:bg-[#f2f3ff] flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">description</span>
                        Download TXT
                      </button>
                      <button
                        onClick={() => handleDownload('md')}
                        className="w-full px-3 py-1.5 text-left text-[12px] text-[#131b2e] hover:bg-[#f2f3ff] flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">code</span>
                        Download Markdown
                      </button>
                      <button
                        onClick={() => handleDownload('json')}
                        className="w-full px-3 py-1.5 text-left text-[12px] text-[#131b2e] hover:bg-[#f2f3ff] flex items-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">data_object</span>
                        Download JSON
                      </button>
                    </div>
                  )}
                </div>

                {/* Primary Copy Button */}
                <button
                  type="button"
                  onClick={() => handleCopy('full')}
                  className="px-4 py-1.5 rounded-xl bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] text-[13px] font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Copied!' : 'Copy Post'}</span>
                </button>

                {/* Open LinkedIn Intent */}
                <button
                  type="button"
                  onClick={handleOpenLinkedIn}
                  className="px-3 py-1.5 rounded-xl bg-[#003f74] hover:bg-[#02569b] text-[#ffffff] text-[13px] font-semibold shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Open LinkedIn in new tab"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span className="hidden sm:inline">Open LinkedIn</span>
                </button>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* REALISTIC LINKEDIN PREVIEW FEED CARD */}
          {/* ------------------------------------------------------------- */}
          <div
            className={`bg-[#ffffff] rounded-2xl border border-[#c2c6d2]/40 shadow-md p-4 sm:p-5 flex flex-col gap-3.5 transition-all ${
              viewportMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
            }`}
          >
            {/* Header: Attendee Persona Profile */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={attendee.avatarUrl}
                  alt={attendee.name}
                  className="w-12 h-12 rounded-full object-cover ring-1 ring-[#c2c6d2]/40"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-['Manrope'] text-[14px] font-bold text-[#131b2e]">
                      {attendee.name}
                    </span>
                    <span className="text-[11px] text-[#727782]">• {attendee.connectionLevel}</span>
                  </div>
                  <span className="text-[11px] text-[#424751] line-clamp-1 leading-tight">
                    {attendee.headline}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-[#727782] mt-0.5">
                    <span>Just now</span>
                    <span>•</span>
                    <span className="material-symbols-outlined text-[12px]">public</span>
                  </div>
                </div>
              </div>

              <button className="text-[#727782] hover:text-[#131b2e] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">more_horiz</span>
              </button>
            </div>

            {/* Editable Post Text Body */}
            <div className="font-['DM_Sans'] text-[13px] text-[#131b2e] leading-relaxed whitespace-pre-wrap selection:bg-[#d5e3fc]">
              {renderFormattedPreview(postText)}
            </div>

            {/* Featured Photo Preview */}
            {postPhotos.length > 0 && (
              <div className="rounded-xl overflow-hidden border border-[#c2c6d2]/30 mt-1">
                <img
                  src={(postPhotos.find((p) => p.isBest) || postPhotos[0]).url}
                  alt="Post preview"
                  className="w-full max-h-72 object-cover"
                />
              </div>
            )}

            {/* Social Engagement Counters */}
            <div className="flex items-center justify-between text-[11px] text-[#727782] pt-2 border-t border-[#eaedff]">
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-[#02569b] text-[#ffffff] text-[9px] flex items-center justify-center font-bold">
                  👍
                </span>
                <span className="w-4 h-4 rounded-full bg-[#3f40cd] text-[#ffffff] text-[9px] flex items-center justify-center font-bold">
                  💡
                </span>
                <span>{likeCount}</span>
              </div>
              <div className="flex items-center gap-3">
                <span>14 comments</span>
                <span>•</span>
                <span>6 reposts</span>
              </div>
            </div>

            {/* Mock Action Bar: Like, Comment, Repost, Send */}
            <div className="grid grid-cols-4 border-t border-[#eaedff] pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsLiked(!isLiked);
                  setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
                  onShowToast(isLiked ? 'Unliked' : 'Liked');
                }}
                className={`py-1.5 flex items-center justify-center gap-1 text-[12px] font-semibold rounded-lg hover:bg-[#f2f3ff] transition-colors cursor-pointer ${
                  isLiked ? 'text-[#02569b]' : 'text-[#515f74]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isLiked ? 'thumb_up' : 'thumb_up_off_alt'}
                </span>
                <span>Like</span>
              </button>
              <button
                type="button"
                className="py-1.5 flex items-center justify-center gap-1 text-[12px] font-semibold text-[#515f74] rounded-lg hover:bg-[#f2f3ff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
                <span>Comment</span>
              </button>
              <button
                type="button"
                className="py-1.5 flex items-center justify-center gap-1 text-[12px] font-semibold text-[#515f74] rounded-lg hover:bg-[#f2f3ff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">repeat</span>
                <span>Repost</span>
              </button>
              <button
                type="button"
                className="py-1.5 flex items-center justify-center gap-1 text-[12px] font-semibold text-[#515f74] rounded-lg hover:bg-[#f2f3ff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HOOK LABORATORY MODAL (3 Alternatives) */}
      {/* ========================================================================= */}
      {showHookModal && (
        <div className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#c2c6d2]/30 flex flex-col gap-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#eaedff] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] text-[#003f74]">lightbulb</span>
                <h3 className="font-['Manrope'] text-[18px] font-bold text-[#131b2e]">
                  Hook Laboratory (3 Alternatives)
                </h3>
              </div>
              <button onClick={() => setShowHookModal(false)} className="text-[#727782] hover:text-[#131b2e] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-[12px] text-[#424751]">
              Select an alternative hook opening line. EventPulse will seamlessly replace the opening line while keeping your takeaways untouched.
            </p>

            <div className="flex flex-col gap-3">
              {generatedHooks.map((h) => (
                <div
                  key={h.id}
                  className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#c2c6d2]/30 hover:border-[#02569b] flex flex-col gap-2 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-[#d5e3fc] text-[#003f74] text-[10px] font-bold uppercase">
                      {h.category} Hook
                    </span>
                    <button
                      type="button"
                      onClick={() => handleApplyHook(h.text)}
                      className="px-3 py-1 rounded-lg bg-[#02569b] hover:bg-[#003f74] text-[#ffffff] text-[11px] font-semibold cursor-pointer"
                    >
                      Use this hook
                    </button>
                  </div>
                  <p className="text-[13px] font-medium text-[#131b2e]">{h.text}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#eaedff]">
              <button
                type="button"
                onClick={handleFetchHooks}
                className="text-[12px] font-semibold text-[#02569b] hover:underline cursor-pointer"
              >
                Regenerate 3 new hooks
              </button>
              <button
                type="button"
                onClick={() => setShowHookModal(false)}
                className="px-4 py-2 rounded-xl bg-[#eaedff] text-[#003f74] text-[12px] font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
