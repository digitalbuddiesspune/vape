import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOfferBanners } from "../../api/api";

const DESKTOP_BREAKPOINT = 1024;

function mapBanners(list) {
  return (list || [])
    .filter((banner) => banner.isActive !== false && banner.imageUrl?.trim())
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((banner) => ({
      id: banner._id,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || "",
      alt: banner.alt || "VapeHub offer banner",
    }));
}

function OfferBannerTile({ banner }) {
  const image = (
    <img
      src={banner.imageUrl}
      alt={banner.alt}
      className="block h-auto w-full max-w-full bg-transparent"
      loading="lazy"
      draggable={false}
    />
  );

  if (banner.linkUrl) {
    const isExternal = /^https?:\/\//i.test(banner.linkUrl);
    if (isExternal) {
      return (
        <a
          href={banner.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-transparent"
        >
          {image}
        </a>
      );
    }
    return (
      <Link to={banner.linkUrl} className="block w-full bg-transparent">
        {image}
      </Link>
    );
  }

  return <div className="w-full bg-transparent">{image}</div>;
}

function PromoBannerSkeleton() {
  return (
    <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
      <div className="min-h-[120px] w-full animate-pulse sm:min-h-[150px]" />
    </section>
  );
}

function PromoBanner() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`).matches
      ? "desktop"
      : "mobile"
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const handleChange = (event) => {
      setDevice(event.matches ? "desktop" : "mobile");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const { data } = await getOfferBanners(device);
        let banners = mapBanners(data?.data);

        if (banners.length === 0 && device === "mobile") {
          const fallback = await getOfferBanners("desktop");
          banners = mapBanners(fallback.data?.data);
        }

        setSlides(banners);
      } catch {
        setSlides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [device]);

  if (loading) {
    return <PromoBannerSkeleton />;
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-transparent">
      <div className="flex w-full flex-col bg-transparent">
        {slides.map((slide) => (
          <OfferBannerTile key={slide.id} banner={slide} />
        ))}
      </div>
    </section>
  );
}

export default PromoBanner;
