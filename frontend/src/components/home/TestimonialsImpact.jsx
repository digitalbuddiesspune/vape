import { useCallback, useEffect, useState } from "react";
import { getTestimonials } from "../../api/api";

const AUTO_PLAY_MS = 5000;

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

function TestimonialCarousel({ testimonials }) {
  const [current, setCurrent] = useState(0);
  const count = testimonials.length;

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + count) % count);
  }, [count]);

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    if (count <= 1) return undefined;
    const timer = setInterval(next, AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, [next, count]);

  useEffect(() => {
    if (current >= count) {
      setCurrent(0);
    }
  }, [count, current]);

  if (count === 0) {
    return null;
  }

  const item = testimonials[current];

  return (
    <div className="text-center">
      <div className="mx-auto flex w-full max-w-xl items-center justify-center gap-3">
        {count > 1 && (
          <NavArrowButton direction="left" onClick={prev} label="Previous testimonial" />
        )}

        <div className="relative flex min-h-[180px] min-w-0 flex-1 flex-col justify-between overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-center shadow-sm sm:px-5 sm:py-5">
          <span className="absolute left-3 top-2 select-none font-serif text-4xl leading-none text-primary/25">
            &ldquo;
          </span>
          <span className="absolute bottom-1 right-3 select-none font-serif text-4xl leading-none text-primary/25">
            &rdquo;
          </span>

          <div className="relative z-10">
            <Stars />
            <p className="mb-4 text-sm leading-relaxed text-neutral-700 transition-opacity duration-500">
              {item.text}
            </p>
          </div>

          <div className="relative z-10">
            <p className="text-sm font-bold text-neutral-900">{item.name}</p>
            {item.role ? (
              <p className="text-xs text-neutral-500">{item.role}</p>
            ) : null}
          </div>
        </div>

        {count > 1 && (
          <NavArrowButton direction="right" onClick={next} label="Next testimonial" />
        )}
      </div>
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
    <section className="bg-white px-5 py-8 sm:px-6 md:px-8 lg:px-12 md:py-10">
      <div className="mx-auto max-w-[1600px]">
        <h2 className="mb-5 text-center text-2xl font-bold text-text-primary sm:mb-6 sm:text-3xl lg:text-4xl">
          What Our Customers Say
        </h2>
        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </section>
  );
}

export default TestimonialsImpact;
