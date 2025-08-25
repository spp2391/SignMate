import React, { useState } from "react";

// 전체 Accordion 컨테이너
export function Accordion({ children }) {
  return <div className="flex flex-col gap-6">{children}</div>;
}

// AccordionItem: 개별 아코디언
export function AccordionItem({ children, className }) {
  const [isOpen, setIsOpen] = useState(false);

  // Trigger와 Content 구분
  const trigger = React.Children.toArray(children).find(
    (child) => child.type.displayName === "AccordionTrigger"
  );
  const content = React.Children.toArray(children).find(
    (child) => child.type.displayName === "AccordionContent"
  );

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${className || ""}`}
    >
      {trigger && React.cloneElement(trigger, { onClick: handleToggle })}
      {content && React.cloneElement(content, { isOpen })}
    </div>
  );
}

// AccordionTrigger: 클릭 버튼
export function AccordionTrigger({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0 font-semibold text-lg bg-gray-50 hover:bg-gray-100 transition ${className || ""}`}
    >
      {children}
    </button>
  );
}
AccordionTrigger.displayName = "AccordionTrigger";

// AccordionContent: 열렸을 때 보여주는 내용
export function AccordionContent({ children, isOpen, className }) {
  if (!isOpen) return null;
  return (
    <div className={`px-6 py-4 text-gray-700 leading-relaxed space-y-2 ${className || ""}`}>
      {children}
    </div>
  );
}
AccordionContent.displayName = "AccordionContent";
