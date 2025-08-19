// ContractBase.jsx
import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SignaturePad from "signature_pad";

/* ===== 경로 유틸 ===== */
// "a.b[0].c" → ["a","b","0","c"]
const pathToParts = (path) =>
  String(path || "").replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);

// 객체 경로 읽기
const getByPath = (obj, path) =>
  !path ? obj : pathToParts(path).reduce((acc, k) => (acc == null ? acc : acc[k]), obj);

// 객체 경로 쓰기 (중간 경로 자동 생성)
const setByPath = (obj, path, val) => {
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
function deepMerge(target = {}, source = {}) {
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

/* ===== 표시 유틸 ===== */
const pretty = (v) => (typeof v === "boolean" ? (v ? "예" : "아니오") : v == null ? "" : String(v));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* === 테이블 HTML 렌더러 (미리보기에서 표로 보이게) === */
function renderTableHTML(tableFieldDef, rows = []) {
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

/* === 본문 치환 — table인 경우 표로 렌더 === */
/* 린트(no-useless-escape) 회피: 문자셋 명시 */
function renderBodyHTML(template, data, activeKey, orderMap, fieldsByName) {
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

/* ===== 좌측 입력 필드 ===== */
function FieldInput({ field, value, onChange, onFocusField }) {
  if (field.type === "section") {
    return (
      <div className="mb">
        <div className="sec"><span className="sec-bullet" /><span className="sec-title">{field.label}</span></div>
      </div>
    );
  }
  if (field.type === "textarea") {
    return (
      <div className="mb">
        <label className="lbl">{field.label}</label>
        <textarea className="ipt" rows={5} value={value || ""} onFocus={() => onFocusField?.(field.name)}
          onChange={(e) => onChange(field.name, e.target.value)} />
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <div className="mb">
        <label className="lbl">{field.label}</label>
        <select className="ipt" value={value || ""} onFocus={() => onFocusField?.(field.name)}
          onChange={(e) => onChange(field.name, e.target.value)}>
          <option value="">선택</option>
          {(field.options || []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    );
  }
  if (field.type === "checkbox") {
    return (
      <div className="mb">
        <label className="lbl inline">
          <input type="checkbox" checked={!!value} onFocus={() => onFocusField?.(field.name)}
            onChange={(e) => onChange(field.name, e.target.checked)} /> {field.label}
        </label>
      </div>
    );
  }
  if (field.type === "table") {
    const rows = value || [];
    const addRow = () => onChange(field.name, [...rows, {}]);
    const removeRow = (i) => onChange(field.name, rows.filter((_, idx) => idx !== i));
    const setCell = (i, key, v) => {
      const copy = rows.map((r) => ({ ...r })); copy[i] = { ...copy[i], [key]: v }; onChange(field.name, copy);
    };
    const visibleRows = rows.length ? rows : Array.from({ length: field.minRows || 0 }).map(() => ({}));
    return (
      <div className="mb">
        <div className="rowHead"><label className="lbl">{field.label}</label><button type="button" className="btn" onClick={addRow}>+ 행 추가</button></div>
        <div className="scroll">
          <table className="tbl edit">
            <thead>
              <tr>
                {field.columns.map((c) => <th key={c.key}>{c.label}</th>)}
                <th style={{ width: 80 }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((_, i) => (
                <tr key={i}>
                  {field.columns.map((c) => (
                    <td key={c.key}>
                      <input
                        className="ipt cell"
                        type={c.type === "number" ? "number" : c.type === "date" ? "date" : "text"}
                        value={(rows[i] || {})[c.key] || ""}
                        onFocus={() => onFocusField?.(`${field.name}[${i}].${c.key}`)}
                        onChange={(e) => setCell(i, c.key, e.target.value)}
                      />
                    </td>
                  ))}
                  <td className="center"><button type="button" className="btn" onClick={() => removeRow(i)}>삭제</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  // text/number/date
  return (
    <div className="mb">
      <label className="lbl">{field.label}</label>
      <input className="ipt" type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        value={value || ""} onFocus={() => onFocusField?.(field.name)}
        onChange={(e) => onChange(field.name, e.target.value)} />
    </div>
  );
}

/* ===== 서명 키 도우미 ===== */
const counterpartOf = (k) => {
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

/** 내 서명 경로 계산:
 *  - template.signMap 우선
 *  - 그 외 body에 등장하는 다양한 명칭 인식
 *  - 최종 fallback: sender→sign.sender, receiver→sign.receiver
 */
function getMySignPath(role, template, signKeys) {
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

/* ===== 미리보기 하단 서명 섹션 ===== */
const sigLabel = (k) => {
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

function SignatureFooter({ signKeys, form }) {
  if (!signKeys?.length) return null;
  // 보기 좋은 정렬
  const order = ["sign.sender","sign.discloser","sign.employer","sign.client","sign.buyer","sign.principal","sign.receiver","sign.recipient","sign.employee","sign.vendor","sign.supplier","sign.agent"];
  const uniq = Array.from(new Set(signKeys));
  uniq.sort((a,b) => (order.indexOf(a) === -1 ? 999 : order.indexOf(a)) - (order.indexOf(b) === -1 ? 999 : order.indexOf(b)));
  return (
    <div className="sig-footer">
      <div className="sec" style={{marginTop:16}}><span className="sec-bullet" /><span className="sec-title">전자서명</span></div>
      <div className="sig-grid">
        {uniq.map((k) => {
          const v = getByPath(form, k);
          return (
            <div key={k} className="sig-cell">
              <div className="sig-role">{sigLabel(k)}</div>
              {v ? <img className="sign-img" src={v} alt="signature"/> : <span className="sign-box" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===== 메인 ===== */
export default function ContractBase({
  template,
  role = "sender",
  data = {},
  handleChange = () => {},
}) {
  const [title, setTitle] = useState(template.name);
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(data || {})));
  const [activeKey, setActiveKey] = useState(null);
  const previewRef = useRef(null);

  // 외부 data → 내부 form 병합(루프 방지)
  const dataRef = useRef(JSON.stringify(data || {}));
  useEffect(() => {
    const now = JSON.stringify(data || {});
    if (now !== dataRef.current) {
      dataRef.current = now;
      setForm((prev) => deepMerge(prev, data || {}));
    }
  }, [data]);

  // 내부 form 변경 시 상위로 통지
  useEffect(() => {
    handleChange && handleChange(form);
  }, [form, handleChange]);

  // 서명패드
  const sigCanvasRef = useRef(null);
  const sigPadRef = useRef(null);

  // 이름->필드정의 맵 (table 렌더에 사용)
  const fieldsByName = useMemo(() => {
    const map = {};
    (template.fields || []).forEach((f) => { if (f.name) map[f.name] = f; });
    return map;
  }, [template.fields]);

  // 본문에서 sign.* 키 수집
  const signKeysFromBody = useMemo(() => {
    const keys = new Set();
    const re = /{{\s*(sign\.[A-Za-z0-9_.[\]]+)\s*}}/g;
    let m;
    while ((m = re.exec(template.body))) keys.add(m[1]);
    return Array.from(keys);
  }, [template.body]);

  // 내 서명 경로 계산
  const mySignPath = useMemo(() => getMySignPath(role, template, signKeysFromBody), [role, template, signKeysFromBody]);

  // 하단 섹션에서 표시할 전체 서명 키(본문 키 + 내 키 + 상대 키)
  const allSignKeys = useMemo(() => {
    const list = new Set([...(signKeysFromBody || [])]);
    if (mySignPath) list.add(mySignPath);
    const cp = counterpartOf(mySignPath);
    if (cp) list.add(cp);
    return Array.from(list);
  }, [signKeysFromBody, mySignPath]);

  // PDF 내보내기 상태(배지/가이드 숨김용)
  const [exporting, setExporting] = useState(false);

  // 수정 가능 키 (editable + 서명키 + 내 서명/상대 서명 보강)
  const editableSet = useMemo(() => {
    const base = Array.isArray(template.editable)
      ? template.editable
      : (template.fields || []).filter((f) => f.type !== "section").map((f) => f.name);
    const extra = [mySignPath, counterpartOf(mySignPath)].filter(Boolean);
    return new Set([...base, ...signKeysFromBody, ...extra]);
  }, [template.editable, template.fields, signKeysFromBody, mySignPath]);

  // 본문 등장 순서 → 왼쪽 입력 정렬/배지 번호
  const docOrder = useMemo(() => {
    const order = {};
    const re = /{{\s*([A-Za-z0-9_.[\]]+)\s*}}/g;
    let m, idx = 0;
    while ((m = re.exec(template.body))) {
      const key = m[1];
      if (order[key] == null) order[key] = idx++;
    }
    return order;
  }, [template.body]);

  // 좌측 필드 (receiver는 입력 폼 숨김)
  const visibleFields = useMemo(() => {
    if (role === "receiver") return [];
    let all = (template.fields || []).filter((f) => f.type === "section" || editableSet.has(f.name));
    const sections = all.filter((f) => f.type === "section");
    const inputs = all.filter((f) => f.type !== "section");
    inputs.sort((a, b) => (docOrder[a.name] ?? 1e9) - (docOrder[b.name] ?? 1e9));
    return [...sections, ...inputs];
  }, [template.fields, editableSet, docOrder, role]);

  // 초기값
  useEffect(() => {
    const init = JSON.parse(JSON.stringify(template.defaults || {}));
    (template.fields || []).forEach((f) => {
      if (f.type === "section") return;
      const existed = getByPath(init, f.name);
      if (existed !== undefined) return;
      if (f.type === "table") setByPath(init, f.name, Array.from({ length: f.minRows || 0 }).map(() => ({})));
      else if (f.type === "checkbox") setByPath(init, f.name, false);
      else setByPath(init, f.name, "");
    });
    setForm(init);
    setTitle(template.name);
  }, [template]);

  // 값 변경(허용 키만) — receiver는 sign.* 외 차단
  const onChange = (name, value) => {
    if (role === "receiver" && !name.startsWith("sign.")) return;
    if (!editableSet.has(name)) return;
    setForm((p) => {
      const copy = JSON.parse(JSON.stringify(p || {}));
      setByPath(copy, name, value);
      return copy;
    });
  };

  // 미리보기 HTML
  const previewHtml = useMemo(
    () => renderBodyHTML(template.body, form, activeKey, docOrder, fieldsByName),
    [template, form, activeKey, docOrder, fieldsByName]
  );

  // 본문에 포함되지 않은 table을 하단에 자동 추가
  const extraTablesHtml = useMemo(() => {
    const bodyStr = template.body || "";
    const tables = (template.fields || []).filter((f) => f.type === "table");
    const missing = tables.filter((f) => !bodyStr.includes(`{{${f.name}}}`));
    if (!missing.length) return "";
    return missing
      .map((f) => renderTableHTML(f, getByPath(form, f.name) || []))
      .join("");
  }, [template.fields, template.body, form]);

  // 포커스 시 하이라이트
  useEffect(() => {
    if (!activeKey || !previewRef.current) return;
    const el = previewRef.current.querySelector(`[data-key="${CSS.escape(activeKey)}"]`);
    if (!el) return;
    el.classList.add("pulse");
    const t = setTimeout(() => el.classList.remove("pulse"), 800);
    return () => clearTimeout(t);
  }, [activeKey, previewHtml]);

  // PDF 저장 (sender/receiver 모두)
  const savePDF = async () => {
    const node = document.querySelector(".page");
    if (!node) return;
    try {
      setExporting(true);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: "#fff" });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const cw = canvas.width, ch = canvas.height;
      const ratio = ch / cw;
      let imgW = pageW;
      let imgH = imgW * ratio;
      if (imgH > pageH) { imgH = pageH; imgW = imgH / ratio; }
      const x = (pageW - imgW) / 2;
      const y = (pageH - imgH) / 2;
      pdf.addImage(img, "PNG", x, y, imgW, imgH);
      pdf.save(`${title || template.name}.pdf`);
    } finally {
      setExporting(false);
    }
  };

  // 서명패드 초기화 + 드로잉 끝나면 즉시 반영
  useLayoutEffect(() => {
    if (!sigCanvasRef.current) return;
    if (!sigPadRef.current) {
      sigPadRef.current = new SignaturePad(sigCanvasRef.current, { backgroundColor: "#fff" });
    }
    // 리사이즈
    const resize = () => {
      const c = sigCanvasRef.current;
      if (!c) return;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const w = c.offsetWidth, h = c.offsetHeight;
      c.width = Math.max(1, Math.floor(w * ratio));
      c.height = Math.max(1, Math.floor(h * ratio));
      const ctx = c.getContext("2d");
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      sigPadRef.current?.clear();
    };
    resize();
    window.addEventListener("resize", resize);

    // 드로잉 종료 시 즉시 반영
    sigPadRef.current.onEnd = () => {
      if (!sigPadRef.current) return;
      if (sigPadRef.current.isEmpty()) return;
      const dataURL = sigPadRef.current.toDataURL("image/png");
      onChange(mySignPath, dataURL);
      setActiveKey(mySignPath);
    };

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [mySignPath]);

  const clearSignature = () => sigPadRef.current?.clear();
  const applySignature = () => {
    if (!sigPadRef.current) return;
    if (sigPadRef.current.isEmpty()) { alert("서명을 입력해 주세요."); return; }
    const dataURL = sigPadRef.current.toDataURL("image/png");
    onChange(mySignPath, dataURL);
    setActiveKey(mySignPath);
  };

  const mySigLabel = useMemo(() => {
    const key = mySignPath?.replace("sign.", "") || "my";
    return `내 서명 (${key})`;
  }, [mySignPath]);

  return (
    <div className="wrap">
      <h1 className="ttl">{template.name}</h1>
      <div className="grid">
        {/* 좌측: 입력영역 */}
        <div>
          {/* sender만 제목/입력폼 보임 */}
          {role === "sender" && (
            <div className="mb">
              <label className="lbl">문서 제목</label>
              <input className="ipt" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
          )}

          {role === "sender" && visibleFields.map((f, idx) => (
            <div key={`${f.name || f.label}-${idx}`} onFocusCapture={() => f.name && setActiveKey(f.name)}>
              {f.type !== "section" && (<div className="badge">#{(docOrder[f.name] ?? 999) + 1}</div>)}
              <FieldInput field={f} value={getByPath(form, f.name)} onChange={onChange} onFocusField={setActiveKey} />
            </div>
          ))}

          {/* 전자서명 (좌측 영역) */}
          <div className="mb">
            <div className="sec"><span className="sec-bullet" /><span className="sec-title">전자서명</span></div>
            <label className="lbl">{mySigLabel}</label>
            <div className="sigpad"><canvas ref={sigCanvasRef} className="sig-canvas" /></div>
            <div style={{display:"flex", gap:8}}>
              <button className="btn" onClick={clearSignature}>지우기</button>
              <button className="btn primary" onClick={applySignature}>서명 적용</button>
            </div>
          </div>

          {/* PDF 버튼 — sender/receiver 모두 표시 */}
          <div className="mb" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn primary" onClick={savePDF}>PDF로 저장</button>
          </div>
        </div>

        {/* 우측: 미리보기 (sticky 적용) */}
        <div className="preview sticky">
          {/* sig-bottom: 인라인 sign.* 숨기고 하단 전용 섹션만 노출 */}
          <div className={`page ${exporting ? "export" : ""} sig-bottom`}>
            <div className="center">
              <div className="title">{title || template.name}</div>
              <div className="sub">{template.name}</div>
            </div>

            <div ref={previewRef} className="body" dangerouslySetInnerHTML={{ __html: previewHtml }} />

            {/* 본문에 포함되지 않은 표 자동 추가 */}
            {extraTablesHtml && <div className="body" dangerouslySetInnerHTML={{ __html: extraTablesHtml }} />}

            {/* 미리보기 '맨 아래' 전자서명 섹션 */}
            <SignatureFooter signKeys={allSignKeys} form={form} />

            {template.footerNote && <div className="foot">{template.footerNote}</div>}
          </div>
        </div>
      </div>

      {/* 스타일 */}
      <style>{`
        .wrap{max-width:1200px;margin:0 auto;padding:16px}
        .ttl{font-size:22px;font-weight:700;margin-bottom:12px}

        .grid{display:grid; gap:24px}
        @media (max-width:1099px){ .grid{grid-template-columns:1fr} }
        @media (min-width:1100px){
          .grid{
            grid-template-columns: repeat(2, minmax(520px, 560px));
            justify-content: center; align-items: start; column-gap: 32px;
          }
          .grid > div{ width: 100%; max-width: 560px; }
        }

        .mb{margin-bottom:14px}
        .lbl{display:block;font-size:14px;margin-bottom:6px;color:#333}
        .lbl.inline{display:inline-flex;align-items:center;gap:8px}

        .ipt{width:100%;border:1px solid #ddd;border-radius:10px;padding:10px 12px;font-size:14px}
        .ipt.cell{height:38px;font-size:14px;padding:8px 10px}
        textarea.ipt{min-height:96px}

        .btn{border:1px solid #222;border-radius:10px;padding:8px 12px;background:#fff;cursor:pointer}
        .btn.primary{background:#111;color:#fff}

        .preview{border:1px solid #e5e7eb;border-radius:12px;padding:0;background:#f9fafb}
        .sticky{position:sticky; top:12px; align-self:start; height:fit-content}

        .sec{display:flex;align-items:center;gap:8px;padding:6px 2px;border-bottom:1px dashed #e5e7eb}
        .sec-bullet{width:6px;height:6px;border-radius:50%;background:#111;display:inline-block}
        .sec-title{font-weight:700;font-size:13px}
        .badge{display:inline-block;margin:0 0 4px 0;font-size:11px;color:#555;background:#eef2ff;border:1px solid #c7d2fe;border-radius:6px;padding:2px 6px;font-weight:600;}

        .page{width:210mm; min-height:297mm; margin:0 auto; background:#fff; color:#000; padding:14mm; box-sizing:border-box; border-radius:12px; box-shadow:0 0 6px rgba(0,0,0,.08)}
        @page{ size:A4; margin:12mm }
        @media print{ .wrap{padding:0} .grid{display:block} .preview{border:none;padding:0} .page{box-shadow:none;border-radius:0;margin:0;width:auto;min-height:auto;padding:12mm} }

        .center{text-align:center}
        .title{font-size:18px;font-weight:700;margin-top:4px}
        .sub{font-size:12px;color:#666}
        .body{white-space:pre-wrap;word-break:break-word;line-height:1.65;margin-top:8px}
        .idx-badge{display:inline-block;margin-right:4px;font-size:10px;color:#555;background:#eef2ff;border:1px solid #c7d2fe;border-radius:6px;padding:1px 4px;vertical-align:baseline}

        .anchor{background:transparent;transition:background .2s, box-shadow .2s}
        .placeholder{color:#999}
        .hit{background:#fff7cc}
        .pulse{animation: pulse 0.8s ease;}
        @keyframes pulse{0%{box-shadow:0 0 0 0 rgba(250,204,21,.6)}100%{box-shadow:0 0 0 8px rgba(250,204,21,0)}}

        /* PDF 저장 시 배지/하이라이트 숨김 */
        .page.export .idx-badge,
        .page.export .badge,
        .page.export .hit,
        .page.export .pulse { display:none !important; box-shadow:none !important; background:transparent !important; }

        /* 본문 내 sign.* 숨김 (footer로 이동) */
        .page.sig-bottom .sig-inline { display:none !important; }

        /* 표 편집/프린트 공용 스타일 */
        .tbl{width:100%;border-collapse:collapse; table-layout:auto}
        .tbl th,.tbl td{border:1px solid #e5e7eb;padding:8px;text-align:left;vertical-align:middle}
        .tbl.edit th{position:sticky; top:0; background:#f8fafc; z-index:1}
        .tbl .ipt{width:100%}
        .tbl .ipt.cell{width:100%}
        .tbl td.center{ text-align:center }

        .scroll{overflow:auto}
        .tbl th{white-space:nowrap}
        .tbl.edit{min-width:720px}

        /* 미리보기 표 */
        .tbl.print{margin-top:6px}
        .table-preview{margin-top:12px}
        .table-preview .table-title{font-weight:700; margin:10px 0 6px}

        .sigpad{border:1px dashed #cbd5e1;border-radius:10px;background:#fff;height:160px;margin:6px 0 8px}
        .sig-canvas{width:100%;height:100%;display:block;border-radius:10px}
        .sign-img{display:block;margin:6px 0 10px;max-width:260px;max-height:100px;border-bottom:1px solid #111}
        .sign-box{display:inline-block;width:260px;height:60px;border-bottom:1px solid #111;background:transparent}

        /* 미리보기 하단 서명 레이아웃 */
        .sig-footer{margin-top:18px}
        .sig-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:8px}
        .sig-cell{display:flex;flex-direction:column;gap:6px}
        .sig-role{font-size:13px;color:#333}
        .foot{margin-top:16px;color:#666;font-size:12px}
        .rowHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
      `}</style>
    </div>
  );
}
