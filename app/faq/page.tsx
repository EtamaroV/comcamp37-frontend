"use client";

import { useEffect } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {Footer} from "@/components/ui/footer";
import {FAQQuestions} from "@/components/faq/faq";

export default function faqPage() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
      <>
      <div className="flex flex-col justify-center items-center">
        <div className='flex flex-col justify-center w-full items-center pt-16 pb-10 mb-10'>
            <p className='text-8xl mb-4 font-zootopia'>FAQ</p><p className='text-white/50'>Frequently Asked Question</p>
        </div>
        {/* 1 ก้อน */}
        <div className="z-20 flex-3 bg-theme-secondary w-full px-5 py-5 md:p-10 md:pl-15 relative">
        <Accordion
                    type="single"
                    collapsible
                    defaultValue="item-1"
                    className="z-20"
                >
                    {FAQQuestions.map((question) => (
                        <AccordionItem key={question.id} value={question.id} className="z-20 border-b-2 border-black cursor-pointer">
                            <AccordionTrigger className="text-black font-bold text-lg px-4 hover:no-underline hover:pl-6 [&>svg]:text-black cursor-pointer">{question.question}</AccordionTrigger>
                            <AccordionContent className="text-lg z-20 pr-4 pl-8 text-black whitespace-pre-line">{question.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
        </div>
        </div>

          <Footer/>
        
    </>
    );
}