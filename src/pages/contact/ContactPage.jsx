import { useTranslation } from "react-i18next";

const ContactPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-50">
    

      {/* Contact Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10">
          
          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <span className="text-emerald-700 font-semibold">
                {t("contactInfo")}
              </span>

              <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">
                យើងរីករាយក្នុងការស្តាប់ពីអ្នក
              </h2>

              <p className="text-slate-600 leading-relaxed">
                អ្នកអាចទាក់ទងមកកាន់យើងតាមរយៈទូរស័ព្ទ អ៊ីមែល ឬផ្ញើសារតាម
                Contact Form ខាងក្រោម។
              </p>
            </div>

            <div className="grid gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">
                  លេខទូរស័ព្ទ
                </h3>
                <p className="text-slate-600">+855 96 878 2196</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">
                  អ៊ីមែល
                </h3>
                <p className="text-slate-600">
                  raksabun2006@gmial.com
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">
                  អាសយដ្ឋាន
                </h3>
                <p className="text-slate-600">
                  រាជធានីភ្នំពេញ ប្រទេសកម្ពុជា
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {t("sendUsMessage")}
              </h2>

              <p className="text-slate-600 mt-2">
                បំពេញព័ត៌មានខាងក្រោម ហើយយើងនឹងទាក់ទងអ្នកវិញឆាប់ៗ។
              </p>
            </div>

            <form className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t("name")}
                </label>

                <input
                  type="text"
                  placeholder={t("namePlaceholder")}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t("email")}
                </label>

                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t("subject")}
                </label>

                <input
                  type="text"
                  placeholder={t("subjectPlaceholder")}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t("message")}
                </label>

                <textarea
                  rows="6"
                  placeholder={t("messagePlaceholder")}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-4 rounded-xl font-semibold transition-all duration-300"
              >
                {t("send")}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactPage;