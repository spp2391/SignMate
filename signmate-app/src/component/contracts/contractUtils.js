// 계약서에서 자주 쓰는 공통 유틸 모음
// 데이터 경로를 다루는 함수들만 분리해둠
// ContractBase.jsx에서 불러다 씀

//경로 유틸 
// "a.b[0].c" → ["a","b","0","c"]
export const pathToParts = (path) =>
  String(path || "").replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);

// 객체 경로 읽기
export const getByPath = (obj, path) =>
  !path ? obj : pathToParts(path).reduce((acc, k) => (acc == null ? acc : acc[k]), obj);

// 객체 경로 쓰기 (중간 경로 자동 생성)
export const setByPath = (obj, path, val) => {
  const parts = pathToParts(path);
  if (!parts.length) return obj;
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (cur[k] == null || typeof cur[k] !== "object")
      cur[k] = /^\d+$/.test(parts[i + 1]) ? [] : {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = val;
  return obj;
};

// 깊은 병합(배열은 교체, 객체는 재귀 병합)
export function deepMerge(target = {}, source = {}) {
  const out = Array.isArray(target) ? [...target] : { ...target };
  Object.keys(source || {}).forEach((k) => {
    const sv = source[k];
    const tv = out[k];
    if (sv && typeof sv === "object" && !Array.isArray(sv) && tv && typeof tv === "object" && !Array.isArray(tv)) {
      out[k] = deepMerge(tv, sv);
    } else {
      out[k] = Array.isArray(sv) ? [...sv] : sv;
    }
  });
  return out;
}

// 표시 유틸 
export const pretty = (v) => (typeof v === "boolean" ? (v ? "예" : "아니오") : v == null ? "" : String(v));
export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// 테이블 HTML 렌더러 (미리보기에서 표로 보이게)
export function renderTableHTML(tableFieldDef, rows = []) {
  const cols = tableFieldDef.columns || [];
  const safe = (x) => esc(pretty(x ?? ""));

  const header = `
    <thead>
      <tr>
        ${cols.map((c) => `<th>${esc(c.label || c.key)}</th>`).join("")}
      </tr>
    </thead>`;

  const body = `
    <tbody>
      ${
        rows.length
          ? rows
              .map(
                (row) => `
              <tr>
                ${cols.map((c) => `<td>${safe((row || {})[c.key])}</td>`).join("")}
              </tr>`
              )
              .join("")
          : `<tr><td colspan="${cols.length}" class="empty">입력된 항목이 없습니다.</td></tr>`
      }
    </tbody>`;

  return `
    <div class="table-preview">
      <div class="table-title">${esc(tableFieldDef.label || tableFieldDef.name)}</div>
      <table class="tbl print">
        ${header}
        ${body}
      </table>
    </div>`;
}

// 본문 치환 — table인 경우 표로 렌더 
// 린트(no-useless-escape) 회피: 문자셋 명시 
export function renderBodyHTML(template, data, activeKey, orderMap, fieldsByName) {
  return template.replace(/{{\s*([A-Za-z0-9_.[\]]+)\s*}}/g, (_, rawKey) => {
    const key = rawKey.trim();
    const parts = key.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
    let v = data;
    for (const p of parts) { if (v == null) break; v = v[p]; }

    const idx = orderMap && orderMap[key] != null ? Number(orderMap[key]) + 1 : null;
    const badge = idx ? `<span class="idx-badge">#${idx}</span>` : "";
    const isActive = activeKey && key === activeKey;

    // 서명: 인라인은 숨기고 위치 앵커만 유지(하단 섹션에서 출력)
    if (key.startsWith("sign.")) {
      return `<span class="anchor sig-inline ${isActive ? "hit" : ""}" data-key="${esc(key)}">${badge}</span>`;
    }

    // table 필드면 표 형태로 렌더
    const fieldDef = fieldsByName[key];
    if (fieldDef && fieldDef.type === "table") {
      const html = renderTableHTML(fieldDef, Array.isArray(v) ? v : []);
      return `<span class="anchor ${isActive ? "hit" : ""}" data-key="${esc(key)}">${html}</span>`;
    }

    // 일반 값
    let html = "";
    if (Array.isArray(v)) {
      html = (v || [])
        .map((row) =>
          row && typeof row === "object"
            ? Object.values(row ?? {}).map(pretty).join(" ")
            : pretty(row)
        )
        .map(esc)
        .join("<br/>");
    } else {
      html = esc(pretty(v ?? ""));
    }
    const content = html || "<span class='placeholder'>[입력]</span>";
    return `<span class="anchor ${isActive ? "hit" : ""}" data-key="${esc(key)}">${badge}${content}</span>`;
  });
}

// 서명 키 도우미 
export const counterpartOf = (k) => {
  const m = String(k || "");
  if (m.endsWith(".sender")) return "sign.receiver";
  if (m.endsWith(".receiver")) return "sign.sender";
  if (m.endsWith(".discloser")) return "sign.recipient";
  if (m.endsWith(".recipient")) return "sign.discloser";
  if (m.endsWith(".employer")) return "sign.employee";
  if (m.endsWith(".employee")) return "sign.employer";
  if (m.endsWith(".client")) return "sign.vendor";
  if (m.endsWith(".vendor")) return "sign.client";
  if (m.endsWith(".buyer")) return "sign.supplier";
  if (m.endsWith(".supplier")) return "sign.buyer";
  if (m.endsWith(".principal")) return "sign.agent";
  if (m.endsWith(".agent")) return "sign.principal";
  return null;
};

// 내 서명 경로 계산 
export function getMySignPath(role, template, signKeys) {
  const map = template?.signMap;
  if (map) {
    if (role === "sender" && map.sender) return map.sender;
    if (role === "receiver" && map.receiver) return map.receiver;
  }
  const has = (k) => signKeys.includes(k);
  if (role === "sender") {
    if (has("sign.sender")) return "sign.sender";
    if (has("sign.discloser")) return "sign.discloser";
    if (has("sign.employer")) return "sign.employer";
    if (has("sign.client")) return "sign.client";
    if (has("sign.buyer")) return "sign.buyer";
    if (has("sign.principal")) return "sign.principal";
  } else {
    if (has("sign.receiver")) return "sign.receiver";
    if (has("sign.recipient")) return "sign.recipient";
    if (has("sign.employee")) return "sign.employee";
    if (has("sign.vendor")) return "sign.vendor";
    if (has("sign.supplier")) return "sign.supplier";
    if (has("sign.agent")) return "sign.agent";
  }
  return role === "sender" ? "sign.sender" : "sign.receiver";
}

export const sigLabel = (k) => {
  const n = (k || "").replace(/^sign\./, "");
  const map = {
    sender: "보내는 사람",
    receiver: "받는 사람",
    discloser: "공개자",
    recipient: "수신자",
    employer: "사업주",
    employee: "근로자",
    client: "발주자(갑)",
    vendor: "수행자(을)",
    buyer: "수요자(을)",
    supplier: "공급자(갑)",
    principal: "갑",
    agent: "을",
  };
  return map[n] || n;
};
