import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";
import { Check } from "lucide-react";

const laws = [
  {
    title: "민법",
    subtitle: "(낙성불요식 계약 원칙, 계약의 효력)",
    content: [
      "한국 민법에서는 별도의 형식을 요구하지 않고, 당사자간의 약정(합의)만으로 계약의 성립을 인정하는 낙성 불요식 계약 원칙을 따르고 있습니다.",
      "계약 당사자가 계약 내용에 대해서 동의했다는 사실을 증명할 수 있으면 그 형태가 무엇이든 법적 효력이 인정됩니다.",
      "종이 계약서는 계약 내용에 대해 증명할 수 있는 증거 중 하나입니다. 종이 쪽지, 음성 녹음 파일 역시 계약 내용을 증명할 수 있다면 종이 계약서와 마찬가지로 증거로써 법적 효력이 인정됩니다.",
      "SIGNMATE은 이메일, 휴대폰 본인 인증, 접근 암호 등 최대 3개의 수단을 통한 본인 확인을 합니다. 서명 진행과 관련된 중요 시점마다 시간, IP 주소, 기기정보, 브라우저 정보 등과 같은 중요 정보에 대해 감사 로그를 기록하여 계약 당사자가 해당 행위를 했다는 사실을 증명할 수 있습니다."
    ]
  },
  {
    title: "전자서명법", 
    subtitle: "(자필이 아닌 전자적으로 입력되는 서명의 효력)",
    content: [
      "전자서명법 제3조제1항: 전자서명은 전자적 형태라는 이유만으로 서명, 서명날인 또는 기명날인으로서의 효력이 부인되지 않습니다.",
      "전자서명법 제3조제2항: 법령의 규정 또는 당사자 간의 약정에 따라 서명, 서명날인 또는 기명날인의 방식으로 전자서명을 선택한 경우, 그 전자서명은 서명, 서명날인 또는 기명날인으로서의 효력을 가집니다.",
      "전자서명(Electronic Signature)은 반드시 당사자의 약정(동의) 후 수행되므로, 사람이 아닌 전자 형식이라는 이유로 문서 또는 서명의 법적 효력이 부인되지 않습니다."
    ]
  },
  {
  title: "전자문서및전자거래기본법",
  subtitle: "(서면이 아닌 전자문서의 효력)",
  content: [
    "전자문서 및 전자거래 기본법 제4조제1항: 전자문서는 전자적 형태로 되어 있다는 이유만으로 법적 효력이 부인되지 아니한다.",
    "전자문서 및 전자거래 기본법 제4조의2: 전자문서가 다음 각 호의 요건을 모두 갖춘 경우에는 그 전자문서를 서면으로 본다. 다만, 다른 법령에 특별한 규정이 있거나 성질상 전자적 형태가 허용되지 아니하는 경우에는 서면으로 보지 아니한다.",
    "  1. 전자문서의 내용을 열람할 수 있을 것",
    "  2. 전자문서가 작성·변환되거나 송신·수신 또는 저장된 때의 형태 또는 그와 같이 재현될 수 있는 형태로 보존되어 있을 것",
    "SIGNMATE의 전자문서는 작성·변환되거나 송신·수신 또는 저장된 때의 형태 또는 그와 같이 재현될 수 있는 형태로 보존되며 열람이 가능한 PDF 파일로 저장됩니다.",
    "단, 다른 법령에 특별한 규정이 있거나 성질상 전자적 형태가 허용되지 않는 경우 서면으로 인정되지 않을 수 있습니다.",
    "  (예: 민법 제428조의2(보증의 방식) - 단, 이 경우에도 전자문서법 제4조 제2항에 따라 보증인이 자기의 영업 또는 사업으로 작성한 보증의 의사가 표시된 전자문서는 서면으로 인정됩니다)"
  ]
}
];

export default function LawEffectPage() {
  const [search, setSearch] = useState("");
  const filteredLaws = laws.filter(
    law =>
      law.title.includes(search) ||
      law.subtitle.includes(search) ||
      law.content.some(c => c.includes(search))
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-12 py-16 md:py-20 font-sans">
      {/* 대표 문구 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-36 md:mb-44"
      >
        <span className="text-base md:text-lg text-blue-600 font-medium uppercase px-5 py-3 bg-blue-100 rounded-full">
          법적효력
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold mt-12 text-gray-900 leading-snug md:leading-relaxed">
          <span className="block mb-6">SIGNMATE 전자계약은</span>
          <span className="block">종이계약과 법적효력이 동일합니다</span>
        </h1>

        <p className="text-lg md:text-xl mt-8 md:mt-10 text-gray-700 max-w-3xl mx-auto">
          SIGNMATE에서 이용하는 서명과 계약은 법령에 근거해 확실한 법적효력이 인정됩니다.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-24 items-start">
        {/* 좌측 검색 & 안내 텍스트 */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-start"
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 md:mb-10 text-gray-900">
            주요 법령에 전자계약의 효력이 명시되어 있습니다
          </h2>
          <p className="text-lg md:text-xl leading-relaxed mb-8 md:mb-10 text-gray-600">
            민법, 전자서명법, 전자문서 및 전자거래 기본법에 명시된 내용을 확인해 보세요.
          </p>
          <div className="mt-4 md:mt-6">
            <Input
              placeholder="법령 이름이나 키워드를 검색하세요..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full shadow-lg rounded-3xl border border-gray-300 focus:ring-2 focus:ring-blue-400 p-4 text-lg"
            />
          </div>
        </motion.div>

        {/* 우측 드래그 가능한 아코디언 */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8 md:space-y-10"
        >
          <Accordion type="single" collapsible>
            {filteredLaws.map((law, index) => (
              <motion.div
                key={index}
                drag
                dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <AccordionItem
                  value={`law-${index}`}
                  className="bg-white shadow-xl rounded-3xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
                >
                  <AccordionTrigger className="text-xl md:text-2xl font-semibold px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-2 hover:text-blue-600 transition-colors duration-300">
                    <span>{law.title}</span>
                    <span className="text-gray-500 text-base md:text-lg">{law.subtitle}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 text-lg md:text-xl px-8 py-6 leading-relaxed border-t border-gray-100 space-y-4">
                    {Array.isArray(law.content)
                      ? law.content.map((c, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check size={20} color="#000000" className="flex-shrink-0 mt-1" />
                            <span>{c}</span>
                          </div>
                        ))
                      : (
                        <div className="flex items-start gap-2">
                          <Check size={20} color="#000000" className="flex-shrink-0 mt-1" />
                          <span>{law.content}</span>
                        </div>
                      )
                    }
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
