import { useState } from "react";
import { Copy, Check, ChevronLeft, ChevronRight, Mic } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ShortsCandidate } from "@/types/analysis";

interface ShortsCardProps {
  candidates: ShortsCandidate[];
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("클립보드에 복사되었습니다");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary shrink-0" onClick={handleCopy} title={label}>
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
}

export function ShortsCard({ candidates }: ShortsCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!candidates || candidates.length === 0) {
    return (
      <Card className="border-border/60 bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            ✂️ 쇼츠 콕콕 (Shorts)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">쇼츠 후보가 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  const candidate = candidates[activeIndex];
  if (!candidate) return null;

  return (
    <Card className="relative overflow-hidden border-primary/30 shadow-[var(--shadow-card-hover)] ring-1 ring-primary/10 transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
            <span className="text-xl">✂️</span>
            쇼츠 콕콕 (Shorts)
          </CardTitle>
        </div>
        {/* Candidate navigator */}
        <div className="flex items-center gap-2 mt-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={activeIndex === 0} onClick={() => setActiveIndex((i) => i - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-1.5">
            {candidates.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 w-2 rounded-full transition-colors ${i === activeIndex ? "bg-primary" : "bg-muted-foreground/30"}`}
              />
            ))}
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={activeIndex === candidates.length - 1} onClick={() => setActiveIndex((i) => i + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground ml-1">후보 {activeIndex + 1} / {candidates.length}</span>
        </div>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-5">
        {/* ===== 1순위: 상단 고정 메인 타이틀 ===== */}
        <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔴</span>
              <div>
                <p className="text-xs font-bold text-foreground">상단 고정 메인 타이틀</p>
                <p className="text-[10px] text-muted-foreground">빨간/노란 띠지에 들어갈 한 줄 제목</p>
              </div>
            </div>
            <CopyButton text={candidate.mainTitle || ""} label="메인 타이틀 복사" />
          </div>
          <p className="text-base font-black text-foreground leading-snug">
            {candidate.mainTitle || candidate.title}
          </p>
        </div>

        {/* ===== 2순위: 오프닝 나레이션 (0~15초) ===== */}
        <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mic className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">🎙️ 오프닝 나레이션 (0~15초)</p>
                <p className="text-[10px] text-muted-foreground">첫 3초 후킹 + 상황 설명 · 음성 & 자막 겸용</p>
              </div>
            </div>
            <CopyButton text={`${candidate.openingNarration} (${candidate.narrationEmotion})`} label="나레이션 복사" />
          </div>
          <p className="text-sm leading-relaxed font-medium text-foreground whitespace-pre-line">
            {candidate.openingNarration}
          </p>
          {candidate.narrationEmotion && (
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              🎭 감정 가이드: {candidate.narrationEmotion}
            </span>
          )}
        </div>

        {/* ===== 4순위: AI 추천 편집점 ===== */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span>🎬</span>
            <p className="text-xs font-semibold text-foreground">AI 추천 편집점 (골든 타임라인)</p>
          </div>
          <div className="space-y-2">
            {(candidate.editPoints || []).map((ep, i) => (
              <div key={i} className="rounded-lg bg-muted/50 p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-xs font-mono font-semibold text-primary">
                    {ep.start} → {ep.end}
                  </span>
                  <CopyButton text={`${ep.start} → ${ep.end}: ${ep.reason}`} />
                </div>
                <p className="text-xs text-muted-foreground">{ep.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing CTA */}
        <Section emoji="📢" title="강력한 클로징 (CTA)" content={candidate.closingCTA} />

        {/* Thumbnail strategy */}
        <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span>🖼️</span>
              <p className="text-xs font-bold text-foreground">썸네일 & 제목 전략</p>
            </div>
            <CopyButton
              text={`제목 후보:\n${(candidate.thumbnailTitles || []).map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\n컨셉:\n${candidate.thumbnailConcept}`}
              label="썸네일 전략 복사"
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">제목 카피 후보</p>
            {(candidate.thumbnailTitles || []).map((title, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary">{i + 1}.</span>
                <p className="text-sm font-semibold text-foreground flex-1">{title}</p>
                <CopyButton text={title} />
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-destructive/5 border border-destructive/15 p-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">🔴 빨간 띠자막 썸네일 컨셉</p>
            <p className="text-xs leading-relaxed">{candidate.thumbnailConcept}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Section({ emoji, title, content }: { emoji: string; title: string; content: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span>{emoji}</span>
          <p className="text-xs font-semibold text-foreground">{title}</p>
        </div>
        <CopyButton text={content} />
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  );
}
