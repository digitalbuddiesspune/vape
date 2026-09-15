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
      className={`group flex items-stretch gap-3 overflow-hidden rounded-sm p-4 sm:gap-4 sm:p-5 ${theme.bg}`}
    >
      <div className="min-w-0 flex-1">
        <h3
          className={`text-lg font-bold leading-tight tracking-tight sm:text-xl ${theme.title}`}
        >
          {item.title}
        </h3>
        <p className={`mt-1.5 text-sm leading-relaxed sm:mt-2 sm:text-[15px] ${theme.desc}`}>
          {item.description}
        </p>
      </div>

      {item.imageUrl ? (
        <div className="flex w-[72px] shrink-0 items-end justify-end sm:w-[88px]">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="max-h-[72px] w-full object-contain object-bottom drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)] transition-transform duration-300 group-hover:scale-105 sm:max-h-[88px]"
            loading="lazy"
          />
        </div>
      ) : null}
    </article>
  );
}

export default WhatsRightForYouCard;
