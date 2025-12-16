// frontend/src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-5 w-full bg-[#0053E2] text-white">
      <div className="w-full">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="border border-white/20 rounded-xl p-6 hover:bg-white/10 transition">
              <h3 className="text-lg font-bold mb-3">About Us</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Pellentesque posuere orci lobortis scelerisque blandit. Donec id
                tellus lacinia an, tincidunt risus ac, consequat velit.
              </p>
            </div>

            <div className="border border-white/20 rounded-xl p-6 hover:bg-white/10 transition">
              <h3 className="text-lg font-bold mb-3">Information</h3>
              <nav className="flex flex-col gap-2 text-sm text-white/80">
                <a className="hover:text-white transition">Search</a>
                <a className="hover:text-white transition">Store Location</a>
                <a className="hover:text-white transition">Order & Return</a>
                <a className="hover:text-white transition">Privacy Policy</a>
              </nav>
            </div>

            <div className="border border-white/20 rounded-xl p-6 hover:bg-white/10 transition">
              <h3 className="text-lg font-bold mb-3">Support</h3>
              <nav className="flex flex-col gap-2 text-sm text-white/80">
                <a className="hover:text-white transition">Contact Us</a>
                <a className="hover:text-white transition">About Us</a>
                <a className="hover:text-white transition">Career</a>
                <a className="hover:text-white transition">Delivery</a>
              </nav>
            </div>

            <div className="border border-white/20 rounded-xl p-6 hover:bg-white/10 transition">
              <h3 className="text-lg font-bold mb-3">Help</h3>
              <nav className="flex flex-col gap-2 text-sm text-white/80">
                <a className="hover:text-white transition">Help & FAQ's</a>
                <a className="hover:text-white transition">Information</a>
                <a className="hover:text-white transition">Shipping Details</a>
                <a className="hover:text-white transition">Online Payment</a>
              </nav>
            </div>

          </div>

          {/* Bottom section */}
          <div className="mt-10 border-t border-white/30 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/80">
              © {new Date().getFullYear()} BuyNext. All rights reserved.
            </p>

            <div className="flex items-center gap-4">
              <a className="text-sm text-white/80 hover:text-white transition">
                Privacy
              </a>
              <a className="text-sm text-white/80 hover:text-white transition">
                Terms
              </a>
              <a className="text-sm text-white/80 hover:text-white transition">
                Help
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
