import * as React from "react";
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Stack, Table, TableHead, TableBody, TableRow, TableCell,
  Chip, Pagination, CircularProgress, IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { fetchContracts } from "../services/adminApi.js";

// 프론트 상태그룹 → 백엔드 enum CSV 매핑
function mapStatusGroupToCsv(group) {
  if (group === "done") return "COMPLETED";
  if (group === "inprogress") return "DRAFT,SIGN_REQUEST,SIGNED"; // 필요시 추가/조정
  return ""; // all
}

export default function ContractsPage() {
  const [query, setQuery] = React.useState("");
  const [statusGroup, setStatusGroup] = React.useState("all"); // all | inprogress | done
  const [page, setPage] = React.useState(0);
  const [size] = React.useState(10);

  const [rows, setRows] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const statusCsv = mapStatusGroupToCsv(statusGroup);
      const p = await fetchContracts({ page, size, query, status: statusCsv });
      setRows(p.content ?? []);
      setTotalPages(p.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [page, size, query, statusGroup]);

  React.useEffect(() => { load(); }, [load]);

  const onSearch = async (e) => {
    e?.preventDefault?.();
    if (page !== 0) setPage(0);
    else await load();
  };

  const StatusChips = () => (
    <Stack direction="row" gap={1} sx={{ mt: 1, mb: 1 }}>
      <Chip
        label="전체"
        variant={statusGroup === "all" ? "filled" : "outlined"}
        color={statusGroup === "all" ? "primary" : "default"}
        onClick={() => setStatusGroup("all")}
        size="small"
      />
      <Chip
        label="진행중"
        variant={statusGroup === "inprogress" ? "filled" : "outlined"}
        color={statusGroup === "inprogress" ? "primary" : "default"}
        onClick={() => setStatusGroup("inprogress")}
        size="small"
      />
      <Chip
        label="완료"
        variant={statusGroup === "done" ? "filled" : "outlined"}
        color={statusGroup === "done" ? "primary" : "default"}
        onClick={() => setStatusGroup("done")}
        size="small"
      />
    </Stack>
  );

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        계약 관리
      </Typography>

      <Box component="form" onSubmit={onSearch} sx={{ mb: 1 }}>
        <Stack direction="row" gap={1} alignItems="center">
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요."
            size="small"
            sx={{ width: 320, bgcolor: "white" }}
          />
          <Button type="submit" variant="contained" startIcon={<SearchIcon />}>
            검색
          </Button>
        </Stack>
      </Box>

      <StatusChips />

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: "#f3f6fb" }}>
              <TableRow>
                <TableCell width={80}>번호</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>발주자</TableCell>
                <TableCell>수급자</TableCell>
                <TableCell>유형</TableCell>
                <TableCell>등록일</TableCell>
                <TableCell align="center" width={100}>상세보기</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8, color: "text.secondary" }}>
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              )}

              {rows.map((c, idx) => (
                <TableRow key={c.id} hover>
                  <TableCell>{page * size + idx + 1}</TableCell>
                  <TableCell>{c.status}</TableCell>
                  <TableCell>{c.title}</TableCell>
                  <TableCell>{c.writerName}</TableCell>
                  <TableCell>{c.receiverName}</TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell>{(c.createdAt ?? "").slice(0, 10)}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" aria-label="상세보기">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <Pagination
              page={page + 1}
              count={Math.max(totalPages, 1)}
              onChange={(_, v) => setPage(v - 1)}
              color="primary"
              size="small"
            />
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
