import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';

const ReceiverSignPage = () => {
  const { contractId } = useParams();
  const [contract, setContract] = useState(null);
  const sigCanvas = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 계약서 내용 불러오기
    axios.get(`/api/service-contracts/${contractId}`)
      .then(res => {
        setContract(res.data);
        setLoading(false);
      })
      .catch(err => {
        alert('계약서 불러오기 실패');
        setLoading(false);
      });
  }, [contractId]);

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const saveSignature = async () => {
    if (sigCanvas.current.isEmpty()) {
      alert('서명을 해주세요');
      return;
    }
    const signatureImage = sigCanvas.current.toDataURL(); // base64
    const signatureHash = ''; // 해시가 필요하면 구현

    // signerId는 로그인 정보에서 가져오세요 (예시로 2로 고정)
    const signerId = 2;

    try {
      await axios.post('/api/signatures', {
        contractId,
        signerId,
        role: 'receiver',
        signatureImage,
        signatureHash,
      });
      alert('서명 저장 완료');
      // 리다이렉트하거나 상태 업데이트
    } catch (err) {
      alert('서명 저장 실패');
    }
  };

  if (loading) return <div>로딩중...</div>;

  return (
    <div>
      <h2>계약서 내용</h2>
      <pre>{JSON.stringify(contract, null, 2)}</pre>

      <h3>서명하기</h3>
      <SignatureCanvas
        penColor="black"
        canvasProps={{width: 400, height: 150, className: 'sigCanvas'}}
        ref={sigCanvas}
      />
      <button onClick={clearSignature}>지우기</button>
      <button onClick={saveSignature}>서명 제출</button>
    </div>
  );
};

export default ReceiverSignPage;
