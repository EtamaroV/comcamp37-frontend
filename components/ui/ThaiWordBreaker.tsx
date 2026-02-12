"use client";

import React, { useMemo } from 'react';

interface Props {
    text: string;
}

const ThaiWordBreaker = ({ text }:Props) => {
    const processedText = useMemo(() => {
        // Fallback ถ้า Browser ไม่รองรับ
        if (typeof Intl === 'undefined' || !Intl.Segmenter) return text;

        const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
        const originalSegments = Array.from(segmenter.segment(text));
        const mergedSegments: string[] = [];

        for (let i = 0; i < originalSegments.length; i++) {
            let currentWord = originalSegments[i].segment;

            // Loop เพื่อเช็คคำถัดไป (Look ahead)
            while (i + 1 < originalSegments.length) {
                const nextSegment = originalSegments[i + 1].segment;

                // กรณีที่ 1: คำถัดไปเป็น "ๆ" ติดกันเลย (เช่น "ต่างๆ")
                if (nextSegment === 'ๆ') {
                    currentWord += nextSegment;
                    i++; // ข้าม index ถัดไปเพราะรวมมาแล้ว
                    continue; // เช็คต่อเผื่อมี ๆ อีก (เช่น "มากๆๆ")
                }

                // กรณีที่ 2: คำถัดไปเป็นช่องว่าง และตัวถัดไปอีกเป็น "ๆ" (เช่น "ข้อความ ๆ")
                if (nextSegment.trim() === '' && i + 2 < originalSegments.length) {
                    const nextNextSegment = originalSegments[i + 2].segment;
                    if (nextNextSegment === 'ๆ') {
                        currentWord += nextSegment + nextNextSegment;
                        i += 2; // ข้ามช่องว่างและ ๆ
                        continue;
                    }
                }

                // ถ้าไม่เข้าเงื่อนไข ให้หยุดรวม
                break;
            }

            mergedSegments.push(currentWord);
        }

        return mergedSegments.map((word, index) => (
            <span key={index} className="inline-block whitespace-nowrap">
                {word}
                {/* จัดการเรื่องช่องว่าง ถ้าคำนั้นเป็นช่องว่างล้วนๆ ให้ใช้ Non-breaking space */}
                {word === ' ' ? '\u00A0' : ''}
            </span>
        ));
    }, [text]);

    return <span className="inline break-words">{processedText}</span>;
};

export const ThaiWordBreakerWBR = ({ text }: Props) => {
    const processedText = useMemo(() => {
        if (typeof Intl === 'undefined' || !Intl.Segmenter) {
            return text;
        }

        const segmenter = new Intl.Segmenter('th', { granularity: 'word' });
        const segments = segmenter.segment(text);

        return Array.from(segments).map((s, index) => (
            <React.Fragment key={index}>
                {s.segment}
                <wbr />
            </React.Fragment>
        ));
    }, [text]);

    return <>{processedText}</>;
};

export default ThaiWordBreaker;