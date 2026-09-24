import { Link } from "react-router-dom";
import { SiteBrand } from "../layout/SiteBrand";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import UserAccountDropdown from "../account/UserAccountDropdown";
import DesktopSearchBar from "./DesktopSearchBar";
import CategoryNavbar from "../layout/CategoryNavbar";
import { NavIconWrap } from "./NavIconWrap";
import { ICON_HIT_MD, ICON_SVG_LG } from "../../utils/iconLayout";

import { formatPrice } from "../../utils/currency";

function TopNav() {
  const { user, openAuthModal } = useAuth();
  const { items, cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const cartTotal = items.reduce(
    (sum, item) => sum + item.discountedPrice * item.quantity,
    0
  );

  const handleWishlistClick = (e) => {
    if (!user) {
      e.preventDefault();
      openAuthModal("login");
    }
  };

  const handleCartClick = (e) => {
    if (!user) {
      e.preventDefault();
      openAuthModal("login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 hidden border-b border-black/[0.06] bg-white/90 backdrop-blur-xl lg:block">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-5 py-3.5 xl:gap-6 xl:px-8">
        <div className="flex shrink-0 items-center">
          <SiteBrand variant="header" />
        </div>

        <DesktopSearchBar className="mx-2 min-w-0 flex-1 xl:mx-4" />

        <div className="flex shrink-0 items-center gap-1.5 overflow-visible xl:gap-2">
          {user ? (
            <UserAccountDropdown user={user} />
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className={`${ICON_HIT_MD} rounded-full bg-black/[0.04] text-text-primary transition hover:bg-black/[0.07]`}
              aria-label="Login or Register"
            >
              <svg className={ICON_SVG_LG} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </button>
          )}

          <Link
            to="/wishlist"
            data-wishlist-target="desktop"
            onClick={handleWishlistClick}
            className={`${ICON_HIT_MD} relative rounded-full bg-black/[0.04] text-text-primary transition hover:bg-black/[0.07]`}
            aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
          >
            <NavIconWrap badge={wishlistCount}>
              <svg className={ICON_SVG_LG} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </NavIconWrap>
          </Link>

          <Link
            to="/cart"
            data-cart-target="desktop"
            onClick={handleCartClick}
            className="relative flex h-10 items-center gap-1.5 overflow-visible rounded-full bg-black/[0.04] px-3 text-text-primary transition hover:bg-black/[0.07]"
            aria-label={`Cart, ${cartCount} items, ${formatPrice(cartTotal)}`}
          >
            <NavIconWrap badge={cartCount}>
              <svg className={ICON_SVG_LG} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </NavIconWrap>
            <span className="text-sm font-bold leading-none">{formatPrice(cartTotal)}</span>
          </Link>
        </div>
      </div>
      <CategoryNavbar />
    </header>
  );
}

export default TopNav;
