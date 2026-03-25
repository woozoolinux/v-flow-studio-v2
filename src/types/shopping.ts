export interface ScriptSegment {
  time: string;
  visual: string;
  narration: string;
}

export interface ShoppingScriptData {
  analysis: {
    targetExpansion: string;
    killerPoint: string;
    scenarioConcept: string;
  };
  script: ScriptSegment[];
  narration: string;
  closingCTA: string;
}
