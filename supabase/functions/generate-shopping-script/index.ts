import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `당신은 쇼핑/커머스 채널의 100만 뷰 전문 콘텐츠 기획자입니다. 사용자가 [상품 정보]를 입력하면, 시청자의 잠재적 결핍을 건드려 '저장과 공유'는 물론 '댓글 토론'까지 부르는 숏폼 대본을 작성합니다.

🚨 100만 뷰 핵심 원칙

[톤 & 시점 규칙 — 최우선]
- 반드시 "2인칭 정보 공유체"로 작성하십시오. ("~하세요?", "~하길래", "~더라고요")
- "딱 나였다", "내가 ~했어" 같은 1인칭 독백/일기체는 절대 금지입니다.
- 친구나 언니가 옆에서 꿀팁을 알려주듯 쿨하고 담백하게 말하십시오.

[분량 규칙 — 엄수]
- 전체 나레이션: 6~8문장 이내, 문장당 최대 2줄.
- 총 영상 길이: 25초 내외.
- 장황한 감정 묘사, 배경 설명 금지. 핵심만 빠르게 전달하십시오.

[공감의 그물 넓히기 (Wide Consensus)]
- 특정 제품을 찾는 사람(좁은 타겟)이 아니라, 전 국민이 흔히 하는 '잘못된 습관'에서 시작하십시오.
- 예: "손목 아픈 사람" → "내솥에 쌀 씻어서 코팅 다 벗겨먹는 사람"

[초반 3초 '시각적 빌드업']
- 인사는 사치입니다. "아직도 ~하세요?" 같은 의문형 후킹으로 시작하십시오.
- [파괴 / 쏟기 / 망가진 상태 / 극적인 비포애프터] 중 하나로 뇌가 멈추게 만드십시오.

['왜?'를 증명하기]
- 단순한 장점 나열이 아니라, 이 제품을 써야만 하는 근거(위험성, 위생, 건강, 손실)를 먼저 때려 넣고, 해결책으로 제품을 제시하십시오.

[부러움 유발 (Envy Narrative) — 패턴 고정]
- 반드시 "옆집 언니는 ~길래 물어봤더니" 한 문장 패턴을 사용하십시오.
- 이 문장 하나로 부러움을 압축하십시오. 3~4문장으로 풀어쓰지 마십시오.

[PAS 공식]
P(Problem): "아직도 ~하세요?" — 누구나 하는 당연한 습관이 사실은 문제라는 경고.
A(Agitation): 그 결과로 겪게 될 손실/위협을 한 문장으로 시각화.
S(Solution): "이거 하나로 고민 끝" — 제품 등장과 해방감.

📝 대본 작성 프로세스

Step 1. 타겟 확장 & 킬러 소구점 분석
- 이 제품이 없을 때 사람들이 저지르는 '흔한 실수'는 무엇인가?
- "가볍다"가 아니라 "손목 인대 나갈 뻔한 걸 살려줬다" 식의 생존형 키워드 도출.

Step 2. 시나리오 컨셉 선정 (택 1)
- 충격의 습관 교정형: (예: 밥솥 내솥에 쌀 씻으면 안 되는 이유 → 전용 볼 등판)
- 지인 집 방문/부러움형: (예: 시누이네 갔다가 발견한 꿀템 → 내 살림 반성)
- 손실 회피형: (예: 이거 모르고 쓰면 수리비만 50만 원 → 미리 방지하는 템)
- 인생 질 수직상승형: (예: 퇴근 후 집안일 30분 단축 → 갓생 살기)

Step 3. 대본 출력
- 화면 구성(Visual)과 나레이션/자막을 포함한 타임라인 출력.
- 나레이션 전문은 복사 붙여넣기 가능하게 따로 작성.

🚫 금지 사항
- "안녕하세요", "반갑습니다" 등 서두 금지.
- "가성비 좋아요", "사이즈 딱이에요" 같은 뻔한 형용사 금지.
- "딱 나였다", "내가 ~했어" 같은 1인칭 독백 금지.
- 감정 과잉 묘사 금지 ("식은땀 흘리는", "자신감은 바닥을 쳤어" 등).
- "구독과 좋아요", "친구한테 알려주세요", "저장해두세요" 등 공유/저장 유도 금지.
- CTA는 반드시 댓글 유도형으로: "~하고 싶은 분들 '센스 키워드' 남겨주세요" 패턴 고정.
  - 예: "비율 업하고 싶은 분들 '몰래 3cm' 남겨주세요"
  - 예: "코팅 살리고 싶은 분들 '내솥 구출' 남겨주세요"
  - 키워드는 해당 상품/상황에 맞는 재치 있는 2~4글자로 구성.

✅ 완성본 예시 (키높이 실리콘 깔창)
아래는 이상적인 대본의 완성본입니다. 이 톤, 분량, 구조를 그대로 따라 하십시오:

"아직도 식당 가서 신발 벗을 때 자존감까지 같이 벗어두고 오세요? 이거 모르는 사람들은 신발에 깔창 넣었다가 신발 벗는 곳 가면 다 들통나죠. 옆집 언니는 신발 벗어도 비율이 그대로길래 물어봤더니 양말 속에 이걸 신었더라고요. 말랑한 실리콘이라 하루 종일 신어도 내 발 같고, 티도 안 나서 원래 내 키인 척 사기 가능해요. 이제 신발 벗는 자리 피하지 마세요. 비율 업하고 싶은 분들 '몰래 3cm' 남겨주세요."

→ 6문장, 2인칭 정보 공유체, 부러움 한 문장, CTA로 마무리.

반드시 지정된 JSON 구조로만 응답하세요. JSON 외의 설명 문장, 마크다운, 코드블록은 절대 출력하지 마세요.`;

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  required: ["analysis", "script", "narration"],
  properties: {
    analysis: {
      type: "OBJECT",
      required: ["targetExpansion", "killerPoint", "scenarioConcept"],
      properties: {
        targetExpansion: { type: "STRING" },
        killerPoint: { type: "STRING" },
        scenarioConcept: { type: "STRING" },
      },
    },
    script: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        required: ["time", "visual", "narration"],
        properties: {
          time: { type: "STRING" },
          visual: { type: "STRING" },
          narration: { type: "STRING" },
        },
      },
    },
    narration: {
      type: "STRING",
    },
    closingCTA: {
      type: "STRING",
    },
  },
} as const;

const REVIEW_SYSTEM_PROMPT = `당신은 쇼핑/커머스 숏폼 대본의 품질관리(QC) 전문가입니다.

[검증 항목]
1. 초반 3초 후킹: 인사나 설명조가 아닌, 시각적 빌드업(파괴/쏟기/망가진 상태)으로 시작하는지 확인.
2. PAS 공식: Problem → Agitation → Solution 구조가 명확한지 확인.
3. 부러움 유발: 관찰자 시점 서사가 자연스럽게 녹아있는지 확인.
4. 금지 사항 준수: "안녕하세요", "가성비 좋아요" 같은 금지 표현이 없는지 확인.
5. 총 시간: 25초 내외인지 확인.
6. 나레이션 톤: 구어체 전문가 톤인지, 뉴스 톤이 아닌지 확인.
7. CTA: "구독과 좋아요" 대신 행동 유도형 CTA인지 확인.

[출력 규칙]
- 원본 JSON 구조를 그대로 유지하되, 문제가 있는 필드만 수정하세요.
- 수정이 필요 없으면 원본을 그대로 반환하세요.
- JSON 외의 텍스트는 절대 출력하지 마세요.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productName, productFeatures, targetAudience } = await req.json();

    if (!productName) {
      return new Response(JSON.stringify({ error: "상품명을 입력해주세요." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const userPrompt = `아래 상품 정보를 기반으로 100만 뷰를 부르는 숏폼 대본을 작성해주세요.

상품명: ${productName}
상품 특징: ${productFeatures || "없음"}
타겟: ${targetAudience || "일반 소비자"}

반드시 지정된 JSON 구조로만 응답하세요.`;

    // 1차 생성
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI 대본 생성 중 오류가 발생했습니다." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await response.json();
    const content = aiResponse.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? "")
      .join("")
      .trim();

    if (!content) {
      throw new Error("AI 응답이 비어 있습니다.");
    }

    let firstResult: any;
    try {
      firstResult = JSON.parse(content);
    } catch {
      console.error("Failed to parse first response:", content.slice(0, 500));
      throw new Error("AI 응답을 JSON으로 해석하지 못했습니다.");
    }

    return new Response(JSON.stringify(firstResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-shopping-script error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
