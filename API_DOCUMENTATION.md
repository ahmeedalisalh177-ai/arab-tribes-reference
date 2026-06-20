# 📚 توثيق API - مرجع القبائل العربية

## نظرة عامة

هذا الملف يحتوي على توثيق شامل لجميع نقاط نهاية API المتاحة في موقع مرجع القبائل العربية.

## الرابط الأساسي (Base URL)

```
http://localhost:3000
```

أو عند النشر:
```
https://arab-tribes.manus.space
```

---

## 📄 المقالات (Articles)

### 1. الحصول على جميع المقالات

**الطلب:**
```
GET /api/articles?page=1&limit=10
```

**المعاملات:**
- `page` (اختياري): رقم الصفحة (افتراضي: 1)
- `limit` (اختياري): عدد النتائج لكل صفحة (افتراضي: 10)

**الاستجابة:**
```json
{
  "articles": [
    {
      "id": 1,
      "title": "قبيلة قريش: النسب والتاريخ",
      "slug": "quraish-tribe",
      "excerpt": "قبيلة قريش من أشهر القبائل العربية...",
      "author": "أحمد محمد",
      "created_at": "2024-06-20T10:30:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

---

### 2. الحصول على مقالة محددة

**الطلب:**
```
GET /api/articles/:slug
```

**مثال:**
```
GET /api/articles/quraish-tribe
```

**الاستجابة:**
```json
{
  "id": 1,
  "title": "قبيلة قريش: النسب والتاريخ",
  "slug": "quraish-tribe",
  "excerpt": "قبيلة قريش من أشهر القبائل العربية...",
  "content": "محتوى المقالة الكامل...",
  "keywords": "قريش, قبيلة, عدنانية",
  "author": "أحمد محمد",
  "published": true,
  "created_at": "2024-06-20T10:30:00Z",
  "updated_at": "2024-06-20T10:30:00Z"
}
```

**الأخطاء:**
- `404`: المقالة غير موجودة

---

### 3. إنشاء مقالة جديدة

**الطلب:**
```
POST /api/articles
Content-Type: application/json
```

**البيانات المطلوبة:**
```json
{
  "title": "عنوان المقالة",
  "slug": "article-slug",
  "excerpt": "ملخص المقالة",
  "content": "محتوى المقالة الكامل",
  "keywords": "كلمات, مفتاحية",
  "author": "اسم المؤلف",
  "published": false
}
```

**الاستجابة:**
```json
{
  "id": 2,
  "title": "عنوان المقالة",
  "slug": "article-slug",
  "excerpt": "ملخص المقالة",
  "content": "محتوى المقالة الكامل",
  "keywords": "كلمات, مفتاحية",
  "author": "اسم المؤلف",
  "published": false,
  "created_at": "2024-06-20T10:30:00Z",
  "updated_at": "2024-06-20T10:30:00Z"
}
```

**الأخطاء:**
- `400`: بيانات ناقصة أو slug موجود بالفعل
- `500`: خطأ في الخادم

---

### 4. تحديث مقالة

**الطلب:**
```
PUT /api/articles/:id
Content-Type: application/json
```

**البيانات:**
```json
{
  "title": "عنوان جديد",
  "excerpt": "ملخص جديد",
  "content": "محتوى جديد",
  "keywords": "كلمات جديدة",
  "author": "مؤلف جديد",
  "published": true
}
```

**الاستجابة:**
```json
{
  "id": 1,
  "title": "عنوان جديد",
  "excerpt": "ملخص جديد",
  "content": "محتوى جديد",
  "keywords": "كلمات جديدة",
  "author": "مؤلف جديد",
  "published": true,
  "created_at": "2024-06-20T10:30:00Z",
  "updated_at": "2024-06-20T11:45:00Z"
}
```

---

### 5. حذف مقالة

**الطلب:**
```
DELETE /api/articles/:id
```

**الاستجابة:**
```json
{
  "message": "Article deleted successfully"
}
```

**الأخطاء:**
- `404`: المقالة غير موجودة

---

## 🏛️ القبائل (Tribes)

### 1. الحصول على جميع القبائل

**الطلب:**
```
GET /api/tribes?type=adnani
```

**المعاملات:**
- `type` (اختياري): نوع القبيلة (adnani, qahtan, baida)

**الاستجابة:**
```json
[
  {
    "id": 1,
    "name": "قبيلة قريش",
    "slug": "quraish",
    "description": "من أشهر القبائل العربية العدنانية",
    "lineage": "قريش بن فهر بن مالك...",
    "history": "تاريخ القبيلة...",
    "notable_sheikhs": "أبو سفيان، علي بن أبي طالب...",
    "region": "الحجاز",
    "type": "adnani",
    "created_at": "2024-06-20T10:30:00Z",
    "updated_at": "2024-06-20T10:30:00Z"
  }
]
```

---

### 2. الحصول على قبيلة محددة

**الطلب:**
```
GET /api/tribes/:slug
```

**مثال:**
```
GET /api/tribes/quraish
```

**الاستجابة:**
```json
{
  "id": 1,
  "name": "قبيلة قريش",
  "slug": "quraish",
  "description": "من أشهر القبائل العربية العدنانية",
  "lineage": "قريش بن فهر بن مالك...",
  "history": "تاريخ القبيلة...",
  "notable_sheikhs": "أبو سفيان، علي بن أبي طالب...",
  "region": "الحجاز",
  "type": "adnani",
  "created_at": "2024-06-20T10:30:00Z",
  "updated_at": "2024-06-20T10:30:00Z"
}
```

---

### 3. إنشاء قبيلة جديدة

**الطلب:**
```
POST /api/tribes
Content-Type: application/json
```

**البيانات المطلوبة:**
```json
{
  "name": "اسم القبيلة",
  "slug": "tribe-slug",
  "type": "adnani",
  "description": "وصف القبيلة",
  "lineage": "نسب القبيلة",
  "history": "تاريخ القبيلة",
  "notable_sheikhs": "المشائخ المشهورون",
  "region": "المنطقة الجغرافية"
}
```

**الاستجابة:**
```json
{
  "id": 2,
  "name": "اسم القبيلة",
  "slug": "tribe-slug",
  "type": "adnani",
  "description": "وصف القبيلة",
  "lineage": "نسب القبيلة",
  "history": "تاريخ القبيلة",
  "notable_sheikhs": "المشائخ المشهورون",
  "region": "المنطقة الجغرافية",
  "created_at": "2024-06-20T10:30:00Z",
  "updated_at": "2024-06-20T10:30:00Z"
}
```

---

### 4. تحديث قبيلة

**الطلب:**
```
PUT /api/tribes/:id
Content-Type: application/json
```

**البيانات:**
```json
{
  "name": "اسم جديد",
  "description": "وصف جديد",
  "lineage": "نسب جديد",
  "history": "تاريخ جديد",
  "notable_sheikhs": "مشائخ جدد",
  "region": "منطقة جديدة",
  "type": "adnani"
}
```

---

### 5. حذف قبيلة

**الطلب:**
```
DELETE /api/tribes/:id
```

**الاستجابة:**
```json
{
  "message": "Tribe deleted successfully"
}
```

---

## 🔍 البحث (Search)

### البحث عن مقالات وقبائل

**الطلب:**
```
GET /api/search?q=keyword
```

**المعاملات:**
- `q` (مطلوب): كلمة البحث (يجب أن تكون على الأقل 2 أحرف)

**الاستجابة:**
```json
{
  "articles": [
    {
      "id": 1,
      "title": "قبيلة قريش: النسب والتاريخ",
      "slug": "quraish-tribe",
      "excerpt": "قبيلة قريش من أشهر القبائل العربية...",
      "type": "article"
    }
  ],
  "tribes": [
    {
      "id": 1,
      "title": "قبيلة قريش",
      "slug": "quraish",
      "excerpt": "من أشهر القبائل العربية العدنانية",
      "type": "tribe"
    }
  ],
  "total": 2
}
```

**الأخطاء:**
- `400`: كلمة البحث قصيرة جداً

---

## 🗺️ Sitemap

### الحصول على Sitemap

**الطلب:**
```
GET /sitemap.xml
```

**الاستجابة:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>http://localhost:3000/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>http://localhost:3000/article/quraish-tribe</loc>
    <lastmod>2024-06-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## 🤖 Robots.txt

### الحصول على Robots.txt

**الطلب:**
```
GET /robots.txt
```

**الاستجابة:**
```
User-agent: *
Allow: /
Sitemap: http://localhost:3000/sitemap.xml
```

---

## 📊 أمثلة عملية

### مثال 1: إضافة مقالة عن قبيلة تميم

```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "قبيلة تميم: من أكبر القبائل العربية",
    "slug": "tamim-tribe-history",
    "excerpt": "قبيلة تميم من أكبر القبائل العربية العدنانية...",
    "content": "محتوى المقالة الكامل عن قبيلة تميم...",
    "keywords": "تميم, قبيلة, عدنانية, نجد",
    "author": "محمد أحمد",
    "published": true
  }'
```

### مثال 2: البحث عن القبائل

```bash
curl "http://localhost:3000/api/search?q=قريش"
```

### مثال 3: الحصول على المقالات المنشورة

```bash
curl "http://localhost:3000/api/articles?page=1&limit=5"
```

---

## ⚠️ رموز الأخطاء

| الكود | المعنى |
|------|--------|
| 200 | نجاح الطلب |
| 201 | تم إنشاء المورد بنجاح |
| 400 | طلب غير صحيح (بيانات ناقصة أو خاطئة) |
| 404 | المورد غير موجود |
| 500 | خطأ في الخادم |

---

## 🔐 ملاحظات الأمان

- جميع الطلبات يجب أن تكون عبر HTTPS في الإنتاج
- تجنب إرسال معلومات حساسة في URL
- استخدم Content-Type: application/json للطلبات
- تحقق من صحة البيانات قبل الإرسال

---

## 📝 ملاحظات إضافية

- جميع التواريخ بصيغة ISO 8601
- جميع النصوص يجب أن تكون بصيغة UTF-8
- الـ slug يجب أن يكون فريداً (لا يمكن تكراره)
- يمكن استخدام الـ API من أي تطبيق أو موقع

---

**آخر تحديث**: 20 يونيو 2024
