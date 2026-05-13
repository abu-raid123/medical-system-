# نظام تقارير الإجازات المرضية - Sick Leave Report System

نظام ويب ثنائي اللغة (عربي/إنجليزي) لإصدار تقارير الإجازات المرضية بصيغة PDF مع QR Code للتحقق.

## المميزات

- صفحة تسجيل دخول محمية
- نموذج إدخال بيانات ثنائي اللغة (عربي/إنجليزي)
- تحويل تلقائي للتاريخ الهجري
- توليد تقرير PDF مطابق للقالب الرسمي
- توليد QR Code مع رابط للاستعلام
- صفحة استعلام عن التقارير برمز الإجازة
- تخزين دائم في قاعدة بيانات Supabase

## التشغيل المحلي

```bash
npm install
npm run dev
```

يعمل على `http://localhost:3000` مع تخزين محلي (ملف JSON).

## النشر على Netlify مع Supabase

### 1. إنشاء مشروع Supabase (مجاني)

1. اذهب إلى [supabase.com](https://supabase.com) وأنشئ حساب
2. أنشئ مشروع جديد (New Project)
3. اذهب إلى **SQL Editor** والصق محتوى ملف `supabase-schema.sql`
4. اضغط **Run** لإنشاء الجدول

### 2. الحصول على مفاتيح Supabase

1. اذهب إلى **Project Settings** → **API**
2. انسخ:
   - `Project URL` → هذا هو `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` key → هذا هو `SUPABASE_SERVICE_ROLE_KEY`

### 3. النشر على Netlify

1. اذهب إلى [netlify.com](https://netlify.com)
2. اضغط **Add new site** → **Import an existing project**
3. اختر GitHub واختر هذا المستودع
4. في **Environment variables** أضف:
   - `NEXT_PUBLIC_SUPABASE_URL` = رابط مشروعك في Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` = مفتاح service_role
5. اضغط **Deploy**

## بيانات الدخول

- اسم المستخدم: `salah`
- كلمة المرور: `773354060`

## التقنيات

- Next.js 16 (App Router)
- Supabase (PostgreSQL)
- jsPDF + Amiri Font (توليد PDF مع دعم العربية)
- QR Code (qrcode)
- Tailwind CSS
