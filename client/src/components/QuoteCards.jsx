import styles from './QuoteCards.module.css'

const QUOTES = [
  { text: 'גאונות היא אחוז אחד השראה ותשעים ותשעה אחוזי הזעה', author: 'תומס אדיסון' },
  { text: 'הדבר החשוב הוא לא להפסיק לשאול שאלות', author: 'אלברט איינשטיין' },
  { text: 'הצלחה היא סכום של מאמצים קטנים, שחוזרים עליהם יום אחרי יום', author: 'רוברט קולייר' },
]

export function QuoteCards() {
  return (
    <div className={styles.quotes}>
      {QUOTES.map((quote) => (
        <figure key={quote.author} className={styles.quote}>
          <blockquote>{quote.text}</blockquote>
          <figcaption>{quote.author}</figcaption>
        </figure>
      ))}
    </div>
  )
}
