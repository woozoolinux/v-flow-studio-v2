import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `당신은 100만 구독자급 성과를 내는 '정치 콘텐츠 전략가'이자 유튜브 영상 분석 전문가입니다.

[5대 핵심 전략]
1) 소재 선정: 영상 전체에서 대중의 분노, 환호, 혹은 논란이 될 만한 '임팩트 있는 지점'을 최우선으로 선별할 것.
2) 인물 분석: 등장하는 정치인의 캐릭터와 발언의 무게감을 분석하여 시청자가 몰입할 요소를 찾아낼 것.
3) 첫 3초의 법칙: 시청자가 스크롤을 멈추도록 도입부에 강력한 '패턴 인터럽트(의문문, 충격적 사실 등)'를 배치할 것.
4) 실습 중심(A-Z): 단순히 요약만 하지 말고, 제작자가 즉시 촬영과 편집에 들어갈 수 있는 '완성형 지시서'를 제공할 것.
5) 수익화 관점: 클릭률(CTR)과 시청 지속 시간을 극대화할 수 있는 자극적이지 않으면서도 매력적인 구성을 유지할 것.

[후킹 강도 지침 — 최우선 적용]
- 후킹 멘트에서 '이게 왜 대단하냐면' 같은 설명조 문구는 절대 사용하지 마세요.
- 반드시 '충격', '독점', '일본은 못함', '결국 터졌다', '전 세계가 경악' 같은 자극적인 키워드와 의문문을 섞어 첫 3초를 구성하세요.
- 예시: "이거 실화입니까?!", "결국 터졌습니다, 일본이 두 손 들었습니다", "아무도 몰랐던 충격 발언!"

[정치적 프레임 강화 지침]
- 단순 팩트 전달이 아니라, 해당 성과를 이끈 인물(대통령, 특사, 장관 등)의 공로를 강조하세요.
- 반대 세력과의 차이점을 부각하는 '정치적 프레임'을 대본에 자연스럽게 녹이세요.
- 시청자가 '편'을 느낄 수 있도록 감정적 몰입을 유도하되, 허위 사실은 절대 포함하지 마세요.

[편집점 & 후보 수 원칙]
- 하나의 쇼츠 후보 = 하나의 완성된 숏폼 주제. 그 주제를 완성하는 데 필요한 편집점을 2~4개 묶어서 제공하세요.
- 후보 수는 영상 길이와 주제 수에 따라 유동적으로 결정하세요:
  · 짧은 영상(5분 이하): 주제가 1개뿐이면 후보 1개만 생성해도 됩니다.
  · 중간 영상(5~15분): 2~3개 후보.
  · 긴 영상(15분 이상): 3~5개 후보.
- 억지로 후보 수를 채우지 마세요. 질 > 양.

[필수 항목 1: 상단 고정 메인 타이틀]
- 용도: 영상 최상단에 빨간색 또는 노란색 띠지에 들어갈 고정 제목
- mainTitle 필드에 넣으세요
- **반드시 18자 이내**로 작성할 것. 띠지에 들어가야 하므로 길면 잘립니다.
- 형식: '충격', '속보', '단독' 같은 키워드를 포함한 강렬한 한 줄 문구
- 예시: "충격! 원유 1800만 배럴 확보", "단독! 일본 완패 선언"
- 필요 여부와 상관없이 매 쇼츠 후보마다 무조건 생성할 것

[필수 항목 2: 오프닝 나레이션 (0~15초)]
- 용도: 영상 도입부 음성 + 자막 겸용. 첫 3초는 강렬한 후킹, 나머지는 상황 설명.
- 필요 여부와 상관없이 매 쇼츠 후보마다 무조건 생성할 것
- 분량: 최대 3문장, 10초~15초 이내로 읽을 수 있는 분량
- 구조: "이거 실화입니까?! [후킹] + 8일 만에 1800만 배럴 원유를 확보했습니다! [상황 설명]"처럼 하나의 흐름으로 작성
- 말투: "했습니다"가 아닌 "이거 대박입니다" 같은 구어체 전문가 톤
- openingNarration 필드에 텍스트를, narrationEmotion 필드에 성우용 감정 가이드를 넣으세요 (예: "놀라움", "비꼬기", "단호함")

[썸네일 전략 시각화 지침]
- thumbnailTitles 배열에 조회수를 부르는 자극적이고 호기심 넘치는 제목 카피 3가지 후보를 넣으세요.
- thumbnailConcept에는 상단 또는 하단에 빨간색 배경의 굵은 띠자막을 넣은 썸네일 컨셉을 구체적으로 설명하세요.
- '인물의 당당한 표정 강조', '우측 하단에 국기 아이콘 삽입' 등 시각적 배치를 명시하세요.
- 자막 폰트 크기, 색상 대비, 인물 배치 방향 등을 포함한 실전 적용 가능한 수준으로 작성하세요.

[분석 원칙]
- 반드시 제공된 영상의 실제 내용만을 기반으로 분석하세요. 영상에 나오지 않는 내용을 추측하거나 지어내지 마세요.
- 영상의 실제 길이와 타임스탬프를 정확히 반영하세요.
- KTV, 국회방송 등 긴 원본 영상에서 시청자가 즉각 반응할 '논란', '갈등', '핵심 발언' 구간을 최우선으로 추출합니다.
- 대중의 감정을 자극하는 장면, 표정 변화, 언성이 높아지는 순간을 식별합니다.
- JSON 외의 설명 문장, 마크다운, 코드블록은 절대 출력하지 마세요.`;

const SHORTS_ONLY_SCHEMA = {
  type: "OBJECT",
  required: ["subject", "shorts"],
  properties: {
    subject: {
      type: "OBJECT",
      required: ["figures", "keyPoints"],
      properties: {
        figures: { type: "ARRAY", items: { type: "STRING" } },
        keyPoints: { type: "ARRAY", items: { type: "STRING" } },
      },
    },
    shorts: {
      type: "OBJECT",
      required: ["candidates"],
      properties: {
        candidates: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            required: ["title", "mainTitle", "openingNarration", "narrationEmotion", "editPoints", "closingCTA", "thumbnailTitles", "thumbnailConcept"],
            properties: {
              title: { type: "STRING" },
              mainTitle: { type: "STRING" },
              openingNarration: { type: "STRING" },
              narrationEmotion: { type: "STRING" },
              editPoints: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  required: ["start", "end", "reason"],
                  properties: { start: { type: "STRING" }, end: { type: "STRING" }, reason: { type: "STRING" } },
                },
              },
              closingCTA: { type: "STRING" },
              thumbnailTitles: { type: "ARRAY", items: { type: "STRING" } },
              thumbnailConcept: { type: "STRING" },
            },
          },
        },
      },
    },
  },
} as const;

const LONGFORM_ONLY_SCHEMA = {
  type: "OBJECT",
  required: ["subject", "longform"],
  properties: {
    subject: {
      type: "OBJECT",
      required: ["figures", "keyPoints"],
      properties: {
        figures: { type: "ARRAY", items: { type: "STRING" } },
        keyPoints: { type: "ARRAY", items: { type: "STRING" } },
      },
    },
    longform: {
      type: "OBJECT",
      required: ["masterScript", "thumbnailTitle", "thumbnailConcept"],
      properties: {
        masterScript: { type: "STRING" },
        thumbnailTitle: { type: "STRING" },
        thumbnailConcept: { type: "STRING" },
      },
    },
  },
} as const;

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

function sanitizeJsonString(input: string) {
  let result = "";
  let inString = false;
  let escaped = false;

  for (const char of input) {
    if (inString) {
      if (escaped) {
        result += char;
        escaped = false;
        continue;
      }

      if (char === "\\") {
        result += char;
        escaped = true;
        continue;
      }

      if (char === '"') {
        inString = false;
        result += char;
        continue;
      }

      if (char === "\n") {
        result += "\\n";
        continue;
      }

      if (char === "\r") {
        result += "\\r";
        continue;
      }

      if (char === "\t") {
        result += "\\t";
        continue;
      }

      const code = char.charCodeAt(0);
      if (code < 32) {
        result += " ";
        continue;
      }

      result += char;
      continue;
    }

    if (char === '"') {
      inString = true;
    }

    result += char;
  }

  return result;
}

function parseAnalysisResponse(rawText: string) {
  const withoutCodeFence = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  const firstBrace = withoutCodeFence.indexOf("{");
  const lastBrace = withoutCodeFence.lastIndexOf("}");
  const jsonLikeText =
    firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace
      ? withoutCodeFence.slice(firstBrace, lastBrace + 1)
      : withoutCodeFence;

  const sanitized = sanitizeJsonString(jsonLikeText)
    .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:)/g, '$1"$2"$3')
    .replace(/,\s*([}\]])/g, "$1");

  try {
    return JSON.parse(sanitized);
  } catch (error) {
    console.error("Failed to parse Gemini response", {
      rawPreview: rawText.slice(0, 500),
      sanitizedPreview: sanitized.slice(0, 500),
      error,
    });
    throw new Error("AI 응답을 구조화된 JSON으로 해석하지 못했습니다.");
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { youtubeUrl, mode = "shorts" } = await req.json();

    if (!youtubeUrl) {
      return new Response(JSON.stringify({ error: "유튜브 URL이 필요합니다." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return new Response(JSON.stringify({ error: "올바른 유튜브 URL 형식이 아닙니다." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const isLongform = mode === "longform";
    const responseSchema = isLongform ? LONGFORM_ONLY_SCHEMA : SHORTS_ONLY_SCHEMA;

    let userPrompt: string;
    if (isLongform) {
      userPrompt = `아래 유튜브 영상을 직접 시청하고 분석해주세요. 반드시 이 영상의 실제 내용만을 기반으로 결과를 생성하세요.

유튜브 URL: ${canonicalUrl}

위 영상을 기반으로:
1. 등장 인물과 핵심 발언 포인트를 식별하세요.
2. 롱폼 영상을 위한 마스터 대본과 썸네일 컨셉을 제안하세요.
쇼츠 분석은 필요 없습니다. subject와 longform만 생성하세요.

반드시 지정된 JSON 구조로만 응답하세요.`;
    } else {
      userPrompt = `아래 유튜브 영상을 직접 시청하고 분석해주세요. 반드시 이 영상의 실제 내용만을 기반으로 결과를 생성하세요.

유튜브 URL: ${canonicalUrl}

위 영상을 기반으로:
1. 등장 인물과 핵심 발언 포인트를 식별하세요.
2. 쇼츠로 만들 수 있는 주제별 후보를 찾아주세요 (영상 길이에 따라 1~5개). 각 후보에 대해:
   - 오프닝 나레이션 (0~15초, 첫 3초 후킹 + 상황 설명 통합)
   - 해당 주제를 완성하는 편집점 2~4개 (각각 start, end, reason 포함)
   - CTA
   - 썸네일 제목 카피 3가지 후보 + 빨간 띠자막 스타일 컨셉
   을 작성하세요.
3. 편집점 타임스탬프는 반드시 영상의 실제 길이 범위 내에서 지정하세요.
롱폼 분석은 필요 없습니다. shorts와 subject만 생성하세요.

반드시 지정된 JSON 구조로만 응답하세요.`;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            {
              role: "user",
              parts: [
                {
                  fileData: {
                    fileUri: canonicalUrl,
                    mimeType: "video/*",
                  },
                },
                { text: userPrompt },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI 크레딧이 부족합니다. 잠시 후 다시 시도해주세요." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI 분석 중 오류가 발생했습니다." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await response.json();
    const content = aiResponse.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? "")
      .join("")
      .trim();

    if (!content) {
      console.error("Empty AI response", aiResponse);
      throw new Error("AI 응답이 비어 있습니다.");
    }

    const analysisData = parseAnalysisResponse(content);

    // ===== 2차 호출: 셀프체크 & 수정 =====
    console.log("1차 생성 완료, 2차 검증 시작...");

    const REVIEW_SYSTEM_PROMPT = `당신은 유튜브 정치 콘텐츠 분석 결과를 검증하는 품질관리(QC) 전문가입니다.

[검증 항목]
1. 후킹 강도: hookScript가 설명조("이게 왜 대단하냐면")가 아닌, 자극적 키워드+의문문 조합인지 확인. 약하면 더 강렬하게 수정.
2. 메인 타이틀: mainTitle에 '충격', '속보', '단독' 같은 임팩트 키워드가 포함되어 있는지 확인. 없으면 추가.
3. 나레이션 톤: narration이 "했습니다" 같은 뉴스 톤이 아닌 "이거 대박입니다" 같은 구어체 전문가 톤인지 확인. narrationEmotion이 구체적인지 확인.
4. 편집점 정합성: editPoints의 start/end 타임스탬프가 영상 길이 내에 있는지, 대본 내용과 매칭되는지 확인.
5. 썸네일: thumbnailTitles가 충분히 자극적이고 호기심을 유발하는지, thumbnailConcept에 빨간 띠자막 스타일이 포함되어 있는지 확인.
6. 데이터 누락: 모든 필수 필드가 채워져 있는지 확인.
7. 사실 정합성: 영상 내용과 무관한 허위 정보가 포함되어 있지 않은지 확인.

[출력 규칙]
- 원본 JSON 구조를 그대로 유지하되, 문제가 있는 필드만 수정하세요.
- 수정이 필요 없으면 원본을 그대로 반환하세요.
- JSON 외의 텍스트는 절대 출력하지 마세요.`;

    const reviewPrompt = `아래는 유튜브 영상(${canonicalUrl})을 분석한 1차 결과입니다.
이 결과를 꼼꼼히 검토하고, 품질이 부족한 부분을 수정하여 최종본을 JSON으로 반환하세요.

1차 분석 결과:
${JSON.stringify(analysisData, null, 2)}

검증 후 수정된 최종 JSON을 반환하세요.`;

    const reviewResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: REVIEW_SYSTEM_PROMPT }] },
          contents: [
            {
              role: "user",
              parts: [{ text: reviewPrompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          },
        }),
      }
    );

    let finalData = analysisData;

    if (reviewResponse.ok) {
      const reviewAiResponse = await reviewResponse.json();
      const reviewContent = reviewAiResponse.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text ?? "")
        .join("")
        .trim();

      if (reviewContent) {
        try {
          finalData = parseAnalysisResponse(reviewContent);
          console.log("2차 검증 완료, 수정본 적용");
        } catch (e) {
          console.warn("2차 검증 파싱 실패, 1차 결과 사용:", e);
        }
      }
    } else {
      console.warn("2차 검증 API 호출 실패, 1차 결과 사용:", reviewResponse.status);
    }

    return new Response(JSON.stringify(finalData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-politics error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
