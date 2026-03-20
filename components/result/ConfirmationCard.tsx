import React from 'react';
import Image from "next/image";

interface ConfirmationCardProps {
    className?: string;
    blur?: boolean;
    children: React.ReactNode;
}

export const ConfirmationCard: React.FC<ConfirmationCardProps> = ({
    className = "",
    blur = false,
    children

    }) => {

    return (
        <div className={`absolute md:relative min-w-3xl h-full md:h-auto md:w-full md:max-w-4xl overflow-hidden aspect-[1315/1745] ${className}`}>
            { blur ? (
                <Image src="https://storage.comcamp.io/web-assets/result/paperblur.webp" height={0} width={0} sizes="100%" alt="" unoptimized loading="eager"
                       className="absolute inset-0 w-full h-full"
                />
            ) : (
                <Image src="https://storage.comcamp.io/web-assets/result/paper.webp" height={0} width={0} sizes="100%" alt="" unoptimized loading="eager"
                       className="absolute inset-0 w-full h-full"
                />
            )}

            {/*
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 1315 1745"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g filter="url(#filter0_d_3002_1720)">
                    <path d="M17 57C17 40.4315 30.4315 27 47 27L1189 27C1205.57 27 1219 40.4315 1219 57V345.12C1219 351.228 1220.86 357.19 1224.34 362.209L1283.66 447.791C1287.14 452.81 1289 458.772 1289 464.88V884V1295.85C1289 1302.12 1287.03 1308.24 1283.37 1313.34L1224.63 1395.16C1220.97 1400.26 1219 1406.38 1219 1412.65V1697C1219 1713.57 1205.57 1727 1189 1727H47C30.4315 1727 17 1713.57 17 1697L17 57Z" fill="#043880"/>
                </g>
                <g filter="url(#filter1_n_3002_1720)">
                    <path d="M0 30C0 13.4315 13.4315 0 30 0L1172 0C1188.57 0 1202 13.4315 1202 30V318.12C1202 324.228 1203.86 330.19 1207.34 335.209L1266.66 420.791C1270.14 425.81 1272 431.772 1272 437.88V857V1268.85C1272 1275.12 1270.03 1281.24 1266.37 1286.34L1207.63 1368.16C1203.97 1373.26 1202 1379.38 1202 1385.65V1670C1202 1686.57 1188.57 1700 1172 1700H30C13.4315 1700 0 1686.57 0 1670L0 30Z" fill="#014AAD"/>
                </g>
                <g filter="url(#filter2_d_3002_1720)">
                    <rect x="40" y="270.094" width="990" height="1400" transform="rotate(-5.27946 40 270.094)" fill="#D9D9D9"/>
                </g>
                <g filter="url(#filter3_d_3002_1720)">
                    <g clipPath="url(#clip0_3002_1720)">
                        <rect width="990" height="1400" transform="translate(78.3884 231.04) rotate(-1)" fill="#FEFEFE"/>

                        <path d="M864.475 547.605C860.233 550.368 863.121 563.482 865.736 567.816C868.355 572.159 875.146 583.692 880.004 582.233C885.77 580.503 888.912 564.583 886.531 559.053C884.073 553.349 869.681 544.217 864.475 547.605Z" fill="#EB8B51"/>
                        <mask id="mask0_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="893" y="545" width="31" height="25"><path d="M917.556 545.204L923.43 558.207L899.219 569.144L893.345 556.142L917.556 545.204Z" fill="white"/></mask>
                        <g mask="url(#mask0_3002_1720)"><path d="M921.485 554.184C921.872 556.43 919.426 560.016 916.51 561.333C905.831 566.157 896.761 564.666 894.93 559.616C893.401 555.401 899.656 553.244 902.033 552.347C905.242 551.138 912.133 549.926 915.56 550.055C919.309 550.199 921.179 552.407 921.485 554.184Z" fill="#EB8B51"/></g>
                        <mask id="mask1_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="885" y="528" width="31" height="25"><path d="M915.804 541.325L909.929 528.32L885.717 539.258L891.592 552.263L915.804 541.325Z" fill="white"/></mask>
                        <g mask="url(#mask1_3002_1720)"><path d="M911.662 532.441C910.233 530.666 905.925 530.132 903.009 531.449C892.33 536.273 887.455 544.065 890.033 548.777C892.185 552.71 897.938 549.443 900.182 548.252C903.211 546.643 908.675 542.274 910.844 539.616C913.214 536.708 912.794 533.846 911.662 532.441Z" fill="#EB8B51"/></g>
                        <mask id="mask2_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="885" y="564" width="23" height="21"><path d="M907.014 577.734L900.915 564.233L885.906 571.013L892.006 584.514L907.014 577.734Z" fill="white"/></mask>
                        <g mask="url(#mask2_3002_1720)"><path d="M906.105 576.73C905.466 580.489 894.769 581.694 891.255 580.213C888.061 578.868 888.438 574.773 888.941 572.93C889.34 571.477 890.323 568.247 892.641 568.171C896.629 568.043 906.771 572.799 906.105 576.73Z" fill="#EB8B51"/></g>
                        <mask id="mask3_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="870" y="530" width="22" height="21"><path d="M891.705 543.846L885.606 530.345L870.597 537.125L876.697 550.627L891.705 543.846Z" fill="white"/></mask>
                        <g mask="url(#mask3_3002_1720)"><path d="M885.759 531.693C882.516 529.688 874.541 536.918 873.33 540.534C872.228 543.82 875.55 546.244 877.265 547.084C878.619 547.746 881.693 549.144 883.282 547.454C886.014 544.546 889.149 533.792 885.759 531.693Z" fill="#EB8B51"/></g>
                        <mask id="mask4_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="887" y="528" width="8" height="7"><path d="M893.45 528.675L894.781 531.621L889.039 534.215L887.708 531.269L893.45 528.675Z" fill="white"/></mask>
                        <g mask="url(#mask4_3002_1720)"><path d="M889.162 533.471C888.947 533.424 888.882 533.415 888.712 533.247C887.809 532.357 888.512 530.933 889.112 530.637C890.652 529.879 894.469 530.93 894.469 530.93C894.469 530.93 891.594 534.001 889.162 533.471Z" fill="#EB8B51"/></g>
                        <mask id="mask5_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="906" y="570" width="8" height="6"><path d="M913.454 572.954L912.123 570.008L906.381 572.602L907.712 575.548L913.454 572.954Z" fill="white"/></mask>
                        <g mask="url(#mask5_3002_1720)"><path d="M907.02 573.002C906.913 573.194 906.877 573.248 906.891 573.487C906.961 574.753 908.495 575.167 909.114 574.912C910.701 574.258 912.435 570.699 912.435 570.699C912.435 570.699 908.23 570.827 907.02 573.002Z" fill="#EB8B51"/></g>
                        <mask id="mask6_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="913" y="529" width="8" height="6"><path d="M919.301 529.142L920.632 532.088L914.89 534.682L913.559 531.736L919.301 529.142Z" fill="white"/></mask>
                        <g mask="url(#mask6_3002_1720)"><path d="M915.013 533.938C914.798 533.892 914.734 533.883 914.563 533.714C913.66 532.825 914.363 531.4 914.963 531.105C916.503 530.346 920.32 531.397 920.32 531.397C920.32 531.397 917.445 534.468 915.013 533.938Z" fill="#EB8B51"/></g>
                        <mask id="mask7_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="921" y="547" width="9" height="7"><path d="M929.009 550.632L927.678 547.687L921.937 550.28L923.267 553.226L929.009 550.632Z" fill="white"/></mask>
                        <g mask="url(#mask7_3002_1720)"><path d="M922.576 550.68C922.469 550.872 922.433 550.927 922.447 551.166C922.517 552.432 924.051 552.845 924.669 552.591C926.256 551.937 927.991 548.378 927.991 548.378C927.991 548.378 923.786 548.505 922.576 550.68Z" fill="#EB8B51"/></g>
                        <path d="M950.066 485.302C949.142 490.279 960.633 497.228 965.575 498.321C970.527 499.418 983.563 502.449 985.855 497.924C988.577 492.555 979.211 479.304 973.564 477.216C967.737 475.064 951.2 479.195 950.066 485.302Z" fill="#EB8B51"/>
                        <mask id="mask8_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="976" y="445" width="23" height="30"><path d="M984.92 445.194L998.388 449.903L989.62 474.982L976.152 470.274L984.92 445.194Z" fill="white"/></mask>
                        <g mask="url(#mask8_3002_1720)"><path d="M994.134 448.539C996.027 449.807 996.938 454.051 995.882 457.071C992.015 468.133 984.682 473.675 979.761 471.52C975.655 469.722 978.403 463.704 979.393 461.364C980.73 458.205 984.601 452.379 987.058 449.985C989.747 447.368 992.635 447.535 994.134 448.539Z" fill="#EB8B51"/></g>
                        <mask id="mask9_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="958" y="439" width="23" height="30"><path d="M980.901 443.79L967.431 439.081L958.663 464.16L972.133 468.869L980.901 443.79Z" fill="white"/></mask>
                        <g mask="url(#mask9_3002_1720)"><path d="M971.61 440.665C969.34 440.477 965.983 443.229 964.927 446.25C961.059 457.311 963.342 466.215 968.533 467.595C972.866 468.747 974.466 462.328 975.15 459.881C976.072 456.578 976.674 449.608 976.244 446.205C975.771 442.483 973.408 440.814 971.61 440.665Z" fill="#EB8B51"/></g>
                        <mask id="mask10_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="981" y="470" width="21" height="21"><path d="M1001.22 475.256L987.232 470.367L981.797 485.914L995.782 490.803L1001.22 475.256Z" fill="white"/></mask>
                        <g mask="url(#mask10_3002_1720)"><path d="M999.863 475.223C1002.15 478.277 995.644 486.857 992.149 488.382C988.972 489.768 986.265 486.672 985.278 485.037C984.5 483.747 982.837 480.807 984.381 479.076C987.037 476.098 997.474 472.03 999.863 475.223Z" fill="#EB8B51"/></g>
                        <mask id="mask11_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="946" y="458" width="21" height="21"><path d="M966.115 462.985L952.13 458.096L946.695 473.642L960.68 478.531L966.115 462.985Z" fill="white"/></mask>
                        <g mask="url(#mask11_3002_1720)"><path d="M953.212 458.914C949.523 459.881 949.263 470.642 951.047 474.012C952.668 477.076 956.714 476.341 958.505 475.678C959.917 475.153 963.049 473.89 962.921 471.574C962.698 467.59 957.069 457.905 953.212 458.914Z" fill="#EB8B51"/></g>
                        <mask id="mask12_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="954" y="451" width="6" height="8"><path d="M956.328 451.262L959.379 452.329L957.3 458.277L954.249 457.21L956.328 451.262Z" fill="white"/></mask>
                        <g mask="url(#mask12_3002_1720)"><path d="M956.846 457.675C956.664 457.798 956.612 457.839 956.373 457.846C955.106 457.888 954.559 456.396 954.758 455.758C955.27 454.119 958.663 452.079 958.663 452.079C958.663 452.079 958.906 456.278 956.846 457.675Z" fill="#EB8B51"/></g>
                        <mask id="mask13_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="997" y="466" width="6" height="8"><path d="M1002.19 467.297L999.142 466.23L997.063 472.178L1000.11 473.244L1002.19 467.297Z" fill="white"/></mask>
                        <g mask="url(#mask13_3002_1720)"><path d="M997.793 471.99C997.858 472.2 997.873 472.263 998.055 472.418C999.021 473.24 1000.38 472.414 1000.62 471.791C1001.24 470.19 999.858 466.48 999.858 466.48C999.858 466.48 997.051 469.614 997.793 471.99Z" fill="#EB8B51"/></g>
                        <mask id="mask14_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="972" y="432" width="6" height="8"><path d="M974.487 432.858L977.538 433.925L975.459 439.872L972.408 438.806L974.487 432.858Z" fill="white"/></mask>
                        <g mask="url(#mask14_3002_1720)"><path d="M975.005 439.271C974.823 439.394 974.772 439.435 974.533 439.442C973.266 439.483 972.719 437.992 972.918 437.353C973.43 435.715 976.823 433.674 976.823 433.674C976.823 433.674 977.066 437.874 975.005 439.271Z" fill="#EB8B51"/></g>
                        <mask id="mask15_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="991" y="439" width="6" height="8"><path d="M996.747 440.64L993.696 439.574L991.616 445.521L994.668 446.588L996.747 440.64Z" fill="white"/></mask>
                        <g mask="url(#mask15_3002_1720)"><path d="M992.346 445.334C992.412 445.543 992.427 445.607 992.609 445.762C993.575 446.584 994.932 445.758 995.174 445.134C995.794 443.534 994.412 439.824 994.412 439.824C994.412 439.824 991.605 442.957 992.346 445.334Z" fill="#EB8B51"/></g>
                        <path d="M1034.86 362.061C1031.43 365.785 1037.46 377.781 1041.07 381.335C1044.68 384.897 1054.1 394.397 1058.45 391.784C1063.61 388.685 1062.73 372.482 1059.06 367.711C1055.27 362.789 1039.06 357.493 1034.86 362.061Z" fill="#EB8B51"/>
                        <mask id="mask16_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1064" y="346" width="31" height="29"><path d="M1085.7 346.632L1094.6 357.783L1073.84 374.358L1064.94 363.208L1085.7 346.632Z" fill="white"/></mask>
                        <g mask="url(#mask16_3002_1720)"><path d="M1091.73 354.365C1092.66 356.446 1091.17 360.525 1088.67 362.521C1079.51 369.832 1070.35 370.625 1067.33 366.183C1064.81 362.476 1070.34 358.842 1072.42 357.387C1075.23 355.423 1081.61 352.547 1084.97 351.826C1088.63 351.04 1090.99 352.718 1091.73 354.365Z" fill="#EB8B51"/></g>
                        <mask id="mask17_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1053" y="332" width="31" height="28"><path d="M1083.05 343.306L1074.14 332.154L1053.38 348.729L1062.28 359.881L1083.05 343.306Z" fill="white"/></mask>
                        <g mask="url(#mask17_3002_1720)"><path d="M1076.84 335.719C1075.02 334.352 1070.71 334.897 1068.21 336.893C1059.05 344.204 1056.25 352.958 1059.91 356.888C1062.97 360.168 1067.74 355.583 1069.62 353.874C1072.16 351.567 1076.37 345.985 1077.82 342.874C1079.4 339.471 1078.28 336.801 1076.84 335.719Z" fill="#EB8B51"/></g>
                        <mask id="mask18_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1061" y="369" width="23" height="23"><path d="M1083.52 380.758L1074.27 369.18L1061.4 379.455L1070.65 391.033L1083.52 380.758Z" fill="white"/></mask>
                        <g mask="url(#mask18_3002_1720)"><path d="M1082.39 380.009C1082.7 383.81 1072.63 387.617 1068.86 387.05C1065.43 386.535 1064.78 382.473 1064.82 380.564C1064.84 379.057 1065 375.684 1067.23 375.038C1071.06 373.929 1082.06 376.035 1082.39 380.009Z" fill="#EB8B51"/></g>
                        <mask id="mask19_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1038" y="340" width="23" height="22"><path d="M1060.32 351.698L1051.07 340.12L1038.2 350.395L1047.45 361.973L1060.32 351.698Z" fill="white"/></mask>
                        <g mask="url(#mask19_3002_1720)"><path d="M1051.55 341.388C1047.92 340.245 1041.97 349.22 1041.69 353.023C1041.43 356.48 1045.25 358.009 1047.12 358.4C1048.6 358.706 1051.92 359.302 1053.04 357.273C1054.97 353.78 1055.36 342.585 1051.55 341.388Z" fill="#EB8B51"/></g>
                        <mask id="mask20_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1053" y="336" width="8" height="8"><path d="M1058.26 336.565L1060.28 339.091L1055.35 343.022L1053.34 340.496L1058.26 336.565Z" fill="white"/></mask>
                        <g mask="url(#mask20_3002_1720)"><path d="M1055.29 342.271C1055.07 342.279 1055.01 342.286 1054.8 342.165C1053.7 341.526 1054.03 339.972 1054.54 339.537C1055.85 338.422 1059.81 338.498 1059.81 338.498C1059.81 338.498 1057.78 342.184 1055.29 342.271Z" fill="#EB8B51"/></g>
                        <mask id="mask21_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1081" y="372" width="8" height="7"><path d="M1088.58 374.536L1086.56 372.01L1081.64 375.941L1083.65 378.467L1088.58 374.536Z" fill="white"/></mask>
                        <g mask="url(#mask21_3002_1720)"><path d="M1082.35 376.17C1082.3 376.383 1082.28 376.444 1082.35 376.673C1082.73 377.882 1084.32 377.904 1084.85 377.505C1086.23 376.479 1087.03 372.602 1087.03 372.602C1087.03 372.602 1082.99 373.763 1082.35 376.17Z" fill="#EB8B51"/></g>
                        <mask id="mask22_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1078" y="330" width="8" height="8"><path d="M1083.43 330.637L1085.44 333.163L1080.52 337.094L1078.5 334.568L1083.43 330.637Z" fill="white"/></mask>
                        <g mask="url(#mask22_3002_1720)"><path d="M1080.46 336.343C1080.24 336.35 1080.17 336.358 1079.97 336.237C1078.87 335.598 1079.2 334.044 1079.71 333.609C1081.01 332.494 1084.97 332.57 1084.97 332.57C1084.97 332.57 1082.94 336.256 1080.46 336.343Z" fill="#EB8B51"/></g>
                        <mask id="mask23_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1091" y="346" width="8" height="7"><path d="M1098.14 349.066L1096.12 346.54L1091.2 350.471L1093.22 352.997L1098.14 349.066Z" fill="white"/></mask>
                        <g mask="url(#mask23_3002_1720)"><path d="M1091.92 350.7C1091.86 350.912 1091.84 350.974 1091.91 351.202C1092.29 352.412 1093.88 352.434 1094.42 352.035C1095.79 351.009 1096.6 347.132 1096.6 347.132C1096.6 347.132 1092.55 348.293 1091.92 350.7Z" fill="#EB8B51"/></g>
                        <path d="M1036.18 455.156C1032.22 458.304 1036.32 471.09 1039.33 475.16C1042.34 479.238 1050.19 490.085 1054.89 488.177C1060.46 485.915 1062.1 469.771 1059.21 464.489C1056.23 459.039 1041.05 451.295 1036.18 455.156Z" fill="#EB8B51"/>
                        <mask id="mask24_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1065" y="447" width="31" height="27"><path d="M1088.81 447.795L1095.87 460.191L1072.79 473.348L1065.72 460.952L1088.81 447.795Z" fill="white"/></mask>
                        <g mask="url(#mask24_3002_1720)"><path d="M1093.56 456.369C1094.15 458.568 1092.05 462.367 1089.27 463.952C1079.09 469.755 1069.92 469.119 1067.63 464.263C1065.71 460.21 1071.74 457.476 1074.02 456.361C1077.1 454.857 1083.85 453.005 1087.27 452.813C1091.02 452.605 1093.09 454.627 1093.56 456.369Z" fill="#EB8B51"/></g>
                        <mask id="mask25_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1056" y="431" width="31" height="27"><path d="M1086.7 444.097L1079.63 431.7L1056.55 444.857L1063.62 457.254L1086.7 444.097Z" fill="white"/></mask>
                        <g mask="url(#mask25_3002_1720)"><path d="M1081.74 435.64C1080.15 434.007 1075.81 433.878 1073.03 435.463C1062.85 441.266 1058.73 449.48 1061.74 453.93C1064.25 457.644 1069.67 453.853 1071.79 452.456C1074.66 450.571 1079.69 445.709 1081.6 442.86C1083.69 439.743 1083 436.933 1081.74 435.64Z" fill="#EB8B51"/></g>
                        <mask id="mask26_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1059" y="468" width="23" height="22"><path d="M1081.36 481.169L1074.02 468.298L1059.71 476.454L1067.05 489.325L1081.36 481.169Z" fill="white"/></mask>
                        <g mask="url(#mask26_3002_1720)"><path d="M1080.36 480.255C1080.07 484.057 1069.54 486.258 1065.9 485.113C1062.59 484.073 1062.58 479.961 1062.91 478.079C1063.17 476.595 1063.85 473.287 1066.15 472.994C1070.11 472.493 1080.65 476.279 1080.36 480.255Z" fill="#EB8B51"/></g>
                        <mask id="mask27_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1041" y="435" width="22" height="23"><path d="M1062.94 448.864L1055.6 435.993L1041.3 444.149L1048.63 457.02L1062.94 448.864Z" fill="white"/></mask>
                        <g mask="url(#mask27_3002_1720)"><path d="M1055.88 437.321C1052.47 435.628 1045.2 443.573 1044.34 447.286C1043.55 450.662 1047.08 452.764 1048.87 453.44C1050.28 453.971 1053.47 455.075 1054.89 453.244C1057.34 450.093 1059.45 439.093 1055.88 437.321Z" fill="#EB8B51"/></g>
                        <mask id="mask28_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1057" y="433" width="8" height="7"><path d="M1063.26 433.596L1064.86 436.404L1059.38 439.525L1057.78 436.716L1063.26 433.596Z" fill="white"/></mask>
                        <g mask="url(#mask28_3002_1720)"><path d="M1059.44 438.773C1059.22 438.746 1059.15 438.743 1058.97 438.592C1057.99 437.791 1058.55 436.306 1059.12 435.956C1060.58 435.056 1064.48 435.746 1064.48 435.746C1064.48 435.746 1061.91 439.072 1059.44 438.773Z" fill="#EB8B51"/></g>
                        <mask id="mask29_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1080" y="472" width="8" height="7"><path d="M1087.32 475.807L1085.72 472.999L1080.24 476.119L1081.85 478.927L1087.32 475.807Z" fill="white"/></mask>
                        <g mask="url(#mask29_3002_1720)"><path d="M1080.92 476.457C1080.83 476.658 1080.8 476.716 1080.84 476.953C1081.02 478.206 1082.59 478.475 1083.18 478.163C1084.7 477.364 1086.09 473.658 1086.09 473.658C1086.09 473.658 1081.92 474.178 1080.92 476.457Z" fill="#EB8B51"/></g>
                        <mask id="mask30_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1083" y="431" width="8" height="7"><path d="M1089.04 431.641L1090.64 434.449L1085.17 437.569L1083.56 434.761L1089.04 431.641Z" fill="white"/></mask>
                        <g mask="url(#mask30_3002_1720)"><path d="M1085.22 436.818C1085 436.791 1084.93 436.788 1084.75 436.637C1083.77 435.835 1084.33 434.351 1084.9 434.001C1086.37 433.101 1090.26 433.79 1090.26 433.79C1090.26 433.79 1087.69 437.117 1085.22 436.818Z" fill="#EB8B51"/></g>
                        <path d="M957.427 563.628C954.416 567.697 961.699 578.979 965.662 582.127C969.632 585.283 980.022 593.721 984.065 590.658C988.864 587.024 986.253 571.009 982.091 566.658C977.797 562.17 961.122 558.636 957.427 563.628Z" fill="#EB8B51"/>
                        <mask id="mask31_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="987" y="542" width="30" height="30"><path d="M1006.33 542.851L1016.37 552.985L997.503 571.686L987.46 561.551L1006.33 542.851Z" fill="white"/></mask>
                        <g mask="url(#mask31_3002_1720)"><path d="M1013.15 549.895C1014.29 551.864 1013.25 556.078 1010.98 558.33C1002.66 566.579 993.637 568.346 990.158 564.254C987.255 560.837 992.362 556.633 994.277 554.963C996.863 552.71 1002.9 549.169 1006.15 548.094C1009.72 546.92 1012.24 548.336 1013.15 549.895Z" fill="#EB8B51"/></g>
                        <mask id="mask32_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="974" y="529" width="30" height="30"><path d="M1003.33 539.827L993.29 529.691L974.419 548.392L984.463 558.528L1003.33 539.827Z" fill="white"/></mask>
                        <g mask="url(#mask32_3002_1720)"><path d="M996.353 532.947C994.394 531.783 990.171 532.786 987.898 535.038C979.575 543.286 977.725 552.29 981.786 555.805C985.176 558.74 989.427 553.67 991.113 551.771C993.39 549.206 996.986 543.204 998.091 539.957C999.297 536.404 997.904 533.869 996.353 532.947Z" fill="#EB8B51"/></g>
                        <mask id="mask33_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="985" y="566" width="23" height="23"><path d="M1007.81 577.014L997.378 566.491L985.68 578.083L996.108 588.606L1007.81 577.014Z" fill="white"/></mask>
                        <g mask="url(#mask33_3002_1720)"><path d="M1006.6 576.391C1007.32 580.136 997.714 584.999 993.904 584.838C990.441 584.692 989.365 580.723 989.193 578.82C989.06 577.32 988.853 573.949 990.999 573.069C994.692 571.557 1005.86 572.474 1006.6 576.391Z" fill="#EB8B51"/></g>
                        <mask id="mask34_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="959" y="540" width="23" height="23"><path d="M981.632 550.601L971.204 540.078L959.506 551.671L969.934 562.194L981.632 550.601Z" fill="white"/></mask>
                        <g mask="url(#mask34_3002_1720)"><path d="M971.818 541.288C968.079 540.541 963.129 550.1 963.256 553.911C963.37 557.375 967.329 558.487 969.23 558.676C970.729 558.823 974.098 559.06 974.998 556.922C976.543 553.243 975.727 542.071 971.818 541.288Z" fill="#EB8B51"/></g>
                        <mask id="mask35_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="973" y="535" width="8" height="8"><path d="M977.972 535.775L980.247 538.071L975.772 542.506L973.497 540.21L977.972 535.775Z" fill="white"/></mask>
                        <g mask="url(#mask35_3002_1720)"><path d="M975.627 541.767C975.41 541.798 975.346 541.812 975.128 541.714C973.971 541.195 974.133 539.615 974.592 539.129C975.77 537.88 979.714 537.533 979.714 537.533C979.714 537.533 978.091 541.414 975.627 541.767Z" fill="#EB8B51"/></g>
                        <mask id="mask36_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1005" y="567" width="8" height="8"><path d="M1012.17 570.287L1009.9 567.991L1005.42 572.426L1007.7 574.722L1012.17 570.287Z" fill="white"/></mask>
                        <g mask="url(#mask36_3002_1720)"><path d="M1006.16 572.577C1006.13 572.795 1006.11 572.858 1006.21 573.078C1006.72 574.239 1008.3 574.091 1008.79 573.637C1010.05 572.47 1010.43 568.53 1010.43 568.53C1010.43 568.53 1006.53 570.117 1006.16 572.577Z" fill="#EB8B51"/></g>
                        <mask id="mask37_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="997" y="527" width="8" height="7"><path d="M1002.36 527.19L1004.64 529.486L1000.16 533.921L997.884 531.625L1002.36 527.19Z" fill="white"/></mask>
                        <g mask="url(#mask37_3002_1720)"><path d="M1000.02 533.181C999.798 533.212 999.734 533.226 999.516 533.128C998.359 532.61 998.521 531.029 998.98 530.543C1000.16 529.295 1004.1 528.947 1004.1 528.947C1004.1 528.947 1002.48 532.829 1000.02 533.181Z" fill="#EB8B51"/></g>
                        <mask id="mask38_3002_1720" style={{maskType: 'luminance'}} maskUnits="userSpaceOnUse" x="1012" y="541" width="7" height="8"><path d="M1018.96 543.94L1016.68 541.644L1012.21 546.079L1014.48 548.375L1018.96 543.94Z" fill="white"/></mask>
                        <g mask="url(#mask38_3002_1720)"><path d="M1012.95 546.23C1012.91 546.447 1012.9 546.511 1012.99 546.73C1013.5 547.892 1015.08 547.744 1015.57 547.29C1016.83 546.123 1017.22 542.183 1017.22 542.183C1017.22 542.183 1013.32 543.769 1012.95 546.23Z" fill="#EB8B51"/></g>
                    </g>
                </g>

                <defs>
                    <filter id="filter0_d_3002_1720" x="17" y="27" width="1298" height="1718" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dx="22" dy="14"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3002_1720"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3002_1720" result="shape"/>
                    </filter>
                    <filter id="filter1_n_3002_1720" x="0" y="0" width="1272" height="1700" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feTurbulence type="fractalNoise" baseFrequency="0.5 0.5" stitchTiles="stitch" numOctaves="3" result="noise" seed="5453" />
                        <feColorMatrix in="noise" type="luminanceToAlpha" result="alphaNoise" />
                        <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                            <feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 "/>
                        </feComponentTransfer>
                        <feComposite operator="in" in2="shape" in="coloredNoise1" result="noise1Clipped" />
                        <feFlood floodColor="rgba(33, 33, 33, 0.25)" result="color1Flood" />
                        <feComposite operator="in" in2="noise1Clipped" in="color1Flood" result="color1" />
                        <feMerge result="effect1_noise_3002_1720">
                            <feMergeNode in="shape" />
                            <feMergeNode in="color1" />
                        </feMerge>
                    </filter>
                    <filter id="filter2_d_3002_1720" x="40" y="179" width="1140.62" height="1503.15" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dx="22" dy="14"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3002_1720"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3002_1720" result="shape"/>
                    </filter>
                    <filter id="filter3_d_3002_1720" x="78.3884" y="213.762" width="1040.28" height="1435.06" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dx="22" dy="14"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3002_1720"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3002_1720" result="shape"/>
                    </filter>
                    <filter id="filter4_g_3002_1720" x="566.501" y="1264.41" width="365.452" height="127.279" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feTurbulence type="fractalNoise" baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="1180" />
                        <feDisplacementMap in="shape" scale="4.5999999046325684" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                        <feMerge result="effect1_texture_3002_1720">
                            <feMergeNode in="displacedImage"/>
                        </feMerge>
                    </filter>
                    <filter id="filter5_g_3002_1720" x="564.106" y="1348.54" width="360.992" height="58.8537" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feTurbulence type="fractalNoise" baseFrequency="0.19230769574642181 0.19230769574642181" numOctaves="3" seed="5382" />
                        <feDisplacementMap in="shape" scale="3.7999999523162842" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                        <feMerge result="effect1_texture_3002_1720">
                            <feMergeNode in="displacedImage"/>
                        </feMerge>
                    </filter>
                    <filter id="filter6_g_3002_1720" x="562.436" y="1362.4" width="360.714" height="56.8732" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feTurbulence type="fractalNoise" baseFrequency="0.19230769574642181 0.19230769574642181" numOctaves="3" seed="5382" />
                        <feDisplacementMap in="shape" scale="3.7999999523162842" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                        <feMerge result="effect1_texture_3002_1720">
                            <feMergeNode in="displacedImage"/>
                        </feMerge>
                    </filter>
                    <filter id="filter7_g_3002_1720" x="729.596" y="1208.79" width="68.0076" height="68.0078" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feTurbulence type="fractalNoise" baseFrequency="0.033003300428390503 0.033003300428390503" numOctaves="3" seed="4575" />
                        <feDisplacementMap in="shape" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                        <feMerge result="effect1_texture_3002_1720">
                            <feMergeNode in="displacedImage"/>
                        </feMerge>
                    </filter>
                    <filter id="filter8_g_3002_1720" x="532.785" y="1210.53" width="437.553" height="235.843" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feTurbulence type="fractalNoise" baseFrequency="0.030303031206130981 0.030303031206130981" numOctaves="3" seed="9401" />
                        <feDisplacementMap in="shape" scale="8" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
                        <feMerge result="effect1_texture_3002_1720">
                            <feMergeNode in="displacedImage"/>
                        </feMerge>
                    </filter>
                    <clipPath id="clip0_3002_1720">
                        <rect width="990" height="1400" fill="white" transform="translate(78.3884 231.04) rotate(-1)"/>
                    </clipPath>
                </defs>
            </svg>

            */}
            <div
                className="absolute -rotate-1"
                style={{ left: '6.9%', top: '12.69%', width: '75.3%', height: '80.3%' }}
            >

                {/* รูเจาะ */}
                {/*<div
                    className="absolute h-full left-3 top-0 flex flex-col items-center justify-evenly"
                >
                    <div className="w-3 h-3 mb-20 rounded-full bg-gray-800"></div>
                    <div className="w-3 h-3 mt-20 rounded-full bg-gray-800"></div>

                </div>*/}

                {children}

            </div>

        </div>
    );
};

export default ConfirmationCard;