export type PostStylePreset =
  | 'Professional'
  | 'Storytelling'
  | 'Technical'
  | 'Personal'
  | 'Grateful'
  | 'Educational'
  | 'Short & Punchy'
  | 'Founder'
  | 'Developer'
  | 'Career / Learning';

export type PostLengthPreset = 'Short' | 'Standard' | 'Long';

export const LENGTH_TARGETS: Record<PostLengthPreset, { maxChars: number; label: string }> = {
  Short: { maxChars: 600, label: 'Short (~600 chars)' },
  Standard: { maxChars: 1300, label: 'Standard (~1,300 chars)' },
  Long: { maxChars: 2500, label: 'Long (~2,500 chars)' },
};

export type AudienceType =
  | 'General LinkedIn Audience'
  | 'Recruiters'
  | 'Developers'
  | 'Founders'
  | 'Clients'
  | 'Industry Professionals'
  | 'Students';

export type CtaStyle =
  | 'None'
  | 'Question'
  | 'Discussion'
  | 'Networking'
  | 'Learning'
  | 'Soft CTA';

export type EmojiLevel = 'None' | 'Minimal' | 'Moderate';

export type WritingVoice =
  | 'Default'
  | 'Professional'
  | 'Casual'
  | 'Technical'
  | 'Friendly'
  | 'Founder'
  | 'Developer';

export interface MentionItem {
  id: string;
  type: 'Company' | 'Speaker' | 'Event' | 'Community';
  displayName: string;
  linkedInHandle?: string;
  url?: string;
}

export interface CampaignData {
  id: string;
  name: string;
  organizer: string;
  date: string;
  location: string;
  badgeType: string;
  hashtags: string[];
  channels: {
    linkedInCompany: string;
    twitter: string;
    eventPortal: string;
  };
  aiPromptDirectives: string;
  autoEnrichment: boolean;
  registeredDelegates: number;
  brandUniformityScore: number;
  postsGenerated: number;
  impressions: string;
  engagementRate: string;
  status?: 'active' | 'upcoming' | 'past' | 'draft' | 'archived';
  accessMode?: 'public' | 'link-only' | 'password';
  accessCode?: string;
  mentions?: MentionItem[];
  templateId?: string;
}

export interface AttendeeProfile {
  name: string;
  headline: string;
  avatarUrl: string;
  connectionLevel: string;
  writingSample?: string;
  savedStyle?: WritingVoice;
}

export interface AttachedPhoto {
  id: string;
  url: string;
  label: string;
  alt: string;
  isBest?: boolean;
}

export interface QualityMetric {
  name: string;
  score: number;
  description: string;
}

export interface ContentQualityBreakdown {
  overallScore: number;
  hook: number;
  clarity: number;
  specificity: number;
  readability: number;
  authenticity: number;
  cta: number;
  hashtags: number;
  suggestions: string[];
}

export interface FactCheckFlag {
  id: string;
  claim: string;
  explanation: string;
  suggestedFix: string;
  status: 'flagged' | 'removed' | 'kept' | 'edited';
}

export interface FactCheckResult {
  isConsistent: boolean;
  score: number;
  flags: FactCheckFlag[];
}

export interface HookItem {
  id: string;
  category: 'Curiosity' | 'Personal' | 'Result' | 'Question' | 'Learning' | 'Story';
  text: string;
}

export interface SmartHashtagGroup {
  event: string[];
  technology: string[];
  industry: string[];
  community: string[];
}

export interface EventTemplate {
  id: string;
  name: string;
  badgeType: string;
  description: string;
  defaultHashtags: string[];
  defaultTone: string;
  defaultStyle: PostStylePreset;
  directives: string;
  icon: string;
}

export interface PostDraft {
  id: string;
  eventId: string;
  eventName: string;
  updatedAt: number;
  takeaways: string;
  tone: string;
  postStyle: PostStylePreset;
  postLength: PostLengthPreset;
  postText: string;
  variations: string[];
  activeVariationIdx: number;
  photos: AttachedPhoto[];
  qualityScore: number;
  status: 'draft' | 'generated' | 'copied';
}

export interface ActivityFeedItem {
  id: string;
  name: string;
  role: string;
  timeAgo: string;
  avatar: string;
  quote: string;
  likes?: number;
}

export interface TelemetrySummary {
  visits: number;
  postsGenerated: number;
  imagesUploaded: number;
  copyActions: number;
  regenerations: number;
  chartData: Array<{ date: string; posts: number; attendees: number }>;
}

export type ImproveAction =
  | 'make_more_human'
  | 'make_shorter'
  | 'make_professional'
  | 'make_engaging'
  | 'improve_hook'
  | 'improve_readability'
  | 'reduce_emojis'
  | 'stronger_cta'
  | 'improve_storytelling'
  | 'make_technical';
