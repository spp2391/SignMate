import React, { useState } from "react";

export default function OutsourcingContractPage() {
  const [fit, setFit] = useState(true);
  const [scale, setScale] = useState(0.92);

  return (
    <>
      {/* 툴바 */}
      <div className="toolbar">
        <button onClick={() => window.print()}>인쇄/저장(PDF)</button>
        <label>
          <input type="checkbox" checked={fit} onChange={(e) => setFit(e.target.checked)} />
          한 페이지에 맞추기
        </label>
        {fit && (
          <>
            <span className="small">배율</span>
            <input
              type="range"
              min={0.8}
              max={1.0}
              step={0.01}
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
            />
            <span className="small">{Math.round(scale * 100)}%</span>
          </>
        )}
      </div>

      {/* 본문 */}
      <div className={`page ${fit ? "fit" : ""}`} style={fit ? { "--scale": String(scale) } : undefined}>
        <div className="title">업무위탁 계약서</div>

        <p className="small">
          <span className="blockline md" />(이하 “갑”)과 <span className="blockline md" />(이하 “을”)은
          다음과 같이 업무위탁 계약(이하 “본 계약”)을 체결한다.
        </p>

        <p style={{ fontWeight: 700 }}>제 1 조 (업무목적)</p>
        <div className="indent">
          <p>
            “갑”은 아래 제2조의 업무를 “을”에게 위탁하고, “을”은 이를 성실히 수행하기로 한다.
          </p>
        </div>

        <p style={{ fontWeight: 700 }}>제 2 조 (업무내용)</p>
        <div className="indent">
          <p>“을”이 수행할 업무(이하 “작업”)은 다음과 같다.</p>
          <ol style={{ margin: "4px 0 8px 18px" }}>
            <li>제품/서비스 운영지원</li>
            <li>현장 점검 및 보고</li>
            <li>자료 수집·분석 및 보고서 작성</li>
            <li>재고/물류 관리 보조</li>
            <li>고객 응대 및 통지 업무</li>
            <li>기타 “갑”이 서면으로 지정한 업무</li>
          </ol>
        </div>

        <p style={{ fontWeight: 700 }}>제 3 조 (수행기간 및 대가정산)</p>
        <div className="indent">
          <p>
            ① 수행기간: 20<span className="blockline xs" />년 <span className="blockline xs" />월{" "}
            <span className="blockline xs" />일부터 20<span className="blockline xs" />년{" "}
            <span className="blockline xs" />월 <span className="blockline xs" />일까지.
          </p>
          <p>② 대가는 아래 산식에 따라 산정·지급한다.</p>
        </div>

        <table className="tbl">
          <thead>
            <tr>
              <th>구분</th>
              <th>단가</th>
              <th>수량</th>
              <th>1인/1건당</th>
              <th>지급액</th>
              <th>업무구분</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} style={{ textAlign: "right", fontWeight: 700 }}>합계</td>
              <td></td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>

        <p style={{ fontWeight: 700 }}>제 4 조 (비밀유지 및 지식재산권)</p>
        <div className="indent">
          <p>① “을”은 업무 수행 중 알게 된 일체의 비밀정보를 제3자에게 누설하지 않는다.</p>
          <p>② 산출물의 저작권/소유권 귀속은 별도 특약이 없는 한 “갑”에게 귀속한다.</p>
        </div>

        <p style={{ fontWeight: 700 }}>제 5 조 (보고 및 관리)</p>
        <div className="indent">
          <p>
            ① “을”은 진행상황을 정기적으로 보고하고, “갑”의 요청 시 관련 자료를 즉시 제출한다.
          </p>
          <p>② “갑”은 품질확보를 위해 검수 및 개선을 요구할 수 있다.</p>
        </div>

        <p style={{ fontWeight: 700 }}>제 6 조 (계약의 해지)</p>
        <div className="indent">
          <p>일방의 중대한 위반 발생 시 상대방은 서면통지로 계약을 해지할 수 있다.</p>
        </div>

        <p style={{ fontWeight: 700 }}>제 7 조 (기타)</p>
        <div className="indent">
          <p>본 계약에 정하지 아니한 사항은 민법 등 관계 법령 및 상관례를 따른다.</p>
        </div>

        <div className="hr" />

        <p style={{ textAlign: "right" }}>
          20<span className="blockline xs" /> 년 <span className="blockline xs" /> 월{" "}
          <span className="blockline xs" /> 일
        </p>

        <div className="sign">
          <div className="sigcol">
            <p style={{ fontWeight: 700 }}>(갑)</p>
            <p>주소 : <span className="blockline wide" /></p>
            <p>대표자 : <span className="blockline md" /> (서명)</p>
            <p>연락처 : <span className="blockline md" /></p>
          </div>
          <div className="sigcol">
            <p style={{ fontWeight: 700 }}>(을)</p>
            <p>주소 : <span className="blockline wide" /></p>
            <p>대표자 : <span className="blockline md" /> (서명)</p>
            <p>연락처 : <span className="blockline md" /></p>
          </div>
        </div>
      </div>

      {/* 스타일 */}
      <style>{`
        :root { --scale: 1; }
        .toolbar{display:flex;gap:8px;align-items:center;padding:10px;margin:0 auto 12px;width:210mm;max-width:100%;font-family:system-ui,"Malgun Gothic",sans-serif}
        .small{font-size:12px;color:#444}
        .page{width:210mm;min-height:297mm;margin:0 auto 24px;background:#fff;color:#000;padding:14mm;box-shadow:0 0 6px rgba(0,0,0,.15);box-sizing:border-box;font-family:"Malgun Gothic",sans-serif;line-height:1.45;font-size:12pt;border-radius:8px}
        .page.fit{transform:scale(var(--scale));transform-origin:top left;width:calc(210mm / var(--scale));min-height:calc(297mm / var(--scale))}
        .title{text-align:center;font-weight:700;font-size:15pt;margin-bottom:12px}
        .indent{padding-left:16px}
        .hr{border-top:1px solid #000;margin:12px 0}
        .sign{display:flex;gap:16px;margin-top:10px}
        .sigcol{flex:1}
        .tbl{width:100%;border-collapse:collapse;margin:8px 0}
        .tbl th,.tbl td{border:1px solid #000;padding:6px;text-align:center;font-size:11pt}
        .blockline{display:inline-block;min-width:80px;border-bottom:1px solid #000;line-height:1}
        .blockline.wide{min-width:300px}
        .blockline.md{min-width:160px}
        .blockline.sm{min-width:50px}
        .blockline.xs{min-width:35px}
        @page{size:A4;margin:12mm}
        @media print{ .toolbar{display:none} .page{box-shadow:none;margin:0;width:auto;min-height:auto;padding:12mm;border-radius:0} }
      `}</style>
    </>
  );
}
