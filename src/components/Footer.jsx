import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 border-t-8 border-emerald-700 mt-auto">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* About Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white tracking-wide">
            ទីផ្សារឌីជីថលកម្ពុជា
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            វេទិកាឌីជីថលសម្រាប់ជួយកសិករកម្ពុជា ក្នុងការផ្សព្វផ្សាយ និងលក់
            ផលិតផលកសិកម្មដោយផ្ទាល់ទៅកាន់អតិថិជន។ គាំទ្រផលិតផលកសិកម្មខ្មែរ
            និងរួមចំណែកលើកកម្ពស់សេដ្ឋកិច្ចកសិកម្មកម្ពុជា។
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-white font-semibold mb-3 border-b border-gray-700 pb-1 text-sm uppercase text-emerald-400 tracking-wider">
            តំណភ្ជាប់
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-amber-400 transition duration-300">
                ទំព័រដើម
              </Link>
            </li>
            <li>
              <Link
                to="/product"
                className="hover:text-amber-400 transition duration-300"
              >
                ផលិតផលកសិកម្ម
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-amber-400 transition duration-300"
              >
                អំពីយើង
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-amber-400 transition duration-300"
              >
                ទំនាក់ទំនង
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-white font-semibold mb-3 border-b border-gray-700 pb-1 text-sm uppercase text-emerald-400 tracking-wider">
            អ្នកអភិវឌ្ឍន៍ប្រព័ន្ធ
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
      <div className="bg-slate-950 py-4 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Bun Raksa. រក្សាសិទ្ធិគ្រប់យ៉ាង។
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Developed by: Bun Raksa
        </p>
      </div>
    </footer>
  );
};

export default Footer;