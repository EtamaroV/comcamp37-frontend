"use client"

import React from "react";
import ConfirmationCard from "@/components/result/ConfirmationCard";

interface StampProps {
    status?: string;
}

export const Stamp: React.FC<StampProps> = ({
    status = "fail"
}) => {

    switch (status) {
        case "fail":
            return (
                <svg viewBox="0 0 426 215" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_g_1107_2481)">
                        <path d="M50.3418 84.8525H63.4375C72.168 84.8525 78.0713 85.1895 81.1475 85.8633C84.2529 86.5371 86.7725 88.2656 88.7061 91.0488C90.6689 93.8027 91.6504 98.2119 91.6504 104.276C91.6504 109.813 90.9619 113.534 89.585 115.438C88.208 117.343 85.498 118.485 81.4551 118.866C85.1172 119.774 87.5781 120.99 88.8379 122.514C90.0977 124.037 90.874 125.443 91.167 126.732C91.4893 127.992 91.6504 131.493 91.6504 137.235V156H74.4678V132.357C74.4678 128.549 74.1602 126.19 73.5449 125.282C72.959 124.374 71.3916 123.92 68.8428 123.92V156H50.3418V84.8525ZM68.8428 97.0254V112.846C70.9229 112.846 72.373 112.567 73.1934 112.011C74.043 111.425 74.4678 109.564 74.4678 106.43V102.519C74.4678 100.263 74.0576 98.7832 73.2373 98.0801C72.4463 97.377 70.9814 97.0254 68.8428 97.0254ZM98.8574 84.8525H129.707V99.0908H117.358V112.582H128.916V126.117H117.358V141.762H130.938V156H98.8574V84.8525ZM158.931 84.8525V132.401C158.931 139.521 158.857 144.105 158.711 146.156C158.564 148.178 157.891 150.009 156.689 151.649C155.518 153.29 153.906 154.433 151.855 155.077C149.834 155.692 146.772 156 142.671 156H133.398V143.563C134.512 143.651 135.317 143.695 135.815 143.695C137.134 143.695 138.174 143.373 138.936 142.729C139.697 142.084 140.137 141.293 140.254 140.355C140.371 139.418 140.43 137.602 140.43 134.906V84.8525H158.931ZM166.094 84.8525H196.943V99.0908H184.595V112.582H196.152V126.117H184.595V141.762H198.174V156H166.094V84.8525ZM246.733 115.878H228.232V103.485C228.232 99.8818 228.027 97.6406 227.617 96.7617C227.236 95.8535 226.372 95.3994 225.024 95.3994C223.501 95.3994 222.534 95.9414 222.124 97.0254C221.714 98.1094 221.509 100.453 221.509 104.057V137.104C221.509 140.561 221.714 142.816 222.124 143.871C222.534 144.926 223.457 145.453 224.893 145.453C226.27 145.453 227.163 144.926 227.573 143.871C228.013 142.816 228.232 140.341 228.232 136.444V127.523H246.733V130.292C246.733 137.646 246.206 142.86 245.151 145.937C244.126 149.013 241.826 151.708 238.252 154.022C234.707 156.337 230.327 157.494 225.112 157.494C219.692 157.494 215.225 156.513 211.709 154.55C208.193 152.587 205.864 149.877 204.722 146.42C203.579 142.934 203.008 137.704 203.008 130.731V109.945C203.008 104.818 203.184 100.98 203.535 98.4316C203.887 95.8535 204.927 93.3779 206.655 91.0049C208.413 88.6318 210.83 86.7715 213.906 85.4238C217.012 84.0469 220.571 83.3584 224.585 83.3584C230.034 83.3584 234.531 84.4131 238.076 86.5225C241.621 88.6318 243.95 91.2686 245.063 94.4326C246.177 97.5674 246.733 102.46 246.733 109.11V115.878ZM290.635 84.8525V99.0908H279.648V156H261.147V99.0908H250.205V84.8525H290.635ZM294.854 84.8525H325.703V99.0908H313.354V112.582H324.912V126.117H313.354V141.762H326.934V156H294.854V84.8525ZM332.295 84.8525H346.138C355.073 84.8525 361.108 85.2627 364.243 86.083C367.407 86.9033 369.81 88.251 371.45 90.126C373.091 92.001 374.116 94.0957 374.526 96.4102C374.937 98.6953 375.142 103.207 375.142 109.945V134.862C375.142 141.249 374.834 145.526 374.219 147.694C373.633 149.833 372.593 151.518 371.099 152.748C369.604 153.949 367.759 154.799 365.562 155.297C363.364 155.766 360.054 156 355.63 156H332.295V84.8525ZM350.796 97.0254V143.827C353.462 143.827 355.103 143.3 355.718 142.245C356.333 141.161 356.641 138.246 356.641 133.5V105.858C356.641 102.636 356.538 100.57 356.333 99.6621C356.128 98.7539 355.659 98.0947 354.927 97.6846C354.194 97.2451 352.817 97.0254 350.796 97.0254Z" fill="#AA0000"/>
                    </g>
                    <g filter="url(#filter1_g_1107_2481)">
                        <rect x="33" y="168" width="360" height="5" fill="#AA0000"/>
                        <rect x="33.5" y="168.5" width="359" height="4" stroke="#AA0000"/>
                    </g>
                    <g filter="url(#filter2_g_1107_2481)">
                        <rect x="33" y="182" width="360" height="3" fill="#AA0000"/>
                        <rect x="33.5" y="182.5" width="359" height="2" stroke="#AA0000"/>
                    </g>
                    <path d="M221.022 20.7758C221.546 21.1589 221.738 21.9718 221.577 23.314C221.422 24.6148 220.963 26.1853 220.486 27.8145C220.016 29.4184 219.526 31.0808 219.352 32.4895C219.183 33.8567 219.278 35.2269 220.27 35.9885C220.583 36.2281 220.964 36.3285 221.343 36.3578C221.724 36.3871 222.14 36.3478 222.562 36.2754C223.4 36.1315 224.357 35.8366 225.237 35.5777C226.144 35.3111 226.962 35.085 227.598 35.0339C227.915 35.0084 228.14 35.031 228.29 35.0837C228.42 35.1297 228.486 35.1945 228.528 35.2916C229.024 36.4506 228.501 37.9126 227.021 39.5412C225.567 41.1399 223.322 42.7431 220.799 44.0917C218.28 45.4381 215.516 46.5129 213.049 47.0737C211.815 47.354 210.667 47.5031 209.667 47.498C208.663 47.4929 207.841 47.3327 207.234 47.0221C206.611 46.7032 205.98 46.1025 205.368 45.2475C204.758 44.3969 204.187 43.3219 203.674 42.0938C202.647 39.6376 201.87 36.614 201.469 33.6552C201.068 30.6906 201.05 27.8318 201.514 25.6974C201.987 23.5182 202.894 22.3375 204.151 22.2136C204.339 22.1951 204.606 22.3231 204.954 22.9687C205.28 23.5741 205.56 24.4196 205.857 25.3374C206.147 26.2288 206.453 27.1873 206.826 27.9314C207.013 28.3051 207.232 28.6548 207.497 28.9232C207.766 29.1956 208.105 29.406 208.521 29.4426C209.126 29.4955 209.731 29.3189 210.311 29.0257C210.892 28.7317 211.479 28.3039 212.061 27.8084C213.22 26.8205 214.428 25.4987 215.578 24.276C216.746 23.0338 217.849 21.9007 218.84 21.2124C219.859 20.5051 220.532 20.417 221.022 20.7758Z" fill="#AA0000" stroke="#AA0000"/>
                    <g filter="url(#filter3_g_1107_2481)">
                        <circle cx="213" cy="34" r="27.5" stroke="#AA0000" strokeWidth="5"/>
                    </g>
                    <g filter="url(#filter4_g_1107_2481)">
                        <path d="M385 30C405.435 30 422 46.5655 422 67V174C422 194.435 405.435 211 385 211H41C20.5655 211 4 194.435 4 174V67C4 46.5655 20.5655 30 41 30H177.089C177.031 30.8259 177 31.6595 177 32.5C177 36.1554 177.553 39.6816 178.579 43H42C28.7452 43 18 53.7452 18 67V174C18 187.255 28.7452 198 42 198H384C397.255 198 408 187.255 408 174V67C408 53.7452 397.255 43 384 43H246.421C247.447 39.6816 248 36.1554 248 32.5C248 31.6595 247.969 30.8259 247.911 30H385Z" fill="#AA0000"/>
                    </g>
                    <defs>
                        <filter id="filter0_g_1107_2481" x="48.0418" y="81.0584" width="329.4" height="78.7357" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="1180" />
                            <feDisplacementMap in="shape" scale="4.5999999046325684" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                            <feMerge result="effect1_texture_1107_2481">
                                <feMergeNode in="displacedImage"/>
                            </feMerge>
                        </filter>
                        <filter id="filter1_g_1107_2481" x="31.1" y="166.1" width="363.8" height="8.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feTurbulence type="fractalNoise" baseFrequency="0.19230769574642181 0.19230769574642181" numOctaves="3" seed="5382" />
                            <feDisplacementMap in="shape" scale="3.7999999523162842" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                            <feMerge result="effect1_texture_1107_2481">
                                <feMergeNode in="displacedImage"/>
                            </feMerge>
                        </filter>
                        <filter id="filter2_g_1107_2481" x="31.1" y="180.1" width="363.8" height="6.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feTurbulence type="fractalNoise" baseFrequency="0.19230769574642181 0.19230769574642181" numOctaves="3" seed="5382" />
                            <feDisplacementMap in="shape" scale="3.7999999523162842" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                            <feMerge result="effect1_texture_1107_2481">
                                <feMergeNode in="displacedImage"/>
                            </feMerge>
                        </filter>
                        <filter id="filter3_g_1107_2481" x="179" y="0" width="68" height="68" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feTurbulence type="fractalNoise" baseFrequency="0.033003300428390503 0.033003300428390503" numOctaves="3" seed="4575" />
                            <feDisplacementMap in="shape" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                            <feMerge result="effect1_texture_1107_2481">
                                <feMergeNode in="displacedImage"/>
                            </feMerge>
                        </filter>
                        <filter id="filter4_g_1107_2481" x="0" y="26" width="426" height="189" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feTurbulence type="fractalNoise" baseFrequency="0.030303031206130981 0.030303031206130981" numOctaves="3" seed="9401" />
                            <feDisplacementMap in="shape" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                            <feMerge result="effect1_texture_1107_2481">
                                <feMergeNode in="displacedImage"/>
                            </feMerge>
                        </filter>
                    </defs>
                </svg>
            )
        case "reserve":
            return (
                <svg viewBox="0 0 426 215" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_g_1107_2482)">
                        <path d="M118.896 84.8525L110.679 156H87.5635C85.4541 145.072 83.5938 132.65 81.9824 118.734C81.25 124.682 79.5361 137.104 76.8408 156H53.8574L45.5957 84.8525H63.5693L65.459 109.682L67.3926 133.632C68.0664 121.239 69.7656 104.979 72.4902 84.8525H91.7383C92.002 86.9326 92.6758 94.7549 93.7598 108.319L95.7812 135.346C96.8066 118.148 98.5205 101.317 100.923 84.8525H118.896ZM153.657 84.8525L164.248 156H145.308L144.385 143.212H137.749L136.65 156H117.49L126.895 84.8525H153.657ZM143.857 130.6C142.92 122.543 141.982 112.597 141.045 100.761C139.17 114.354 137.998 124.301 137.529 130.6H143.857ZM185.913 84.8525V156H167.412V84.8525H185.913ZM230.605 84.8525V99.0908H219.619V156H201.118V99.0908H190.176V84.8525H230.605ZM253.325 84.8525V141.762H264.575V156H234.824V84.8525H253.325ZM287.603 84.8525V156H269.102V84.8525H287.603ZM334.229 106.386H317.046V101.112C317.046 98.6514 316.826 97.084 316.387 96.4102C315.947 95.7363 315.215 95.3994 314.189 95.3994C313.076 95.3994 312.227 95.8535 311.641 96.7617C311.084 97.6699 310.806 99.0469 310.806 100.893C310.806 103.266 311.128 105.053 311.772 106.254C312.388 107.455 314.131 108.905 317.002 110.604C325.234 115.497 330.42 119.511 332.559 122.646C334.697 125.78 335.767 130.834 335.767 137.807C335.767 142.875 335.166 146.61 333.965 149.013C332.793 151.415 330.508 153.437 327.109 155.077C323.711 156.688 319.756 157.494 315.244 157.494C310.293 157.494 306.06 156.557 302.544 154.682C299.058 152.807 296.772 150.419 295.688 147.519C294.604 144.618 294.062 140.502 294.062 135.17V130.512H311.245V139.169C311.245 141.835 311.479 143.549 311.948 144.311C312.446 145.072 313.311 145.453 314.541 145.453C315.771 145.453 316.68 144.97 317.266 144.003C317.881 143.036 318.188 141.601 318.188 139.696C318.188 135.507 317.617 132.768 316.475 131.479C315.303 130.189 312.417 128.036 307.817 125.019C303.218 121.972 300.171 119.76 298.677 118.383C297.183 117.006 295.938 115.102 294.941 112.67C293.975 110.238 293.491 107.133 293.491 103.354C293.491 97.9043 294.18 93.9199 295.557 91.4004C296.963 88.8809 299.219 86.918 302.324 85.5117C305.43 84.0762 309.18 83.3584 313.574 83.3584C318.379 83.3584 322.466 84.1348 325.835 85.6875C329.233 87.2402 331.475 89.2031 332.559 91.5762C333.672 93.9199 334.229 97.9189 334.229 103.573V106.386ZM378.877 84.8525V99.0908H367.891V156H349.39V99.0908H338.447V84.8525H378.877Z" fill="#B87E00"/>
                    </g>
                    <g filter="url(#filter1_g_1107_2482)">
                        <rect x="33" y="168" width="360" height="5" fill="#B87E00"/>
                    </g>
                    <g filter="url(#filter2_g_1107_2482)">
                        <rect x="33" y="182" width="360" height="3" fill="#B87E00"/>
                    </g>
                    <path d="M207.006 47.4671C212.622 50.3405 231.472 40.8922 228.988 35.0946C228.158 33.1579 222.246 36.8744 220.575 35.5914C217.552 33.2719 224.392 22.6217 221.317 20.3722C218.216 18.1037 212.393 29.28 208.565 28.9446C206.45 28.759 206.216 21.5079 204.103 21.7159C197.655 22.3495 201.238 44.5153 207.006 47.4671Z" fill="#B87E00"/>
                    <g filter="url(#filter3_g_1107_2482)">
                        <circle cx="213" cy="34" r="27.5" stroke="#B87E00" strokeWidth="5"/>
                    </g>
                    <g filter="url(#filter4_g_1107_2482)">
                        <path d="M385 30C405.435 30 422 46.5655 422 67V174C422 194.435 405.435 211 385 211H41C20.5655 211 4 194.435 4 174V67C4 46.5655 20.5655 30 41 30H177.089C177.031 30.8259 177 31.6595 177 32.5C177 36.1554 177.553 39.6816 178.579 43H42C28.7452 43 18 53.7452 18 67V174C18 187.255 28.7452 198 42 198H384C397.255 198 408 187.255 408 174V67C408 53.7452 397.255 43 384 43H246.421C247.447 39.6816 248 36.1554 248 32.5C248 31.6595 247.969 30.8259 247.911 30H385Z" fill="#B87E00"/>
                    </g>
                    <defs>
                        <filter id="filter0_g_1107_2482" x="43.2957" y="81.0584" width="337.881" height="78.7357" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="1180" />
                            <feDisplacementMap in="shape" scale="4.5999999046325684" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                            <feMerge result="effect1_texture_1107_2482">
                                <feMergeNode in="displacedImage"/>
                            </feMerge>
                        </filter>
                        <filter id="filter1_g_1107_2482" x="31.1" y="166.1" width="363.8" height="8.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feTurbulence type="fractalNoise" baseFrequency="0.19230769574642181 0.19230769574642181" numOctaves="3" seed="5382" />
                            <feDisplacementMap in="shape" scale="3.7999999523162842" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                            <feMerge result="effect1_texture_1107_2482">
                                <feMergeNode in="displacedImage"/>
                            </feMerge>
                        </filter>
                        <filter id="filter2_g_1107_2482" x="31.1" y="180.1" width="363.8" height="6.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feTurbulence type="fractalNoise" baseFrequency="0.19230769574642181 0.19230769574642181" numOctaves="3" seed="5382" />
                            <feDisplacementMap in="shape" scale="3.7999999523162842" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                            <feMerge result="effect1_texture_1107_2482">
                                <feMergeNode in="displacedImage"/>
                            </feMerge>
                        </filter>
                        <filter id="filter3_g_1107_2482" x="179" y="0" width="68" height="68" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feTurbulence type="fractalNoise" baseFrequency="0.033003300428390503 0.033003300428390503" numOctaves="3" seed="4575" />
                            <feDisplacementMap in="shape" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                            <feMerge result="effect1_texture_1107_2482">
                                <feMergeNode in="displacedImage"/>
                            </feMerge>
                        </filter>
                        <filter id="filter4_g_1107_2482" x="0" y="26" width="426" height="189" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feTurbulence type="fractalNoise" baseFrequency="0.030303031206130981 0.030303031206130981" numOctaves="3" seed="9401" />
                            <feDisplacementMap in="shape" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                            <feMerge result="effect1_texture_1107_2482">
                                <feMergeNode in="displacedImage"/>
                            </feMerge>
                        </filter>
                    </defs>
                </svg>
            )
        case "pass":
            return (
                <svg viewBox="0 0 426 215" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_g_1107_2480)">
                        <path d="M69.8096 84.8525L80.4004 156H61.46L60.5371 143.212H53.9014L52.8027 156H33.6426L43.0469 84.8525H69.8096ZM60.0098 130.6C59.0723 122.543 58.1348 112.597 57.1973 100.761C55.3223 114.354 54.1504 124.301 53.6816 130.6H60.0098ZM126.763 115.878H108.262V103.485C108.262 99.8818 108.057 97.6406 107.646 96.7617C107.266 95.8535 106.401 95.3994 105.054 95.3994C103.53 95.3994 102.563 95.9414 102.153 97.0254C101.743 98.1094 101.538 100.453 101.538 104.057V137.104C101.538 140.561 101.743 142.816 102.153 143.871C102.563 144.926 103.486 145.453 104.922 145.453C106.299 145.453 107.192 144.926 107.603 143.871C108.042 142.816 108.262 140.341 108.262 136.444V127.523H126.763V130.292C126.763 137.646 126.235 142.86 125.181 145.937C124.155 149.013 121.855 151.708 118.281 154.022C114.736 156.337 110.356 157.494 105.142 157.494C99.7217 157.494 95.2539 156.513 91.7383 154.55C88.2227 152.587 85.8936 149.877 84.751 146.42C83.6084 142.934 83.0371 137.704 83.0371 130.731V109.945C83.0371 104.818 83.2129 100.98 83.5645 98.4316C83.916 95.8535 84.9561 93.3779 86.6846 91.0049C88.4424 88.6318 90.8594 86.7715 93.9355 85.4238C97.041 84.0469 100.601 83.3584 104.614 83.3584C110.063 83.3584 114.561 84.4131 118.105 86.5225C121.65 88.6318 123.979 91.2686 125.093 94.4326C126.206 97.5674 126.763 102.46 126.763 109.11V115.878ZM176.597 115.878H158.096V103.485C158.096 99.8818 157.891 97.6406 157.48 96.7617C157.1 95.8535 156.235 95.3994 154.888 95.3994C153.364 95.3994 152.397 95.9414 151.987 97.0254C151.577 98.1094 151.372 100.453 151.372 104.057V137.104C151.372 140.561 151.577 142.816 151.987 143.871C152.397 144.926 153.32 145.453 154.756 145.453C156.133 145.453 157.026 144.926 157.437 143.871C157.876 142.816 158.096 140.341 158.096 136.444V127.523H176.597V130.292C176.597 137.646 176.069 142.86 175.015 145.937C173.989 149.013 171.689 151.708 168.115 154.022C164.57 156.337 160.19 157.494 154.976 157.494C149.556 157.494 145.088 156.513 141.572 154.55C138.057 152.587 135.728 149.877 134.585 146.42C133.442 142.934 132.871 137.704 132.871 130.731V109.945C132.871 104.818 133.047 100.98 133.398 98.4316C133.75 95.8535 134.79 93.3779 136.519 91.0049C138.276 88.6318 140.693 86.7715 143.77 85.4238C146.875 84.0469 150.435 83.3584 154.448 83.3584C159.897 83.3584 164.395 84.4131 167.939 86.5225C171.484 88.6318 173.813 91.2686 174.927 94.4326C176.04 97.5674 176.597 102.46 176.597 109.11V115.878ZM183.232 84.8525H214.082V99.0908H201.733V112.582H213.291V126.117H201.733V141.762H215.312V156H183.232V84.8525ZM220.674 84.8525H239.307C244.346 84.8525 248.213 85.248 250.908 86.0391C253.633 86.8301 255.669 87.9727 257.017 89.4668C258.394 90.9609 259.316 92.7773 259.785 94.916C260.283 97.0254 260.532 100.307 260.532 104.76V110.956C260.532 115.497 260.063 118.808 259.126 120.888C258.188 122.968 256.46 124.564 253.94 125.678C251.45 126.791 248.184 127.348 244.141 127.348H239.175V156H220.674V84.8525ZM239.175 97.0254V115.131C239.702 115.16 240.156 115.175 240.537 115.175C242.236 115.175 243.408 114.765 244.053 113.944C244.727 113.095 245.063 111.352 245.063 108.715V102.87C245.063 100.438 244.683 98.8564 243.921 98.124C243.159 97.3916 241.577 97.0254 239.175 97.0254ZM303.115 84.8525V99.0908H292.129V156H273.628V99.0908H262.686V84.8525H303.115ZM307.334 84.8525H338.184V99.0908H325.835V112.582H337.393V126.117H325.835V141.762H339.414V156H307.334V84.8525ZM344.775 84.8525H358.618C367.554 84.8525 373.589 85.2627 376.724 86.083C379.888 86.9033 382.29 88.251 383.931 90.126C385.571 92.001 386.597 94.0957 387.007 96.4102C387.417 98.6953 387.622 103.207 387.622 109.945V134.862C387.622 141.249 387.314 145.526 386.699 147.694C386.113 149.833 385.073 151.518 383.579 152.748C382.085 153.949 380.239 154.799 378.042 155.297C375.845 155.766 372.534 156 368.11 156H344.775V84.8525ZM363.276 97.0254V143.827C365.942 143.827 367.583 143.3 368.198 142.245C368.813 141.161 369.121 138.246 369.121 133.5V105.858C369.121 102.636 369.019 100.57 368.813 99.6621C368.608 98.7539 368.14 98.0947 367.407 97.6846C366.675 97.2451 365.298 97.0254 363.276 97.0254Z" fill="#1CAA00"/>
                    </g>
                    <g filter="url(#filter1_g_1107_2480)">
                        <rect x="33" y="168" width="360" height="5" fill="#1CAA00"/>
                        <rect x="33.5" y="168.5" width="359" height="4" stroke="#1CAA00"/>
                    </g>
                    <g filter="url(#filter2_g_1107_2480)">
                        <rect x="33" y="182" width="360" height="3" fill="#1CAA00"/>
                        <rect x="33.5" y="182.5" width="359" height="2" stroke="#1CAA00"/>
                    </g>
                    <path d="M221.022 20.7758C221.546 21.1589 221.738 21.9718 221.577 23.314C221.422 24.6148 220.963 26.1853 220.486 27.8145C220.016 29.4184 219.526 31.0808 219.352 32.4895C219.183 33.8567 219.278 35.2269 220.27 35.9885C220.583 36.2281 220.964 36.3285 221.343 36.3578C221.724 36.3871 222.14 36.3478 222.562 36.2754C223.4 36.1315 224.357 35.8366 225.237 35.5777C226.144 35.3111 226.962 35.085 227.598 35.0339C227.915 35.0084 228.14 35.031 228.29 35.0837C228.42 35.1297 228.486 35.1945 228.528 35.2916C229.024 36.4506 228.501 37.9126 227.021 39.5412C225.567 41.1399 223.322 42.7431 220.799 44.0917C218.28 45.4381 215.516 46.5129 213.049 47.0737C211.815 47.354 210.667 47.5031 209.667 47.498C208.663 47.4929 207.841 47.3327 207.234 47.0221C206.611 46.7032 205.98 46.1025 205.368 45.2475C204.758 44.3969 204.187 43.3219 203.674 42.0938C202.647 39.6376 201.87 36.614 201.469 33.6552C201.068 30.6906 201.05 27.8318 201.514 25.6974C201.987 23.5182 202.894 22.3375 204.151 22.2136C204.339 22.1951 204.606 22.3231 204.954 22.9687C205.28 23.5741 205.56 24.4196 205.857 25.3374C206.147 26.2288 206.453 27.1873 206.826 27.9314C207.013 28.3051 207.232 28.6548 207.497 28.9232C207.766 29.1956 208.105 29.406 208.521 29.4426C209.126 29.4955 209.731 29.3189 210.311 29.0257C210.892 28.7317 211.479 28.3039 212.061 27.8084C213.22 26.8205 214.428 25.4987 215.578 24.276C216.746 23.0338 217.849 21.9007 218.84 21.2124C219.859 20.5051 220.532 20.417 221.022 20.7758Z" fill="#1CAA00" stroke="#1CAA00"/>
                    <g filter="url(#filter3_g_1107_2480)">
                        <circle cx="213" cy="34" r="27.5" stroke="#1CAA00" strokeWidth="5"/>
                    </g>
                    <g filter="url(#filter4_g_1107_2480)">
                        <path d="M385 30C405.435 30 422 46.5655 422 67V174C422 194.435 405.435 211 385 211H41C20.5655 211 4 194.435 4 174V67C4 46.5655 20.5655 30 41 30H177.089C177.031 30.8259 177 31.6595 177 32.5C177 36.1554 177.553 39.6816 178.579 43H42C28.7452 43 18 53.7452 18 67V174C18 187.255 28.7452 198 42 198H384C397.255 198 408 187.255 408 174V67C408 53.7452 397.255 43 384 43H246.421C247.447 39.6816 248 36.1554 248 32.5C248 31.6595 247.969 30.8259 247.911 30H385Z" fill="#1CAA00"/>
                    </g>
                    <defs>
                        <filter id="filter0_g_1107_2480" x="31.3426" y="81.0584" width="358.579" height="78.7357" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="1180" />
                            <feDisplacementMap in="shape" scale="4.5999999046325684" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                            <feMerge result="effect1_texture_1107_2480">
                                <feMergeNode in="displacedImage"/>
                            </feMerge>
                        </filter>
                        <filter id="filter1_g_1107_2480" x="31.1" y="166.1" width="363.8" height="8.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feTurbulence type="fractalNoise" baseFrequency="0.19230769574642181 0.19230769574642181" numOctaves="3" seed="5382" />
                            <feDisplacementMap in="shape" scale="3.7999999523162842" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                            <feMerge result="effect1_texture_1107_2480">
                                <feMergeNode in="displacedImage"/>
                            </feMerge>
                        </filter>
                        <filter id="filter2_g_1107_2480" x="31.1" y="180.1" width="363.8" height="6.8" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feTurbulence type="fractalNoise" baseFrequency="0.19230769574642181 0.19230769574642181" numOctaves="3" seed="5382" />
                            <feDisplacementMap in="shape" scale="3.7999999523162842" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                            <feMerge result="effect1_texture_1107_2480">
                                <feMergeNode in="displacedImage"/>
                            </feMerge>
                        </filter>
                        <filter id="filter3_g_1107_2480" x="179" y="0" width="68" height="68" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feTurbulence type="fractalNoise" baseFrequency="0.033003300428390503 0.033003300428390503" numOctaves="3" seed="4575" />
                            <feDisplacementMap in="shape" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                            <feMerge result="effect1_texture_1107_2480">
                                <feMergeNode in="displacedImage"/>
                            </feMerge>
                        </filter>
                        <filter id="filter4_g_1107_2480" x="0" y="26" width="426" height="189" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                            <feTurbulence type="fractalNoise" baseFrequency="0.030303031206130981 0.030303031206130981" numOctaves="3" seed="9401" />
                            <feDisplacementMap in="shape" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                            <feMerge result="effect1_texture_1107_2480">
                                <feMergeNode in="displacedImage"/>
                            </feMerge>
                        </filter>
                    </defs>
                </svg>
            )
    }
}

export default Stamp;