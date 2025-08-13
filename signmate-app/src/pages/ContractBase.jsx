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

/* ===== 표시 유틸 ===== */
const pretty = (v) => (typeof v === "boolean" ? (v ? "예" : "아니오") : v == null ? "" : String(v));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ===== 본문 치환: {{key}} → 값 + 하이라이트/배지/서명 ===== */
function renderBodyHTML(template, data, activeKey, orderMap) {
  return template.replace(/{{\s*([\w.\[\]0-9]+)\s*}}/g, (_, rawKey) => {
    const key = rawKey.trim();
    const parts = key.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
    let v = data;
    for (const p of parts) { if (v == null) break; v = v[p]; }

    const idx = orderMap && orderMap[key] != null ? Number(orderMap[key]) + 1 : null;
    const badge = idx ? `<span class="idx-badge">#${idx}</span>` : "";
    const isActive = activeKey && key === activeKey;

    // 서명: dataURL 이미지 또는 빈 박스
    if (key.startsWith("sign.")) {
      const hasSig = v && String(v).startsWith("data:image/");
      const node = hasSig
        ? `<img class="sign-img" src="${esc(String(v))}" alt="signature"/>`
        : `<span class="sign-box"></span>`;
      return `<span class="anchor ${isActive ? "hit" : ""}" data-key="${esc(key)}">${badge}${node}</span>`;
    }

    // 일반 텍스트/배열
    let html = "";
    if (Array.isArray(v)) {
      html = (v || [])
        .map((row) => (row && typeof row === "object" ? Object.values(row ?? {}).map(pretty).join(" ") : pretty(row)))
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
        <textarea className="ipt" rows={4} value={value || ""} onFocus={() => onFocusField?.(field.name)}
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
          <table className="tbl">
            <thead>
              <tr>
                {field.columns.map((c) => <th key={c.key}>{c.label}</th>)}
                <th style={{ width: 64 }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((_, i) => (
                <tr key={i}>
                  {field.columns.map((c) => (
                    <td key={c.key}>
                      <input className="ipt" type={c.type === "number" ? "number" : c.type === "date" ? "date" : "text"}
                        value={(rows[i] || {})[c.key] || ""} onFocus={() => onFocusField?.(`${field.name}[${i}].${c.key}`)}
                        onChange={(e) => setCell(i, c.key, e.target.value)} />
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

/* ===== 메인 ===== */
export default function ContractBase({ template }) {
  const [title, setTitle] = useState(template.name);
  const [form, setForm] = useState({});
  const [activeKey, setActiveKey] = useState(null);
  const previewRef = useRef(null);

  // 서명패드
  const sigCanvasRef = useRef(null);
  const sigPadRef = useRef(null);

  // 본문에서 sign.* 키 자동 추출 (예: sign.principal, sign.agent ...)
  const signKeys = useMemo(() => {
    const keys = new Set();
    const re = /{{\s*(sign\.[\w.\[\]0-9]+)\s*}}/g;
    let m;
    while ((m = re.exec(template.body))) keys.add(m[1]);
    return Array.from(keys);
  }, [template.body]);

  // 서명 대상 (본문에 sign.*가 있으면 첫 번째를 기본값으로)
  const [sigTarget, setSigTarget] = useState(signKeys[0] || "sign.principal");

  // PDF 내보내기 상태(배지/가이드 숨김용)
  const [exporting, setExporting] = useState(false);

  // 수정 가능 키 (editable + signKeys 자동 포함)
  const editableSet = useMemo(() => {
    const base = Array.isArray(template.editable)
      ? template.editable
      : (template.fields || []).filter((f) => f.type !== "section").map((f) => f.name);
    return new Set([...base, ...signKeys]);
  }, [template.editable, template.fields, signKeys]);

  // 본문 등장 순서 → 왼쪽 입력 정렬/배지 번호
  const docOrder = useMemo(() => {
    const order = {};
    const re = /{{\s*([\w.\[\]0-9]+)\s*}}/g;
    let m, idx = 0;
    while ((m = re.exec(template.body))) {
      const key = m[1];
      if (order[key] == null) order[key] = idx++;
    }
    return order;
  }, [template.body]);

  // 좌측 필드 (섹션 + 입력)
  const visibleFields = useMemo(() => {
    const all = (template.fields || []).filter((f) => f.type === "section" || editableSet.has(f.name));
    const sections = all.filter((f) => f.type === "section");
    const inputs = all.filter((f) => f.type !== "section");
    inputs.sort((a, b) => (docOrder[a.name] ?? 1e9) - (docOrder[b.name] ?? 1e9));
    return [...sections, ...inputs];
  }, [template.fields, editableSet, docOrder]);

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
    // 템플릿 교체 시 서명 대상 기본값 재설정
    setSigTarget((prev) => (signKeys.includes(prev) ? prev : (signKeys[0] || "sign.principal")));
  }, [template, signKeys]);

  // 값 변경(허용 키만)
  const onChange = (name, value) => {
    if (!editableSet.has(name)) return;
    setForm((p) => {
      const copy = JSON.parse(JSON.stringify(p || {}));
      setByPath(copy, name, value);
      return copy;
    });
  };

  // 미리보기 HTML
  const previewHtml = useMemo(
    () => renderBodyHTML(template.body, form, activeKey, docOrder),
    [template, form, activeKey, docOrder]
  );

  // 포커스 시: 자동 스크롤 제거(하이라이트만)
  useEffect(() => {
    if (!activeKey || !previewRef.current) return;
    const el = previewRef.current.querySelector(`[data-key="${CSS.escape(activeKey)}"]`);
    if (!el) return;
    el.classList.add("pulse");
    const t = setTimeout(() => el.classList.remove("pulse"), 800);
    return () => clearTimeout(t);
  }, [activeKey, previewHtml]);

  // PDF 저장: 배지/가이드 숨기고 A4 한 장에 맞춰 저장
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

  // 서명패드 초기화/리사이즈
  useLayoutEffect(() => {
    if (!sigCanvasRef.current) return;
    if (!sigPadRef.current) {
      sigPadRef.current = new SignaturePad(sigCanvasRef.current, { backgroundColor: "#fff" });
    }
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
    return () => window.removeEventListener("resize", resize);
  }, []);

  // 서명패드: 버튼들
  const clearSignature = () => sigPadRef.current?.clear();
  const applySignature = () => {
    if (!sigPadRef.current) return;
    if (sigPadRef.current.isEmpty()) { alert("서명을 입력해 주세요."); return; }
    const dataURL = sigPadRef.current.toDataURL("image/png");
    onChange(sigTarget, dataURL);
    setActiveKey(sigTarget);
  };

  return (
    <div className="wrap">
      <h1 className="ttl">{template.name}</h1>
      <div className="grid">
        {/* 좌측: 입력영역 */}
        <div>
          <div className="mb">
            <label className="lbl">문서 제목</label>
            <input className="ipt" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {visibleFields.map((f, idx) => (
            <div key={`${f.name || f.label}-${idx}`} onFocusCapture={() => f.name && setActiveKey(f.name)}>
              {f.type !== "section" && (<div className="badge">#{(docOrder[f.name] ?? 999) + 1}</div>)}
              <FieldInput field={f} value={getByPath(form, f.name)} onChange={onChange} onFocusField={setActiveKey} />
            </div>
          ))}

          {/* 전자서명 */}
          <div className="mb">
            <div className="sec"><span className="sec-bullet" /><span className="sec-title">전자서명</span></div>
            <label className="lbl">서명 대상</label>
            <select className="ipt" value={sigTarget} onChange={(e)=>setSigTarget(e.target.value)}>
              {signKeys.length
                ? signKeys.map((k) => <option key={k} value={k}>{k.replace("sign.","")} 서명</option>)
                : <>
                    <option value="sign.principal">principal 서명</option>
                    <option value="sign.agent">agent 서명</option>
                  </>
              }
            </select>
            <div className="sigpad"><canvas ref={sigCanvasRef} className="sig-canvas" /></div>
            <div style={{display:"flex", gap:8}}>
              <button className="btn" onClick={clearSignature}>지우기</button>
              <button className="btn primary" onClick={applySignature}>서명 적용</button>
            </div>
          </div>

          <div className="mb" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn primary" onClick={savePDF}>PDF로 저장</button>
          </div>
        </div>

        {/* 우측: 미리보기 (A4) */}
        <div className="preview">
          <div className={`page ${exporting ? "export" : ""}`}>
            <div className="center">
              <div className="title">{title || template.name}</div>
              <div className="sub">{template.name}</div>
            </div>
            <div ref={previewRef} className="body" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            {template.footerNote && <div className="foot">{template.footerNote}</div>}
          </div>
        </div>
      </div>

      {/* 스타일 */}
      <style>{`
        .wrap{max-width:1100px;margin:0 auto;padding:16px}
        .ttl{font-size:22px;font-weight:700;margin-bottom:12px}
        .grid{display:grid;grid-template-columns:1fr;gap:24px}
        @media(min-width:900px){.grid{grid-template-columns:1fr 1fr}}
        .mb{margin-bottom:12px}
        .lbl{display:block;font-size:13px;margin-bottom:6px;color:#333}
        .lbl.inline{display:inline-flex;align-items:center;gap:8px}
        .ipt{width:100%;border:1px solid #ddd;border-radius:8px;padding:8px}
        .btn{border:1px solid #222;border-radius:8px;padding:6px 10px;background:#fff;cursor:pointer}
        .btn.primary{background:#111;color:#fff}
        .preview{border:1px solid #e5e7eb;border-radius:10px;padding:0;background:#f9fafb}

        .sec{display:flex;align-items:center;gap:8px;padding:6px 2px;border-bottom:1px dashed #e5e7eb}
        .sec-bullet{width:6px;height:6px;border-radius:50%;background:#111;display:inline-block}
        .sec-title{font-weight:700;font-size:13px}
        .badge{display:inline-block;margin:0 0 4px 0;font-size:11px;color:#555;background:#eef2ff;border:1px solid #c7d2fe;border-radius:6px;padding:2px 6px;font-weight:600;}

        .page{width:210mm; min-height:297mm; margin:0 auto; background:#fff; color:#000; padding:14mm; box-sizing:border-box; border-radius:10px; box-shadow:0 0 6px rgba(0,0,0,.08)}
        @page{ size:A4; margin:12mm }
        @media print{ .wrap{padding:0} .grid{display:block} .preview{border:none;padding:0} .page{box-shadow:none;border-radius:0;margin:0;width:auto;min-height:auto;padding:12mm} }

        .center{text-align:center}
        .title{font-size:18px;font-weight:700;margin-top:4px}
        .sub{font-size:12px;color:#666}
        .body{white-space:pre-wrap;word-break:break-word;line-height:1.6;margin-top:8px}
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

        .tbl{width:100%;border-collapse:collapse}
        .tbl th,.tbl td{border:1px solid #e5e7eb;padding:6px;text-align:left}

        .sigpad{border:1px dashed #cbd5e1;border-radius:10px;background:#fff;height:140px;margin:6px 0 8px}
        .sig-canvas{width:100%;height:100%;display:block;border-radius:10px}
        .sign-img{display:block;margin:6px 0 10px;max-width:260px;max-height:100px;border-bottom:1px solid #111}
        .sign-box{display:inline-block;width:260px;height:60px;border-bottom:1px solid #111;background:transparent}

        .foot{margin-top:16px;color:#666;font-size:12px}
        .rowHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
        .scroll{overflow:auto}
      `}</style>
    </div>
  );
}
