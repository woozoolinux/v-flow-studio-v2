import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, BarChart3, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  is_blocked: boolean;
  created_at: string;
}

interface UsageStat {
  action_type: string;
  count: number;
}

export default function Admin() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<UsageStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
      return;
    }
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    const [profilesRes, statsRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("usage_logs").select("action_type"),
    ]);

    if (profilesRes.data) setUsers(profilesRes.data as UserProfile[]);

    if (statsRes.data) {
      const counts: Record<string, number> = {};
      (statsRes.data as any[]).forEach((log) => {
        counts[log.action_type] = (counts[log.action_type] || 0) + 1;
      });
      setStats(Object.entries(counts).map(([action_type, count]) => ({ action_type, count })));
    }

    setLoading(false);
  };

  const toggleBlock = async (userId: string, currentlyBlocked: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_blocked: !currentlyBlocked })
      .eq("id", userId);

    if (error) {
      toast.error("상태 변경 실패");
    } else {
      toast.success(currentlyBlocked ? "차단 해제됨" : "차단됨");
      loadData();
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" size="sm" className="mb-6 gap-1 text-muted-foreground" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4" /> 대시보드
        </Button>

        <h1 className="text-2xl font-bold mb-1">🛡️ 관리자 페이지</h1>
        <p className="text-sm text-muted-foreground mb-6">사용자 관리 및 사용량 통계</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-xs text-muted-foreground">전체 사용자</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.reduce((a, b) => a + b.count, 0)}</p>
                <p className="text-xs text-muted-foreground">총 사용 횟수</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.filter((u) => u.is_blocked).length}</p>
                <p className="text-xs text-muted-foreground">차단된 사용자</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage by type */}
        {stats.length > 0 && (
          <Card className="border-border/60 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">📊 기능별 사용량</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {stats.map((s) => (
                  <div key={s.action_type} className="rounded-lg bg-muted/50 px-4 py-2">
                    <p className="text-sm font-medium">{s.action_type}</p>
                    <p className="text-lg font-bold text-primary">{s.count}회</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* User list */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">👥 사용자 목록</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground py-4 text-center">로딩 중...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>가입일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.display_name || "-"}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(u.created_at).toLocaleDateString("ko-KR")}
                      </TableCell>
                      <TableCell>
                        {u.is_blocked ? (
                          <Badge variant="destructive" className="text-xs">차단됨</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">활성</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={u.is_blocked ? "outline" : "destructive"}
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => toggleBlock(u.id, u.is_blocked)}
                        >
                          {u.is_blocked ? "차단 해제" : "차단"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
