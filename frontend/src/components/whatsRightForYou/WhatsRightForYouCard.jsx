const CARD_THEMES = [
  {
    bg: "bg-[#d4e8f7]",
    title: "text-neutral-900",
    desc: "text-neutral-700",
  },
  {
    bg: "bg-[#ececec]",
    title: "text-neutral-900",
    desc: "text-neutral-600",
  },
  {
    bg: "bg-[#5fa9a9]",
    title: "text-white",
    desc: "text-white/90",
  },
  {
    bg: "bg-gradient-to-br from-[#f3dce6] via-[#e8eef5] to-[#c8dff5]",
    title: "text-neutral-900",
    desc: "text-neutral-700",
  },
  {
    bg: "bg-[#b8d4e8]",
    title: "text-neutral-900",
    desc: "text-neutral-700",
  },
  {
    bg: "bg-[#dfe8ef]",
    title: "text-neutral-900",
    desc: "text-neutral-600",
  },
];

function WhatsRightForYouCard({ item, index = 0 }) {
  const theme = CARD_THEMES[index % CARD_THEMES.length];

  return (
    <article
      className={`group relative flex min-h-[220px] flex-col overflow-hidden rounded-sm p-5 sm:min-h-[250px] sm:p-6 ${theme.bg}`}
    >
      <div className="relative z-10 max-w-[85%]">
        <h3
          className={`text-xl font-bold leading-tight tracking-tight sm:text-2xl ${theme.title}`}
        >
          {item.title}
        </h3>
        <p className={`mt-2 text-sm leading-relaxed sm:text-[15px] ${theme.desc}`}>
          {item.description}
        </p>
      </div>

      <div className="relative mt-auto flex flex-1 items-end justify-center pt-5 sm:justify-end sm:pt-6">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="max-h-[110px] w-auto max-w-[90%] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-105 sm:max-h-[130px] sm:max-w-[75%]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white/40 text-xs font-medium text-neutral-500">
            No image
          </div>
        )}
      </div>
    </article>
  );
}

export default WhatsRightForYouCard;
