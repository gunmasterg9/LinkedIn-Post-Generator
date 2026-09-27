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
}

export interface AttendeeProfile {
  name: string;
  headline: string;
  avatarUrl: string;
  connectionLevel: string;
}

export interface AttachedPhoto {
  id: string;
  url: string;
  label: string;
  alt: string;
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
