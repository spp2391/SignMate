// 계약서의 화면 담당
// 실제 계약서 양ㅇ식 html/jsx 구조
// 입력 필드, 서명란, 미리보기 UI
// props로 contractbase에서 관리하는 데이터/필수 받아서 풀력
import React from "react";
import { getByPath, sigLabel } from "./contractUtils";

/* ===== 좌측 입력 필드 ===== */
export function FieldInput({ field, value, onChange, onFocusField }) {
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

/* ===== 미리보기 하단 서명 섹션 ===== */
export function SignatureFooter({ signKeys, form }) {
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
