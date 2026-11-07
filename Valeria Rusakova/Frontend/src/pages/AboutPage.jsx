// AboutPage.jsx - information about the system and the developer.

const TECHNOLOGIES = [
  { name: "React", description: "בניית ממשק המשתמש כאתר של עמוד אחד (SPA)." },
  { name: "FastAPI (Python)", description: "שרת REST API שמקבל את ההודעות ומחזיר תשובות." },
  { name: "LangChain + OpenAI", description: "שליחת השיחה כולה למודל השפה, כדי שיבין את ההקשר." },
  { name: "MySQL", description: "שמירת כל השיחות וההודעות במסד נתונים." },
];

function AboutPage() {
  return (
    <article className="about">
      <h1>אודות ValGPT</h1>

      <section className="about-card">
        <h2>מה זה?</h2>
        <p>
          ValGPT הוא צ'אט בינה מלאכותית בעברית. אפשר לנהל איתו שיחה רציפה – הוא זוכר את
          ההודעות הקודמות באותה שיחה ומבין שאלות המשך. כל שיחה נשמרת במסד הנתונים, ובכל רגע
          אפשר להתחיל שיחה חדשה.
        </p>
      </section>

      <section className="about-card">
        <h2>טכנולוגיות</h2>
        <ul className="tech-list">
          {TECHNOLOGIES.map((technology) => (
            <li key={technology.name}>
              <strong dir="ltr">{technology.name}</strong>
              <span>{technology.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-card">
        <h2>המפתחת</h2>
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
