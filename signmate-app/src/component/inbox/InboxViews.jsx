import React from "react";
import { FileText } from "lucide-react";
import {
  STATUS_META,
  CONTRACT_TYPE_LABEL,
  CONTRACT_TYPE_PATH,
  formatLocalDateTime,
} from "./inboxUtils";
import { useNavigate } from "react-router-dom";

function StatusBadge({ status }) {
  const meta =
    STATUS_META[status] || {
      label: status || "UNKNOWN",
      Icon: FileText,
      className: "bg-neutral-100 text-neutral-700 border-neutral-200",
    };
  const Icon = meta.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium ${meta.className}`}
      style={{fontSize:"15px"}}
    >
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}

export function ListView({ docs, selected, setSelected }) {
  const navigate = useNavigate();
  const allChecked = docs.length > 0 && docs.every((d) => selected[d.contractId]);

  const toggleAll = (checked) => {
    const next = {};
    docs.forEach((d) => (next[d.contractId] = !!checked));
    setSelected(next);
  };

  const goDetail = (d) => {
    const seg =
      CONTRACT_TYPE_PATH[d.contractType] ||
      String(d.contractType || "").toLowerCase();
    navigate(`/${seg}/${d.contractId}`);
  };

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="grid grid-cols-12 items-center gap-2 border-b bg-neutral-50 p-3 text-xs font-medium text-neutral-600">
        <div className="col-span-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(e) => toggleAll(e.target.checked)}
          />
          <span style={{fontSize:"15px"}}>제목</span>
        </div>
        <div className="col-span-2" style={{fontSize:"15px"}}>유형</div>
        <div className="col-span-2" style={{fontSize:"15px"}}>상태</div>
        <div className="col-span-2" style={{fontSize:"15px"}}>최근 수정</div>
      </div>

      {docs.map((d) => (
        <div
          key={d.contractId}
          className="grid grid-cols-12 items-center gap-2 border-b p-3 hover:bg-neutral-50"
          style={{fontSize:"25px"}}
        >
          <div className="col-span-6 flex items-center gap-3">
            <input
              type="checkbox"
              checked={!!selected[d.contractId]}
              onChange={(e) =>
                setSelected((s) => ({ ...s, [d.contractId]: e.target.checked }))
              }
            />
            <div className="flex items-start gap-3">
              <div className="mt-3 hidden sm:block" >
                <FileText className="h-10 w-7 text-neutral-600" />
              </div>
              <div className="cursor-pointer" onClick={() => goDetail(d)}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium leading-tight" >
                    {d.title || CONTRACT_TYPE_LABEL[d.contractType] || "-"}
                  </span>
                  <StatusBadge status={d.status} />
                  <span className="rounded-full border px-3 py-2 text-xs bg-neutral-100" style={{fontSize:"15px"}}>
                    요청자
                  </span>
                </div>
                <div className="text-xs text-neutral-500 mt-0.5" style={{fontSize:"12px"}}>
                  {d.writerName+","+ d.receiverName|| "-"}
               
                  {d.address ? `, ${d.address}` : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <span className="rounded-full border px-3 py-2 text-xs" style={{fontSize:"15px"}}>
              {CONTRACT_TYPE_LABEL[d.contractType] ?? d.contractType}
            </span>
          </div>

          <div className="col-span-2">
            <StatusBadge status={d.status} />
          </div>

          <div className="col-span-2 text-sm" style={{fontSize:"15px"}}>
            
             {formatLocalDateTime(d.contractEndDate)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function GridView({ docs, selected, setSelected }) {
  const navigate = useNavigate();

  const goDetail = (d) => {
    const seg =
      CONTRACT_TYPE_PATH[d.contractType] ||
      String(d.contractType || "").toLowerCase();
    navigate(`/${seg}/${d.contractId}`);
  };
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {docs.map((d) => (
        <div key={d.contractId} onClick={() => goDetail(d)} className="rounded-xl border">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <StatusBadge status={d.status} />
              </div>
            </div>
          
            <div className="mt-3 font-medium leading-tight line-clamp-2">
               {CONTRACT_TYPE_LABEL[d.contractType] ?? d.contractType}
            </div>
            <div className="mt-1 text-xs text-neutral-500 line-clamp-1">
              {d.writerName+","+ d.receiverName|| "-"}
            </div>

            <div className="col-span-2 text-sm">
  {(() => {
    const time =
      d.effectiveDate ||
      d.contractStartDate ||
      d.contractEndDate ||
      d.updatedAt;
    if (!time) return "-";

    // YYYY-MM-DD 형태일 경우 T00:00:00 붙이기
    const isoTime = /^\d{4}-\d{2}-\d{2}$/.test(time) ? time + "T00:00:00" : time;
    return formatLocalDateTime(isoTime);
  })()}
</div>


            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!selected[d.contractId]}
                onChange={(e) =>
                  setSelected((s) => ({ ...s, [d.contractId]: e.target.checked }))
                }
              />
              <span className="text-xs text-neutral-500">선택</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}