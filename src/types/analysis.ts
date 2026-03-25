export interface EditPoint {
  start: string;
  end: string;
  reason: string;
}

export interface ShortsCandidate {
  title: string;
  mainTitle: string;
  openingNarration: string;
  narrationEmotion: string;
  editPoints: EditPoint[];
  closingCTA: string;
  thumbnailTitles: string[];
  thumbnailConcept: string;
}

export interface AnalysisData {
  subject: {
    figures: string[];
    keyPoints: string[];
  };
  shorts?: {
    candidates: ShortsCandidate[];
  };
  longform?: {
    masterScript: string;
    thumbnailTitle: string;
    thumbnailConcept: string;
  };
}
