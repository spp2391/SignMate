// src/component/SignaturePad.jsx
import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

function SignaturePad({ onSave }) {
  const sigCanvasRef = useRef(null);
  const [trimmedDataURL, setTrimmedDataURL] = useState(null);

  const clear = () => {
    sigCanvasRef.current.clear();
    setTrimmedDataURL(null);
    onSave(null);
  };

  const save = () => {
    if (sigCanvasRef.current.isEmpty()) {
      alert("서명이 비어있습니다!");
      return;
    }
    const dataURL = sigCanvasRef.current.getTrimmedCanvas().toDataURL("image/png");
    setTrimmedDataURL(dataURL);
    onSave(dataURL);
  };

  return (
    <div>
      <SignatureCanvas
        ref={sigCanvasRef}
        penColor="black"
        canvasProps={{ width: 400, height: 200, style: { border: "1px solid #000" } }}
      />
      <div style={{ marginTop: 8 }}>
        <button onClick={clear} style={{ marginRight: 10 }}>지우기</button>
        <button onClick={save}>서명 저장</button>
      </div>
      {trimmedDataURL && (
        <div style={{ marginTop: 10 }}>
          <strong>서명 미리보기:</strong><br />
          <img src={trimmedDataURL} alt="서명 미리보기" style={{ border: "1px solid #000", maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
}

export default SignaturePad;
