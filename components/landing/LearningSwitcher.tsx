import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    LearningFolder,
    LearningContent,
    LearningTitle,
    LearningDescription,
    LearningLogo
} from './LearningFolders';
import {LearningFolderMobile} from "@/components/landing/LearningFoldersMobile";

// ข้อมูลเหมือนเดิม (ละไว้เพื่อความกระชับ)
const FOLDER_DATA = [
    {
        id: 0,
        theme: 'yellow',
        colors: { c1: "#F4D471", c2: "#FFAA2B", c3: "#FFA114" },
        btnGradient: "from-[#F4D471]/10 to-[#F4D471]/15",
        btnBorder: "border-[#F4D471]/20",
        fillColor: "#F4D471",
        title: "C Programming",
        description: "ร่วมเจาะลึกกลไกการทำงานของคอมพิวเตอร์ผ่าน ภาษา C เรียนรู้การวางตรรกะ การเขียน Clean Code และการแก้ปัญหา (Debugging) อย่างเป็นระบบ ปิดท้ายภารกิจด้วยการสร้าง Terminal Game ของตัวเองจากรากฐานที่น้อง ๆ สร้างมากับมือ",
        logo: (<svg viewBox="0 0 172 190" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_i_434_128)">
                <path fillRule="evenodd" clipRule="evenodd" d="M80.7403 1.28553C83.8076 -0.42851 87.5514 -0.42851 90.6186 1.28553C105.774 9.76552 151.332 35.3408 166.442 43.8208C169.51 45.5348 171.404 48.6923 171.404 52.1655C171.404 69.1706 171.404 120.276 171.404 137.281C171.404 140.709 169.51 143.912 166.442 145.626C151.332 154.106 105.774 179.681 90.6186 188.161C87.5514 189.875 83.8076 189.875 80.7403 188.161C65.6297 179.636 20.0723 154.061 4.9617 145.581C1.89447 143.867 0 140.709 0 137.236C0 120.231 0 69.1255 0 52.1204C0 48.6923 1.89447 45.4897 4.9617 43.7757C20.0723 35.3408 65.6297 9.76552 80.7403 1.28553ZM85.702 31.5519C120.569 31.5519 148.851 59.8336 148.851 94.7008C148.851 129.568 120.569 157.85 85.702 157.85C50.8348 157.85 22.5532 129.568 22.5532 94.7008C22.5532 59.8336 50.8348 31.5519 85.702 31.5519ZM85.702 63.1263C103.113 63.1263 117.276 77.2897 117.276 94.7008C117.276 112.112 103.113 126.275 85.702 126.275C68.291 126.275 54.1276 112.112 54.1276 94.7008C54.1276 77.2897 68.291 63.1263 85.702 63.1263Z" fill="#A7A7A7"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M169.106 46.0312C171.452 48.1964 171.407 51.4891 171.407 54.0602C171.407 71.2006 171.272 119.87 171.452 136.966C171.452 138.77 170.866 140.619 170.009 142.063L83.8555 94.701L169.106 46.0312Z" fill="#A6A6A6"/>
            </g>
            <defs>
                <filter id="filter0_i_434_128" x="0" y="0" width="174.953" height="193.94" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dx="3.50172" dy="5.25257"/>
                    <feGaussianBlur stdDeviation="2.24693"/>
                    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_434_128"/>
                </filter>
            </defs>
        </svg>)
    },
    {
        id: 1,
        theme: 'green',
        colors: { c1: "#AEFF3E", c2: "#88CC00", c3: "#669900" },
        btnGradient: "from-[#AEFF3E]/10 to-[#AEFF3E]/15",
        btnBorder: "border-[#AEFF3E]/20",
        fillColor: "#AEFF3E",
        title: "Microcontroller",
        description: "มาเรียนรู้วิธีการเติมชีวิตให้สิ่งของผ่านบอร์ด micro:bit และทำความเข้าใจระบบฝังตัว (Embedded System) น้อง ๆ จะได้สวมบทบาทวิศวกร ฝึกเขียน Block Coding ควบคุมไฟ LED และหุ่นยนต์ผ่าน Challenge สุดท้าทาย เพื่อสร้าง Mini Project ที่จะเปลี่ยนเมืองทั้งเมืองให้เป็นระบบอัตโนมัติ !",
        logo: (<svg viewBox="0 0 321 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_i_511_1205)">
                    <path d="M246.326 108.431V117.594H275.773V108.431H246.326Z" fill="#A6A6A6"/>
                    <path d="M44.6582 108.439V117.603H75.1444V108.439H44.6582Z" fill="#A6A6A6"/>
                    <path d="M246.316 202.852V212.015H271.641V202.852H246.316Z" fill="#A6A6A6"/>
                    <path d="M49.9297 202.859V212.022H70.6464V202.859H49.9297Z" fill="#A6A6A6"/>
                    <path d="M248.873 155.821V164.984H292.177V155.821H248.873Z" fill="#A6A6A6"/>
                    <path d="M28.2324 155.826V164.989H75.1395V155.826H28.2324Z" fill="#A6A6A6"/>
                    <path d="M108.97 270.427L118.133 270.427L118.133 246.8L108.97 246.8L108.97 270.427Z" fill="#A6A6A6"/>
                    <path d="M108.97 76.4199L118.133 76.4199L118.133 48.3589L108.97 48.3589L108.97 76.4199Z" fill="#A6A6A6"/>
                    <path d="M203.384 270.427L212.547 270.427L212.547 240.582L203.384 240.582L203.384 270.427Z" fill="#A6A6A6"/>
                    <path d="M203.384 73.9951L212.547 73.9951L212.547 48.3591L203.384 48.3591L203.384 73.9951Z" fill="#A6A6A6"/>
                    <path d="M156.358 79.4854L165.521 79.4854L165.521 36.5277L156.358 36.5277L156.358 79.4854Z" fill="#A6A6A6"/>
                    <path d="M156.358 286.297L165.521 286.297L165.521 246.804L156.358 246.804L156.358 286.297Z" fill="#A6A6A6"/>
                    <path d="M70.6543 221.579V98.5082C70.6543 82.9361 83.2818 70.3086 98.854 70.3086H223.657C239.229 70.3086 251.856 82.9361 251.856 98.5082V221.579C251.856 237.151 239.229 249.778 223.657 249.778H98.854C83.2818 249.761 70.6543 237.133 70.6543 221.579ZM97.4856 240.58H223.068C232.872 240.58 240.822 232.63 240.822 222.826V97.2438C240.822 87.4397 232.872 79.4891 223.068 79.4891H97.4856C87.6815 79.4891 79.7309 87.4397 79.7309 97.2438V222.826C79.7309 232.63 87.6815 240.58 97.4856 240.58Z" fill="#A3A3A3"/>
                    <path d="M109.281 189.273V131.522C109.281 118.774 119.622 108.433 132.371 108.433H190.122C202.87 108.433 213.211 118.774 213.211 131.522V189.273C213.211 202.021 202.87 212.363 190.122 212.363H132.371C119.622 212.363 109.281 202.021 109.281 189.273Z" fill="#A7A7A7"/>
                    <path d="M16.4199 112.695C16.4199 102.597 24.5958 94.4209 34.6943 94.4209C44.7928 94.4209 52.9687 102.597 52.9687 112.695C52.9687 122.794 44.7928 130.97 34.6943 130.97C24.5958 130.97 16.4199 122.794 16.4199 112.695ZM34.6943 122.655C40.2026 122.655 44.6543 118.204 44.6543 112.695C44.6543 107.187 40.2026 102.735 34.6943 102.735C29.186 102.735 24.7343 107.187 24.7343 112.695C24.7343 118.204 29.186 122.655 34.6943 122.655Z" fill="#A6A6A6"/>
                    <path d="M0 160.9C0 150.802 8.17583 142.626 18.2744 142.626C28.3729 142.626 36.5487 150.802 36.5487 160.9C36.5487 170.999 28.3729 179.175 18.2744 179.175C8.17583 179.175 0 170.999 0 160.9ZM18.2744 170.86C23.7827 170.86 28.2343 166.409 28.2343 160.9C28.2343 155.392 23.7827 150.94 18.2744 150.94C12.7661 150.94 8.31441 155.392 8.31441 160.9C8.31441 166.409 12.7834 170.86 18.2744 170.86Z" fill="#A6A6A6"/>
                    <path d="M16.4199 207.115C16.4199 197.017 24.5958 188.841 34.6943 188.841C44.7928 188.841 52.9687 197.017 52.9687 207.115C52.9687 217.214 44.7928 225.389 34.6943 225.389C24.5958 225.389 16.4199 217.214 16.4199 207.115ZM34.6943 217.387C40.2026 217.387 44.6543 212.935 44.6543 207.427C44.6543 201.919 40.2026 197.467 34.6943 197.467C29.186 197.467 24.7343 201.919 24.7343 207.427C24.7343 212.935 29.186 217.387 34.6943 217.387Z" fill="#A6A6A6"/>
                    <path d="M207.479 16.4033C217.578 16.4033 225.754 24.5791 225.754 34.6777C225.754 44.7762 217.578 52.952 207.479 52.952C197.381 52.952 189.205 44.7762 189.205 34.6777C189.205 24.5791 197.398 16.4033 207.479 16.4033ZM198.004 34.6777C198.004 40.1859 202.456 44.6376 207.964 44.6376C213.473 44.6376 217.924 40.1859 217.924 34.6777C217.924 29.1694 213.473 24.7177 207.964 24.7177C202.456 24.7177 198.004 29.1867 198.004 34.6777Z" fill="#A6A6A6"/>
                    <path d="M159.792 0C169.89 0 178.066 8.17582 178.066 18.2743C178.066 28.3729 169.89 36.5487 159.792 36.5487C149.693 36.5487 141.518 28.3555 141.518 18.2743C141.518 8.19314 149.693 0 159.792 0ZM149.832 18.2743C149.832 23.7826 154.284 28.2343 159.792 28.2343C165.3 28.2343 169.752 23.7826 169.752 18.2743C169.752 12.7661 165.3 8.31439 159.792 8.31439C154.284 8.31439 149.832 12.7661 149.832 18.2743Z" fill="#A6A6A6"/>
                    <path d="M113.06 16.4033C123.158 16.4033 131.334 24.5791 131.334 34.6777C131.334 44.7762 123.158 52.952 113.06 52.952C102.961 52.952 94.7852 44.7762 94.7852 34.6777C94.7852 24.5791 102.978 16.4033 113.06 16.4033ZM103.585 34.6777C103.585 40.1859 108.036 44.6376 113.545 44.6376C119.053 44.6376 123.504 40.1859 123.504 34.6777C123.504 29.1694 119.053 24.7177 113.545 24.7177C108.036 24.7177 103.585 29.1867 103.585 34.6777Z" fill="#A6A6A6"/>
                    <path d="M303.978 207.601C303.978 217.699 295.803 225.875 285.704 225.875C275.606 225.875 267.43 217.699 267.43 207.601C267.43 197.502 275.606 189.326 285.704 189.326C295.803 189.326 303.978 197.519 303.978 207.601ZM285.721 197.45C280.213 197.45 275.761 201.902 275.761 207.41C275.761 212.918 280.213 217.37 285.721 217.37C291.23 217.37 295.681 212.918 295.681 207.41C295.681 201.902 291.23 197.45 285.721 197.45Z" fill="#A6A6A6"/>
                    <path d="M320.416 159.74C320.416 169.839 312.24 178.014 302.142 178.014C292.043 178.014 283.867 169.839 283.867 159.74C283.867 149.642 292.043 141.466 302.142 141.466C312.24 141.466 320.416 149.642 320.416 159.74ZM302.142 149.243C296.633 149.243 292.182 153.695 292.182 159.203C292.182 164.711 296.633 169.163 302.142 169.163C307.65 169.163 312.102 164.711 312.102 159.203C312.102 153.695 307.633 149.243 302.142 149.243Z" fill="#A6A6A6"/>
                    <path d="M303.978 112.678C303.978 122.776 295.803 130.952 285.704 130.952C275.606 130.952 267.43 122.776 267.43 112.678C267.43 102.579 275.606 94.4033 285.704 94.4033C295.803 94.4033 303.978 102.579 303.978 112.678ZM285.721 102.718C280.213 102.718 275.761 107.169 275.761 112.678C275.761 118.186 280.213 122.638 285.721 122.638C291.23 122.638 295.681 118.186 295.681 112.678C295.681 107.169 291.23 102.718 285.721 102.718Z" fill="#A6A6A6"/>
                    <path d="M113.544 301.812C103.445 301.812 95.2695 293.637 95.2695 283.538C95.2695 273.439 103.445 265.264 113.544 265.264C123.642 265.264 131.818 273.439 131.818 283.538C131.818 293.619 123.642 301.812 113.544 301.812ZM123.504 283.538C123.504 278.03 119.052 273.578 113.544 273.578C108.036 273.578 103.584 278.03 103.584 283.538C103.584 289.046 108.036 293.498 113.544 293.498C119.052 293.498 123.504 289.029 123.504 283.538Z" fill="#A6A6A6"/>
                    <path d="M207.964 301.812C197.865 301.812 189.689 293.637 189.689 283.538C189.689 273.439 197.865 265.264 207.964 265.264C218.062 265.264 226.238 273.439 226.238 283.538C226.238 293.619 218.062 301.812 207.964 301.812ZM217.924 283.538C217.924 278.03 213.472 273.578 207.964 273.578C202.456 273.578 198.004 278.03 198.004 283.538C198.004 289.046 202.456 293.498 207.964 293.498C213.472 293.498 217.924 289.029 217.924 283.538Z" fill="#A6A6A6"/>
                    <path d="M161.249 320C151.15 320 142.975 311.824 142.975 301.726C142.975 291.627 151.15 283.451 161.249 283.451C171.348 283.451 179.523 291.627 179.523 301.726C179.523 311.824 171.348 320 161.249 320ZM171.209 301.726C171.209 296.217 166.757 291.766 161.249 291.766C155.741 291.766 151.289 296.217 151.289 301.726C151.289 307.234 155.741 311.685 161.249 311.685C166.757 311.685 171.209 307.234 171.209 301.726Z" fill="#A6A6A6"/>
                </g>
                <defs>
                    <filter id="filter0_i_511_1205" x="0" y="0" width="326.416" height="327.7" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dx="6" dy="9"/>
                        <feGaussianBlur stdDeviation="3.85"/>
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_511_1205"/>
                    </filter>
                </defs>
            </svg>
        )
    },
    {
        id: 2,
        theme: 'blue',
        colors: { c1: "#3EBFFF", c2: "#2A9FD6", c3: "#0077AA" },
        btnGradient: "from-[#3EBFFF]/10 to-[#3EBFFF]/15",
        btnBorder: "border-[#3EBFFF]/20",
        fillColor: "#3EBFFF",
        title: "Artificial Intelligence",
        description: "สัมผัสโลกของปัญญาประดิษฐ์ในแบบที่เข้าใจง่ายผ่านเครื่องมือ No-Code ไม่ต้องมีพื้นฐานก็สนุกได้! น้อง ๆ จะได้ลองเตรียมข้อมูล ฝึกสอนโมเดล (Model Training) และเชื่อมต่อ AI เข้ากับระบบอัตโนมัติเพื่อแก้ปัญหารอบตัว เหมือนมีผู้ช่วยอัจฉริยะที่คอยดูแลความเรียบร้อยให้ชาวเมือง",
        logo: (<svg viewBox="0 0 320 251" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_i_614_501)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M286.257 67.5749C270.572 67.5749 257.387 56.793 253.638 42.25H215.021C206.772 42.25 199.773 48.2051 198.399 56.3542L197.024 64.6914C195.774 72.339 191.9 79.3598 186.089 84.5C191.9 89.6402 195.774 96.5983 197.024 104.309L198.399 112.646C199.773 120.795 206.772 126.75 215.021 126.75H219.957C223.706 112.207 236.891 101.425 252.576 101.425C271.197 101.425 286.257 116.532 286.257 135.213C286.257 153.893 271.197 169 252.576 169C236.891 169 223.706 158.218 219.957 143.675H215.021C198.586 143.675 184.526 131.765 181.777 115.467L180.402 107.129C179.028 98.9804 172.029 93.0252 163.781 93.0252H150.408C146.659 107.568 133.474 118.35 117.789 118.35C102.105 118.35 88.9201 107.568 85.1709 93.0252H66.2371C62.4878 107.568 49.3029 118.35 33.6184 118.35C15.0596 118.225 0 103.118 0 84.4373C0 65.757 15.0596 50.6499 33.6809 50.6499C49.3654 50.6499 62.5503 61.4318 66.2996 75.9748H85.2334C88.9826 61.4318 102.168 50.6499 117.852 50.6499C133.536 50.6499 146.721 61.4318 150.471 75.9748H163.843C172.091 75.9748 179.09 70.0197 180.465 61.8706L181.839 53.5334C184.526 37.2352 198.586 25.3249 215.083 25.3249H253.7C257.45 10.7819 270.635 0 286.319 0C304.94 0 320 15.1072 320 33.7875C320 52.4677 304.878 67.5749 286.257 67.5749ZM286.257 50.6499C295.567 50.6499 303.066 43.0649 303.066 33.7875C303.066 24.51 295.505 16.9251 286.257 16.9251C277.008 16.9251 269.447 24.51 269.447 33.7875C269.447 43.0649 276.946 50.6499 286.257 50.6499ZM33.6809 101.3C42.9916 101.3 50.4901 93.7148 50.4901 84.4373C50.4901 75.1599 42.9291 67.5749 33.6809 67.5749C24.4327 67.5749 16.8092 75.0972 16.8092 84.4373C16.8092 93.7775 24.3702 101.3 33.6809 101.3ZM134.724 84.4373C134.724 93.7775 127.163 101.3 117.914 101.3C108.666 101.3 101.105 93.7148 101.105 84.4373C101.105 75.1599 108.666 67.5749 117.914 67.5749C127.163 67.5749 134.724 75.0972 134.724 84.4373ZM269.447 135.087C269.447 144.427 261.886 151.95 252.638 151.95C243.327 151.95 235.829 144.365 235.829 135.087C235.829 125.81 243.39 118.225 252.638 118.225C261.886 118.225 269.447 125.81 269.447 135.087Z" fill="#A3A3A3"/>
                </g>
                <g filter="url(#filter1_i_614_501)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M171.758 217.927V217.356C175.945 215.259 180.132 211.637 180.132 204.489C180.132 194.195 171.663 188 159.959 188C147.969 188 139.405 194.576 139.405 204.679C139.405 211.542 143.401 215.259 147.779 217.356V217.927C142.926 219.643 137.121 224.79 137.121 233.368C137.121 243.756 145.685 251 159.864 251C174.042 251 182.321 243.756 182.321 233.368C182.321 224.79 176.611 219.738 171.758 217.927ZM159.864 196.769C164.622 196.769 168.142 199.818 168.142 204.965C168.142 210.112 164.526 213.162 159.864 213.162C155.201 213.162 151.299 210.112 151.299 204.965C151.299 199.723 155.011 196.769 159.864 196.769ZM159.864 241.85C154.344 241.85 149.872 238.324 149.872 232.319C149.872 226.887 153.583 222.788 159.768 222.788C165.859 222.788 169.57 226.791 169.57 232.51C169.57 238.324 165.288 241.85 159.864 241.85Z" fill="#A3A3A3"/>
                    <path d="M197 250.046H209.18V224.216C209.18 215.733 214.319 212.016 220.123 212.016C225.833 212.016 230.305 215.83 230.305 223.645V250.046H242.485V221.166C242.485 208.68 235.253 201.438 223.93 201.438C216.793 201.438 212.796 204.296 209.941 208.013H209.18L208.133 202.39H197V250.046Z" fill="#A3A3A3"/>
                    <path d="M89.18 250.046H77V202.39H88.133L89.18 208.013H89.941C92.796 204.296 96.793 201.438 103.93 201.438C115.253 201.438 122.485 208.68 122.485 221.166V250.046H110.305V223.645C110.305 215.83 105.833 212.016 100.123 212.016C94.319 212.016 89.18 215.733 89.18 224.216V250.046Z" fill="#A3A3A3"/>
                </g>
                <defs>
                    <filter id="filter0_i_614_501" x="0" y="0" width="324" height="173" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dx="5" dy="4"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_614_501"/>
                    </filter>
                    <filter id="filter1_i_614_501" x="77" y="188" width="169.484" height="67" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dx="5" dy="4"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="shape" result="effect1_innerShadow_614_501"/>
                    </filter>
                </defs>
            </svg>
        )
    }
];

const AUTO_PLAY_DURATION = 18000;

const FolderSwitcher = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    // ใช้ keyState เพื่อ force re-render animation ของ timer เมื่อกดปุ่ม
    const [timerKey, setTimerKey] = useState(0);
    const timerRef:any = useRef(null);

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % FOLDER_DATA.length);
            setTimerKey((prev) => prev + 1); // Reset timer circle animation
        }, AUTO_PLAY_DURATION);
    };

    useEffect(() => {
        startTimer();
        return () => clearInterval(timerRef.current);
    }, []);

    const handleManualSwitch = (index:any) => {
        setActiveIndex(index);
        setTimerKey((prev) => prev + 1); // Reset timer circle animation
        startTimer();
    };

    const activeData = FOLDER_DATA[activeIndex];

    // Animation Variants สำหรับ Folder
    const folderVariants = {
        initial: { opacity: 0, x: 50, scale: 0.95 },
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: { opacity: 0, x: -50, scale: 0.95 }
    };

    return (
        <div className="flex flex-row justify-evenly w-full bg-theme-primary-darken overflow-hidden z-10">
            <div className="flex flex-col md:flex-row justify-evenly w-full bg-theme-primary-darken md:pt-5 md:p-20 overflow-hidden max-w-[1600px] gap-y-3 ">
            {/* === Left: Buttons === */}
            <div className="flex md:flex-col justify-evenly items-center flex-1 gap-6 z-12 order-2 md:order-1">
                {FOLDER_DATA.map((item, index) => {
                    const isActive = activeIndex === index;
                    return (
                        <div key={item.id} className="relative flex justify-center items-center z-12">


                            <motion.button
                                onClick={() => handleManualSwitch(index)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{
                                    scale: isActive ? 1.1 : 1,
                                    opacity: isActive ? 1 : 0.6,
                                    filter: isActive ? "grayscale(0%)" : "grayscale(50%)"
                                }}
                                className={`z-12
                                overflow-hidden w-15 md:w-20 lg:w-30 aspect-square rounded-lg md:rounded-4xl cursor-pointer relative z-10
                                backdrop-blur-sm
                                ${item.btnGradient}
                                ${item.btnBorder}
                                shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_8px_10px_-6px_rgba(0,0,0,0.1),_inset_0_1px_0_0_rgba(255,255,255,0.5),_inset_0_0_20px_0_rgba(255,255,255,0.05)]
                            `}
                            >
                                {/* SVG Icon Code (เหมือนเดิม) */}
                                <svg className="absolute bottom-0 w-[80%] z-11" width="135" viewBox="0 0 135 139" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M-15.4295 90.5666C-22.7426 99.8454 -6.55049 126.678 2.47038 134.304C11.5076 141.947 35.1462 162.365 44.7947 155.507C56.2477 147.371 51.2907 109.826 41.8911 99.3813C32.1915 88.6081 -6.4556 79.183 -15.4295 90.5666Z" fill={item.fillColor}/>
                                    <mask id={`mask0_${item.id}`} maskUnits="userSpaceOnUse" x="54" y="45" width="69" height="68">
                                        <path d="M100.117 45.5615L122.826 69.9143L77.4795 112.201L54.7702 87.8483L100.117 45.5615Z" fill="white"/>
                                    </mask>
                                    <g mask={`url(#mask0_${item.id})`}>
                                        <path d="M115.517 62.4766C118.051 67.1511 115.325 76.9082 109.864 82.0008C89.8629 100.652 68.6962 104.136 60.8713 94.3425C54.3403 86.1676 66.5533 76.7214 71.1386 72.9622C77.3301 67.8884 91.6562 60.056 99.3306 57.7788C107.726 55.2933 113.511 58.7749 115.517 62.4766Z" fill={item.fillColor}/>
                                    </g>
                                    <mask id={`mask1_${item.id}`} maskUnits="userSpaceOnUse" x="25" y="13" width="69" height="68">
                                        <path d="M93.3454 38.2977L70.6328 13.9414L25.2858 56.2281L47.9984 80.5844L93.3454 38.2977Z" fill="white"/>
                                    </mask>
                                    <g mask={`url(#mask1_${item.id})`}>
                                        <path d="M77.5448 21.7547C73.0584 18.9005 63.1348 20.9401 57.6738 26.0326C37.6731 44.6836 32.7203 65.5556 41.9446 74.0446C49.644 81.1299 59.9191 69.6057 63.989 65.2937C69.4823 59.4713 78.2951 45.7264 81.102 38.2296C84.1671 30.0276 81.0975 24.0144 77.5448 21.7547Z" fill={item.fillColor}/>
                                    </g>
                                    <mask id={`mask2_${item.id}`} maskUnits="userSpaceOnUse" x="49" y="100" width="53" height="52">
                                        <path d="M101.143 125.362L77.5625 100.075L49.4524 126.288L73.0327 151.575L101.143 125.362Z" fill="white"/>
                                    </mask>
                                    <g mask={`url(#mask2_${item.id})`}>
                                        <path d="M98.3811 123.824C99.7801 132.612 77.0326 143.274 68.1571 142.629C60.0886 142.043 57.8593 132.708 57.595 128.258C57.3893 124.748 57.1465 116.871 62.2153 114.97C70.9362 111.703 96.915 114.635 98.3811 123.824Z" fill={item.fillColor}/>
                                    </g>
                                    <mask id={`mask3_${item.id}`} maskUnits="userSpaceOnUse" x="-10" y="36" width="52" height="53">
                                        <path d="M41.9573 61.8933L18.377 36.6064L-9.73313 62.8195L13.8472 88.1064L41.9573 61.8933Z" fill="white"/>
                                    </mask>
                                    <g mask={`url(#mask3_${item.id})`}>
                                        <path d="M19.7216 39.4718C11.0529 37.4633 -1.17018 59.4116 -1.14586 68.3103C-1.12376 76.4001 8.03254 79.2752 12.453 79.8492C15.9403 80.2993 23.7817 81.091 26.0317 76.1672C29.8982 67.6954 28.7864 41.5754 19.7216 39.4718Z" fill={item.fillColor}/>
                                    </g>
                                </svg>
                            </motion.button>
                        </div>
                    )
                })}
            </div>

            {/* === Right: Folder Content with Transitions === */}
            <div className="flex-3 relative z-11 order-1 md:order-2">
                {/* mode='wait' ทำให้ตัวเก่าออกให้จบก่อน ตัวใหม่ค่อยเข้ามา */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeData.id} // สำคัญมาก! เปลี่ยน key = trigger animation
                        variants={folderVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="block w-full h-full" // Ensure wrapping div fills space
                    >
                        <LearningFolder
                            color1={activeData.colors.c1}
                            color2={activeData.colors.c2}
                            color3={activeData.colors.c3}
                        >
                            <LearningContent>
                                <div>
                                    <LearningTitle>{activeData.title}</LearningTitle>
                                    <LearningDescription>
                                        {activeData.description}
                                    </LearningDescription>
                                </div>
                            </LearningContent>

                            <LearningLogo>
                                {activeData.logo}
                            </LearningLogo>
                        </LearningFolder>
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeData.id} // สำคัญมาก! เปลี่ยน key = trigger animation
                        variants={folderVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="hidden w-full h-full" // Ensure wrapping div fills space
                    >
                        <LearningFolderMobile
                            color1={activeData.colors.c1}
                            color2={activeData.colors.c2}
                            color3={activeData.colors.c3}
                        >
                            <LearningContent>
                                <div>
                                    <LearningTitle>{activeData.title}</LearningTitle>
                                    <LearningDescription>
                                        {activeData.description}
                                    </LearningDescription>
                                </div>
                            </LearningContent>

                            <LearningLogo>
                                {activeData.logo}
                            </LearningLogo>
                        </LearningFolderMobile>
                    </motion.div>
                </AnimatePresence>
            </div>
            </div>
        </div>
    );
};

export default FolderSwitcher;