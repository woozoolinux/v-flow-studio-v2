import { useState } from "react";
import { Search, Sparkles, Zap, Film, Clapperboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnalysisCard } from "@/components/AnalysisCard";
import { ShortsCard } from "@/components/ShortsCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { AnalysisData } from "@/types/analysis";

type AnalysisMode = "shorts" | "longform";

const FUNCTIONS_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

const LOADING_MESSAGES = [
  "전문가가 영상을 심층 분석하여 조회수 터지는 지점을 찾는 중입니다...",
  "핵심 인물과 임팩트 발언을 식별하는 중...",
  "쇼츠 편집점과 대본을 생성하는 중...",
  "AI가 결과를 검증하는 중...",
];

export function PoliticsHub() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [shortsData, setShortsData] = useState<AnalysisData | null>(null);
  const [longformData, setLongformData] = useState<AnalysisData | null>(null);
  const [mode, setMode] = useState<AnalysisMode>("shorts");

  const currentData = mode === "shorts" ? shortsData : longformData;

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);

    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIdx]);
    }, 3000);

    try {
      const resp = await fetch(`${FUNCTIONS_BASE}/analyze-politics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ youtubeUrl: url.trim(), mode }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "분석 중 오류가 발생했습니다.");
      }

      const result = await resp.json();
      if (result?.error) throw new Error(result.error);

      if (mode === "shorts") {
        setShortsData(result as AnalysisData);
      } else {
        setLongformData(result as AnalysisData);
      }
      toast.success("AI 분석이 완료되었습니다!");
    } catch (e: any) {
      console.error("Analysis error:", e);
      toast.error(e.message || "분석 중 오류가 발생했습니다.");
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  };

  const subjectCopy = currentData
    ? `핵심 인물: ${currentData.subject.figures.join(", ")}\n\n포인트:\n${currentData.subject.keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}`
    : "";

  const longformCopy = currentData?.longform
    ? `마스터 대본:\n${currentData.longform.masterScript}\n\n썸네일 제목: ${currentData.longform.thumbnailTitle}\n썸네일 컨셉: ${currentData.longform.thumbnailConcept}`
    : "";

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          🔥 정치 — AI 분석
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          유튜브 URL을 입력하면 AI가 편집점, 대본, 썸네일 전략을 자동 생성합니다.
        </p>
      </div>

      <div className="flex gap-2 mb-3">
        <Button variant={mode === "shorts" ? "default" : "outline"} size="sm" className="gap-1.5 text-xs font-semibold" onClick={() => setMode("shorts")}>
          <Clapperboard className="h-3.5 w-3.5" /> 숏폼
        </Button>
        <Button variant={mode === "longform" ? "default" : "outline"} size="sm" className="gap-1.5 text-xs font-semibold" onClick={() => setMode("longform")}>
          <Film className="h-3.5 w-3.5" /> 롱폼
        </Button>
      </div>

      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="유튜브 URL을 입력하세요 (예: https://youtube.com/watch?v=...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            className="pl-10 h-12 bg-card border-border/60 text-sm"
          />
        </div>
        <Button onClick={handleAnalyze} disabled={loading || !url.trim()} className="h-12 px-6 font-semibold gap-2" style={{ background: "var(--gradient-purple)" }}>
          {loading ? <Zap className="h-4 w-4 animate-pulse-glow" /> : <Sparkles className="h-4 w-4" />}
          AI 심층 분석하기
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div key="skeleton" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6">
            <motion.p key={loadingMsg} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-primary font-medium text-center">{loadingMsg}</motion.p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
          </motion.div>
        )}

        {currentData && !loading && (
          <motion.div key={`results-${mode}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
            {currentData.shorts && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <ShortsCard candidates={currentData.shorts.candidates} />
              </motion.div>
            )}
            {currentData.longform && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <AnalysisCard icon="✍️" title="롱폼 콕콕 (Long-form)" copyContent={longformCopy}>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-1.5">마스터 대본</p>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{currentData.longform.masterScript}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                      <p className="text-xs font-semibold text-foreground">🖼️ 썸네일 추천</p>
                      <p className="text-sm font-medium text-primary">{currentData.longform.thumbnailTitle}</p>
                      <p className="text-xs">{currentData.longform.thumbnailConcept}</p>
                    </div>
                  </div>
                </AnalysisCard>
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <AnalysisCard icon="🎯" title="소재 & 인물 분석" copyContent={subjectCopy}>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">식별된 인물</p>
                    <div className="flex flex-wrap gap-1.5">
                      {currentData.subject.figures.map((f) => (
                        <span key={f} className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{f}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2">핵심 포인트</p>
                    <ul className="space-y-1.5">
                      {currentData.subject.keyPoints.map((p, i) => (
                        <li key={i} className="flex gap-2 text-sm"><span className="text-primary font-bold">{i + 1}.</span>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnalysisCard>
            </motion.div>
          </motion.div>
        )}

        {!currentData && !loading && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">분석할 영상을 입력해주세요</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              유튜브 URL을 입력하고 AI 심층 분석 버튼을 누르면,<br />편집점·대본·썸네일 전략이 자동으로 생성됩니다.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
