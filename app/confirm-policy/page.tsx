"use client";
import {Footer} from "@/components/ui/footer";

export default function Privacy() {
    return (
      <>
      <div className='w-full h-full bg-theme-primary-darken text-white scroll-smooth'>
        {/* <div className='bg-[#212738] flex justify-center font-bold py-8 sticky top-0 z-1'>banner</div> */}
        <div className='flex justify-center'>
            <div className='font-zootopia text-center w-full flex flex-col items-center justify-center font-bold text-5xl px-15 pt-26 pb-3 bg-gradient-to-b from-theme-primary to-twilight-indigo-800'>
            ข้อกำหนดในการยืนยันสิทธิเข้าร่วมโครงการ<br />
            <span className='text-center font-bai_jamjuree text-sm mt-5 opacity-70'>โครงการฝึกอบรมเชิงปฏิบัติการคอมพิวเตอร์เบื้องต้น ครั้งที่ 37 ขอชี้แจงข้อกำหนดในการยืนยันสิทธิเข้าร่วมโครงการ ดังนี้</span>
            </div>
        </div>
        <div className="top-0 left-0 w-full overflow-hidden leading-[0]">
            <div className="w-full -mt-[10vh] h-[20vh] bg-twilight-indigo-800 [clip-path:ellipse(80%_100%_at_50%_0%)] mb-10">
            </div>
        </div>

        <div className='flex justify-around'>
          <div className='[&_section]:scroll-mt-24 [&_span]:text-xl/12 [&_span]:font-bold [&_span]:-ml-6 [&_span]:inline-block [&_span]:indent-0
           [&_ul]:list-disc [&_ul]:list-outside [&_ul]:ml-4 [&_ul]:ml-16 [&_p]:ml-2 px-12 text-base/8 pb-10 [&_p:not(.ignores)]:indent-8 max-w-6xl'>
            <section id="p1">
              <span>1. เงินมัดจำ</span><br />
                <p>โครงการมีการเรียกเก็บค่ามัดจำการเข้าร่วมจำนวน 500 บาท เพื่อเป็นหลักประกันในการเข้าร่วมกิจกรรม โดยจะชำระคืนให้แก่นักเรียนผู้เข้าร่วมโครงการในพิธีปิดของโครงการในรูปแบบเงินสด ยกเว้น นักเรียนผู้เข้าร่วมโครงการทำผิดข้อกำหนดต่อไปนี้</p>
                <ul>
                  <li>นักเรียนผู้เข้าร่วมโครงการเข้าร่วมกิจกรรมไม่ครบตามจำนวนชั่วโมงที่กำหนด</li>
                  <li>นักเรียนผู้เข้าร่วมโครงการไม่เข้าร่วมพิธีปิดของโครงการ</li>
                  <li>นักเรียนผู้เข้าร่วมโครงการประพฤติตนผิดกฎระเบียบของโครงการอย่างร้ายแรง</li>
                  <li>ตรวจสอบพบว่าข้อมูลที่ใช้ในการสมัครเข้าโครงการ หรือ ข้อมูลเพิ่มเติมสำหรับยืนยันสิทธิของนักเรียนผู้เข้าร่วมโครงการเป็นเท็จ</li>
                </ul>
                <p>โดยหากนักเรียนผู้เข้าร่วมโครงการทำผิดข้อกำหนดข้างต้น ทางโครงการขอสงวนสิทธิไม่คืนเงินมัดจำทุกกรณี</p>
            </section>
            <br />
            <section id="p2">
              <span>2. การคุ้มครองข้อมูลส่วนบุคคล</span><br />
              <p>เนื่องจากในบริเวณกิจกรรมของโครงการ มีการบันทึกภาพบรรยากาศภายในโครงการ ทั้งภาพนิ่ง ภาพเคลื่อนไหว และเสียง ซึ่งอาจถูกใช้ในการประชาสัมพันธ์ในช่องทางต่าง ๆ การยืนยันสิทธิ์ จะถือเป็นการอนุญาตให้โครงการบันทึกภาพนิ่ง ภาพเคลื่อนไหว และเสียงของนักเรียนผู้เข้าร่วมโครงการ</p>
            </section>
            <br />
            <section id="p3">
              <span>3. การมอบประกาศนียบัตรเข้าร่วมกิจกรรม</span><br />
              <p>โครงการขอสงวนสิทธิมอบเกียรติบัตรให้แก่นักเรียนผู้เข้าร่วมโครงการที่ผ่านข้อกำหนดการได้รับประกาศนียบัตรที่ทางโครงการกำหนดเท่านั้น โดยอาจรวมถึงแต่ไม่จำกัดเพียง</p>
                <ul>
                  <li>นักเรียนผู้เข้าร่วมโครงการต้องเข้าร่วมกิจกรรมครบตามจำนวนชั่วโมงที่กำหนด</li>
                  <li>นักเรียนผู้เข้าร่วมโครงการต้องไม่ทำผิดกฎระเบียบร้ายแรงของโครงการ</li>
                </ul>
            </section>
            <br /><br/>
            <footer className="-ml-6 [&_p]:ml-0 -ml-2">
              <h1 className="font-bold ml-2">หัวหน้าฝ่ายทะเบียน</h1>
              <p className="ignores">นายชัยกร ประพันธ์พงพินิจ<br/>อีเมล : chaiyakorn.prap@mail.kmutt.ac.th<br/>เบอร์โทรศัพท์ : 065-728-5679</p>
            </footer>
          </div>
        </div>
      </div>
          <Footer/>
    </>
    );
}