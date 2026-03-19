import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

// Optional: Force edge runtime for the fastest response times
export const runtime = 'edge';

export function fixThaiLayout(text: string): string {
    if (!text) return '';

    // สร้างคู่ประกอบร่าง: นิคหิตปกติ (\u0E4D) + วรรณยุกต์ชั้น 3 (\uF70A-\uF70D)
    const amMapNormal: Record<string, string> = { '\u0E48': '\u0E4D\uF70A', '\u0E49': '\u0E4D\uF70B', '\u0E4A': '\u0E4D\uF70C', '\u0E4B': '\u0E4D\uF70D' };

    // สร้างคู่ประกอบร่างเยื้องซ้าย: นิคหิตเยื้องซ้าย (\uF711) + วรรณยุกต์ชั้น 3 เยื้องซ้าย (\uF718-\uF71B)
    const amMapLeft: Record<string, string> = { '\u0E48': '\uF711\uF718', '\u0E49': '\uF711\uF719', '\u0E4A': '\uF711\uF71A', '\u0E4B': '\uF711\uF71B' };

    let processedText = text
        // 1. จัดการ สระอำ หลัง ป ฝ ฟ (ใช้คู่เยื้องซ้าย)
        .replace(/([ปฝฟ])([่-๋])ำ/g, (m, c, t) => c + (amMapLeft[t] || '\uF711\uF705' + t) + 'า')
        .replace(/([ปฝฟ])ำ([่-๋])/g, (m, c, t) => c + (amMapLeft[t] || '\uF711\uF705' + t) + 'า')
        .replace(/([ปฝฟ])ำ/g, '$1\uF711า')

        // 2. จัดการ สระอำ ปกติ (ใช้คู่ปกติ)
        .replace(/([่-๋])ำ/g, (m, t) => (amMapNormal[t] || '\u0E4D\uF70A' + t) + 'า')
        .replace(/ำ([่-๋])/g, (m, t) => (amMapNormal[t] || '\u0E4D\uF70A' + t) + 'า')
        .replace(/ำ/g, '\u0E4Dา');

    processedText = processedText
        // 3. กฎเฉพาะ ฬ.จุฬา หางสั้น (ตามด้วยสระบน)
        .replace(/ฬ(?=[\u0E31\u0E34-\u0E37\u0E47-\u0E4C\u0E4D])/g, '\uF736')

        // 4. พยัญชนะฐานล่าง + สระล่าง
        .replace(/ฎ([ฺุู])/g, (m, v) => '\uF730' + (v === 'ุ' ? '\uF740' : v === 'ู' ? '\uF741' : '\uF742'))
        .replace(/ฏ([ฺุู])/g, (m, v) => '\uF731' + (v === 'ุ' ? '\uF740' : v === 'ู' ? '\uF741' : '\uF742'))
        .replace(/ฤ([ฺุู])/g, (m, v) => '\uF732' + (v === 'ุ' ? '\uF740' : v === 'ู' ? '\uF741' : '\uF742'))
        .replace(/ฦ([ฺุู])/g, (m, v) => '\uF733' + (v === 'ุ' ? '\uF740' : v === 'ู' ? '\uF741' : '\uF742'))
        .replace(/ฐ([ฺุู])/g, (m, v) => '\uF734' + (v === 'ุ' ? '\uF740' : v === 'ู' ? '\uF741' : '\uF742'))
        .replace(/ญ([ฺุู])/g, (m, v) => '\uF735' + (v === 'ุ' ? '\uF740' : v === 'ู' ? '\uF741' : '\uF742'))
        // Ligature ฤๅ ฦๅ
        .replace(/ฤๅ/g, '\uF750')
        .replace(/ฦๅ/g, '\uF751');

    // Map PUA แกน X Y
    const toneMapUp: Record<string, string> = { '\u0E48': '\uF70A', '\u0E49': '\uF70B', '\u0E4A': '\uF70C', '\u0E4B': '\uF70D', '\u0E4C': '\uF70E' };
    const toneMapLeft: Record<string, string> = { '\u0E48': '\uF705', '\u0E49': '\uF706', '\u0E4A': '\uF707', '\u0E4B': '\uF708', '\u0E4C': '\uF709' };
    const toneMapUpLeft: Record<string, string> = { '\u0E48': '\uF718', '\u0E49': '\uF719', '\u0E4A': '\uF71A', '\u0E4B': '\uF71B', '\u0E4C': '\uF71C' };
    const vowelMapLeft: Record<string, string> = { '\u0E31': '\uF710', '\u0E47': '\uF712', '\u0E34': '\uF713', '\u0E35': '\uF714', '\u0E36': '\uF715', '\u0E37': '\uF716', '\u0E4D': '\uF711' };

    const upperVowels = /[\u0E31\u0E34\u0E35\u0E36\u0E37\u0E47\u0E4D\uF710\uF711\uF712\uF713\uF714\uF715\uF716]/;
    const lowerVowels = /[\u0E38\u0E39\u0E3A\uF740\uF741\uF742]/;
    const longTailConsonants = /[ปฝฟ]/;

    let result = '';
    let isAfterLongTail = false;

    // 5. For Loop จัดเรียงแกน X Y
    for (let i = 0; i < processedText.length; i++) {
        const char = processedText[i];

        if (char.match(/[ก-ฮ\uF730-\uF736]/)) {
            isAfterLongTail = longTailConsonants.test(char);
            result += char;
        }
        else if (upperVowels.test(char)) {
            if (isAfterLongTail && vowelMapLeft[char]) result += vowelMapLeft[char];
            else result += char;
        }
        else if (char.match(/[\u0E48-\u0E4C]/)) {
            const prevChar = i > 0 ? processedText[i - 1] : '';
            const hasUpperVowel = upperVowels.test(prevChar);

            if (hasUpperVowel && isAfterLongTail) result += toneMapUpLeft[char] || char;
            else if (hasUpperVowel) result += toneMapUp[char] || char;
            else if (isAfterLongTail) result += toneMapLeft[char] || char;
            else result += char;
        }
        else {
            result += char;
            if (!lowerVowels.test(char)) isAfterLongTail = false;
        }
    }

    return result;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export async function GET(req: NextRequest) {
    const [fontData, bgBuffer] = await Promise.all([
        fetch(new URL('./NotoSansThai-OG.ttf', import.meta.url)).then((res) => res.arrayBuffer()),
        fetch('https://storage.comcamp.io/web-assets/result/storyTemplate.png').then((res) => res.arrayBuffer())
    ]);

    const bgBase64 = `data:image/png;base64,${arrayBufferToBase64(bgBuffer)}`;

    const { searchParams } = new URL(req.url);
    const title = fixThaiLayout(searchParams.get('name') ?? "");

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    position: 'relative',
                    backgroundColor: 'white',
                    fontFamily: 'NotoSansThai',
                }}
            >
                {/* ใช้ img tag แทน backgroundImage */}
                <img
                    src={bgBase64}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '1080px',
                        height: '1920px',
                        objectFit: 'cover',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        width: '948.14px',
                        height: '160px',
                        left: '22.96px',
                        top: '314.64px',
                        textAlign: 'center',
                        fontSize: '120px',
                        color: '#014AAD',
                        textShadow: '5px 5px 5.3px rgba(0, 0, 0, 0.19)',
                        transform: 'rotate(-3.7deg)',
                        lineHeight: "111.98%"
                    }}
                >
                    {title}
                </div>
            </div>
        ),
        {
            width: 1080,
            height: 1920,
            fonts: [
                {
                    name: 'NotoSansThai',
                    data: fontData,
                    weight: 700,
                },
            ],
        }
    );
}