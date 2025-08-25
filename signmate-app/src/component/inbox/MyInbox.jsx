import React, { useState } from "react";
import Inbox from "./Inbox";
import Dashboard from "./Dashboard";
import { useContracts } from "./useContracts";

export default function ContractsPage() {
  const [tab, setTab] = useState("inbox"); 
  const { data: contracts, isLoading } = useContracts();

  return (
    <div className="w-full p-4 md:p-8">
      <div className="mb-6 flex gap-2 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            tab === "inbox" ? "border-b-2 border-black text-black" : "text-neutral-500"
          }`}
          onClick={() => setTab("inbox")}
        >
          계약서 보관함
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            tab === "dashboard" ? "border-b-2 border-black text-black" : "text-neutral-500"
          }`}
          onClick={() => setTab("dashboard")}
        >
          대시보드
        </button>
      </div>

      {isLoading ? (
        <div>로딩중...</div>
      ) : tab === "inbox" ? (
        <Inbox contracts={contracts} isLoading={isLoading} />
      ) : (
        <Dashboard contracts={contracts} />
      )}
    </div>
  );
}
