# ValGPT – צ'אט AI בעברית

פרויקט גמר – Full Stack Web Development
**מפתחת:** ולריה רוסקובה

🔗 **קישור לפרויקט ב-GitHub:** `<הדביקו כאן את הקישור לריפו>`

---

## מה המערכת עושה?

אתר צ'אט בסגנון ChatGPT:

- שולחים הודעה ומקבלים תשובה אמיתית ממודל של OpenAI.
- הצ'אט **זוכר את ההקשר** של השיחה ("מהי בירת צרפת?" ← "ומה לגבי איטליה?" ← "רומא").
- כפתור **"שיחה חדשה"** פותח שיחה חדשה עם מזהה חדש (השיחה הקודמת נשארת שמורה).
- כל השיחות וההודעות נשמרות ב-MySQL.
- דף **אודות** ותפריט ניווט.
- תמיכה מלאה בעברית (RTL), התאמה למובייל ונגישות (ניווט במקלדת, קוראי מסך).

---

## טכנולוגיות

| חלק | טכנולוגיה | למה |
|------|-----------|-----|
| Frontend | React + Vite | בניית ממשק SPA (עמוד אחד, בלי רענונים) |
| Frontend | React Router | מעבר בין דף הבית לדף אודות |
| Backend | Python + FastAPI | שרת REST API |
| Backend | Pydantic | בדיקת תקינות הנתונים שמגיעים לשרת |
| Backend | SQLAlchemy + PyMySQL | עבודה מול MySQL מתוך Python |
| AI | LangChain (`ChatOpenAI`) + OpenAI | שליחת השיחה למודל וקבלת תשובה |
| Database | MySQL | שמירת השיחות וההודעות |

---

## זרימת המידע

```
 ┌─────────┐  1. POST הודעה + מזהה שיחה  ┌──────────┐
 │  React  │ ──────────────────────────► │ FastAPI  │
 │ (דפדפן) │ ◄────────────────────────── │  (שרת)   │
 └─────────┘  6. הודעת המשתמש + התשובה   └────┬─────┘
                                              │ 2. שליפת ההודעות הקודמות של אותה שיחה
                                              │ 5. שמירת ההודעה והתשובה
                                         ┌────▼─────┐
                                         │  MySQL   │
                                         └──────────┘
                     3. כל ההיסטוריה + ההודעה החדשה
   FastAPI ──► LangChain (ChatOpenAI) ──► OpenAI
           ◄──────────────────────────── 4. תשובת המודל
```

**איך הצ'אט "זוכר"?** בכל הודעה השרת שולף מ-MySQL את כל ההודעות של **אותה שיחה בלבד**
(לפי הסדר), מוסיף את ההודעה החדשה ושולח הכול למודל. אין צורך במנגנון זיכרון מסובך.

**אבטחה:** מפתח OpenAI וסיסמת MySQL נמצאים רק בקובץ `Backend/.env` בשרת.
הדפדפן לא מדבר עם OpenAI אף פעם – רק עם השרת שלנו.

---

## מבנה התיקיות

```
Valeria Rusakova/
├── README.md                       ← הקובץ הזה
├── .gitignore                      ← קבצים שלא עולים ל-GitHub (.env, env, node_modules)
│
├── Database/
│   ├── chatgpt_db.sql              ← יצירת מסד הנתונים והטבלאות (מבנה בלבד, עם הסברים)
│   └── chatgpt_db_export.sql       ← Export מלא (mysqldump) כולל שיחות לדוגמה
│
├── Backend/
│   ├── main.py                     ← נקודת הכניסה: יצירת האפליקציה, CORS, בדיקת תקינות
│   ├── database.py                 ← חיבור ל-MySQL (קורא פרטים מ-.env)
│   ├── models.py                   ← הטבלאות כמחלקות Python (SQLAlchemy)
│   ├── schemas.py                  ← מבנה ה-JSON שנכנס ויוצא (Pydantic)
│   ├── routes/conversations.py     ← נתיבי ה-API של שיחות והודעות
│   ├── services/chat_service.py    ← החיבור ל-OpenAI דרך LangChain
│   ├── requirements.txt            ← ספריות Python
│   ├── .env.example                ← דוגמה לקובץ ההגדרות (בלי סודות)
│   └── ValGPT.postman_collection.json ← בדיקות Postman
│
└── Frontend/
    ├── index.html                  ← דף ה-HTML היחיד (lang="he" dir="rtl")
    ├── package.json                ← ספריות JavaScript ופקודות הרצה
    ├── vite.config.js              ← הגדרות Vite
    ├── .env.example                ← כתובת השרת (לא חובה)
    └── src/
        ├── main.jsx                ← נקודת ההתחלה של React
        ├── App.jsx                 ← מבנה האתר: כותרת + הדף הנוכחי
        ├── App.css                 ← כל העיצוב
        ├── services/api.js         ← כל הקריאות לשרת (fetch)
        ├── pages/
        │   ├── ChatPage.jsx        ← דף הבית – הצ'אט (ניהול השיחה)
        │   └── AboutPage.jsx       ← דף אודות
        └── components/
            ├── Header.jsx          ← כותרת ותפריט ניווט
            ├── WelcomeScreen.jsx   ← מסך פתיחה עם הצעות לשאלות
            ├── MessageBubble.jsx   ← בועת הודעה אחת
            └── MessageInput.jsx    ← תיבת הכתיבה וכפתור השליחה
```

---

## מסד הנתונים

**conversations** – שיחה אחת בכל שורה

| עמודה | סוג | הסבר |
|-------|-----|------|
| id | INT, PK, AUTO_INCREMENT | מזהה ייחודי של השיחה |
| created_at | DATETIME | מתי השיחה נוצרה |

**messages** – הודעה אחת בכל שורה

| עמודה | סוג | הסבר |
|-------|-----|------|
| id | INT, PK, AUTO_INCREMENT | מזהה ייחודי – גם קובע את סדר ההודעות |
| conversation_id | INT, FK → conversations.id | לאיזו שיחה ההודעה שייכת |
| role | ENUM('user','assistant') | מי שלח: המשתמש או הצ'אט |
| content | TEXT | תוכן ההודעה |
| created_at | DATETIME | מתי ההודעה נשלחה |

אינדקס `(conversation_id, id)` מאיץ את השליפה "כל ההודעות של שיחה X לפי הסדר".

---

## REST API

| Method | URL | Body | תשובה | קודי שגיאה |
|--------|-----|------|-------|------------|
| GET | `/api/health` | – | `{"status":"ok","database":"connected"}` | 503 אם MySQL לא זמין |
| POST | `/api/conversations` | – | `201` `{id, created_at}` | 503 |
| GET | `/api/conversations/{id}/messages` | – | `200` רשימת הודעות לפי הסדר | 404 שיחה לא קיימת |
| POST | `/api/conversations/{id}/messages` | `{"content": "..."}` | `201` `{user_message, assistant_message}` | 404, 422 הודעה ריקה, 503 OpenAI לא זמין |

תיעוד אינטראקטיבי אוטומטי: <http://localhost:8000/docs> (כשהשרת רץ).

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
uvicorn main:app --reload           # מריץ את השרת על http://localhost:8000
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
(השרת צריך לרוץ.) האוסף כולל: בדיקת תקינות, יצירת שיחה, הודעה, הודעת המשך עם בדיקת הקשר,
היסטוריה, הפרדה בין שיחות ובדיקות שגיאה (404, 422).

אפשר להריץ גם משורת הפקודה: `npx newman run Backend/ValGPT.postman_collection.json`

---

## לפני הגשה

- [ ] למחוק את התיקייה `Backend/env`
- [ ] למחוק את התיקייה `Frontend/node_modules`
- [ ] לוודא שהקובץ `Backend/.env` **לא** נמצא ב-ZIP / ב-GitHub
- [ ] להוסיף את קישור ה-GitHub בראש הקובץ הזה
