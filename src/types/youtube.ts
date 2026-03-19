export interface KeyMoment {
  timestamp: number;
  label: string;
  description: string;
  isMostViewed: boolean;
}

export interface SummaryResult {
  videoId: string;
  title: string;
  summary: string;
  keyMoments: KeyMoment[];
  highlights: string[];
  mostViewedReason: string;
  thumbnails: {
    maxres: string;
    hq: string;
    auto: string[];
  };
}
