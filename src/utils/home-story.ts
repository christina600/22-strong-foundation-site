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
  story?: string;
  photo?: string;
  photoAlt?: string;
  initials?: string;
  imageWidth?: number;
  imageHeight?: number;
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
  story?: string;
}

interface AudienceConfig {
  id: string;
  heading: string;
  detailAriaLabel: string;
  lead: string;
  body: string;
  statsKey: string;
  statsClass?: string;
  proofClass?: string;
  voicesId?: string;
  voicesAriaLabel: string;
  video?: VideoVoiceContent;
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
  stats: EvidenceStatContent[];
  statsClass?: string;
  proofClass?: string;
  voicesId?: string;
  voicesAriaLabel: string;
  video?: VideoVoiceContent;
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

const resolveVideo = (
  video: VideoVoiceContent | undefined,
  testimonials: Record<string, TestimonialContent>
): VideoVoiceContent | undefined => {
  if (!video) return undefined;
  const testimonial = getTestimonial(testimonials, video.testimonialKey);

  return {
    ...video,
    attribution: video.attribution ?? testimonial?.attribution ?? "",
    story: video.story ?? testimonial?.story ?? ""
  };
};

export function buildAudienceGroups(home: HomeStoryContent): AudienceGroupContent[] {
  return home.audiences.map((group) => ({
    id: group.id,
    heading: group.heading,
    detailAriaLabel: group.detailAriaLabel,
    lead: group.lead,
    body: group.body,
    stats: home.stats[group.statsKey] ?? [],
    statsClass: group.statsClass,
    proofClass: group.proofClass,
    voicesId: group.voicesId,
    voicesAriaLabel: group.voicesAriaLabel,
    video: resolveVideo(group.video, home.testimonials),
    voices: group.voicesKey === "veteranVoices"
      ? home.veteranVoices
      : (group.voices ?? []).map((voice) => resolveVoice(voice, home.testimonials))
  }));
}
