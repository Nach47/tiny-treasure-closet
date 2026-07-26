const REVIEWS = [
  {
    quote:
      "The Cloud Knit Romper is unbelievably soft, and it arrived faster than I expected. Ordering on WhatsApp made it so easy to ask questions first.",
    name: "Adwoa K.",
    detail: "Mother of one, Accra",
  },
  {
    quote:
      "We bought the Meadow Sibling Set for our twins' first birthday and the fit was perfect. You can tell every piece is made with real care.",
    name: "Efua B.",
    detail: "Mother of twins, Kumasi",
  },
  {
    quote:
      "Paying with Mobile Money and getting order updates straight on WhatsApp is exactly what I needed as a busy parent. Will be back for more.",
    name: "Nana A.",
    detail: "Father of two, Tema",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-gold" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.5 14.9 9l7.1.6-5.4 4.6 1.7 6.9L12 17.8 5.7 21.1l1.7-6.9L2 9.6 9.1 9Z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="bg-beige/50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 text-center">
          <p className="eyebrow">Loved by Parents</p>
          <h2 className="mt-2 text-3xl">What our customers say</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {REVIEWS.map((review) => (
            <figure key={review.name} className="card-surface rounded-4xl p-7">
              <Stars />
              <blockquote className="mt-4 text-sm leading-relaxed text-ink-soft">
                “{review.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm font-semibold text-ink">
                {review.name}
                <span className="block text-xs font-normal text-ink-soft">{review.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
