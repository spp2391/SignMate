﻿import React, { useEffect, useMemo, useState } from "react";
import { Search, ShieldCheck, Loader2 } from "lucide-react";
import { ListView, GridView } from "./InboxViews";
import { ContractStatus, ContractType } from "./inboxUtils";
import {   useNavigate } from "react-router-dom";
function decodeUserIdFromToken() {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    
    return payload?.id ?? null;
  } catch {
    return null;
  }
}

export default function Inbox({ resolvedUserId: userIdProp,isLoggedIn, loginUser }) {

  const navigate = useNavigate();
  const [memberType, setMemberType] = useState();
  
  const resolvedUserId = userIdProp ?? decodeUserIdFromToken() ?? 1;

  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [contractType, setContractType] = useState("all");
  const [sort, setSort] = useState("recent");
  const [onlyCompleted, setOnlyCompleted] = useState(false);
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다..");
      navigate("/login", { replace: true });
    } else {
      if (loginUser.kakaoId) {
        setMemberType("kakao");
      } else if (loginUser.googleId) {
        setMemberType("google");
      } else if (loginUser.naverId) {
        setMemberType("naver");
      } else {
        setMemberType("normal");
      }
    }
   console.log("로그인 유저아이디는:"+resolvedUserId);
    setIsLoading(true);
    fetch(`http://localhost:8080/contracts/user/${resolvedUserId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
         console.log("서버에서 받은 원본 JSON:", json);
         
        const items = Array.isArray(json) ? json : (json?.contracts ?? []);
        setContracts(items);
      })
      .catch((err) => {
        console.error(err);
        setContracts([]);
      })
      .finally(() => setIsLoading(false));
  }, [resolvedUserId]);
  

  const filtered = useMemo(() => {
    const q = (query ?? "").toLowerCase().trim();

    let out = (Array.isArray(contracts) ? contracts : []).filter((d) => {
      const title = (d.title ?? "").toLowerCase();
      const participantsText = `${d.writerName || ""} ${d.receiverName || ""}`.toLowerCase();
      const queryOk = !q || title.includes(q) || participantsText.includes(q);
      const statusOk = status === "all" || d.status === status;
      const typeOk = contractType === "all" || d.contractType === contractType;
      const completedOk = !onlyCompleted || d.status === ContractStatus.COMPLETED;
      return queryOk && statusOk && typeOk && completedOk;
    });

    if (sort === "title") {
      out = [...out].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else {
      out = [...out].sort(
        (a, b) =>
          new Date(b.lastEdited || b.updatedAt || b.contractEndDate || 0).getTime() -
          new Date(a.lastEdited || a.updatedAt || a.contractEndDate || 0).getTime()
      );
    }

    return out;
  }, [contracts, query, status, contractType, onlyCompleted, sort]);

  const anyChecked = Object.values(selected).some(Boolean);

  const handleDeleteSelected = async () => {
  const selectedIds = Object.keys(selected).filter((contractId) => selected[contractId]);
  if (selectedIds.length === 0) return;

  try {
    for (const contractId of selectedIds) {
      // 선택된 계약 가져오기
      const doc = contracts.find((c) => String(c.contractId) === contractId);
      if (!doc) continue;

      // 계약 유형별 URL 결정
      let url = "";
      switch (doc.contractType) {
        case ContractType.SECRET:
          url = `/api/secret/${contractId}`;
          break;
        case ContractType.OUTSOURCING:
          url = `/api/outsourcing/${contractId}`;
          break;
        case ContractType.EMPLOYMENT:
          url = `/api/employment/${contractId}`;
          break;
        case ContractType.SERVICE:
          url = `/api/service/${contractId}`;
          break;
        case ContractType.SUPPLY:
          url = `/api/supply/${contractId}`;
          break;
        default:
          console.warn("알 수 없는 계약 유형:", doc.contractType);
          continue;
      }

      // DELETE 요청
      const res = await fetch(url, { method: "DELETE",headers: {
    "Authorization": "Bearer " + localStorage.getItem("accessToken"),
    "Content-Type": "application/json"
  } });
      if (!res.ok) throw new Error(`삭제 실패: 작성자 본인만 삭제 할 수있습니다.`);
    }

    // 선택 초기화 & 리스트 갱신
    setSelected({});
    setContracts((prev) => prev.filter((c) => !selectedIds.includes(String(c.contractId))));
    alert("선택한 계약 삭제 완료!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


  return (
    <div className="w-full p-4 md:p-8"  style={{
    paddingLeft: "400px",
    paddingRight: "400px",
    marginBottom: "300px"
   
  }} >
      <div className="mb-4 flex items-center justify-between" >
        <div className="text-xl md:text-2xl font-semibold" style={{fontSize:"30px", marginBottom:"10px"}}>계약서 보관함</div>
        <div className="flex items-center gap-2">
          <button
            className="hidden md:inline-flex rounded-md border px-3 py-2 text-sm"
            onClick={() => setView(view === "list" ? "grid" : "list")}
            style={{fontSize:"15px"}}
          >
            {view === "list" ? "그리드 보기" : "리스트 보기"}
          </button>
          <button className="rounded-md bg-black text-white px-3 py-2 text-sm inline-flex items-center gap-2" style={{fontSize:"15px", padding:"7px"}}>
            <ShieldCheck className="h-4 w-4" /> 계약서 보안
          </button>
        </div>
      </div>

      <div className="mb-4 rounded-xl border">
        <div className="p-4">
          <div className="grid gap-3 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
                <input
                  className="h-14 w-full rounded-md border pl-8 pr-3 text-sm"
                  placeholder="참여자 검색"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{fontSize:"20px"}}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <select
                className="h-14 w-full rounded-md border px-3 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{fontSize:"15px"}}
              >
                <option value="all" >모든 상태</option>
                <option value={ContractStatus.DRAFT}>작성 중</option>
                <option value={ContractStatus.IN_PROGRESS}>진행 중</option>
                <option value={ContractStatus.COMPLETED}>서명 완료</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                className="h-14 w-full rounded-md border px-3 text-sm"
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                style={{fontSize:"15px"}}
              >
                <option value="all">전체 유형</option>
                <option value={ContractType.EMPLOYMENT}>근로 계약서</option>
                <option value={ContractType.OUTSOURCING}>업무위탁 계약서</option>
                <option value={ContractType.SECRET}>비밀유지계약서</option>
                <option value={ContractType.SERVICE}>용역 계약서</option>
                <option value={ContractType.SUPPLY}>자재/물품 공급계약서</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                className="h-14 w-full rounded-md border px-3 text-sm"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{fontSize:"15px"}}
              >
                <option value="recent">최신 수정순</option>
                <option value="title">제목순</option>
              </select>
            </div>

            <div className="md:col-span-2 flex items-center justify-end">
              <label className="inline-flex items-center gap-2 text-sm" style={{fontSize:"15px"}}>
                <input
                  type="checkbox"
                  checked={onlyCompleted}
                  onChange={(e) => setOnlyCompleted(e.target.checked)}
                  
                />
                완료(서명 완료)만 보기
              </label>
            </div>
          </div>
        </div>
      </div>

      {anyChecked && (
        <div className="mb-3 flex items-center justify-between rounded-xl border p-3 bg-neutral-50">
          <div className="text-sm text-neutral-600" style={{fontSize:"15px"}}>
            선택됨: {Object.values(selected).filter(Boolean).length}건
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-md border px-3 py-2 text-sm" style={{fontSize:"15px"}}>다운로드</button>
            <button className="rounded-md border px-3 py-2 text-sm" style={{fontSize:"15px"}}>계약서 유형 변경</button>
           <button
  className="rounded-md bg-red-600 text-white px-3 py-2 text-sm"
  onClick={handleDeleteSelected}
  style={{fontSize:"15px"}}
>
  삭제
</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-neutral-500" style={{fontSize:"15px"}}>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          불러오는 중…
        </div>
      ) : (
        <>
          <div className="mb-3 inline-flex rounded-md border p-1">
            <button
              className={`px-3 py-1 text-sm rounded ${view === "list" ? "bg-black text-white" : ""}`}
              onClick={() => setView("list")}
              style={{fontSize:"15px"}}
            >
              리스트
            </button>
            <button
              className={`px-3 py-1 text-sm rounded ${view === "grid" ? "bg-black text-white" : ""}`}
              onClick={() => setView("grid")}
              style={{fontSize:"15px"}}
            >
              그리드
            </button>
          </div>

          {view === "list" ? (
            <ListView docs={filtered} selected={selected} setSelected={setSelected} />
          ) : (
            <GridView docs={filtered} selected={selected} setSelected={setSelected} />
          )}
        </>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-neutral-600" style={{fontSize:"15px"}}>총 {filtered.length}건</div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border px-3 py-2 text-sm" style={{fontSize:"15px"}}>이전</button>
          <button className="rounded-md border px-3 py-2 text-sm" style={{fontSize:"15px"}}>다음</button>
        </div>
      </div>
    </div>
  );
};