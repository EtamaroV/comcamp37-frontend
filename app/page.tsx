"use client"

import { motion } from "motion/react"
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import LearningSection from "@/components/landing/LearningSection";
import SponsorSection from "@/components/landing/SponsorSection";
import ConditionSection from "@/components/landing/ConditionSection";
import TimelineSection from "@/components/landing/TimelineSection";
import FAQSection from "@/components/landing/FAQSection";
import ClickSpark from "@/components/landing/ClickClick";
import {CookieModal} from "@/components/landing/CookieModal";
import {Footer} from "@/components/ui/footer";

export default function Home() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };
  return (
      <ClickSpark
          sparkColor='#fff'
          sparkSize={10}
          sparkRadius={15}
          sparkCount={8}
          duration={400}
          extraScale={2}
      >
      <motion.div className="flex flex-col"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  viewport={{ once: true }}
      >
          <div>
              <HeroSection/>
          </div>
          <div id={"about"} className="mt-35 pt-15 md:mt-50 md:pt-0">
              <AboutSection/>
          </div>
          <div className="mt-50 md:hidden"></div>
          <div id={"learning"} className="pt-20">
              <LearningSection/>
          </div>
          <div className="pt-50 bg-theme-primary-darken md:hidden"></div>
          <div id={"condition"} className="bg-theme-primary-darken pt-23 md:pt-5">
              <ConditionSection/>
          </div>

          <svg viewBox="0 0 1920 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M1920 116.409L1880 135.922C1840 154.763 1760 193.79 1680 174.277C1600 154.763 1520 77.3815 1440 84.1103C1360 90.1662 1280 181.005 1200 187.061C1120 193.79 994 104.137 914 110.193C819.5 110.193 808 121.097 728 172.909C648 224.721 568 237.506 488 192.422C408 147.339 320 104.93 240 98.8745C160 92.1457 80 105.052 40 150.808L0 192.422V0H40C80 0 160 0 240 0C320 0 400 0 480 0C560 0 640 0 720 0C800 0 880 0 960 0C1040 0 1120 0 1200 0C1280 0 1360 0 1440 0C1520 0 1600 0 1680 0C1760 0 1840 0 1880 0H1920V116.409Z" fill="#151E3D"/>
          </svg>

          <div id={"timeline"} className="pt-15 md:pt-0">
              <TimelineSection/>
          </div>
          <div id={"faq"} className="pt-20">
              <FAQSection/>
          </div>
          <div className="py-30 bg-theme-primary">
              <SponsorSection/>
          </div>
          <CookieModal/>
      </motion.div>
          <Footer/>
      </ClickSpark>
  );
}
