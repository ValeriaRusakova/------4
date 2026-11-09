// AboutPage.jsx - information about the system, the developer and accessibility.
import RobotAvatar from "../components/RobotAvatar.jsx";

const TECHNOLOGIES = [
  { name: "React", description: "בניית ממשק המשתמש כאתר של עמוד אחד (SPA)." },
  { name: "FastAPI (Python)", description: "שרת REST API שמקבל את ההודעות ומחזיר תשובות." },
  { name: "LangChain + OpenAI", description: "שליחת השיחה כולה למודל השפה, כדי שיבין את ההקשר, ושימוש בכלים לחיפוש באינטרנט וליצירת תמונות." },
  { name: "MySQL", description: "שמירת כל השיחות וההודעות במסד נתונים." },
];

const FEATURES = [
  "שיחה רציפה שזוכרת את ההקשר",
  "היסטוריית שיחות לפי נושא – אפשר לחזור לכל שיחה או למחוק אותה",
  "חיפוש מידע עדכני באינטרנט (מזג אוויר, חדשות ועוד) עם קישורים למקורות",
  "יצירת תמונות לפי בקשה",
  "מצב בהיר ומצב כהה",
  "התאמה למחשב ולנייד",
];

function AboutPage() {
  return (
    // tabIndex={0}: the page scrolls, so keyboard users must be able to focus it and scroll with the arrows
    <article className="about" tabIndex={0} aria-labelledby="about-title">
      <div className="about-header">
        <RobotAvatar size={64} />
        <h1 id="about-title">
          אודות <span className="gradient-text">ValGPT</span>
        </h1>
      </div>

      <section className="about-card" aria-labelledby="about-what">
        <h2 id="about-what">מה זה?</h2>
        <p>
          ValGPT הוא צ'אט בינה מלאכותית בעברית. אפשר לנהל איתו שיחה רציפה – הוא זוכר את
          ההודעות הקודמות באותה שיחה ומבין שאלות המשך. כל שיחה נשמרת במסד הנתונים ומקבלת נושא,
          כך שאפשר לחזור אליה מהתפריט הצדדי.
        </p>
        <ul className="feature-list">
          {FEATURES.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      <section className="about-card" aria-labelledby="about-tech">
        <h2 id="about-tech">טכנולוגיות</h2>
        <ul className="tech-list">
          {TECHNOLOGIES.map((technology) => (
            <li key={technology.name}>
              <strong dir="ltr">{technology.name}</strong>
              <span>{technology.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-card" aria-labelledby="about-a11y">
        <h2 id="about-a11y">נגישות</h2>
        <p>האתר נבנה כך שיתאים לכמה שיותר אנשים, כולל אנשים עם מוגבלויות:</p>
        <ul className="feature-list">
          <li>ניווט מלא במקלדת, עם סימון ברור של המיקום הנוכחי וקישור "דלגו לתוכן הראשי".</li>
          <li>תמיכה בקוראי מסך: תוויות לכל הכפתורים, והקראה אוטומטית של הודעות חדשות.</li>
          <li>תפריט נגישות (סמל האדם בראש העמוד): הגדלת טקסט, ניגודיות גבוהה, הדגשת קישורים ועצירת אנימציות.</li>
          <li>מצב כהה, ניגודיות צבעים תקינה והתאמה למסכים קטנים.</li>
        </ul>
      </section>

      <section className="about-card" aria-labelledby="about-dev">
        <h2 id="about-dev">המפתחת</h2>
        <p>
          <strong>ולריה רוסקובה</strong>
        </p>
        <p>
          תעודת זהות: <span dir="ltr">******9512</span>
        </p>
        <p>פרויקט גמר – קורס Full Stack Web Development.</p>
      </section>
    </article>
  );
}

export default AboutPage;
