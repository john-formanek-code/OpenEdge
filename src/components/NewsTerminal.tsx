import React, { useState, useEffect, useMemo } from 'react';
import { useTerminal } from './TerminalContext';

type NewsItem = {
  id: string;
  time: string;
  source: string;
  headline: string;
  body: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  tags: string[];
  isBreaking?: boolean;
};

export function NewsTerminal() {
  const { focusedTicker } = useTerminal();
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'ALL' | 'POSITIVE' | 'NEGATIVE'>('ALL');

  const filteredNews = useMemo(() => {
    let news = newsData;
    
    // 1. Sentiment filter
    if (sentimentFilter !== 'ALL') {
      news = news.filter(n => n.sentiment === sentimentFilter);
    }
    
    // 2. Keyword/Ticker filter
    const term = (searchTerm || focusedTicker || '').toUpperCase();
    if (term) {
      news = news.filter(n => 
        n.headline.toUpperCase().includes(term) || 
        n.tags.some(t => t.toUpperCase() === term) ||
        n.body.toUpperCase().includes(term)
      );
    }
    
    return news;
  }, [newsData, focusedTicker, searchTerm, sentimentFilter]);

  const displayNews = filteredNews;

  useEffect(() => {
    if (displayNews.length > 0 && (!selected || !displayNews.find(n => n.id === selected.id))) {
      setSelected(displayNews[0]);
    }
  }, [displayNews, selected]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/news');
        if (res.ok) {
          const data = await res.json();
          if (data.news && data.news.length > 0) {
            setNewsData(data.news);
          }
        }
      } catch (e) {
        console.error('Failed to fetch news', e);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
    const intervalId = setInterval(fetchNews, 60000); // refresh every minute
    return () => clearInterval(intervalId);
  }, []);

  if (loading && newsData.length === 0) {
    return <div className="h-full flex items-center justify-center bg-black text-zinc-500 font-mono text-xs uppercase animate-pulse">Initializing News Feed...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden font-mono">
      <div className="text-[10px] text-zinc-500 font-bold p-2 border-b border-zinc-800 uppercase bg-[#050505] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <span>NWS - Global News Terminal</span>
          <div className="flex bg-black border border-zinc-800 h-6 px-2 items-center">
            <span className="text-[9px] text-zinc-600 mr-2">FIND:</span>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-0 outline-none text-white text-[10px] w-24 uppercase"
              placeholder={focusedTicker || 'KEYWORD...'}
            />
          </div>
        </div>
        <div className="flex gap-2 text-[9px]">
          <button 
            onClick={() => setSentimentFilter('ALL')}
            className={`px-1 border ${sentimentFilter === 'ALL' ? 'bg-zinc-800 text-white border-zinc-600' : 'text-zinc-500 border-zinc-900'}`}
          >
            ALL
          </button>
          <button 
            onClick={() => setSentimentFilter('POSITIVE')}
            className={`px-1 border ${sentimentFilter === 'POSITIVE' ? 'bg-green-500/10 text-green-500 border-green-500/50' : 'text-zinc-500 border-zinc-900'}`}
          >
            POS
          </button>
          <button 
            onClick={() => setSentimentFilter('NEGATIVE')}
            className={`px-1 border ${sentimentFilter === 'NEGATIVE' ? 'bg-red-500/10 text-red-500 border-red-500/50' : 'text-zinc-500 border-zinc-900'}`}
          >
            NEG
          </button>
          <span className="bg-amber-500/20 text-amber-500 px-1 border border-amber-500/50">LIVE</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Headlines */}
        <div className="w-1/3 min-w-[250px] border-r border-zinc-900 bg-[#0a0a0a] overflow-y-auto custom-scrollbar flex flex-col">
          {displayNews.length === 0 ? (
            <div className="p-4 text-center text-[10px] text-zinc-600 uppercase">
              No news matches filters.
            </div>
          ) : (
            displayNews.map((news) => (
              <div 
                key={news.id} 
                onClick={() => setSelected(news)}
                className={`p-2 border-b border-zinc-800/50 cursor-pointer transition-colors ${
                  selected && selected.id === news.id ? 'bg-zinc-800/50 border-l-2 border-l-amber-500' : 'hover:bg-zinc-900'
                } ${news.isBreaking ? 'bg-red-950/10' : ''}`}
              >
                <div className="flex justify-between items-start mb-1 text-[9px]">
                  <div className="flex items-center gap-1">
                    {news.isBreaking && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                    <span className="text-zinc-500">{news.time}</span>
                  </div>
                  <span className={`font-black ${
                    news.sentiment === 'POSITIVE' ? 'text-green-500' : 
                    news.sentiment === 'NEGATIVE' ? 'text-red-500' : 'text-zinc-400'
                  }`}>
                    {news.source}
                  </span>
                </div>
                <div className={`text-[10px] font-bold leading-tight ${
                  news.isBreaking ? 'text-red-400' : 
                  (selected && selected.id === news.id ? 'text-white' : 'text-zinc-300')
                }`}>
                  {news.headline}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Main Area - Article */}
        <div className="flex-1 bg-black p-4 overflow-y-auto custom-scrollbar">
          {selected ? (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 text-[10px]">
                <span className="bg-zinc-900 text-amber-500 px-2 py-0.5 font-bold border border-zinc-700">{selected.source}</span>
                <span className="text-zinc-500">{selected.time} EST</span>
                <div className="ml-auto flex gap-1">
                  {selected.tags.map(t => (
                    <span key={t} className="text-[9px] bg-zinc-900 px-1 text-zinc-400 border border-zinc-800">#{t}</span>
                  ))}
                </div>
              </div>
              <h1 className="text-lg font-black text-white leading-snug mb-4">{selected.headline}</h1>
              <div className="h-px w-full bg-zinc-800 mb-4" />
              <p className="text-zinc-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {selected.body}
              </p>
              
              {/* Sentiment Analysis block */}
              <div className="mt-8 border border-zinc-900 bg-[#050505] p-3">
                <div className="text-[9px] text-zinc-600 font-bold uppercase mb-2">Automated Sentiment Analysis</div>
                <div className="flex items-center gap-3">
                  <div className={`text-xl font-black ${
                      selected.sentiment === 'POSITIVE' ? 'text-green-500' : 
                      selected.sentiment === 'NEGATIVE' ? 'text-red-500' : 'text-zinc-400'
                    }`}>
                    {selected.sentiment}
                  </div>
                  <div className="flex-1 h-2 bg-zinc-900 relative">
                    <div className={`absolute top-0 bottom-0 left-0 transition-all duration-500 ${
                        selected.sentiment === 'POSITIVE' ? 'bg-green-500 w-[85%]' : 
                        selected.sentiment === 'NEGATIVE' ? 'bg-red-500 w-[85%]' : 'bg-zinc-500 w-[50%]'
                      }`} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-600 uppercase text-[10px]">
              Select an article to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
