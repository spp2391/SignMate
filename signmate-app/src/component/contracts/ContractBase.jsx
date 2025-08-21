// 계약서 데이터 상태 관리 
// 서명 입력 처리
// pdf 내보내기 로직 호출
// ContractViews.jsx + ContractUtils.js 연결
import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SignaturePad from "signature_pad";

import {
  getByPath, setByPath, deepMerge,
  renderBodyHTML, renderTableHTML,
  counterpartOf, getMySignPath
} from "./contractUtils";
import { FieldInput, SignatureFooter } from "./ContractViews";

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

      {/* 스타일 (원본 그대로) */}
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
