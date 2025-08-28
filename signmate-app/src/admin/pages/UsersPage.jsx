// src/admin/pages/UsersPage.jsx
import * as React from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Stack, Pagination, CircularProgress, Chip,
  FormControl, InputLabel, Select, MenuItem, Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { fetchUsers, getUserDetail, updateUser, deleteUser } from "../services/adminApi.js";

/** 라벨/유틸 */
const ROLE_LABEL = { ADMIN: "관리자", USER: "일반" };
const toRole = (u) => (u?.userType ?? u?.role ?? "").toUpperCase();

function formatDate(d) {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    // Spring LocalDateTime 직렬화가 "2025-08-28T..." 형태면 이것도 커버
    if (!isNaN(dt.getTime())) return dt.toISOString().split("T")[0];
    const s = String(d);
    return s.includes("T") ? s.split("T")[0] : s.slice(0, 10);
  } catch {
    return "-";
  }
}

/** ─────────────────────────  회원 상세 다이얼로그  ───────────────────────── **/
function UserDetailDialog({ open, onClose, user, onSave }) {
  const normalize = (u) => ({
    ...u,
    userType: (u?.userType ?? u?.role ?? "USER").toUpperCase(),
  });

  const [form, setForm] = React.useState(normalize(user ?? {}));
  React.useEffect(() => setForm(normalize(user ?? {})), [user]);
  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: 22, fontWeight: 800, py: 2 }}>
        회원 상세
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          "& .MuiInputBase-input": { fontSize: 16.5, py: 1.2 },
          "& .MuiInputLabel-root": { fontSize: 14.5 },
          "& .MuiSelect-select": { fontSize: 16.5, py: 1.2 },
        }}
      >
        <Grid container spacing={2.2}>
          <Grid item xs={12} sm={6}>
            <TextField label="이름" fullWidth value={form?.name ?? ""} onChange={set("name")} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="이메일" fullWidth value={form?.email ?? ""} onChange={set("email")} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="role-label">권한</InputLabel>
              <Select
                labelId="role-label"
                label="권한"
                value={form?.userType ?? "USER"}
                onChange={set("userType")}
              >
                <MenuItem value="USER">일반</MenuItem>
                <MenuItem value="ADMIN">관리자</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="닉네임" fullWidth value={form?.nickname ?? ""} onChange={set("nickname")} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="회사명" fullWidth value={form?.companyName ?? ""} onChange={set("companyName")} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="가입일" fullWidth value={formatDate(form?.regdate)} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="수정일" fullWidth value={formatDate(form?.moddate)} InputProps={{ readOnly: true }} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.6 }}>
        <Button onClick={onClose} sx={{ fontSize: 15.5 }}>닫기</Button>
        <Button variant="contained" onClick={() => onSave(form)} sx={{ fontSize: 15.5 }}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** ─────────────────────────────  회원 목록  ───────────────────────────── **/
export default function UsersPage() {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [size] = React.useState(10);

  const [rows, setRows] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detailUser, setDetailUser] = React.useState(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const p = await fetchUsers({ page, size, query }); // 서버 검색 지원 시 사용됨
      setRows(p.content ?? []);
      setTotalPages(p.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [page, size, query]);

  React.useEffect(() => { load(); }, [load]);

  const onSearch = async (e) => {
    e?.preventDefault?.();
    // 서버 검색 미지원이어도 UX 위해 프론트 필터를 추가로 적용
    if (page !== 0) setPage(0);
    else await load();
  };

  // 클라이언트 사이드 보조 필터 (이름/이메일)
  const filtered = React.useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return rows;
    return (rows ?? []).filter((u) => {
      const n = (u.name || "").toLowerCase();
      const e = (u.email || "").toLowerCase();
      return n.includes(q) || e.includes(q);
    });
  }, [rows, query]);

  const openDetail = async (userId) => {
    const data = await getUserDetail(userId);
    setDetailUser(data);
    setDetailOpen(true);
  };

  const onSaveDetail = async (form) => {
    await updateUser(form.userId, {
      name: form.name,
      email: form.email,
      userType: form.userType, // USER / ADMIN
      nickname: form.nickname,
      companyName: form.companyName,
    });
    setDetailOpen(false);
    await load();
  };

  const onDelete = async (userId) => {
    // 기본 confirm → 필요 시 ConfirmDialog로 교체 가능
    if (!window.confirm("정말 삭제하시겠어요?")) return;
    await deleteUser(userId);
    await load();
  };

  return (
    <>
      {/* 상단 헤더 카드 */}
      <Card
        elevation={0}
        sx={{
          mb: 2.5,
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e7edf6",
        }}
      >
        <Box
          sx={{
            px: 3, py: 2.5,
            background: "linear-gradient(135deg,#eff6ff 0%, #f8fbff 60%, #ffffff 100%)",
            borderBottom: "1px solid #eef2f7",
          }}
        >
          <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
            회원 관리
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: "text.secondary", mt: 0.5 }}>
            회원을 검색하고 권한을 변경하거나 정보를 수정하세요.
          </Typography>
        </Box>

        {/* 검색바 */}
        <CardContent sx={{ pt: 2.2 }}>
          <Box component="form" onSubmit={onSearch}>
            <Stack direction={{ xs: "column", sm: "row" }} gap={1.4} alignItems="center">
              <Box sx={{ position: "relative", width: { xs: "100%", sm: 420 } }}>
                <SearchIcon
                  sx={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}
                />
                <TextField
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="이름/이메일로 검색"
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      pl: 4.5,
                      borderRadius: 2,
                      boxShadow: "0 1px 0 rgba(16,24,40,.04), 0 1px 2px rgba(16,24,40,.06)",
                      bgcolor: "#fff",
                    },
                    "& .MuiInputBase-input": { fontSize: 16.5, py: 1.15 },
                  }}
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SearchIcon />}
                sx={{ fontSize: 15.5, py: 1.15, px: 2.6, borderRadius: 2 }}
              >
                검색
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* 표 카드 */}
      <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e7edf6" }}>
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, maxHeight: 560 }}>
          <Table stickyHeader sx={{
            "& th, & td": { fontSize: 16, py: 1.35 },
            "& thead th": { bgcolor: "#f6f8fc", fontWeight: 700, color: "#334155" },
            "& tbody tr:hover": { backgroundColor: "#f9fbff" },
            "& tbody tr:nth-of-type(odd)": { backgroundColor: "#fcfdff" },
          }}>
            <TableHead>
              <TableRow>
                <TableCell width={90}>번호</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>이메일</TableCell>
                <TableCell width={140}>권한</TableCell>
                <TableCell width={180}>가입일</TableCell>
                <TableCell align="center" width={160}>관리</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Box sx={{ opacity: 0.6 }}>
                      <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 0.5 }}>
                        결과가 없습니다
                      </Typography>
                      <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                        검색어를 변경해 보세요.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              )}

              {!loading && filtered.map((u, idx) => {
                const role = toRole(u);
                return (
                  <TableRow key={u.userId} hover>
                    <TableCell>{page * size + idx + 1}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => openDetail(u.userId)}
                        sx={{ fontSize: 15.5, textTransform: "none", px: 0.5 }}
                      >
                        {u.name}
                      </Button>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={ROLE_LABEL[role] ?? role ?? "-"}
                        color={role === "ADMIN" ? "error" : "default"}
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: 13, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(u.regdate)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="수정">
                        <IconButton onClick={() => openDetail(u.userId)} aria-label="edit">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="삭제">
                        <IconButton color="error" onClick={() => onDelete(u.userId)} aria-label="delete">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <CardContent sx={{ display: "flex", justifyContent: "center", py: 2.2 }}>
          <Pagination
            page={page + 1}
            count={Math.max(totalPages, 1)}
            onChange={(_, v) => setPage(v - 1)}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": { fontSize: 16, minWidth: 36, height: 36, borderRadius: 10 },
            }}
          />
        </CardContent>
      </Card>

      <UserDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        user={detailUser}
        onSave={onSaveDetail}
      />
    </>
  );
}
