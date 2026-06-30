import React, { useState } from 'react';

export default function AgribusinessNews() {
  const [selectedCategory, setSelectedCategory] = useState('ទាំងអស់');
  const [searchQuery, setSearchQuery] = useState('');

  // Categories list
  const categories = ['ទាំងអស់', 'ដំណាំស្រូវ', 'បន្លែ', 'ផ្លែឈើ', 'សត្វចិញ្ចឹម', 'បច្ចេកវិទ្យាកសិកម្ម', 'ព័ត៌មានកសិ-ពាណិជ្ជកម្ម'];

  // Full dataset of news items
  const allNews = [
    {
      id: 1,
      title: 'ការនាំចេញអង្ករផ្ការំដួលកម្ពុជាទៅកាន់ទីផ្សារអន្តរជាតិកើនឡើង ២០% ក្នុងឆមាសទីមួយ',
      category: 'ដំណាំស្រូវ',
      date: '១៨ មិថុនា ២០២៦',
      views: '៥.២កែវ',
      excerpt: 'ក្រសួងកសិកម្ម រុក្ខាប្រមាញ់ និងនេសាទ បានបង្ហាញរបាយការណ៍ថ្មីអំពីការរីកចម្រើនយ៉ាងខ្លាំងនៃតម្រូវការអង្ករប្រណីតរបស់កម្ពុជានៅលើទីផ្សារសហគមន៍អឺរ៉ុប និងអាស៊ី ដោយសារការរក្សាបាននូវស្តង់ដារគុណភាពខ្ពស់ និងតម្លៃប្រកួតប្រជែង...',
      image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=1000',
      featured: true
    },
    {
      id: 2,
      title: 'បច្ចេកទេសដាំដំណាំស្ពៃក្តោបក្នុងផ្ទះសំណាញ់ទទួលបានផលចំណេញខ្ពស់',
      category: 'បន្លែ',
      date: '១៨ មិថុនា ២០២៦',
      views: '១.៨កែវ',
      excerpt: 'ការដាំបន្លែក្នុងផ្ទះសំណាញ់កំពុងក្លាយជាជម្រើសដ៏ពេញនិយមសម្រាប់កសិករសម័យថ្មី ព្រោះវាជួយកាត់បន្ថយការប្រើប្រាស់ថ្នាំពុលកសិកម្ម និងការពារពីការបំផ្លាញរបស់សត្វល្អិតចង្រៃបានយ៉ាងច្រើន...',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=500',
      featured: false
    },
    {
      id: 3,
      title: 'ប្រព័ន្ធស្រោចស្រពវៃឆ្លាតដំណើរការដោយសូឡា ជួយកាត់បន្ថយការចំណាយថាមពល',
      category: 'បច្ចេកវិទ្យាកសិកម្ម',
      date: '១៧ មិថុនា ២០២៦',
      views: '២.៤កែវ',
      excerpt: 'ការដាក់បញ្ចូលបច្ចេកវិទ្យា IoT រួមផ្សំជាមួយថាមពលពន្លឺព្រះអាទិត្យនៅក្នុងប្រព័ន្ធស្រោចស្រព បានជួយឱ្យកសិករសន្សំសំចៃថវិកាលើការទិញប្រេងឥន្ធនៈ និងកម្លាំងពលកម្មរហូតដល់ទៅ ៤០%...',
      image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=500',
      featured: false
    },
    {
      id: 4,
      title: 'តម្លៃផ្លែទុរេនខេត្តកំពតរក្សាបានលំនឹងល្អ ខណៈតម្រូវការក្នុងស្រុកកើនឡើង',
      category: 'ផ្លែឈើ',
      date: '១៦ មិថុនា ២០២៦',
      views: '៣.១កែវ',
      excerpt: 'ទោះបីជាមានការនាំចូលផ្លែឈើពីបរទេសមួយចំនួនក៏ដោយ ក៏ផ្លែទុរេនម៉ាកសម្គាល់ភូមិសាស្ត្ររបស់ខេត្តកំពត នៅតែរក្សាបានប្រជាប្រិយភាព និងមានតម្លៃខ្ពស់នៅលើទីផ្សារដោយសាររសជាតិប្លែកដាច់គេ...',
      image: 'https://images.unsplash.com/photo-1629115917454-938b813cd68b?auto=format&fit=crop&q=80&w=500',
      featured: false
    },
    {
      id: 5,
      title: 'វិធីសាស្ត្រចិញ្ចឹមមាន់ស្រុកតាមបែបធម្មជាតិ ការពារជំងឺបានយ៉ាងមានប្រសិទ្ធភាព',
      category: 'សត្វចិញ្ចឹម',
      date: '១៥ មិថុនា ២០២៦',
      views: '៩៥០ នាក់',
      excerpt: 'ការប្រើប្រាស់ចំណីផ្សំពីធម្មជាតិ និងរុក្ខឱសថបុរាណក្នុងការថែទាំសត្វស្លាប មិនត្រឹមតែជួយឱ្យសាច់មាន់មានរសជាតិឆ្ងាញ់និងមានសុវត្ថិភាពនោះទេ ថែមទាំងជួយបង្កើនប្រព័ន្ធភាពស៊ាំប្រឆាំងនឹងជំងឺឆ្លងរាលដាល...',
      image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=500',
      featured: false
    },
    {
      id: 6,
      title: 'សហគមន៍កសិកម្មទំនើបជំរុញការផលិតបន្លែសុវត្ថិភាពផ្គត់ផ្គង់ផ្សារទំនើបក្នុងរាជធានី',
      category: 'ព័ត៌មានកសិ-ពាណិជ្ជកម្ម',
      date: '១៤ មិថុនា ២០២៦',
      views: '១.៥កែវ',
      excerpt: 'ការចងក្រងកសិករជាបណ្តុំសហគមន៍កសិកម្មទំនើប បានជួយសម្រួលដល់ការចរចាតម្លៃ និងធានាបាននូវការផ្គត់ផ្គង់កសិផលជាប្រចាំទៅកាន់ដៃគូបញ្ជាទិញធំៗ ដោយមិនបារម្ភពីរឿងអតិផរណាតម្លៃ...',
      image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=500',
      featured: false
    }
  ];

  // Filter logic
  const filteredNews = allNews.filter(item => {
    const matchesCategory = selectedCategory === 'ទាំងអស់' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = allNews.find(item => item.featured);

  return (
    <div className="min-h-screen bg-slate-50 font-siemreap text-slate-800 antialiased">
      
      {/* =========================================================
          NEWS BREADCRUMB & HEADER
         ========================================================= */}
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <a href="#" className="hover:text-emerald-700">ទំព័រដើម</a>
            <span>/</span>
            <span className="text-slate-600 font-medium">ព័ត៌មាន និងព្រឹត្តិការណ៍</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl tracking-wide">
            ព័ត៌មានកសិកម្មថ្មីៗ
          </h1>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl">
            តាមដានរាល់ព្រឹត្តិការណ៍ បច្ចេកទេសដាំដុះ និន្នាការទីផ្សារ និងរបាយការណ៍កសិកម្មសំខាន់ៗជុំវិញព្រះរាជាណាចក្រកម្ពុជា។
          </p>
        </div>
      </div>

      {/* =========================================================
          FILTER & SEARCH CONTROLS
         ========================================================= */}
      <section className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Categories Tab Layout */}
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  selectedCategory === cat 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="ស្វែងរកអត្ថបទព័ត៌មាន..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 pl-9 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none transition"
            />
            <div className="absolute left-3 top-2.5 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0x" />
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          MAIN NEWS ARTICLES GRID
         ========================================================= */}
      <main className="container mx-auto px-4 py-8 md:px-6">
        
        {/* Dynamic Highlight: Only show featured banner if no active search/category filter */}
        {selectedCategory === 'ទាំងអស់' && !searchQuery && featuredArticle && (
          <section className="mb-12">
            <div className="group overflow-hidden rounded-2xl bg-white shadow-md border border-slate-100 grid grid-cols-1 lg:grid-cols-12 transition hover:shadow-xl">
              <div className="relative h-64 sm:h-80 lg:h-auto lg:col-span-7 overflow-hidden bg-slate-200">
                <img 
                  src={featuredArticle.image} 
                  alt={featuredArticle.title} 
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-101"
                />
                <span className="absolute left-4 top-4 rounded-md bg-amber-500 px-3 py-1 text-xs text-slate-900 font-bold">
                  ព័ត៌មានលេចធ្លោប្រចាំថ្ងៃ
                </span>
              </div>
              <div className="p-6 md:p-8 lg:col-span-5 flex flex-col justify-center space-y-4">
                <span className="inline-block rounded bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs font-semibold self-start">
                  {featuredArticle.category}
                </span>
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 md:text-2xl leading-relaxed transition">
                  {featuredArticle.title}
                </h2>
                <p className="text-slate-500 text-xs font-normal leading-loose line-clamp-3">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-100">
                  <span>{featuredArticle.date}</span>
                  <span>មើល៖ {featuredArticle.views}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Dynamic Header Status */}
        <div className="mb-6 flex items-center justify-between border-l-4 border-emerald-600 pl-3">
          <h3 className="text-lg font-bold text-slate-900">
            {selectedCategory === 'ទាំងអស់' ? 'អត្ថបទព័ត៌មានទាំងអស់' : `ចំណាត់ថ្នាក់ក្រុម៖ ${selectedCategory}`}
          </h3>
          <span className="text-xs text-slate-400">រកឃើញចំនួន {filteredNews.length} អត្ថបទ</span>
        </div>

        {/* Empty State Result */}
        {filteredNews.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-400">មិនមានទិន្នន័យព័ត៌មានដែលអ្នកកំពុងស្វែងរកឡើយ។</p>
          </div>
        )}

        {/* Standard News Grid */}
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((item) => (
            <article key={item.id} className="group flex flex-col overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm transition hover:shadow-md">
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105" 
                />
                <span className="absolute bottom-3 left-3 rounded bg-emerald-700/90 backdrop-blur-sm px-2.5 py-0.5 text-[11px] text-white">
                  {item.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-950 group-hover:text-emerald-700 line-clamp-2 text-sm leading-relaxed transition">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 font-normal leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-50">
                  <span>{item.date}</span>
                  <span>មើល៖ {item.views}</span>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Pagination Block Footer Accent */}
        {filteredNews.length > 0 && (
          <div className="mt-12 flex justify-center gap-2 text-xs">
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 text-slate-400 cursor-not-allowed">ថយក្រោយ</button>
            <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-white font-medium">១</button>
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 text-slate-600">បន្តទៅមុខ</button>
          </div>
        )}

      </main>
    </div>
  );
}