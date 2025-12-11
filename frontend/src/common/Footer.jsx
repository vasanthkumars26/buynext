// frontend/src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-5 text-gray-200 w-full block border-t">
      {/* full-bleed gradient background */}
      <div className="w-full ">
        {/* Full width container — no max-w, just padding for gutters */}
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-12">
          {/* The grid now stretches across the full width (with internal gutters via px) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-extrabold title-glow mb-3">About Us</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Pellentesque posuere orci lobortis scelerisque blandit. Donec id
                tellus lacinia an, tincidunt risus ac, consequat velit. Donec id
                tellus lacinia an, tincidunt risus.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-extrabold title-glow mb-3">Information</h3>
              <nav className="flex flex-col gap-2 text-sm text-white/80">
                <a className="hover:text-cyan-300 transition">Search</a>
                <a className="hover:text-cyan-300 transition">Store Location</a>
                <a className="hover:text-cyan-300 transition">Order & Return</a>
                <a className="hover:text-cyan-300 transition">Privacy Policy</a>
              </nav>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-extrabold title-glow mb-3">Support</h3>
              <nav className="flex flex-col gap-2 text-sm text-white/80">
                <a className="hover:text-cyan-300 transition">Contact Us</a>
                <a className="hover:text-cyan-300 transition">About Us</a>
                <a className="hover:text-cyan-300 transition">Career</a>
                <a className="hover:text-cyan-300 transition">Delivery</a>
              </nav>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-extrabold title-glow mb-3">Help</h3>
              <nav className="flex flex-col gap-2 text-sm text-white/80">
                <a className="hover:text-cyan-300 transition">Help & FAQ's</a>
                <a className="hover:text-cyan-300 transition">Information</a>
                <a className="hover:text-cyan-300 transition">Shipping Details</a>
                <a className="hover:text-cyan-300 transition">Online Payment</a>
              </nav>
            </div>
          </div>

          {/* bottom row — full width with divider */}
          <div className="mt-8 border-t border-white/6 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/70">
              © {new Date().getFullYear()} BuyNext. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <a className="text-sm text-white/80 hover:text-cyan-300 transition">Privacy</a>
              <a className="text-sm text-white/80 hover:text-cyan-300 transition">Terms</a>
              <a className="text-sm text-white/80 hover:text-cyan-300 transition">Help</a>
            </div>
          </div>
        </div>
      </div>

      {/* Keep the inline glass styles — unchanged look */}
      <style jsx>{`
        .glass {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(6px);
        }
        .title-glow {
          text-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
