import styles from './QuoteCards.module.css'

const QUOTES = [
  { text: 'גאונות היא אחוז אחד השראה ותשעים ותשעה אחוזי הזעה', author: 'תומס אדיסון' },
  { text: 'הדבר החשוב הוא לא להפסיק לשאול שאלות', author: 'אלברט איינשטיין' },
  { text: 'הצלחה היא סכום של מאמצים קטנים, שחוזרים עליהם יום אחרי יום', author: 'רוברט קולייר' },
  { text: 'בעיה שהוגדרה היטב – חציה כבר נפתרה', author: "צ'ארלס קטרינג" },
  { text: 'לא נכשלתי. פשוט מצאתי עשרת אלפים דרכים שלא עובדות', author: 'מיוחס לתומס אדיסון' },
  { text: 'השקעה בידע מניבה את הריבית הטובה ביותר', author: "מיוחס לבנג'מין פרנקלין" },
  { text: 'מי שמעולם לא טעה, מעולם לא ניסה דבר חדש', author: 'מיוחס לאלברט איינשטיין' },
  {
    text: 'הצלחה היא היכולת לעבור מכישלון לכישלון בלי לאבד את ההתלהבות',
    author: "מיוחס לווינסטון צ'רצ'יל",
  },
]

export function QuoteCards() {
  return (
    <div className={styles.quotes}>
      {QUOTES.map((quote) => (
        <figure key={quote.text} className={`${styles.quote} lift`}>
          <blockquote>{quote.text}</blockquote>
          <figcaption>{quote.author}</figcaption>
        </figure>
      ))}
    </div>
  )
}
