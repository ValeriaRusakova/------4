# ValGPT – צ'אט AI בעברית

פרויקט גמר – Full Stack Web Development
**מפתחת:** ולריה רוסקובה

🔗 **קישור לפרויקט ב-GitHub:** https://github.com/ValeriaRusakova/------4
---

## מה המערכת עושה?

אתר צ'אט בסגנון ChatGPT:

- שולחים הודעה ומקבלים תשובה אמיתית ממודל של OpenAI.
- הצ'אט **זוכר את ההקשר** של השיחה ("מהי בירת צרפת?" ← "ומה לגבי איטליה?" ← "רומא").
- **היסטוריית שיחות לפי נושא** בתפריט הצדדי – ה-AI נותן לכל שיחה נושא קצר, ובלחיצה חוזרים אליה.
- **יצירת תמונות** – מבקשים "צור תמונה של..." והצ'אט מצייר (כלי של LangChain).
- כפתור **"שיחה חדשה"** פותח שיחה חדשה עם מזהה חדש (השיחה הקודמת נשארת שמורה).
- **מצב בהיר / כהה**, שנשמר בדפדפן.
- **נגישות**: ניווט מלא במקלדת, קוראי מסך, ותפריט נגישות (הגדלת טקסט, ניגודיות גבוהה, הדגשת קישורים, עצירת אנימציות).
- כל השיחות וההודעות נשמרות ב-MySQL.
- דף **אודות**, תפריט ניווט, עברית (RTL) והתאמה למובייל.

---

## טכנולוגיות

| חלק | טכנולוגיה | למה |
|------|-----------|-----|
| Frontend | React + Vite | בניית ממשק SPA (עמוד אחד, בלי רענונים) |
| Frontend | React Router | מעבר בין דף הבית לדף אודות |
| Frontend | react-markdown | הצגת תשובות ה-AI עם רשימות והדגשות (במקום כוכביות) |
| Backend | Python + FastAPI | שרת REST API |
| Backend | Pydantic | בדיקת תקינות הנתונים שמגיעים לשרת |
| Backend | SQLAlchemy + PyMySQL | עבודה מול MySQL מתוך Python |
| AI | LangChain (`ChatOpenAI`, `@tool`) + OpenAI | שליחת השיחה למודל, וכלי ליצירת תמונות |
| AI | OpenAI Images (`gpt-image-1-mini`) | ציור התמונות |
| Database | MySQL | שמירת השיחות וההודעות |

---

## זרימת המידע

```
 ┌─────────┐  1. POST הודעה + מזהה שיחה  ┌──────────┐
 │  React  │ ──────────────────────────► │ FastAPI  │
 │ (דפדפן) │ ◄────────────────────────── │  (שרת)   │
 └─────────┘  7. ההודעות + נושא השיחה    └────┬─────┘
      ▲                                       │ 2. שליפת ההודעות הקודמות של אותה שיחה
      │ GET /images/...                       │ 6. שמירת ההודעה, התשובה והנושא
      │ (הצגת התמונה)                    ┌────▼─────┐
      │                                  │  MySQL   │
      │                                  └──────────┘
      │              3. כל ההיסטוריה + ההודעה החדשה
      │   FastAPI ──► LangChain (ChatOpenAI + כלי generate_image) ──► OpenAI
      │           ◄────────────────────────────────────────────────── 5. התשובה
      │                         │ 4. אם ביקשו תמונה: המודל מפעיל את הכלי
      └── generated_images/ ◄───┘    → OpenAI Images → נשמר כקובץ בשרת
```

**איך הצ'אט "זוכר"?** בכל הודעה השרת שולף מ-MySQL את כל ההודעות של **אותה שיחה בלבד**
(לפי הסדר), מוסיף את ההודעה החדשה ושולח הכול למודל. אין צורך במנגנון זיכרון מסובך.

**איך עובדת יצירת התמונות?** אנחנו "מספרים" למודל שיש לו כלי בשם `generate_image`
(`llm.bind_tools`). כשהמשתמש מבקש תמונה, המודל מחליט לבד להפעיל את הכלי, השרת מצייר
את התמונה, שומר אותה בתיקייה `Backend/generated_images`, והמודל כותב משפט שמתאר אותה.
אם הציור נכשל, הצ'אט מתנצל והשיחה ממשיכה כרגיל.

**איך נוצר הנושא?** אחרי ההודעה הראשונה בשיחה, השרת מבקש מהמודל כותרת של 2–4 מילים
ושומר אותה בעמודה `title`.

**אבטחה:** מפתח OpenAI וסיסמת MySQL נמצאים רק בקובץ `Backend/.env` בשרת.
הדפדפן לא מדבר עם OpenAI אף פעם – רק עם השרת שלנו.

---

## מבנה התיקיות

```
Valeria Rusakova/
├── README.md                       ← הקובץ הזה
├── .gitignore                      ← קבצים שלא עולים ל-GitHub (.env, env, node_modules, תמונות)
│
├── Database/
│   ├── chatgpt_db.sql              ← יצירת מסד הנתונים והטבלאות (מבנה בלבד, עם הסברים)
│   └── chatgpt_db_export.sql       ← Export מלא (mysqldump) כולל שיחות לדוגמה
│
├── Backend/
│   ├── main.py                     ← נקודת הכניסה: CORS, בדיקת תקינות, שיתוף תיקיית התמונות
│   ├── database.py                 ← חיבור ל-MySQL (קורא פרטים מ-.env, שומר זמנים ב-UTC)
│   ├── models.py                   ← הטבלאות כמחלקות Python (SQLAlchemy)
│   ├── schemas.py                  ← מבנה ה-JSON שנכנס ויוצא (Pydantic)
│   ├── routes/conversations.py     ← נתיבי ה-API של שיחות והודעות
│   ├── services/chat_service.py    ← LangChain: שיחה עם ההקשר, כלי התמונות, יצירת נושא
│   ├── services/image_service.py   ← ציור תמונה ב-OpenAI ושמירתה כקובץ
│   ├── generated_images/           ← התמונות שנוצרו (נוצרת אוטומטית, לא עולה ל-GitHub)
│   ├── requirements.txt            ← ספריות Python
│   ├── .env.example                ← דוגמה לקובץ ההגדרות (בלי סודות)
│   └── ValGPT.postman_collection.json ← בדיקות Postman
│
└── Frontend/
    ├── index.html                  ← דף ה-HTML היחיד (lang="he" dir="rtl", גופן Rubik)
    ├── package.json                ← ספריות JavaScript ופקודות הרצה
    ├── vite.config.js              ← הגדרות Vite
    ├── .env.example                ← כתובת השרת (לא חובה)
    └── src/
        ├── main.jsx                ← נקודת ההתחלה של React
        ├── App.jsx                 ← מבנה האתר: אזור ראשי + תפריט צד; מחבר את הכול
        ├── App.css                 ← כל העיצוב: צבעים בהיר/כהה, נגישות, מובייל
        ├── services/api.js         ← כל הקריאות לשרת (fetch)
        ├── hooks/
        │   ├── useChat.js          ← כל הלוגיקה של הצ'אט: שיחות, הודעות, שליחה, טעינה
        │   └── useSettings.js      ← מצב בהיר/כהה והגדרות הנגישות (נשמרים בדפדפן)
        ├── utils/formatTime.js     ← הצגת שעה ("18:45") ותאריך ("אתמול")
        ├── pages/
        │   ├── ChatPage.jsx        ← דף הבית – הצ'אט
        │   └── AboutPage.jsx       ← דף אודות + הצהרת נגישות
        └── components/
            ├── Header.jsx          ← סרגל עליון: לשוניות, מצב כהה, נגישות
            ├── Sidebar.jsx         ← תפריט צד: שיחה חדשה + היסטוריית שיחות לפי נושא
            ├── AccessibilityMenu.jsx ← חלונית הגדרות הנגישות
            ├── WelcomeBanner.jsx   ← כרטיס "ברוכים הבאים" עם הצעות לשאלות
            ├── MessageBubble.jsx   ← בועת הודעה (טקסט, תמונה, שעה)
            ├── MessageInput.jsx    ← תיבת הכתיבה, כפתור תמונה וכפתור שליחה
            ├── RobotAvatar.jsx     ← דמות הרובוט (מצוירת בקוד SVG)
            └── Icons.jsx           ← אייקונים קטנים (SVG)
```

---

## מסד הנתונים

כל הזמנים נשמרים ב-UTC, והדפדפן מציג אותם בשעון המקומי.

**conversations** – שיחה אחת בכל שורה

| עמודה | סוג | הסבר |
|-------|-----|------|
| id | INT, PK, AUTO_INCREMENT | מזהה ייחודי של השיחה |
| title | VARCHAR(100), NULL | נושא השיחה (נוצר ע"י ה-AI אחרי ההודעה הראשונה) |
| created_at | DATETIME | מתי השיחה נוצרה |
| updated_at | DATETIME, INDEX | מתי נשלחה ההודעה האחרונה (למיון בתפריט הצד) |

**messages** – הודעה אחת בכל שורה

| עמודה | סוג | הסבר |
|-------|-----|------|
| id | INT, PK, AUTO_INCREMENT | מזהה ייחודי – גם קובע את סדר ההודעות |
| conversation_id | INT, FK → conversations.id | לאיזו שיחה ההודעה שייכת |
| role | ENUM('user','assistant') | מי שלח: המשתמש או הצ'אט |
| content | TEXT | תוכן ההודעה |
| image_url | VARCHAR(255), NULL | כתובת התמונה, אם ה-AI יצר תמונה |
| created_at | DATETIME | מתי ההודעה נשלחה |

אינדקס `(conversation_id, id)` מאיץ את השליפה "כל ההודעות של שיחה X לפי הסדר".

---

## REST API

| Method | URL | Body | תשובה | קודי שגיאה |
|--------|-----|------|-------|------------|
| GET | `/api/health` | – | `{"status":"ok","database":"connected"}` | 503 אם MySQL לא זמין |
| GET | `/api/conversations` | – | `200` 50 השיחות האחרונות (עם נושא), החדשה ראשונה | 503 |
| POST | `/api/conversations` | – | `201` `{id, title, created_at, updated_at}` | 503 |
| GET | `/api/conversations/{id}/messages` | – | `200` רשימת הודעות לפי הסדר | 404 שיחה לא קיימת |
| POST | `/api/conversations/{id}/messages` | `{"content": "..."}` | `201` `{user_message, assistant_message, conversation}` | 404, 422 הודעה ריקה, 503 OpenAI לא זמין |
| GET | `/images/{file}` | – | קובץ התמונה (webp) | 404 |

תיעוד אינטראקטיבי אוטומטי: <http://localhost:8000/docs> (כשהשרת רץ).

---

## נגישות

- ניווט מלא במקלדת: קישור "דלגו לתוכן הראשי", מסגרת כתומה ברורה סביב הרכיב הפעיל, Escape סוגר תפריטים.
- קוראי מסך: `lang="he"`, תוויות לכל כפתור ואייקון, הודעות חדשות מוקראות אוטומטית (`role="log"`),
  שגיאות מוקראות מיד (`role="alert"`), ו-`aria-current` על השיחה הפתוחה.
- תפריט נגישות (סמל האדם בסרגל העליון): גודל טקסט, ניגודיות גבוהה, הדגשת קישורים ועצירת אנימציות.
- כבוד להגדרות המחשב: מצב כהה ו"הפחתת תנועה".
- נבדק בכלי **axe-core** (כללי WCAG 2.1 AA): 0 בעיות במצב בהיר, כהה וניגודיות גבוהה.

---

## התקנה והרצה

### דרישות מוקדמות
- Python 3.10 ומעלה
- Node.js 18 ומעלה
- MySQL 8 (מותקן במחשב **או** דרך Docker)
- מפתח OpenAI API

### 1. מסד הנתונים

**אפשרות א' – MySQL מותקן במחשב:** פתחו את MySQL Workbench והריצו את הקובץ
`Database/chatgpt_db_export.sql` (או `Database/chatgpt_db.sql` למסד ריק).

**אפשרות ב' – Docker** (כך זה הורץ בפיתוח):

```powershell
# מריץ שרת MySQL 8.4 ברקע, על פורט 3306, עם שמירת הנתונים ב-volume
docker run -d --name chatgpt-mysql -e MYSQL_ROOT_PASSWORD=YourPassword -p 3306:3306 -v chatgpt-mysql-data:/var/lib/mysql mysql:8.4

# טוען את מבנה המסד (מתוך תיקיית הפרויקט)
Get-Content Database\chatgpt_db.sql -Raw | docker exec -i chatgpt-mysql mysql -uroot -pYourPassword
```

### 2. השרת (Backend)

```powershell
cd Backend
python -m venv env                  # יוצר סביבה וירטואלית בשם env
.\env\Scripts\activate              # מפעיל אותה
pip install -r requirements.txt     # מתקין את הספריות
copy .env.example .env              # יוצר קובץ הגדרות – ערכו אותו עם המפתח והסיסמה שלכם
uvicorn main:app                    # מריץ את השרת על http://localhost:8000
```

### 3. האתר (Frontend)

בטרמינל **נוסף**:

```powershell
cd Frontend
npm install        # מתקין את React ושאר הספריות (יוצר node_modules)
npm run dev        # מריץ את האתר על http://localhost:5173
```

פתחו בדפדפן: **<http://localhost:5173>**

### 4. בדיקות Postman

ב-Postman: **Import** ← בחרו `Backend/ValGPT.postman_collection.json` ← **Run collection**.
(השרת צריך לרוץ.) האוסף כולל: בדיקת תקינות, יצירת שיחה, הודעה ונושא, הודעת המשך עם בדיקת הקשר,
היסטוריה, רשימת השיחות לתפריט הצד, הפרדה בין שיחות, יצירת תמונה, ובדיקות שגיאה (404, 422).

אפשר להריץ גם משורת הפקודה: `npx newman run Backend/ValGPT.postman_collection.json`

---

## לפני הגשה

- [ ] למחוק את התיקייה `Backend/env`
- [ ] למחוק את התיקייה `Frontend/node_modules`
- [ ] לוודא שהקובץ `Backend/.env` **לא** נמצא ב-ZIP / ב-GitHub
