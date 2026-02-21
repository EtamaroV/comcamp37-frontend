import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'experimental-edge';

const ACCESS_RULES = [
    {
        path: '/signin',
        startTime: new Date(process.env.NEXT_PUBLIC_TIME_START_REGIS || "2026-02-23T00:00:00+07:00").getTime(),
        endTime: null,
    },
    {
        path: '/application',
        startTime: new Date(process.env.NEXT_PUBLIC_TIME_START_REGIS || "2026-02-23T00:00:00+07:00").getTime(),
        endTime: null,
    }
];

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)

    if (process.env.NEXT_PUBLIC_BYPASS_REGISTER_TIME === 'true') {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;

    if (process.env.NEXT_PUBLIC_IS_COMINGSOON === 'true') {
        if (pathname == '/') {
            const url = request.nextUrl.clone();
            url.pathname = '/coming-soon';
            return NextResponse.rewrite(url);
        }
    }

    const now = Date.now();

    requestHeaders.set('x-current-path', request.nextUrl.pathname)

    const rule = ACCESS_RULES.find(r => pathname.startsWith(r.path));

    if (rule) {
        const isTooEarly = now < rule.startTime;

        const isExpired = rule.endTime ? now > rule.endTime : false;

        if (isTooEarly || isExpired) {
            const url = request.nextUrl.clone();
            url.pathname = '/404';
            return NextResponse.rewrite(url);
        }
    }

    return NextResponse.next(
        {
            request: {
                headers: requestHeaders,
            },
        }
    );
}

// Next.js 16 performance tip: Use a matcher so the proxy only runs on specific routes
export const config = {
    matcher: [
        '/signin',
        '/application/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)', // Except For Statics File
    ],
};