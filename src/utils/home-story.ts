export interface EvidenceStatContent {
  number: string;
  text: string;
  source: string;
  url: string;
  light?: boolean;
}

export interface TestimonialContent {
  attribution: string;
  quote?: string;
  story: string;
}

export interface PersonVoiceContent {
  name: string;
  title?: string;
  quote?: string;
  sample?: boolean;
  story?: string;
  photo?: string;
  photoAlt?: string;
  initials?: string;
  imageWidth?: number;
  imageHeight?: number;
  imagePosition?: string;
  testimonialKey?: string;
}

export interface VideoVoiceContent {
  src: string;
  poster: string;
  posterAlt?: string;
  triggerLabel: string;
  fallbackLabel: string;
  testimonialKey?: string;
  attribution?: string;
  quote?: string;
  story?: string;
}

export interface FeaturePhotoContent {
  src: string;
  alt: string;
  imagePosition?: string;
}

export interface RecoveryBeatContent extends FeaturePhotoContent {
  afterStat: number;
}

interface AudienceConfig {
  id: string;
  heading: string;
  detailAriaLabel: string;
  lead: string;
  body: string;
  photo?: string;
  photoAlt?: string;
  imagePosition?: string;
  featurePhoto?: FeaturePhotoContent;
  recoveryBeat?: RecoveryBeatContent;
  statsKey: string;
  statsClass?: string;
  stackStats?: boolean;
  proofClass?: string;
  voicesId?: string;
  voicesAriaLabel: string;
  videos?: VideoVoiceContent[];
  voicesKey?: string;
  voices?: PersonVoiceContent[];
}

interface HomeStoryContent {
  stats: Record<string, EvidenceStatContent[]>;
  testimonials: Record<string, TestimonialContent>;
  veteranVoices: PersonVoiceContent[];
  audiences: AudienceConfig[];
}

export interface AudienceGroupContent {
  id: string;
  heading: string;
  detailAriaLabel: string;
  lead: string;
  body: string;
  photo?: string;
  photoAlt?: string;
  imagePosition?: string;
  featurePhoto?: FeaturePhotoContent;
  recoveryBeat?: RecoveryBeatContent;
  stats: EvidenceStatContent[];
  statsClass?: string;
  stackStats?: boolean;
  proofClass?: string;
  voicesId?: string;
  voicesAriaLabel: string;
  videos?: VideoVoiceContent[];
  voices: PersonVoiceContent[];
}

const getTestimonial = (testimonials: Record<string, TestimonialContent>, key?: string) => (
  key ? testimonials[key] : undefined
);

const resolveVoice = (
  voice: PersonVoiceContent,
  testimonials: Record<string, TestimonialContent>
): PersonVoiceContent => {
  const testimonial = getTestimonial(testimonials, voice.testimonialKey);

  return {
    ...voice,
    title: voice.title ?? testimonial?.attribution ?? "",
    quote: voice.quote ?? testimonial?.quote,
    story: voice.story ?? testimonial?.story
  };
};

const resolveVideos = (
  videos: VideoVoiceContent[] | undefined,
  testimonials: Record<string, TestimonialContent>
): VideoVoiceContent[] => {
  if (!videos) return [];
  return videos.map<VideoVoiceContent>((video) => {
    const testimonial = getTestimonial(testimonials, video.testimonialKey);
    return {
      ...video,
      attribution: video.attribution ?? testimonial?.attribution ?? "",
      quote: video.quote ?? testimonial?.quote,
      story: video.story ?? testimonial?.story ?? ""
    };
  });
};

export function buildAudienceGroups(home: HomeStoryContent): AudienceGroupContent[] {
  return home.audiences.map((group) => ({
    id: group.id,
    heading: group.heading,
    detailAriaLabel: group.detailAriaLabel,
    lead: group.lead,
    body: group.body,
    photo: group.photo,
    photoAlt: group.photoAlt,
    imagePosition: group.imagePosition,
    featurePhoto: group.featurePhoto,
    recoveryBeat: group.recoveryBeat,
    stats: home.stats[group.statsKey] ?? [],
    statsClass: group.statsClass,
    stackStats: group.stackStats,
    proofClass: group.proofClass,
    voicesId: group.voicesId,
    voicesAriaLabel: group.voicesAriaLabel,
    videos: resolveVideos(group.videos, home.testimonials),
    voices: group.voicesKey === "veteranVoices"
      ? home.veteranVoices
      : (group.voices ?? []).map((voice) => resolveVoice(voice, home.testimonials))
  }));
}
