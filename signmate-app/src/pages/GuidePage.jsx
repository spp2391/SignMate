// src/pages/GuidePage.jsx
import React, { useState } from "react";

/**
 * 이용 기능 페이지
 * - 상단: 큰 미리보기 + 썸네일 클릭 시 메인 이미지 교체
 * - 하단: 1. 계약 체결 / 2. 계약 관리 카드형 가이드
 * - 모바일 문구 없음
 *
 * 사용 예:
 * <GuidePage
 *   imagesTop={[{src:'/img/step1.png',caption:'계약 작성'}, ...]}
 *   imagesStep1={[{src:'/img/send.png',title:'클릭 한 번으로 계약서 발송',desc:'상대방 지정 및 서명 위치 저장 후 요청 발송'}, ...]}
 *   imagesStep2={[{src:'/img/status.png',title:'진행 현황 실시간 확인',desc:'요청/진행/완료 상태 추적'}, ...]}
 * />
 */
export default function GuidePage({
  imagesTop = [],
  imagesStep1 = [],
  imagesStep2 = [],
}) {
  const [active, setActive] = useState(0);
  const mainTop = imagesTop[active]?.src;

  return (
    <div className="guide">
      <style>{css}</style>

      {/* ===== 상단: 이용 기능 헤더 ===== */}
      <section className="hero">
        <div className="hero__inner">
          <div className="kicker">FEATURES</div>
          <h1 className="hero__title">이용 기능</h1>
          <p className="hero__sub">계약 작성 → 서명 요청 → 계약 체결 → 계약 관리</p>

          <div className="device">
            <div className="device__bezel">
              <div className="device__camera" />
              <div className="device__screen">
                <ImageSlot src={mainTop} ratio="21/9" label="미리보기" dark />
              </div>
            </div>
          </div>

          {/* 탭/썸네일 */}
          <div className="thumbs">
            {(imagesTop.length ? imagesTop : placeholderTop).map((it, i) => (
              <button
                key={i}
                className={`thumb ${i === active ? "is-active" : ""}`}
                onClick={() => setActive(i)}
                type="button"
                aria-label={it.caption ?? `STEP ${i + 1}`}
              >
                <ImageSlot src={it.src} ratio="16/9" />
                <span className="thumb__caption">{it.caption ?? `STEP ${i + 1}`}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 1. 계약 체결 ===== */}
      <section className="container">
        <SectionTitle index={1} title="계약 체결" />
        <div className="grid two">
          {(imagesStep1.length ? imagesStep1 : placeholderStep1).map((c, i) => (
            <Card key={i} title={c.title} desc={c.desc}>
              <ImageSlot src={c.src} ratio="16/9" />
            </Card>
          ))}
        </div>
      </section>

      {/* ===== 2. 계약 관리 ===== */}
      <section className="container">
        <SectionTitle index={2} title="계약 관리" />
        <div className="grid three">
          {(imagesStep2.length ? imagesStep2 : placeholderStep2).map((c, i) => (
            <Card key={i} title={c.title} desc={c.desc}>
              <ImageSlot src={c.src} ratio="16/9" />
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------- 구성요소 ---------- */
function SectionTitle({ index, title }) {
  return (
    <div className="section-title">
      <span className="badge">{index}</span>
      <h2>{title}</h2>
    </div>
  );
}

function Card({ title, desc, children }) {
  return (
    <article className="card">
      <div className="card__media">{children}</div>
      <div className="card__body">
        <h3 className="card__title">{title}</h3>
        <p className="card__desc">{desc}</p>
      </div>
    </article>
  );
}

function ImageSlot({ src, ratio = "16/9", label = "이미지 자리", dark = false }) {
  return (
    <div className={`slot ${dark ? "slot--dark" : ""}`} style={{ aspectRatio: ratio }}>
      {src ? <img src={src} alt="" className="slot__img" /> : <div className="slot__empty">{label}</div>}
    </div>
  );
}

/* ---------- 플레이스홀더 ---------- */
const placeholderTop = [
  { src: "", caption: "계약 작성" },
  { src: "", caption: "서명 요청" },
  { src: "", caption: "계약 체결" },
  { src: "", caption: "계약 관리" },
];

const placeholderStep1 = [
  { src: "", title: "클릭 한 번으로 계약서 발송", desc: "상대방 지정 및 서명 위치 저장 후 요청 발송" },
  { src: "", title: "서명 위치 지정", desc: "문서 내 지정된 위치에 서명하도록 설정" },
];

const placeholderStep2 = [
  { src: "", title: "진행 현황 실시간 확인", desc: "요청/진행/완료 상태를 한눈에 추적" },
  { src: "", title: "자동 분류", desc: "완료/검토 등으로 자동 라벨링" },
  { src: "", title: "검색과 필터", desc: "제목/라벨/상태 조건으로 빠른 조회" },
];

/* ---------- 페이지 CSS ---------- */
const css = `
:root{
  --ink:#0f172a;
  --muted:#64748b;
  --line:#e6e9f3;
  --brand:#4f46e5;
  --brand-weak:#eef2ff;
  --card:#ffffff;
  --radius:16px;
  --shadow:0 10px 28px rgba(2,6,23,.08);
  --maxw:1120px;
}

*{box-sizing:border-box}
body{margin:0}
.guide{color:var(--ink); background:#fff}

/* 헤더 */
.hero{
  background:
    radial-gradient(900px 260px at 50% -120px, var(--brand-weak), transparent) ,
    linear-gradient(180deg,#fff 0%, #fbfdff 70%, #fff 100%);
  border-bottom:1px solid var(--line);
}
.hero__inner{max-width:var(--maxw); margin:0 auto; padding:48px 20px 28px}
.kicker{font-size:12px; letter-spacing:.12em; color:var(--brand); font-weight:800}
.hero__title{margin:6px 0 0; font-size:clamp(28px,4vw,40px); font-weight:900; letter-spacing:-.02em}
.hero__sub{margin:10px 0 16px; color:var(--muted)}

/* 디바이스 프레임 */
.device{display:flex; justify-content:center; margin:6px 0 16px}
.device__bezel{
  width:min(100%,980px); aspect-ratio:21/10; border-radius:28px; padding:16px;
  background:#0e1321; border:1px solid #0b1020;
  box-shadow:0 18px 36px rgba(2,6,23,.18) inset, 0 14px 34px rgba(2,6,23,.08);
  position:relative;
}
.device__camera{width:62px; height:6px; border-radius:6px; background:#1f2740; position:absolute; top:12px; left:50%; transform:translateX(-50%)}
.device__screen{width:100%; height:100%; background:#0b1220; border-radius:18px; overflow:hidden; padding:14px; display:flex; align-items:center; justify-content:center}

/* 썸네일 */
.thumbs{display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; margin-top:8px}
@media(min-width:900px){ .thumbs{ grid-template-columns:repeat(4,1fr); } }
.thumb{
  background:var(--card); border:1px solid var(--line); border-radius:14px; padding:10px; text-align:center;
  box-shadow:var(--shadow); cursor:pointer; transition:transform .15s ease, box-shadow .15s ease, border-color .15s ease;
}
.thumb:hover{ transform:translateY(-2px); box-shadow:0 12px 30px rgba(2,6,23,.12) }
.thumb.is-active{ border-color:#c7d2fe; box-shadow:0 0 0 3px #e0e7ff inset }
.thumb__caption{display:block; margin-top:8px; font-size:13px; color:var(--muted)}

/* 본문 */
.container{max-width:var(--maxw); margin:0 auto; padding:36px 20px}
.section-title{display:flex; align-items:center; gap:10px; margin:2px 0 14px}
.badge{
  width:32px; height:32px; display:grid; place-items:center; border-radius:10px;
  background:#eef2ff; color:#4f46e5; font-weight:900; border:1px solid #dbe3ff;
}
.section-title h2{margin:0; font-size:22px; letter-spacing:-.01em}

/* 카드/그리드 */
.grid.two{ display:grid; gap:18px; grid-template-columns:1fr; }
.grid.three{ display:grid; gap:18px; grid-template-columns:1fr; }
@media(min-width:980px){ .grid.two{ grid-template-columns:1fr 1fr; } }
@media(min-width:1160px){ .grid.three{ grid-template-columns:1fr 1fr 1fr; } }

.card{
  background:var(--card); border:1px solid var(--line); border-radius:var(--radius);
  overflow:hidden; box-shadow:var(--shadow); display:flex; flex-direction:column; min-height:240px;
}
.card__media{ padding:16px; background:#fbfdff }
.card__body{ padding:16px 18px 18px }
.card__title{ margin:0 0 6px; font-weight:900; font-size:18px }
.card__desc{ margin:0; color:var(--muted); line-height:1.6 }

/* 이미지 슬롯 */
.slot{
  width:100%; border-radius:12px; overflow:hidden; border:1px dashed #c8d1ff; background:#fff;
  display:flex; align-items:center; justify-content:center; position:relative;
}
.slot--dark{ border-color:#5b67a9; background:#0f172a }
.slot__img{ width:100%; height:100%; object-fit:cover; display:block }
.slot__empty{
  width:100%; height:100%; display:grid; place-items:center; color:#8391a6;
  background:repeating-linear-gradient(45deg,#f6f9ff 0 14px,#f9fbff 14px 28px);
}
.slot--dark .slot__empty{ color:#cdd5e1; background:repeating-linear-gradient(45deg,#0f172a 0 16px,#0e1525 16px 32px) }
`;
