import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="mt-16 border-t border-emerald-100 bg-[#173b2a] text-emerald-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-12 md:grid-cols-3 md:px-8">

        {/* About Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white tracking-wide">
            {t("brand")} {t("country")}
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            {t("tagline")}.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-white font-semibold mb-3 border-b border-gray-700 pb-1 text-sm uppercase text-emerald-400 tracking-wider">
            {t("products")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="transition hover:text-[#f2bd4b]">
                {t("home")}
              </Link>
            </li>
            <li>
              <Link
                to="/product"
                className="transition hover:text-[#f2bd4b]"
              >
                {t("products")}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="transition hover:text-[#f2bd4b]"
              >
                {t("about")}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="transition hover:text-[#f2bd4b]"
              >
                {t("contact")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-white font-semibold mb-3 border-b border-gray-700 pb-1 text-sm uppercase text-emerald-400 tracking-wider">
            {t("contactInfo")}
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <span className="font-medium text-white">
                ប៊ុន រក្សា
              </span>
            </li>
            <li>និស្សិតជំនាញវិទ្យាសាស្ត្រកុំព្យូទ័រ</li>
            <li>Royal University of Phnom Penh</li>
            <li>រាជធានីភ្នំពេញ, កម្ពុជា</li>
            <li>096 878 2196</li>
            <li>raksabun2006@gmail.com</li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-4 text-center text-xs text-emerald-200/70">
        <p>© {new Date().getFullYear()} ផ្សារកសិកម្មកម្ពុជា · រក្សាសិទ្ធិគ្រប់យ៉ាង</p>
      </div>
    </footer>
  );
};

export default Footer;