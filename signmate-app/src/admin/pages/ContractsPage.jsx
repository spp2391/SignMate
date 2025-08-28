// src/admin/pages/ContractsPage.jsx
import * as React from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Stack, Table, TableHead, TableBody, TableRow, TableCell,
  Chip, Pagination, CircularProgress, IconButton, TableContainer, Tooltip, Paper
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DraftsIcon from "@mui/icons-material/Drafts";
import { fetchContracts } from "../services/adminApi.js";

// 상태/유형 라벨 
const STATUS_LABEL = {
  DRAFT: "작성 중",
  IN_PROGRESS: "진행 중",
  COMPLETED: "서명 완료",
  CANCELED: "취소",
};
const TYPE_LABEL = {
  SERVICE: "용역 계약서",
  EMPLOYMENT: "근로 계약서",
  SECRET: "비밀유지 계약서",
  SUPPLY: "자재/물품 공급 계약서",
  OUTSOURCING: "업무위탁 계약서",
};
// 상세 라우트 베이스 
const TYPE_ROUTE = {
  SERVICE: "/service",
  EMPLOYMENT: "/employment",
  SECRET: "/secret",
  SUPPLY: "/supply",
  OUTSOURCING: "/outsourcing",
};
// 상태 서버 파라미터(단일값) 
function mapStatusParam(group) {
  if (group === "done") return "COMPLETED";
  if (group === "inprogress") return "IN_PROGRESS";
  return "";
}
const U = (v) => (v ? String(v).toUpperCase() : "");

// 상태 칩(테이블 내) 
function StatusChip({ value }) {
  const v = U(value);
  const label = STATUS_LABEL[v] ?? v ?? "-";
  const icon =
    v === "COMPLETED" ? <CheckCircleIcon fontSize="small" /> :
    v === "IN_PROGRESS" ? <ScheduleIcon fontSize="small" /> :
    <DraftsIcon fontSize="small" />;

  const color =
    v === "COMPLETED" ? "success" :
    v === "IN_PROGRESS" ? "info" :    
    v === "DRAFT" ? "warning" :
    "default";

  return (
    <Chip
      icon={icon}
      label={label}
      color={color}
      variant={v === "IN_PROGRESS" ? "filled" : "outlined"}
      size="small"
      sx={{ fontSize: 14, borderRadius: 2 }}
    />
  );
}

export default function ContractsPage() {
  const [query, setQuery] = React.useState("");
  const [statusGroup, setStatusGroup] = React.useState("all"); 
  const [page, setPage] = React.useState(0);
  const [size] = React.useState(10);

  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const status = mapStatusParam(statusGroup);
      const p = await fetchContracts({ page, size, status: status || undefined });
      setRows(p.content ?? []);
    } finally {
      setLoading(false);
    }
  }, [page, size, statusGroup]);

  React.useEffect(() => { load(); }, [load]);

  const onSearchSubmit = (e) => {
    e?.preventDefault?.();
    setPage(0);
  };

  const getStatus = (r) => U(r.status ?? r.contractStatus);
  const getType = (r) => U(r.contractType ?? r.type);
  const getTitleKo = (r) => TYPE_LABEL[getType(r)] ?? "-";

  // 프론트 
  const filtered = React.useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    return (rows ?? []).filter((c) => {
      const s = getStatus(c);
      if (statusGroup === "inprogress" && s !== "IN_PROGRESS") return false;
      if (statusGroup === "done" && s !== "COMPLETED") return false;
      if (!q) return true;
      const title = getTitleKo(c).toLowerCase();
      const writer = (c.writerName || "").toLowerCase();
      const receiver = (c.receiverName || "").toLowerCase();
      return title.includes(q) || writer.includes(q) || receiver.includes(q);
    });
  }, [rows, query, statusGroup]);

  const start = page * size;
  const pageItems = filtered.slice(start, start + size);
  const pageCount = Math.max(1, Math.ceil(filtered.length / size));

  const openDetail = (row) => {
    const id = row.id;
    const base = TYPE_ROUTE[getType(row)];
    if (!id || !base) return;
    window.location.href = `${base}/${id}`;
  };

  
  const StatusChips = () => {
    const colorOf = (key, selected) => {
      if (!selected) return "default";
      if (key === "all") return "info";
      if (key === "inprogress") return "success";
      if (key === "done") return "secondary";
      return "default";
    };
    return (
      <Stack direction="row" gap={1.2} sx={{ mt: 1 }}>
        {[
          { key: "all", label: "전체" },
          { key: "inprogress", label: "진행중" },
          { key: "done", label: "완료" },
        ].map((it) => {
          const selected = statusGroup === it.key;
          return (
            <Chip
              key={it.key}
              label={it.label}
              color={colorOf(it.key, selected)}
              variant={selected ? "filled" : "outlined"}
              onClick={() => { setStatusGroup(it.key); setPage(0); }}
              sx={{ fontSize: 15, height: 40, borderRadius: 2 }}
            />
          );
        })}
      </Stack>
    );
  };

  return (
    <>
      {/* 상단 카드 헤더 */}
      <Card elevation={0} sx={{ mb: 2.5, borderRadius: 3, overflow: "hidden", border: "1px solid #e7edf6" }}>
        <Box
          sx={{
            px: 3, py: 2.5,
            background: "linear-gradient(135deg,#eff6ff 0%, #f8fbff 60%, #ffffff 100%)",
            borderBottom: "1px solid #eef2f7",
          }}
        >
          <Typography sx={{ fontSize: 24, fontWeight: 800, letterSpacing: 0.2 }}>
            계약 관리
          </Typography>
          <Typography sx={{ fontSize: 14.5, color: "text.secondary", mt: 0.5 }}>
            계약서 현황을 검색하고 상태별로 빠르게 필터링하세요.
          </Typography>
        </Box>

        <CardContent sx={{ pt: 2.5 }}>
          <Stack
            component="form"
            onSubmit={onSearchSubmit}
            direction={{ xs: "column", sm: "row" }}
            gap={1.6}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
          >
            <Box sx={{ display: "flex", gap: 1.2, alignItems: "center", flex: 1 }}>
              <Box sx={{ position: "relative", flex: 1 }}>
                <SearchIcon sx={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }} />
                <TextField
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(0); }}
                  placeholder="제목/발주자/수급자 검색"
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      pl: 4.8,
                      borderRadius: 2,
                      boxShadow: "0 1px 0 rgba(16,24,40,.04), 0 1px 2px rgba(16,24,40,.06)",
                      bgcolor: "#fff",
                    },
                    "& .MuiInputBase-input": { fontSize: 18, py: 1.3 },
                  }}
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SearchIcon />}
                sx={{ fontSize: 17, py: 1.25, px: 2.8, borderRadius: 2 }}
              >
                검색
              </Button>
            </Box>

            <StatusChips />
          </Stack>
        </CardContent>
      </Card>

      {/* 표 카드 */}
      <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e7edf6" }}>
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, maxHeight: 560 }}>
          <Table stickyHeader sx={{
            "& th, & td": { fontSize: 18, py: 1.6 },                
            "& thead th": { bgcolor: "#f6f8fc", fontWeight: 700, color: "#334155" },
            "& tbody tr:hover": { backgroundColor: "#f9fbff" },
            "& tbody tr:nth-of-type(odd)": { backgroundColor: "#fcfdff" },
          }}>
            <TableHead>
              <TableRow>
                <TableCell width={80}>번호</TableCell>
                <TableCell width={160}>상태</TableCell>
                <TableCell >계약서 제목</TableCell>
                <TableCell width={180}>발주자</TableCell>
                <TableCell width={180}>수급자</TableCell>
                <TableCell width={240}>계약 유형</TableCell>
                <TableCell width={160}>등록일</TableCell>
                <TableCell align="center" width={120}>상세보기</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!loading && pageItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Box sx={{ opacity: 0.6 }}>
                      <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 0.5 }}>
                        검색 결과가 없습니다
                      </Typography>
                      <Typography sx={{ fontSize: 15, color: "text.secondary" }}>
                        검색어/필터를 변경해 다시 시도하세요.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              )}

              {!loading && pageItems.map((c, idx) => {
                const status = getStatus(c);
                const type = getType(c);
                const titleKo = getTitleKo(c);
                return (
                  <TableRow key={c.id} hover>
                    <TableCell>{start + idx + 1}</TableCell>
                    <TableCell><StatusChip value={status} /></TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{titleKo}</Typography>
                    </TableCell>
                    <TableCell>{c.writerName ?? "-"}</TableCell>
                    <TableCell>{c.receiverName ?? "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={TYPE_LABEL[type] ?? type}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: 14, borderRadius: 2 }}
                      />
                    </TableCell>
                    <TableCell>{(c.createdAt ?? "").slice(0, 10)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="상세보기">
                        <span>
                          <IconButton size="small" onClick={() => openDetail(c)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </span>
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
            count={pageCount}
            onChange={(_, v) => setPage(v - 1)}
            color="primary"
            sx={{ "& .MuiPaginationItem-root": { fontSize: 17, minWidth: 38, height: 38, borderRadius: 10 } }}
          />
        </CardContent>
      </Card>
    </>
  );
}
