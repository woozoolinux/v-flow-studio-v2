import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Key, Eye, EyeOff, Save, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ApiKeyState {
  value: string;
  saved: boolean;
  loading: boolean;
  visible: boolean;
}

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gemini, setGemini] = useState<ApiKeyState>({ value: "", saved: false, loading: false, visible: false });
  const [elevenlabs, setElevenlabs] = useState<ApiKeyState>({ value: "", saved: false, loading: false, visible: false });

  useEffect(() => {
    if (!user) return;
    loadKeys();
  }, [user]);

  const loadKeys = async () => {
    const { data } = await supabase
      .from("user_api_keys")
      .select("key_type, encrypted_key")
      .eq("user_id", user!.id);

    if (data) {
      data.forEach((row: any) => {
        if (row.key_type === "gemini") {
          setGemini((prev) => ({ ...prev, value: row.encrypted_key, saved: true }));
        } else if (row.key_type === "elevenlabs") {
          setElevenlabs((prev) => ({ ...prev, value: row.encrypted_key, saved: true }));
        }
      });
    }
  };

  const saveKey = async (keyType: "gemini" | "elevenlabs", value: string, setState: React.Dispatch<React.SetStateAction<ApiKeyState>>) => {
    if (!user || !value.trim()) return;
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const { error } = await supabase.from("user_api_keys").upsert(
        { user_id: user.id, key_type: keyType, encrypted_key: value.trim(), updated_at: new Date().toISOString() },
        { onConflict: "user_id,key_type" }
      );
      if (error) throw error;
      setState((prev) => ({ ...prev, saved: true, loading: false }));
      toast.success(`${keyType === "gemini" ? "Gemini" : "ElevenLabs"} API 키가 저장되었습니다.`);
    } catch (err: any) {
      toast.error(err.message || "키 저장 중 오류 발생");
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const deleteKey = async (keyType: "gemini" | "elevenlabs", setState: React.Dispatch<React.SetStateAction<ApiKeyState>>) => {
    if (!user) return;
    const { error } = await supabase.from("user_api_keys").delete().eq("user_id", user.id).eq("key_type", keyType);
    if (!error) {
      setState({ value: "", saved: false, loading: false, visible: false });
      toast.success("API 키가 삭제되었습니다.");
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return "••••••••";
    return key.slice(0, 4) + "••••••••" + key.slice(-4);
  };

  const renderKeyInput = (
    label: string,
    keyType: "gemini" | "elevenlabs",
    state: ApiKeyState,
    setState: React.Dispatch<React.SetStateAction<ApiKeyState>>,
    placeholder: string
  ) => (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Key className="h-4 w-4 text-primary" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={state.visible ? "text" : "password"}
              placeholder={placeholder}
              value={state.saved && !state.visible ? maskKey(state.value) : state.value}
              onChange={(e) => setState((prev) => ({ ...prev, value: e.target.value, saved: false }))}
              className="h-10 pr-10 bg-card text-sm"
            />
            <button
              type="button"
              onClick={() => setState((prev) => ({ ...prev, visible: !prev.visible }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {state.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Button
            size="sm"
            className="h-10 px-4 gap-1"
            disabled={state.loading || !state.value.trim() || state.saved}
            onClick={() => saveKey(keyType, state.value, setState)}
            style={!state.saved ? { background: "var(--gradient-purple)" } : {}}
            variant={state.saved ? "outline" : "default"}
          >
            {state.saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {state.saved ? "저장됨" : "저장"}
          </Button>
        </div>
        {state.saved && (
          <button
            onClick={() => deleteKey(keyType, setState)}
            className="text-xs text-destructive hover:underline"
          >
            키 삭제
          </button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" size="sm" className="mb-6 gap-1 text-muted-foreground" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4" /> 대시보드
        </Button>

        <h1 className="text-2xl font-bold mb-1">⚙️ 설정</h1>
        <p className="text-sm text-muted-foreground mb-6">API 키를 등록하여 AI 기능을 사용하세요.</p>

        <div className="space-y-4">
          {renderKeyInput("Gemini API Key", "gemini", gemini, setGemini, "AIza...")}
          {renderKeyInput("ElevenLabs API Key", "elevenlabs", elevenlabs, setElevenlabs, "sk_...")}
        </div>

        <Card className="border-border/60 mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">👤 내 정보</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><span className="text-muted-foreground">이메일:</span> {user?.email}</p>
            <p><span className="text-muted-foreground">가입일:</span> {user?.created_at ? new Date(user.created_at).toLocaleDateString("ko-KR") : "-"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
