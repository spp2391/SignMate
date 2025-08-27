// src/admin/pages/UsersPage.jsx
import * as React from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Table, TableHead, TableBody, TableRow, TableCell,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Select, MenuItem, Stack, Pagination, CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchUsers, getUserDetail, updateUser, deleteUser } from "../services/adminApi.js";

/** ─────────────────────────  회원 상세 다이얼로그  ───────────────────────── **/
function UserDetailDialog({ open, onClose, user, onSave }) {
  const [form, setForm] = React.useState(user ?? {});
  React.useEffect(() => setForm(user ?? {}), [user]);
  const set = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: 20, fontWeight: 700, py: 2 }}>
        회원 상세
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          "& .MuiFormControl-root": { // TextField / Select 공통 크기 업
            mt: 1,
          },
          "& .MuiInputBase-input": { fontSize: 16, py: 1.1 },
          "& .MuiSelect-select": { fontSize: 16, py: 1.1 },
          "& .MuiInputLabel-root": { fontSize: 14 },
        }}
      >
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="이름" fullWidth size="medium"
              value={form?.name ?? ""} onChange={set("name")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="이메일" fullWidth size="medium"
              value={form?.email ?? ""} onChange={set("email")}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Select fullWidth value={form?.role ?? "USER"} onChange={set("role")} size="medium">
              <MenuItem value="USER">USER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select fullWidth value={form?.type ?? "PERSONAL"} onChange={set("type")} size="medium">
              <MenuItem value="PERSONAL">PERSONAL</MenuItem>
              <MenuItem value="COMPANY">COMPANY</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="닉네임" fullWidth size="medium"
              value={form?.nickname ?? ""} onChange={set("nickname")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="회사명" fullWidth size="medium"
              value={form?.companyName ?? ""} onChange={set("companyName")}
            />
          </Grid>

          {/* 읽기 전용 */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="가입일" fullWidth size="medium"
              value={form?.regdate ?? ""} InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="수정일" fullWidth size="medium"
              value={form?.moddate ?? ""} InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose} sx={{ fontSize: 15 }}>닫기</Button>
        <Button variant="contained" onClick={() => onSave(form)} sx={{ fontSize: 15 }}>
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
      const p = await fetchUsers({ page, size, query });
      setRows(p.content ?? []);
      setTotalPages(p.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [page, size, query]);

  React.useEffect(() => { load(); }, [load]);

  const onSearch = async (e) => {
    e?.preventDefault?.();
    if (page !== 0) setPage(0);
    else await load();
  };

  const openDetail = async (userId) => {
    const data = await getUserDetail(userId);
    setDetailUser(data);
    setDetailOpen(true);
  };

  const onSaveDetail = async (form) => {
    await updateUser(form.userId, {
      name: form.name,
      email: form.email,
      role: form.role,
      type: form.type,
      nickname: form.nickname,
      companyName: form.companyName,
    });
    setDetailOpen(false);
    await load();
  };

  const onDelete = async (userId) => {
    if (!window.confirm("정말 삭제하시겠어요?")) return;
    await deleteUser(userId);
    await load();
  };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, fontSize: 22 }}>
        회원 관리
      </Typography>

      {/* 검색바 */}
      <Box component="form" onSubmit={onSearch} sx={{ mb: 2 }}>
        <Stack direction="row" gap={1.5} alignItems="center">
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름/이메일로 검색"
            size="medium"
            sx={{
              width: 380,
              bgcolor: "white",
              "& .MuiInputBase-input": { fontSize: 16, py: 1.1 },
            }}
          />
          <Button type="submit" variant="contained" sx={{ fontSize: 15, py: 1.1, px: 2.4 }}>
            검색
          </Button>
        </Stack>
      </Box>

      {/* 표 */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Table
            size="medium"
            sx={{
              "& th, & td": { fontSize: 16, py: 1.25 },
            }}
          >
            <TableHead sx={{ bgcolor: "#f3f6fb", "& .MuiTableCell-root": { fontWeight: 700, fontSize: 16 } }}>
              <TableRow>
                <TableCell width={90}>번호</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>이메일</TableCell>
                <TableCell>역할</TableCell>
                <TableCell>구분</TableCell>
                <TableCell align="center" width={160}>관리</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8, color: "text.secondary" }}>
                    데이터 없음
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={26} />
                  </TableCell>
                </TableRow>
              )}

              {rows.map((u, idx) => (
                <TableRow key={u.userId} hover>
                  <TableCell>{page * size + idx + 1}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => openDetail(u.userId)}
                      size="medium"
                      sx={{ fontSize: 15, textTransform: "none", px: 0.5 }}
                    >
                      {u.name}
                    </Button>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>{u.type}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => openDetail(u.userId)} aria-label="edit">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(u.userId)} aria-label="delete">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* 페이지네이션 */}
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <Pagination
              page={page + 1}
              count={Math.max(totalPages, 1)}
              onChange={(_, v) => setPage(v - 1)}
              color="primary"
              size="medium"
              sx={{
                "& .MuiPaginationItem-root": { fontSize: 15, minWidth: 36, height: 36 },
              }}
            />
          </Box>
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
