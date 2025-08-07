import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';

const SignContract = () => {
  const sigCanvasRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const signatureDataUrl = sigCanvasRef.current.getTrimmedCanvas().toDataURL('image/png');

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('signature', signatureDataUrl);

    const pdfFile = await fetch('/sample-agreement.pdf').then(res => res.blob());
    formData.append('pdf', pdfFile, 'original.pdf');

    try {
      const res = await axios.post('/api/sign/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('제출 완료!');

    } catch (error) {
      console.error(error);
      alert('제출 실패');
    }
  };

  return (
    <div>
      <h2>전자서명 페이지</h2>

      {/* PDF 미리보기 (간단히 생략 가능) */}
      <embed src="/sample-agreement.pdf" width="100%" height="400px" type="application/pdf" />

      <input type="text" name="name" placeholder="이름" onChange={handleChange} />
      <input type="email" name="email" placeholder="이메일" onChange={handleChange} />

      <SignatureCanvas penColor="black" ref={sigCanvasRef} canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} />
      <button onClick={() => sigCanvasRef.current.clear()}>서명 지우기</button>

      <button onClick={handleSubmit}>제출</button>
    </div>
  );
};

export default SignContract;
