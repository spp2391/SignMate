// ContractBase.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ===== 경로 유틸 ===== */
const pathToParts = (path) =>
  String(path || "")
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

const getByPath = (obj, path) => {
  if (!path) return obj;
  return pathToParts(path).reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
};

const setByPath = (obj, path, val) => {
  const parts = pathToParts(path);
  if (!parts.length) return obj;
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (cur[k] == null || typeof cur[k] !== "object") {
      cur[k] = /^\d+$/.test(parts[i + 1]) ? [] : {};
    }
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = val;
  return obj;
};

/* ===== 표시 유틸 ===== */
function pretty(v) {
  if (typeof v === "boolean") return v ? "예" : "아니오";
  if (v == null) return "";
  return String(v);
}
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ===== 본문 치환 (텍스트) ===== */
function renderBody(template, data) {
  return template.replace(/{{\s*([\w.\[\]0-9]+)\s*}}/g, (_, key) => {
    const parts = key.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
    let v = data;
    for (const p of parts) {
      if (v == null) break;
      v = v[p];
    }
    if (v == null) return "";
    if (Array.isArray(v)) {
      return v
        .map((row) =>
          row && typeof row === "object"
            ? Object.values(row ?? {}).map(pretty).join(" ")
            : pretty(row)
        )
        .join("\n");
    }
    return pretty(v);
  });
}

/* ===== 본문 치환 (HTML + 앵커/하이라이트) ===== */
function renderBodyHTML(template, data, activeKey) {
  return template.replace(/{{\s*([\w.\[\]0-9]+)\s*}}/g, (_, rawKey) => {
    const key = rawKey;
    const parts = key.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
    let v = data;
    for (const p of parts) {
      if (v == null) break;
      v = v[p];
    }
    if (v == null) v = "";

    let html;
    if (Array.isArray(v)) {
      html = v
        .map((row) =>
          row && typeof row === "object"
            ? Object.values(row ?? {}).map(pretty).join(" ")
            : pretty(row)
        )
        .map(esc)
        .join("<br/>");
    } else {
      html = esc(pretty(v));
    }

    const isActive = activeKey && key === activeKey;
    const content = html || "<span class='placeholder'>[입력]</span>";
    return `<span class="anchor ${isActive ? "hit" : ""}" data-key="${esc(key)}">${content}</span>`;
  });
}

/* ===== 입력 컴포넌트 ===== */
function FieldInput({ field, value, onChange, onFocusField }) {
  if (field.type === "section") {
    return (
      <div className="mb">
        <div className="sec">
          <span className="sec-bullet" />
          <span className="sec-title">{field.label}</span>
        </div>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="mb">
        <label className="lbl">{field.label}</label>
        <textarea
          className="ipt"
          rows={4}
          value={value || ""}
          onFocus={() => onFocusField?.(field.name)}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="mb">
        <label className="lbl">{field.label}</label>
        <select
          className="ipt"
          value={value || ""}
          onFocus={() => onFocusField?.(field.name)}
          onChange={(e) => onChange(field.name, e.target.value)}
        >
          <option value="">선택</option>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <div className="mb">
        <label className="lbl inline">
          <input
            type="checkbox"
            checked={!!value}
            onFocus={() => onFocusField?.(field.name)}
            onChange={(e) => onChange(field.name, e.target.checked)}
          />{" "}
          {field.label}
        </label>
      </div>
    );
  }

  if (field.type === "table") {
    const rows = value || [];
    const addRow = () => onChange(field.name, [...rows, {}]);
    const removeRow = (i) =>
      onChange(
        field.name,
        rows.filter((_, idx) => idx !== i)
      );
    const setCell = (i, key, v) => {
      const copy = rows.map((r) => ({ ...r }));
      copy[i] = { ...copy[i], [key]: v };
      onChange(field.name, copy);
    };
    const visibleRows =
      rows.length > 0 ? rows : Array.from({ length: field.minRows || 0 }).map(() => ({}));
    return (
      <div className="mb">
        <div className="rowHead">
          <label className="lbl">{field.label}</label>
          <button type="button" className="btn" onClick={addRow}>
            + 행 추가
          </button>
        </div>
        <div className="scroll">
          <table className="tbl">
            <thead>
              <tr>
                {field.columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th style={{ width: 64 }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((_, i) => (
                <tr key={i}>
                  {field.columns.map((c) => (
                    <td key={c.key}>
                      <input
                        className="ipt"
                        type={c.type === "number" ? "number" : c.type === "date" ? "date" : "text"}
                        value={(rows[i] || {})[c.key] || ""}
                        onFocus={() => onFocusField?.(`${field.name}[${i}].${c.key}`)}
                        onChange={(e) => setCell(i, c.key, e.target.value)}
                      />
                    </td>
                  ))}
                  <td className="center">
                    <button type="button" className="btn" onClick={() => removeRow(i)}>
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 기본 input
  return (
    <div className="mb">
      <label className="lbl">{field.label}</label>
      <input
        className="ipt"
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        value={value || ""}
        onFocus={() => onFocusField?.(field.name)}
        onChange={(e) => onChange(field.name, e.target.value)}
      />
    </div>
  );
}

/* ===== 메인 컴포넌트 ===== */
export default function ContractBase({ template }) {
  const [title, setTitle] = useState(template.name);
  const [form, setForm] = useState({});
  const [activeKey, setActiveKey] = useState(null);
  const previewRef = useRef(null);

  // 수정 허용 목록 (없으면 전체 허용)
  const editableSet = useMemo(() => {
    const keys = Array.isArray(template.editable) ? template.editable : (template.fields || [])
      .filter((f) => f.type !== "section")
      .map((f) => f.name);
    return new Set(keys);
  }, [template.editable, template.fields]);

  // 본문 등장 순서 맵
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

  // 좌측 표시 필드(섹션 + 허용)
  const visibleFields = useMemo(() => {
    const all = (template.fields || []).filter((f) => f.type === "section" || editableSet.has(f.name));
    const sections = all.filter((f) => f.type === "section");
    const inputs = all.filter((f) => f.type !== "section");
    inputs.sort((a, b) => {
      const ai = docOrder[a.name] ?? 1e9;
      const bi = docOrder[b.name] ?? 1e9;
      return ai - bi;
    });
    return [...sections, ...inputs];
  }, [template.fields, editableSet, docOrder]);

  // 초기값
  useEffect(() => {
    const init = JSON.parse(JSON.stringify(template.defaults || {}));
    (template.fields || []).forEach((f) => {
      if (f.type === "section") return;
      const exists = getByPath(init, f.name);
      if (exists !== undefined) return;
      if (f.type === "table") {
        setByPath(init, f.name, Array.from({ length: f.minRows || 0 }).map(() => ({})));
      } else if (f.type === "checkbox") {
        setByPath(init, f.name, false);
      } else {
        setByPath(init, f.name, "");
      }
    });
    setForm(init);
    setTitle(template.name);
  }, [template]);

  // onChange: 허용된 키만 반영
  const onChange = (name, value) => {
    if (!editableSet.has(name)) return;
    setForm((p) => {
      const copy = JSON.parse(JSON.stringify(p || {}));
      setByPath(copy, name, value);
      return copy;
    });
  };

  // 미리보기 텍스트/HTML
  const previewBody = useMemo(() => renderBody(template.body, form), [template, form]);
  const previewHtml = useMemo(
    () => renderBodyHTML(template.body, form, activeKey),
    [template, form, activeKey]
  );

  // 포커스 키 하이라이트 + 스크롤
  useEffect(() => {
    if (!activeKey || !previewRef.current) return;
    const el = previewRef.current.querySelector(`[data-key="${CSS.escape(activeKey)}"]`);
    if (el) {
      el.classList.add("pulse");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => el.classList.remove("pulse"), 800);
    }
  }, [activeKey, previewBody]);

  // 보기용 테이블
  const tableFields = (template.fields || []).filter((f) => f.type === "table");

  // PDF 저장
  const savePDF = async () => {
    const node = document.querySelector(".page");
    if (!node) return;
    const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: "#fff" });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, imgW, imgH);
    let remaining = imgH - pageH;
    let offsetY = -pageH;
    while (remaining > 0) {
      pdf.addPage();
      pdf.addImage(img, "PNG", 0, offsetY, imgW, imgH);
      remaining -= pageH;
      offsetY -= pageH;
    }
    pdf.save(`${title || template.name}.pdf`);
  };

  return (
    <div className="wrap">
      <h1 className="ttl">{template.name}</h1>
      <div className="grid">
        {/* 좌측 입력 */}
        <div>
          <div className="mb">
            <label className="lbl">문서 제목</label>
            <input className="ipt" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {visibleFields.map((f, idx) => (
            <div key={`${f.name || f.label}-${idx}`} onFocusCapture={() => f.name && setActiveKey(f.name)}>
              {f.type !== "section" && (
                <div className="badge">#{(docOrder[f.name] ?? 999) + 1}</div>
              )}
              <FieldInput
                field={f}
                value={getByPath(form, f.name)}
                onChange={onChange}
                onFocusField={setActiveKey}
              />
            </div>
          ))}

          <div className="mb" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button className="btn primary" onClick={savePDF}>PDF로 저장</button>
          </div>
        </div>

        {/* 우측 미리보기 */}
        <div className="preview">
          <div className="page">
            <div className="center">
              <div className="title">{title || template.name}</div>
              <div className="sub">{template.name}</div>
            </div>

            {/* HTML 미리보기 (앵커/하이라이트 지원) */}
            <div
              ref={previewRef}
              className="body"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />

            {/* 표가 있는 템플릿은 본문 하단에 표를 추가로 렌더 */}
            {tableFields.map((tf) => {
              const rows = getByPath(form, tf.name) || [];
              const viewRows = rows.filter((r) => Object.keys(r || {}).length > 0);
              if (!viewRows.length) return null;
              return (
                <div key={tf.name} className="mb">
                  <div className="lbl" style={{ marginBottom: 6 }}>{tf.label}</div>
                  <table className="tbl">
                    <thead>
                      <tr>{tf.columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr>
                    </thead>
                    <tbody>
                      {viewRows.map((r, i) => (
                        <tr key={i}>
                          {tf.columns.map((c) => <td key={c.key}>{pretty(r?.[c.key])}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}

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

        .badge{
          display:inline-block;margin:0 0 4px 0;font-size:11px;
          color:#555;background:#eef2ff;border:1px solid #c7d2fe;
          border-radius:6px;padding:2px 6px;font-weight:600;
        }

        .page{
          width:210mm; min-height:297mm; margin:0 auto; background:#fff; color:#000;
          padding:14mm; box-sizing:border-box; border-radius:10px; box-shadow:0 0 6px rgba(0,0,0,.08)
        }
        @page{ size:A4; margin:12mm }
        @media print{
          .wrap{padding:0}
          .grid{display:block}
          .preview{border:none;padding:0}
          .page{box-shadow:none;border-radius:0;margin:0;width:auto;min-height:auto;padding:12mm}
        }

        .center{text-align:center}
        .title{font-size:18px;font-weight:700;margin-top:4px}
        .sub{font-size:12px;color:#666}
        .body{word-break:break-word;line-height:1.6;margin-top:8px;white-space:pre-wrap}
        .tbl{width:100%;border-collapse:collapse}
        .tbl th,.tbl td{border:1px solid #e5e7eb;padding:6px;text-align:left;vertical-align:top}
        .foot{margin-top:16px;color:#666;font-size:12px}
        .rowHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
        .scroll{overflow:auto}

        .anchor{background:transparent;transition:background .2s, box-shadow .2s}
        .placeholder{color:#999}
        .hit{background:#fff7cc}
        .pulse{
          animation: pulse 0.8s ease;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(250, 204, 21, .6); }
          100% { box-shadow: 0 0 0 8px rgba(250, 204, 21, 0); }
        }
      `}</style>
    </div>
  );
}
