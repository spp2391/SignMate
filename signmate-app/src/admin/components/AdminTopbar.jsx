import * as React from "react";
import { Avatar, Button, Stack, Typography } from "@mui/material";

export default function AdminTopbar() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Typography sx={{ display: { xs: "none", md: "block" }, color: "text.secondary" }}>홍길동님</Typography>
      <Avatar alt="홍길동" src="" sx={{ width: 36, height: 36 }} />
      <Button variant="outlined" size="small">로그아웃</Button>
    </Stack>
  );
}
