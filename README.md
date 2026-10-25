# BUGpairoj Fruit Growth AI 360° — HTML Front-end (12 หน้า) v1.0.0

ชุดหน้าเว็บ HTML ทำงานได้จริง (ไม่ใช่รูปภาพ) แปลงจากภาพต้นแบบ 12 หน้า ลิงก์ถึงกันครบผ่าน Sidebar
พร้อมนำไปต่อยอดเป็น PHP 8.3 + MariaDB/MySQL ตาม Master Prompt

## วิธีเปิดใช้งาน
- ดับเบิลคลิก `dashboard.html` (หรือวางทั้งโฟลเดอร์ใน `htdocs/` ของ XAMPP แล้วเปิด `http://localhost/fruit-growth-ai-360/dashboard.html`)
- ต้องต่ออินเทอร์เน็ต (โหลด Tailwind / Chart.js / Leaflet / Lucide / Google Font Prompt จาก CDN)

## โครงสร้างไฟล์
```
fruit-growth-ai-360/
├── dashboard.html            1. แดชบอร์ด
├── farms.html                2. สวน/แปลง (แผนที่ Leaflet, สลับแผนที่/ดาวเทียม, CRUD modal)
├── trees.html                3. ทะเบียนต้นไม้ (ค้นหา/กรอง/แบ่งหน้า 1,842 ต้น, QR จริง, พิมพ์ป้าย, CSV BOM)
├── calendar.html             4. ปฏิทินงาน (เปลี่ยนเดือน, คลิกวันเพื่อเพิ่มงาน, แท็บสถานะ, Export CSV)
├── growth-monitoring.html    5. การเติบโต (กราฟ, ระยะการเติบโต, แผนปุ๋ยรายแปลง, ความผิดปกติ)
├── fertilizer-plans.html     6. ใส่ปุ๋ย (แผน/อนุมัติ 4 ขั้น/ผลดิน/สต็อก, NEED_SOIL_TEST guard)
├── pest-management.html      7. โรค/แมลง (Risk map, IPM, ทะเบียนฉลาก BLOCKED_UNVERIFIED_LABEL, PHI)
├── harvest-forecast.html     8. คาดการณ์เก็บเกี่ยว (กราฟรายสัปดาห์, เกรด, QA Release check PHI/ความแก่)
├── ai-advisor.html           9. AI วิเคราะห์ (อัปโหลด/ถ่ายภาพ + PDPA consent, expert review)
├── integrations.html        10. IoT/API (อุปกรณ์, กราฟเซ็นเซอร์, API keys, Webhook, sync log)
├── reports.html             11. รายงาน (ส่งออก Excel หลายชีต จริง / PDF ผ่าน print)
├── settings.html            12. ตั้งค่า (ธีมสว่าง/มืด/ตามระบบ, การแจ้งเตือน, สิทธิ์, สำรองข้อมูล)
└── assets/
    ├── css/app.css           Design system (ตัวแปรสี light/dark, card, badge, table, switch)
    └── js/
        ├── tw-config.js      Tailwind config + โหลดธีมก่อน render
        └── app.js            Layout (sidebar/topbar/footer), UI kit, Charts, Maps, ไอคอนผลไม้ SVG
```

## แนวทางแปลงเป็น PHP
1. `#sidebar`, `#topbar`, `#footer` ถูกสร้างจาก `Layout.init()` ใน `app.js` → ย้ายเป็น `partials/sidebar.php`, `topbar.php`, `footer.php`
2. ทุกหน้ามี `const DATA/KPIS/...` (ข้อมูลตัวอย่าง) อยู่ด้านบนสคริปต์ → แทนที่ด้วย `fetch('/api/v1/...')` ตาม endpoint ที่เขียนกำกับไว้ใน comment และใน modal ทุกฟอร์ม
3. ฟอร์มทั้งหมดผ่าน `UI.formModal()` มี hidden `csrf_token` แล้ว → ผูกกับ session token ฝั่ง PHP
4. วันที่เก็บเป็น ค.ศ. (ISO) แสดงผล พ.ศ. ด้วย `thDate()`
5. กราฟทุกตัวครอบ `<div class="relative flex items-center justify-center h-[...px]">` + `maintainAspectRatio:false` (แก้กราฟวิ่ง)

## หมายเหตุด้านความถูกต้อง/ความปลอดภัย
- ข้อมูลทุกหน้าเป็น DEMO — ไม่ใช่ค่าเซ็นเซอร์หรือผลทำนายจริง
- ชื่อสาร/อัตราใช้ในหน้าโรคแมลงคงตามต้นแบบ แต่ติดป้าย "ต้องตรวจทะเบียน/ฉลาก" และระบบบล็อกการอนุมัติหากฉลากไม่ verified
- LINE Notify ในต้นแบบเปลี่ยนเป็น **LINE Messaging API** (LINE Notify ยุติบริการแล้ว) และเพิ่ม Telegram Bot ในหน้าตั้งค่า

---
AI Pairoj — by BUGpairoj · https://www.youtube.com/c/BUGpairoj
