import { useCallback, useEffect, useRef, useState } from "react";
import { getTestimonials } from "../../api/api";

const AUTO_PLAY_MS = 5000;
const DESKTOP_BREAKPOINT = 1024;

function NavArrowButton({ direction, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-sm transition hover:border-primary hover:text-primary"
    >
      {direction === "left" ? "‹" : "›"}
    </button>
  );
}

function Stars() {
  return (
    <div className="mb-2 flex justify-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ item }) {
  return (
    <article className="relative flex h-full min-h-[200px] flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-center shadow-sm sm:min-h-[220px] sm:px-5 sm:py-5">
      <span className="absolute left-3 top-2 select-none font-serif text-4xl leading-none text-primary/25">
        &ldquo;
      </span>
      <span className="absolute bottom-1 right-3 select-none font-serif text-4xl leading-none text-primary/25">
        &rdquo;
      </span>

      <div className="relative z-10">
        <Stars />
        <p className="mb-4 text-sm leading-relaxed text-neutral-700">{item.text}</p>
      </div>

      <div className="relative z-10">
        <p className="text-sm font-bold text-neutral-900">{item.name}</p>
        {item.role ? <p className="text-xs text-neutral-500">{item.role}</p> : null}
      </div>
    </article>
  );
}

function useItemsPerView() {
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const update = () => setItemsPerView(mediaQuery.matches ? 4 : 1);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return itemsPerView;
}

function TestimonialSlider({ testimonials }) {
  const scrollRef = useRef(null);
  const itemsPerView = useItemsPerView();
  const count = testimonials.length;
  const canScroll = count > itemsPerView;

  const getScrollStep = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 0;
    const slide = el.querySelector("[data-testimonial-slide]");
    if (!slide) return el.clientWidth;
    const gap = 16;
    return slide.getBoundingClientRect().width + gap;
  }, []);

  const scrollBy = useCallback(
    (direction) => {
      const el = scrollRef.current;
      if (!el) return;
      const step = getScrollStep();
      const maxScroll = el.scrollWidth - el.clientWidth;
      const nextLeft = el.scrollLeft + direction * step;

      if (direction > 0 && nextLeft >= maxScroll - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      if (direction < 0 && nextLeft <= 0) {
        el.scrollTo({ left: maxScroll, behavior: "smooth" });
        return;
      }

      el.scrollBy({ left: direction * step, behavior: "smooth" });
    },
    [getScrollStep]
  );

  useEffect(() => {
    if (!canScroll) return undefined;
    const timer = setInterval(() => scrollBy(1), AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, [canScroll, scrollBy]);

  if (count === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-stretch gap-3">
        {canScroll ? (
          <div className="hidden shrink-0 self-center lg:flex">
            <NavArrowButton
              direction="left"
              onClick={() => scrollBy(-1)}
              label="Previous testimonials"
            />
          </div>
        ) : null}

        <div
          ref={scrollRef}
          className="hide-scrollbar flex min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth"
        >
          {testimonials.map((item, index) => (
            <div
              key={item._id || `${item.name}-${index}`}
              data-testimonial-slide
              className="w-full shrink-0 snap-start lg:w-[calc((100%-3rem)/4)] lg:min-w-[calc((100%-3rem)/4)]"
            >
              <TestimonialCard item={item} />
            </div>
          ))}
        </div>

        {canScroll ? (
          <div className="hidden shrink-0 self-center lg:flex">
            <NavArrowButton
              direction="right"
              onClick={() => scrollBy(1)}
              label="Next testimonials"
            />
          </div>
        ) : null}
      </div>

      {canScroll ? (
        <div className="mt-4 flex items-center justify-center gap-3 lg:hidden">
          <NavArrowButton
            direction="left"
            onClick={() => scrollBy(-1)}
            label="Previous testimonial"
          />
          <NavArrowButton
            direction="right"
            onClick={() => scrollBy(1)}
            label="Next testimonial"
          />
        </div>
      ) : null}
    </div>
  );
}

function TestimonialsImpact() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await getTestimonials();
        setTestimonials(data.data || []);
      } catch {
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-white px-5 py-8 sm:px-6 md:px-8 md:py-10 lg:px-12">
      <div className="mx-auto max-w-[1600px]">
        <h2 className="mb-5 text-center text-2xl font-bold text-text-primary sm:mb-6 sm:text-3xl lg:text-4xl">
          What Our Customers Say
        </h2>
        <TestimonialSlider testimonials={testimonials} />
      </div>
    </section>
  );
}

export default TestimonialsImpact;
