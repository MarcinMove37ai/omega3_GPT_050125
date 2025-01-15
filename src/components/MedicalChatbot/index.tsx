'use client';

import MobileNavigation from '@/components/ui/MobileNavigation';
import MobileMenuOverlay from '@/components/ui/MobileMenuOverlay';
import { MessageCircle, MessageSquarePlus } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SearchModule } from '@/lib/search_module';
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Settings } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import SearchControls from '@/components/ui/SearchControls';
import StudyCard from '@/components/ui/StudyCard';
import type { Source } from '@/types';
import FormattedMessage from '@/components/ui/FormattedMessage';
import CustomTooltip from "@/components/ui/CustomTooltip";
import ChatSidebar from '@/components/ui/ChatSidebar';


interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp?: number; // opcjonalne, do sortowania
}

interface ChatResponse {
  response: string;
  sources: Array<any>;
}

// Example records to show after first interaction
const exampleRecords = [
  {
    PMID: "10799369",
    title: "Oczyszczone kwasy eikozapentaenowy i dokozaheksaenowy mają różne efekty na lipidy i lipoproteiny w surowicy, wielkość cząsteczek LDL, glukozę i insulinę u mężczyzn z łagodną hiperlipidemią.",
    domain_primary: "kardiologia",
    domain_secondary: "lipidy, lipoproteiny, metabolizm glukozy",
    __nn_distance: 0.2,
    url: "https://pubmed.ncbi.nlm.nih.gov/10799369"
  },
  {
    PMID: "10097422",
    title: "Wpływ suplementacji diety rybami na poziomy lipidów",
    domain_primary: "kardiologia",
    domain_secondary: "hiperlipoproteinemia",
    __nn_distance: 0.25,
    url: "https://pubmed.ncbi.nlm.nih.gov/10097422"
  },
  {
    PMID: "10232625",
    title: "Wpływ diety bogatej w kwas alfa-linolenowy na poziom lipidów",
    domain_primary: "kardiologia",
    domain_secondary: "czynniki ryzyka zakrzepicy",
    __nn_distance: 0.3,
    url: "https://pubmed.ncbi.nlm.nih.gov/10232625"
  },
  // Dodaj pozostałe 9 rekordów z podobnymi danymi
  {
    PMID: "10356659",
    title: "Wspólne działanie inhibitorów reduktazy HMG-CoA i kwasów omega-3",
    domain_primary: "kardiologia",
    domain_secondary: "hiperlipidemia",
    __nn_distance: 0.28,
    url: "https://pubmed.ncbi.nlm.nih.gov/10356659"
  },
  {
    PMID: "12518167",
    title: "Wpływ oleju rybnego na utlenianie LDL",
    domain_primary: "kardiologia",
    domain_secondary: "miażdżyca",
    __nn_distance: 0.32,
    url: "https://pubmed.ncbi.nlm.nih.gov/12518167"
  },
  {
    PMID: "12530552",
    title: "Wpływ EPA na średnią objętość płytek krwi",
    domain_primary: "kardiologia",
    domain_secondary: "funkcja płytek krwi",
    __nn_distance: 0.27,
    url: "https://pubmed.ncbi.nlm.nih.gov/12530552"
  },
  {
    PMID: "12558058",
    title: "Wpływ spożycia kwasu alfa-linolenowego na ryzyko chorób serca",
    domain_primary: "kardiologia",
    domain_secondary: "choroba wieńcowa",
    __nn_distance: 0.22,
    url: "https://pubmed.ncbi.nlm.nih.gov/12558058"
  },
  {
    PMID: "12576957",
    title: "Żywienie dojelitowe z kwasem eikozapentaenowym",
    domain_primary: "pulmonologia",
    domain_secondary: "ostry zespół niewydolności oddechowej",
    __nn_distance: 0.35,
    url: "https://pubmed.ncbi.nlm.nih.gov/12576957"
  },
  {
    PMID: "12583947",
    title: "Związek kwasów tłuszczowych omega-3 z trwałością blaszek miażdżycowych",
    domain_primary: "kardiologia",
    domain_secondary: "miażdżyca",
    __nn_distance: 0.24,
    url: "https://pubmed.ncbi.nlm.nih.gov/12583947"
  },
  {
    PMID: "10419086",
    title: "Podawanie kwasu dokozaheksaenowego wpływa na zmiany zachowania",
    domain_primary: "neurologia",
    domain_secondary: "stres psychologiczny",
    __nn_distance: 0.31,
    url: "https://pubmed.ncbi.nlm.nih.gov/10419086"
  },
  {
    PMID: "10232627",
    title: "Spożycie diety z kwasem alfa-linolenowym a ryzyko chorób serca",
    domain_primary: "kardiologia",
    domain_secondary: "choroba niedokrwienna serca",
    __nn_distance: 0.29,
    url: "https://pubmed.ncbi.nlm.nih.gov/10232627"
  },
  {
    PMID: "12583947",
    title: "Wpływ kwasów omega-3 na stabilność blaszek miażdżycowych",
    domain_primary: "kardiologia",
    domain_secondary: "miażdżyca",
    __nn_distance: 0.26,
    url: "https://pubmed.ncbi.nlm.nih.gov/12583947"
  }
];

const BANNER_HEIGHT = 40;
const SCROLL_THRESHOLD = 200;
const SCROLL_DEBOUNCE = 100;
const searchModule = new SearchModule();

const MedicalChatbot = () => {

  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<Source | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isScrollingUp = useRef(false);
  const [searchType, setSearchType] = useState<'semantic' | 'statistical' | 'hybrid'>('hybrid');
  const [topK, setTopK] = useState(12);
  const [queryMode, setQueryMode] = useState<'last' | 'all'>('all');
  const [alpha, setAlpha] = useState<number>(0.65);

const handleNewChat = () => {
    setMessages([]);
    setSources([]);
    setInputValue('');
    setHasInteracted(false);
  };

const columns = [
  {
    key: 'index',
    label: 'Lp.',
    width: isMobile ? '40px' : '60px',
    format: (_: any, index: number) => (index + 1),
    showOnMobile: true
  },
  {
    key: 'PMID',
    label: 'PMID',
    width: '100px',
    format: (value: string) => value || 'N/A',
    showOnMobile: false
  },
  {
    key: 'domain_primary',
    label: 'Dziedzina',
    width: '120px',
    format: (value: string) => value || 'N/A',
    showOnMobile: false
  },
  {
    key: 'title',
    label: 'Tytuł',
    width: isMobile ? 'calc(100% - 40px)' : '400px',
    format: (value: string) => value || 'N/A',
    showOnMobile: true
  },
];



useEffect(() => {
    const scrollArea = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollArea) return;

    const checkScrollability = () => {
        const isScrollable = scrollArea.scrollHeight > scrollArea.clientHeight;
        const isAtTop = scrollArea.scrollTop <= 10;
        setShowBanner(!isScrollable || isAtTop);
    };

    // Obserwator zmian w zawartości
    const resizeObserver = new ResizeObserver(() => {
        checkScrollability();
    });

    resizeObserver.observe(scrollArea);

    // Obsługa scrollowania
    const handleScroll = () => {
        checkScrollability();
    };

    scrollArea.addEventListener('scroll', handleScroll);

    // Inicjalne sprawdzenie
    checkScrollability();

    // Automatyczne przewijanie tylko po zmianie messages
    if (messages.length > 0) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
    }

    return () => {
        scrollArea.removeEventListener('scroll', handleScroll);
        resizeObserver.disconnect();
    };
}, [messages]); // Efekt reaguje na zmiany messages

useEffect(() => {
    console.log('Is mobile:', isMobile);
}, [isMobile]);

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  };

  const prepareConversationHistory = () => {
  return messages.map(msg => ({
    role: msg.type,
    content: msg.content
  }));
};

const handleSendMessage = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!inputValue.trim()) return;

  setIsLoading(true);
  setHasInteracted(true);

  const newMessage = {
      type: 'user' as const,
      role: 'user' as const,
      content: inputValue.trim(),
      originalMessage: inputValue.trim(), // Dodajemy to pole
      timestamp: Date.now()
    };

  setMessages(prev => [...prev, newMessage]);

  try {
    const requestBody = {
      message: inputValue,
      conversationHistory: messages,
      searchParams: {
        search_type: searchType,
        query_mode: queryMode,  // Dodajemy nowy parametr
        top_k: topK,
        alpha: searchType === 'hybrid' ? alpha : undefined
      }
    };

    // Dodajemy baseUrl
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    setSources(data.sources || []);
    setMessages(prev => [...prev, {
      type: 'assistant',
      role: 'assistant',
      content: data.response,
      timestamp: Date.now()
    }]);

  } catch (error) {
    console.error('Error:', error);
    setMessages(prev => [...prev, {
      type: 'assistant',
      role: 'assistant',
      content: 'Wystąpił błąd podczas przetwarzania zapytania.',
      timestamp: Date.now()
    }]);
  } finally {
    setIsLoading(false);
    setInputValue('');
  }
};

return (
  <div className="h-screen bg-white flex flex-col">
  {/* Desktop Sidebar */}
  <ChatSidebar
    onNewChat={handleNewChat}
    isMobile={isMobile}
  />

  {/* Mobile Menu */}
  {isMobile && (
    <MobileMenuOverlay
      isOpen={menuOpen}
      onClose={() => setMenuOpen(false)}
      onNewChat={handleNewChat}
    />
  )}

  <SearchControls
    searchType={searchType}
    setSearchType={setSearchType}
    topK={topK}
    setTopK={setTopK}
    queryMode={queryMode}
    setQueryMode={setQueryMode}
    alpha={alpha}
    setAlpha={setAlpha}
  />
    <div
      className={`fixed top-0 left-0 right-0 z-20 bg-blue-900 transition-transform duration-300 ease-in-out
        ${showBanner ? 'translate-y-0' : '-translate-y-full'}`}
      style={{ height: BANNER_HEIGHT }}
    >
      <div className="max-w-6xl mx-auto w-full h-full flex items-center">
        <div className="w-full px-6 flex items-center justify-between">
                    <span className={`text-sm ${isMobile ? 'text-white/50 text-center w-full' : 'text-white/50'}`}>
            {isMobile ? (
              <>
                Czatuj z badaniami klinicznymi na temat <span className="text-rose-500">Omega-3</span>
              </>
            ) : (
              'Czatuj z badaniami klinicznymi na temat Omega-3 i K2'
            )}
          </span>
          {!isMobile && (
            <span className="text-sm text-red-500/85">
              Niech fakty naukowe wyniosą Twój biznes na wyższy poziom
            </span>
          )}
        </div>
      </div>
    </div>

      <div
        className="flex-1 flex flex-col max-w-6xl mx-auto w-full overflow-hidden transition-[margin] duration-200"
        style={{ marginTop: showBanner ? BANNER_HEIGHT : 0 }}
      >
        {isMobile ? (
  <MobileNavigation
  onToggleSidebar={() => setMenuOpen(!menuOpen)}
/>
) : (
  <div className="bg-white px-6 border-b border-gray-100 py-4">
    <div className="flex justify-between items-center">
      <div
        className="relative group"
        onClick={() => window.location.reload()}
        style={{ cursor: 'pointer' }}
        onMouseEnter={(e) => e.currentTarget.querySelector('div').style.width = '105%'}
        onMouseLeave={(e) => e.currentTarget.querySelector('div').style.width = '150%'}
      >
        <h1 className="text-xl text-gray-800 tracking-wide">
          <span className="font-bold">omega3</span>
          <span className="font-light">gpt.pl</span>
        </h1>
        <div className="h-px bg-gray-200 mt-2 transition-all duration-300"
             style={{ width: '150%' }}>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <User className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  </div>
)}

        <div className="flex-1 overflow-hidden" ref={scrollAreaRef}>
          <ScrollArea className="h-full">
            <div className="px-6">
              <div className={`p-2 md:p-4 ${messages.length > 0 ? 'bg-gray-50 rounded-xl' : ''}`}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-4 p-3 rounded-xl w-[98%] ${
                          message.type === 'user'
                            ? 'ml-auto bg-blue-50'
                            : 'bg-white border border-gray-200 shadow-sm'
                        } ${isMobile ? 'mx-auto' : 'max-w-[80%]'}`}
                      >
                        <FormattedMessage
                          content={message.content}
                          type={message.type}
                        />
                      </div>
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="animate-bounce">●</div>
                    <div className="animate-bounce delay-100">●</div>
                    <div className="animate-bounce delay-200">●</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </ScrollArea>
        </div>

        <footer className="w-full px-6 border-t border-gray-200">
          <div className="flex gap-3 my-6">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
              placeholder="Wpisz zapytanie..."
              className="flex-1 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 shadow-sm text-gray-900"
            />
            <button
              onClick={handleSendMessage}
              className={`${
                isMobile ? 'p-5' : 'px-8 py-4'
              } bg-blue-900 text-white rounded-xl hover:bg-blue-800 shadow-sm flex items-center justify-center`}
            >
              <Send className="w-4 h-4" />
              {!isMobile && <span className="ml-2">Wyślij</span>}
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setIsTableExpanded(!isTableExpanded)}
              className="bg-blue-900 hover:bg-blue-800 text-white rounded-lg w-8 h-8 flex items-center justify-center transition-colors border-2 border-blue-900 hover:border-blue-800"
            >
              {isTableExpanded ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M6 9L12 15L18 9"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 15L12 9L6 15"/>
                </svg>
              )}
            </button>
            <h2 className="text-sm text-gray-400">
              {hasInteracted ? (sources.length > 0 ? 'Badania kliniczne użyte do udzielenia odpowiedzi' : 'Przykładowe badania kliniczne') : 'Lista badań'}
            </h2>
          </div>

          <div className={`${isTableExpanded ? 'h-[420px]' : 'h-32'} rounded-xl shadow-lg bg-white transition-all duration-300`}>
            <div className="w-full h-full relative">
              <div className="sticky top-0 bg-gray-50 z-[5]">
                <table className="w-full table-fixed">
                  <thead>
                    <tr>
                      {columns
                        .filter(column => !isMobile || column.showOnMobile)
                        .map((column) => (
                          <th
                            key={column.key}
                            style={{ width: column.width }}
                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {column.label}
                          </th>
                        ))}
                      {!isMobile && (
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                          Link
                        </th>
                      )}
                    </tr>
                  </thead>
                </table>
              </div>
              <ScrollArea className="h-[calc(100%-36px)]">
                <table className="w-full table-fixed">
                    <tbody className="divide-y divide-gray-200">
                      {sources.map((result, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {columns
                        .filter(column => !isMobile || column.showOnMobile)
                        .map((column) => (
                          <td
                            key={`${index}-${column.key}`}
                            style={{ width: column.width }}
                            className={`px-4 py-2 text-sm text-gray-900 ${column.key === 'title' ? '' : 'truncate'}`}
                            onClick={column.key === 'title' ? () => setSelectedStudy(result) : undefined}
                          >
                            {column.key === 'title' ? (
                                <span className="block truncate text-blue-600 hover:text-blue-900 cursor-pointer">
                                  {column.format(result[column.key], index)}
                                </span>
                              ) : (
                                column.format(result[column.key], index)
                              )}
                          </td>
                        ))}
                      {!isMobile && (
                        <td className="px-4 py-2 text-sm w-20">
                          <button
                            onClick={() => setSelectedStudy(result)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Pokaż
                          </button>
                        </td>
                      )}
                        </tr>
                      ))}
                    </tbody>
                </table>
              </ScrollArea>
            </div>
          </div>
        </footer>
      </div>
      {selectedStudy && (
        <StudyCard
          study={selectedStudy}
          onClose={() => setSelectedStudy(null)}
        />
      )}
    </div>
  );
};

export default MedicalChatbot;
