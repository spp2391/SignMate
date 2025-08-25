import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";

const laws = [
  {
    title: "민법",
    subtitle: "(낙성불요식 계약 원칙, 계약의 효력)",
    content: [
      "한국 민법에서는 별도의 형식을 요구하지 않고, 당사자간의 약정(합의)만으로 계약의 성립을 인정하는 낙성 불요식 계약 원칙을 따르고 있습니다.",
      "계약 당사자가 계약 내용에 대해서 동의했다는 사실을 증명할 수 있으면 그 형태가 무엇이든 법적 효력이 인정됩니다.",
      "종이 계약서는 계약 내용에 대해 증명할 수 있는 증거 중 하나입니다. 종이 쪽지, 음성 녹음 파일 역시 계약 내용을 증명할 수 있다면 종이 계약서와 마찬가지로 증거로써 법적 효력이 인정됩니다.",
      "모두싸인은 이메일, 휴대폰 본인 인증, 접근 암호 등 최대 3개의 수단을 통한 본인 확인을 합니다. 서명 진행과 관련된 중요 시점마다 시간, IP 주소, 기기정보, 브라우저 정보 등과 같은 중요 정보에 대해 감사 로그를 기록하여 계약 당사자가 해당 행위를 했다는 사실을 증명할 수 있습니다."
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
    title: "전자문서 및 전자거래 기본법",
    subtitle: "(전자 문서의 법적 효력)",
    content: [
      "전자문서는 원칙적으로 종이 문서와 동일한 효력이 있습니다.",
      "전자문서로 계약, 청구, 송장 발급 등 법적 효력이 필요한 행위를 수행할 수 있으며, 별도의 추가 형식을 요구하지 않습니다."
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
          <span className="block mb-6">모두싸인 전자계약은</span>
          <span className="block">종이계약과 법적효력이 동일합니다</span>
        </h1>

        <p className="text-lg md:text-xl mt-8 md:mt-10 text-gray-700 max-w-3xl mx-auto">
          모두싸인에서 이용하는 서명과 계약은 법령에 근거해 확실한 법적효력이 인정됩니다.
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
              className="w-full shadow-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 p-4 text-lg"
            />
          </div>
        </motion.div>

        {/* 우측 아코디언 */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8 md:space-y-10"
        >
          <Accordion type="single" collapsible>
            {filteredLaws.map((law, index) => (
              <AccordionItem
                key={index}
                value={`law-${index}`}
                className="bg-white shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <AccordionTrigger className="text-xl md:text-2xl font-semibold px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-2">
                  <span>{law.title}</span>
                  <span className="text-gray-500 text-base md:text-lg">{law.subtitle}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-lg md:text-xl px-8 py-5 leading-relaxed border-t border-gray-100 space-y-3">
                  {Array.isArray(law.content)
                    ? law.content.map((c, i) => <p key={i}>{c}</p>)
                    : <p>{law.content}</p>
                  }
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
