import React, { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/** {{key}} 치환 */
function renderBody(template, data) {
  return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
    const v = key.split(".").reduce((acc, k) => (acc ? acc[k] : ""), data);
    if (v == null) return "";
    if (Array.isArray(v)) return v.map(row => Object.values(row).join(" ")).join("\n");
    return String(v);
  });
}

/** 필드 렌더러 */
function FieldInput({ field, value, onChange }) {
  if (field.type === "textarea") {
    return (
      <div className="mb">
        <label className="lbl">{field.label}</label>
        <textarea
          className="ipt"
          rows={4}
          value={value || ""}
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
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {(rows.length ? rows : Array.from({ length: field.minRows || 0 })).map((_, i) => (
                <tr key={i}>
                  {field.columns.map((c) => (
                    <td key={c.key}>
                      <input
                        className="ipt"
                        type={
                          c.type === "number" ? "number" : c.type === "date" ? "date" : "text"
                        }
                        value={(rows[i] || {})[c.key] || ""}
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
        onChange={(e) => onChange(field.name, e.target.value)}
      />
    </div>
  );
}

/** 공통 페이지 */
export default function ContractBase({ template }) {
  const [title, setTitle] = useState(template.name);
  const [form, setForm] = useState({});
  const [fit, setFit] = useState(true);    // 한 페이지 맞춤
  const [scale, setScale] = useState(0.92); // 배율(0.80~1.00 권장)
  const pageRef = useRef(null);

  useEffect(() => {
    const init = { ...(template.defaults || {}) };
    (template.fields || []).forEach((f) => {
      if (f.type === "table") {
        init[f.name] = Array.from({ length: f.minRows || 0 }).map(() => ({}));
      } else {
        init[f.name] = init[f.name] ?? "";
      }
    });
    setForm(init);
    setTitle(template.name);
  }, [template]);

  const onChange = (name, value) => setForm((p) => ({ ...p, [name]: value }));
  const previewBody = useMemo(() => renderBody(template.body, form), [template, form]);

  const savePDF = async () => {
    const node = pageRef.current; // .page 전체를 캡쳐
    if (!node) return;
    const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: "#fff" });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const iw = pw;
    const ih = (canvas.height * iw) / canvas.width;

    let left = ih;
    let pos = 0;

    pdf.addImage(img, "PNG", 0, pos, iw, ih);
    left -= ph;

    while (left > 0) {
      pos = left - ih;
      pdf.addPage();
      pdf.addImage(img, "PNG", 0, pos, iw, ih);
      left -= ph;
    }
    pdf.save(`${title || template.name}.pdf`);
  };

  const tableFields = (template.fields || []).filter((f) => f.type === "table");

  return (
    <div className="wrap">
      <h1 className="ttl">{template.name}</h1>
      <div className="grid">
        {/* 입력 */}
        <div>
          <div className="mb">
            <label className="lbl">문서 제목</label>
            <input className="ipt" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          {(template.fields || []).map((f) => (
            <FieldInput key={f.name} field={f} value={form[f.name]} onChange={onChange} />
          ))}

          {/* 페이지 맞춤/배율/저장 */}
          <div className="mb" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <label className="lbl inline" style={{ marginBottom: 0 }}>
              <input type="checkbox" checked={fit} onChange={(e) => setFit(e.target.checked)} />
              한 페이지에 맞추기
            </label>
            {fit && (
              <>
                <span className="lbl" style={{ margin: 0 }}>
                  배율
                </span>
                <input
                  type="range"
                  min={0.8}
                  max={1.0}
                  step={0.01}
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                />
                <span className="lbl" style={{ margin: 0 }}>
                  {Math.round(scale * 100)}%
                </span>
              </>
            )}
            <button className="btn primary" onClick={savePDF}>
              PDF로 저장
            </button>
          </div>
        </div>

        {/* 미리보기 (A4 페이지) */}
        <div className="preview">
          <div
            ref={pageRef}
            className={`page ${fit ? "fit" : ""}`}
            style={fit ? { "--scale": String(scale) } : undefined}
          >
            <div className="center">
              <div className="title">{title || template.name}</div>
              <div className="sub">{template.name}</div>
            </div>

            <pre className="body">{previewBody}</pre>

            {tableFields.map((tf) => {
              const rows = form[tf.name] || [];
              const viewRows = rows.filter((r) => Object.keys(r || {}).length > 0);
              if (!viewRows.length) return null;
              return (
                <div key={tf.name} className="mb">
                  <div className="lbl" style={{ marginBottom: 6 }}>
                    {tf.label}
                  </div>
                  <table className="tbl">
                    <thead>
                      <tr>{tf.columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr>
                    </thead>
                    <tbody>
                      {viewRows.map((r, i) => (
                        <tr key={i}>{tf.columns.map((c) => <td key={c.key}>{r?.[c.key] ?? ""}</td>)}</tr>
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

      {/* 최소 스타일 + A4 페이지/스케일 */}
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

        /* A4 페이지 */
        .page{
          width:210mm; min-height:297mm; margin:0 auto; background:#fff; color:#000;
          padding:14mm; box-sizing:border-box; border-radius:10px; box-shadow:0 0 6px rgba(0,0,0,.08)
        }
        .page.fit{
          transform:scale(var(--scale)); transform-origin:top left;
          width:calc(210mm / var(--scale));
          min-height:calc(297mm / var(--scale));
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
        .body{white-space:pre-wrap;word-break:break-word;line-height:1.6;margin-top:8px}
        .tbl{width:100%;border-collapse:collapse}
        .tbl th,.tbl td{border:1px solid #e5e7eb;padding:6px;text-align:left}
        .foot{margin-top:16px;color:#666;font-size:12px}
        .rowHead{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
        .scroll{overflow:auto}
        .center{text-align:center}
      `}</style>
    </div>
  );
}
