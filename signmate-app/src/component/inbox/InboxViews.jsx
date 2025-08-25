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
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${meta.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {meta.label}
    </span>
  );
}

export function ListView({ docs, selected, setSelected }) {
  const navigate = useNavigate();
  const allChecked = docs.length > 0 && docs.every((d) => selected[d.id]);

  const toggleAll = (checked) => {
    const next = {};
    docs.forEach((d) => (next[d.id] = !!checked));
    setSelected(next);
  };

  const goDetail = (d) => {
    const seg =
      CONTRACT_TYPE_PATH[d.contractType] ||
      String(d.contractType || "").toLowerCase();
    navigate(`/${seg}/${d.id}`);
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
          <span>제목</span>
        </div>
        <div className="col-span-2">유형</div>
        <div className="col-span-2">상태</div>
        <div className="col-span-2">최근 수정</div>
      </div>

      {docs.map((d) => (
        <div
          key={d.id}
          className="grid grid-cols-12 items-center gap-2 border-b p-3 hover:bg-neutral-50"
        >
          <div className="col-span-6 flex items-center gap-3">
            <input
              type="checkbox"
              checked={!!selected[d.id]}
              onChange={(e) =>
                setSelected((s) => ({ ...s, [d.id]: e.target.checked }))
              }
            />
            <div className="flex items-start gap-3">
              <div className="mt-0.5 hidden sm:block">
                <FileText className="h-5 w-5 text-neutral-500" />
              </div>
              <div className="cursor-pointer" onClick={() => goDetail(d)}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium leading-tight">
                    {d.title || CONTRACT_TYPE_LABEL[d.contractType] || "-"}
                  </span>
                  <StatusBadge status={d.status} />
                  <span className="rounded-full border px-2 py-0.5 text-xs bg-neutral-100">
                    요청자
                  </span>
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  {d.receiverName || "-"}
                  {d.address ? `, ${d.address}` : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <span className="rounded-full border px-2 py-0.5 text-xs">
              {CONTRACT_TYPE_LABEL[d.contractType] ?? d.contractType}
            </span>
          </div>

          <div className="col-span-2">
            <StatusBadge status={d.status} />
          </div>

          <div className="col-span-2 text-sm">
            {formatLocalDateTime(d.lastEdited || d.updatedAt || d.contractEndDate)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function GridView({ docs, selected, setSelected }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {docs.map((d) => (
        <div key={d.id} className="rounded-xl border">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <StatusBadge status={d.status} />
              </div>
            </div>

            <div className="mt-3 font-medium leading-tight line-clamp-2">
              {d.title || CONTRACT_TYPE_LABEL[d.contractType] || "-"}
            </div>
            <div className="mt-1 text-xs text-neutral-500 line-clamp-1">
              {d.receiverName || "-"}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="rounded-full border px-2 py-0.5 text-xs">
                {CONTRACT_TYPE_LABEL[d.contractType] ?? d.contractType}
              </span>
              <div className="text-xs text-neutral-500">
                {formatLocalDateTime(d.lastEdited || d.updatedAt || d.contractEndDate)}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!selected[d.id]}
                onChange={(e) =>
                  setSelected((s) => ({ ...s, [d.id]: e.target.checked }))
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
