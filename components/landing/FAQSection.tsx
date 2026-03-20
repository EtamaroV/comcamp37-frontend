"use client"

import { useRouter } from 'next/navigation';


import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import {FAQQuestions} from "@/components/faq/faq";


function FAQSection() {
    const router = useRouter();

    const faqSecQ = FAQQuestions.slice(0, 7);

    return (
        <div className='w-full relative overflow-hidden flex flex-row justify-center items-center'>

            <div className="z-20 flex flex-col md:flex-row w-full max-w-[1600px] h-full">
                <div className="flex-1 flex flex-col justify-center items-center p-20">
                    <div className="absolute">
                        <div className="text-4xl font-bold font-zootopia p-40 bg-radial from-theme-primary to-transparent from-20% to-100%">FAQ</div>
                    </div>
                </div>
                <div className="z-20 flex-3 bg-theme-secondary w-full px-5 py-5 md:p-10 md:pl-15 relative">
                    <div className="bg-theme-secondary absolute w-[100vw] h-full origin-top-left top-0 -z-1 text-black"></div>
                    <Accordion
                        type="single"
                        collapsible
                        defaultValue="item-1"
                        className="z-20"
                    >
                        {faqSecQ.map((question) => (
                            <AccordionItem key={question.id} value={question.id} className="z-20 border-b-2 border-black cursor-pointer">
                                <AccordionTrigger className="text-black font-bold text-lg px-4 hover:no-underline hover:pl-6 [&>svg]:text-black cursor-pointer">{question.question}</AccordionTrigger>
                                <AccordionContent className="text-lg z-20 pr-4 pl-8 text-black whitespace-pre-line">{question.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    <button className="text-theme-primary font-bold text-lg relative group pl-5 cursor-pointer" onClick={() => {router.push(`/faq`);}}>
                        <div className="absolute -left-0 transition-all group-hover:left-1.5">{'>'}</div><div>คำถามเพิ่มเติม</div>
                    </button>
                </div>
            </div>

            <div className="absolute left-0 w-full h-full">
            <div className="flex overflow-hidden h-full flex-col justify-start align-middle items-end relative">
                <div
                    className="absolute w-[110dvw] h-[200dvh] rotate-13 origin-left md:origin-top-left -left-[25dvw] -top-[50dvh]"
                    style={{
                        backgroundColor: "transparent",
                        backgroundImage: `
                            linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
                        `,
                        backgroundSize: '80px 80px' // This defines the grid density
                    }}
                ></div>
            </div>
            </div>

        </div>
    )
}
export default FAQSection