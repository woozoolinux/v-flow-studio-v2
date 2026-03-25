import { Sparkles, Zap, BarChart3, Scissors, FileText, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    icon: BarChart3,
    title: "소재 & 인물 분석",
    desc: "영상 속 핵심 인물과 대중 반응 포인트를 AI가 자동 식별합니다.",
  },
  {
    icon: Scissors,
    title: "쇼츠 편집점 추출",
    desc: "15~60초 최적 구간과 후킹 대본을 즉시 생성합니다.",
  },
  {
    icon: FileText,
    title: "롱폼 대본 & 썸네일",
    desc: "전체 맥락을 관통하는 마스터 대본과 썸네일 전략을 추천합니다.",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-12 h-16 border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">V-Flow AI</span>
        </div>
        <Button onClick={() => navigate("/auth")} size="sm" className="gap-2" style={{ background: "var(--gradient-purple)" }}>
          시작하기 <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground mb-6">
              <Zap className="h-3.5 w-3.5" />
              AI 기반 콘텐츠 자동화 엔진
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-5">
              영상 하나로,{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-purple)" }}>
                콘텐츠 전략
              </span>
              <br />
              자동 완성
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              유튜브 URL만 입력하면 AI가 편집점, 대본, 썸네일 전략까지
              <br className="hidden sm:block" />
              한 번에 생성합니다. 제작 시간을 80% 단축하세요.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                className="h-12 px-8 text-sm font-semibold gap-2 shadow-lg"
                style={{ background: "var(--gradient-purple)" }}
              >
                <Play className="h-4 w-4" />
                무료로 시작하기
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-sm font-semibold"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                기능 살펴보기
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            하나의 영상, 세 가지 전략
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            AI가 영상을 분석해 소재·편집점·대본을 동시에 추출합니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-2xl border border-border/60 bg-card p-6 hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300"
            >
              <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 bg-accent/30">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
            지금 바로 분석을 시작하세요
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            복잡한 설정 없이 URL만 입력하면 됩니다.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="h-12 px-10 font-semibold gap-2"
            style={{ background: "var(--gradient-purple)" }}
          >
            <Sparkles className="h-4 w-4" />
            지금 시작하기
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center">
        <p className="text-xs text-muted-foreground">© 2026 V-Flow AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
