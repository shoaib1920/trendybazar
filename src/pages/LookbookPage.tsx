import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { BookOpen, Clock, Calendar, ArrowLeft, ArrowRight, Share2, Sparkles } from 'lucide-react';

export const LookbookPage: React.FC = () => {
  const { 
    lookbookArticles, 
    selectedArticleSlug, 
    navigateToArticle, 
    setActiveView, 
    products, 
    showToast 
  } = useShop();

  const currentArticle = selectedArticleSlug
    ? lookbookArticles.find((a) => a.slug === selectedArticleSlug) || lookbookArticles[0]
    : null;

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard!', 'success');
    }
  };

  if (currentArticle) {
    const featuredProducts = currentArticle.featuredProductSlugs
      .map((slug) => products.find((p) => p.slug === slug))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));

    return (
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10" id="lookbook-article-view">
        {/* Back navigation */}
        <div className="flex items-center justify-between border-b border-gold-hairline pb-4">
          <button
            onClick={() => navigateToArticle('')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#8A6D1F] hover:text-[#141414] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Style Edits</span>
          </button>

          <button
            onClick={() => handleShare(currentArticle.title)}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-black font-semibold"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Article</span>
          </button>
        </div>

        {/* Title & Meta */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#8A6D1F] uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-[#F2B705]" />
            <span>Lahore Design Studio • Style Guide</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#141414] leading-tight">
            {currentArticle.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-serif italic leading-relaxed">
            {currentArticle.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
            <span>By <strong>{currentArticle.author}</strong></span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {currentArticle.publishedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {currentArticle.readTime}
            </span>
          </div>
        </div>

        {/* Hero Cover Image */}
        <div className="aspect-16/9 rounded-3xl overflow-hidden shadow-lg border border-gold-hairline">
          <img
            src={currentArticle.coverImage}
            alt={currentArticle.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Summary Callout */}
        <div className="bg-[#F9F6F0] p-6 sm:p-8 rounded-3xl border-l-4 border-[#9C7A28] text-sm text-gray-800 leading-relaxed font-serif italic shadow-xs">
          "{currentArticle.summary}"
        </div>

        {/* Paragraphs */}
        <div className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed font-sans">
          {currentArticle.content.map((p, idx) => (
            <p key={idx} className="leading-loose">
              {p}
            </p>
          ))}
        </div>

        {/* Featured Products Mentioned in Article */}
        {featuredProducts.length > 0 && (
          <div className="pt-10 border-t border-gold-hairline space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8A6D1F] tracking-widest">Shop The Edit</span>
                <h3 className="font-serif font-bold text-2xl text-[#141414]">Featured In This Guide</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {featuredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </article>
    );
  }

  // Lookbook index list
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12" id="lookbook-index-view">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-[#F9F6F0] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#8A6D1F] border border-gold-hairline">
          <BookOpen className="w-3.5 h-3.5 text-[#F2B705]" />
          <span>Bazaar Sartorial Journal</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-5xl text-[#141414]">
          Style Guides & Master Notes
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          In-depth masterclasses from our Lahore master tailors and clothiers on fabric selection, lace placement, and heritage styling.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {lookbookArticles.map((article, idx) => (
          <div
            key={article.id}
            onClick={() => navigateToArticle(article.slug)}
            className="group bg-white rounded-3xl overflow-hidden border border-gold-hairline hover:border-gold-subtle shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
          >
            <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-50">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#141414]/90 backdrop-blur-xs text-[#F2B705] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {article.readTime}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  {article.publishedDate}
                </span>
                <h2 className="font-serif font-bold text-lg text-[#141414] group-hover:text-[#9C7A28] transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#8A6D1F]">
                <span>Read Full Journal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
