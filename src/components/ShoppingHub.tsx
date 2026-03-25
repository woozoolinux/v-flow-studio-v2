import { useState } from "react";
import { ShoppingBag, Sparkles, Zap, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonCard } from "@/components/SkeletonCard";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { ShoppingScriptData } from "@/types/shopping";

const LOADING_MESSAGES = [
  "상품 정보를 분석하는 중...",
  "타겟을 확장하고 킬러 소구점을 찾는 중...",
  "100만 뷰 대본을 생성하는 중...",
  "AI가 대본 품질을 검증하는 중...",
];

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

export function ShoppingHub() {
  const [productName, setProductName] = useState("");
  const [productFeatures, setProductFeatures] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [data, setData] = useState<ShoppingScriptData | null>(null);

  const handleGenerate = async () => {
    if (!productName.trim()) return;
    setLoading(true);

    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIdx]);
    }, 3000);

    try {
      const { data: result, error } = await supabase.functions.invoke(
        "generate-shopping-script",
        { body: { productName: productName.trim(), productFeatures: productFeatures.trim(), targetAudience: targetAudience.trim() } }
      );

      if (error) throw new Error(error.message || "대본 생성 중 오류가 발생했습니다.");
      if (result?.error) throw new Error(result.error);

      setData(result as ShoppingScriptData);
      toast.success("대본 생성이 완료되었습니다!");
    } catch (e: any) {
      console.error("Shopping script error:", e);
      toast.error(e.message || "대본 생성 중 오류가 발생했습니다.");
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          🛍️ 쇼핑 — AI 대본 생성기
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          상품 정보를 입력하면 AI가 100만 뷰 숏폼 대본을 자동 생성합니다.
        </p>
      </div>

      {/* Input form */}
      <div className="space-y-3 mb-8">
        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">상품명 *</label>
          <Input
            placeholder="예: 스테인리스 믹싱볼 세트"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="h-11 bg-card border-border/60 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">상품 특징 / 설명</label>
          <Textarea
            placeholder="예: 초경량 304 스테인리스, 눈금 표시, 실리콘 바닥 미끄럼 방지, 3종 세트"
            value={productFeatures}
            onChange={(e) => setProductFeatures(e.target.value)}
            className="bg-card border-border/60 text-sm min-h-[80px]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">타겟 (선택)</label>
          <Input
            placeholder="예: 30~50대 주부, 자취생, 요리 초보"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="h-11 bg-card border-border/60 text-sm"
          />
        </div>
        <Button
          onClick={handleGenerate}
          disabled={loading || !productName.trim()}
          className="h-12 px-6 font-semibold gap-2 w-full sm:w-auto"
          style={{ background: "var(--gradient-purple)" }}
        >
          {loading ? <Zap className="h-4 w-4 animate-pulse-glow" /> : <Sparkles className="h-4 w-4" />}
          AI 대본 생성하기
        </Button>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div key="skeleton" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-6">
            <motion.p key={loadingMsg} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-primary font-medium text-center">
              {loadingMsg}
            </motion.p>
            <div className="grid grid-cols-1 gap-5">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </motion.div>
        )}

        {data && !loading && (
          <motion.div key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-5">

            {/* 나레이션 전문 (가장 중요) */}
            <Card className="border-primary/30 shadow-[var(--shadow-card-hover)] ring-1 ring-primary/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <span className="text-xl">🎙️</span> 나레이션 전문 (복사용)
                  </CardTitle>
                  <CopyButton text={data.narration} label="나레이션 전문 복사" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-line font-medium text-foreground">
                  {data.narration}
                </p>
              </CardContent>
            </Card>

            {/* 대본 테이블 */}
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <span className="text-xl">📋</span> 숏폼 대본 (타임라인)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.script.map((seg, i) => (
                    <div key={i} className="rounded-lg bg-muted/50 p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-xs font-mono font-semibold text-primary">
                          {seg.time}
                        </span>
                        <CopyButton text={seg.narration} />
                      </div>
                      <p className="text-xs text-muted-foreground">🎬 {seg.visual}</p>
                      <p className="text-sm font-medium text-foreground">{seg.narration}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 분석 결과 */}
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <span className="text-xl">🧠</span> AI 전략 분석
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">🎯 타겟 확장</p>
                  <p className="text-muted-foreground">{data.analysis.targetExpansion}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">⚡ 킬러 소구점</p>
                  <p className="text-muted-foreground">{data.analysis.killerPoint}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">🎬 시나리오 컨셉</p>
                  <p className="text-muted-foreground">{data.analysis.scenarioConcept}</p>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            {data.closingCTA && (
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <span className="text-xl">📢</span> 클로징 CTA
                    </CardTitle>
                    <CopyButton text={data.closingCTA} label="CTA 복사" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed font-medium text-foreground">{data.closingCTA}</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {!data && !loading && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">상품 정보를 입력해주세요</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              상품명과 특징을 입력하면 AI가 100만 뷰 숏폼 대본을 생성합니다.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
