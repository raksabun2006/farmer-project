
import profileImage from "/images/raksa.jpg";

const AboutPage = () => {
  return (
    <div className="bg-slate-100 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-700 to-green-600 text-white py-12 px-8 text-center">
          <img
            src={profileImage}
            alt="Bun Raksa"
            className="w-40 h-40 mx-auto rounded-full border-4 border-white shadow-lg object-cover"
          />

          <h1 className="text-4xl font-bold mt-6">
            Bun Raksa
          </h1>

          <p className="text-emerald-100 mt-2 text-lg">
            Full-Stack Developer & Computer Science Student
          </p>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">

          <h2 className="text-3xl font-bold text-emerald-800 mb-6 text-center">
            អំពីគម្រោងផ្សារកសិករ
          </h2>

          <p className="text-slate-700 text-lg leading-8 mb-6">
            សួស្តី! ខ្ញុំជានិស្សិតផ្នែកវិទ្យាសាស្ត្រកុំព្យូទ័រ និងជាអ្នកអភិវឌ្ឍន៍គេហទំព័រ។
            ខ្ញុំបានបង្កើតវេទិកា "ផ្សារកសិករ" នេះឡើង
            ដើម្បីជួយលើកកម្ពស់វិស័យកសិកម្មកម្ពុជា
            តាមរយៈការប្រើប្រាស់បច្ចេកវិទ្យាឌីជីថល។
          </p>

          <p className="text-slate-700 text-lg leading-8 mb-10">
            គេហទំព័រនេះអនុញ្ញាតឱ្យកសិករខ្មែរផ្សព្វផ្សាយ
            និងលក់ផលិតផលរបស់ពួកគេដោយផ្ទាល់ទៅកាន់អតិថិជន
            ដោយកាត់បន្ថយការពឹងផ្អែកលើឈ្មួញកណ្តាល
            និងបង្កើនឱកាសរកប្រាក់ចំណូល។
          </p>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-emerald-700 mb-4">
                បេសកកម្ម
              </h3>

              <p className="text-slate-700 leading-7">
                ផ្តល់វេទិកាឌីជីថលដែលអាចជួយកសិករខ្មែរ
                ផ្សព្វផ្សាយ និងលក់ផលិតផលបានយ៉ាងងាយស្រួល
                ព្រមទាំងភ្ជាប់ទំនាក់ទំនងដោយផ្ទាល់ជាមួយអតិថិជន។
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-amber-700 mb-4">
                ចក្ខុវិស័យ
              </h3>

              <p className="text-slate-700 leading-7">
                ក្លាយជាវេទិកាកសិកម្មឌីជីថលឈានមុខគេនៅកម្ពុជា
                ដែលជួយជំរុញសេដ្ឋកិច្ចកសិកម្ម
                និងបង្កើនគុណភាពជីវិតរបស់កសិករ។
              </p>
            </div>

          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t text-center">
            <h3 className="text-xl font-bold text-emerald-700">
              ប៊ុន រក្សា
            </h3>

            <p className="text-slate-600 mt-2">
              Passionate Full-Stack Developer
            </p>

            <p className="text-slate-500 text-sm mt-2">
              Building technology to support Cambodian agriculture.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutPage;
