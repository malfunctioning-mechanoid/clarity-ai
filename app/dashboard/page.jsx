"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { 
  BookOpen, 
  Coins, 
  Compass, 
  CornerDownLeft, 
  FileText, 
  LogOut, 
  Sparkles, 
  User, 
  Layers,
  HelpCircle,
  Menu
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(1000);
  const [inputValue, setInputValue] = useState("");
  const [activeShortcut, setActiveShortcut] = useState(null); // 'exam', 'mock', 'summary'
  const [model, setModel] = useState("gemini-flash");
  
  // Dynamic prompt form input states
  const [topic, setTopic] = useState("");
  const [marks, setMarks] = useState("5");
  const [timeLimit, setTimeLimit] = useState("30");
  const [questions, setQuestions] = useState("10");
  const [chapter, setChapter] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      setUser(user);

      // Fetch student token balance from our Postgres ledger table
      const { data: profile } = await supabase
        .from("profiles")
        .select("token_balance")
        .eq("id", user.id)
        .single();
      
      if (profile) setTokens(profile.token_balance);
    };
    fetchUserData();
  }, []);

  // Listen to keystrokes to catch Notion-style shortcut command triggers
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.startsWith("/exam")) {
      setActiveShortcut("exam");
      setInputValue(value.replace("/exam", ""));
    } else if (value.startsWith("/mock")) {
      setActiveShortcut("mock");
      setInputValue(value.replace("/mock", ""));
    } else if (value.startsWith("/summary")) {
      setActiveShortcut("summary");
      setInputValue(value.replace("/summary", ""));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-white text-[#37352F] font-sans antialiased overflow-hidden">
      
      {/* Left Sidebar Frame */}
      <aside className="w-64 bg-[#FBFBFA] border-r border-[#EDEDEB] flex flex-col justify-between p-4 h-full">
        <div className="space-y-6">
          {/* User Badge Profile Summary */}
          <div className="flex items-center gap-3 px-2 py-1.5 hover:bg-[#F1F1EF] rounded-lg cursor-pointer transition-colors">
            <div className="h-7 w-7 bg-neutral-200 rounded-full flex items-center justify-center border border-[#EDEDEB]">
              <User className="h-4 w-4 text-neutral-600" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold truncate">{user?.email || "Student Account"}</p>
            </div>
          </div>

          {/* Token Balance Tracker Wallet Badge */}
          <div className="bg-white border border-[#EDEDEB] p-3.5 rounded-xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-medium tracking-wide uppercase">Credits Remaining</span>
              <Coins className="h-4 w-4 text-amber-500 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight">{tokens}</span>
              <span className="text-xs text-neutral-400">tokens</span>
            </div>
            <button className="w-full bg-[#37352F] text-white text-xs font-semibold py-2 rounded-lg hover:bg-black transition-colors shadow-sm">
              Buy Token Pack
            </button>
          </div>

          {/* Navigation Route Directory Logs */}
          <nav className="space-y-1 text-sm">
            <span className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2 mb-2">History Log</span>
            <div className="text-xs text-neutral-400 px-2 py-4 border border-dashed border-[#EDEDEB] rounded-lg text-center">
              Your generated study aids will appear here
            </div>
          </nav>
        </div>

        {/* Bottom Sidebar Action Items */}
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 px-2 py-2 text-xs font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out Workspace
        </button>
      </aside>

      {/* Main Study Canvas Arena */}
      <main className="flex-1 flex flex-col h-full bg-white relative">
        
        {/* Main Central Interactive Scroll Workspace Container */}
        <div className="flex-1 overflow-y-auto px-16 py-12 max-w-4xl w-full mx-auto flex flex-col justify-center items-center">
          
          {/* Default Empty State Splash Frame */}
          <div className="text-center space-y-4 max-w-md animate-fade-in">
            <div className="h-12 w-12 bg-[#FBFBFA] border border-[#EDEDEB] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="h-6 w-6 text-[#37352F]" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold tracking-tight">Let's craft precision study guides</h2>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Type your topic below, or initialize dynamic board-aligned engineering templates by invoking shortcut attributes.
              </p>
            </div>
            
            {/* Quick Action Guide Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button onClick={() => setActiveShortcut("exam")} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#EDEDEB] bg-[#FBFBFA] hover:bg-[#F1F1EF] rounded-lg text-xs font-medium transition-colors">
                <FileText className="h-3.5 w-3.5" /> Exam Question (/exam)
              </button>
              <button onClick={() => setActiveShortcut("mock")} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#EDEDEB] bg-[#FBFBFA] hover:bg-[#F1F1EF] rounded-lg text-xs font-medium transition-colors">
                <Compass className="h-3.5 w-3.5" /> Mock Test (/mock)
              </button>
              <button onClick={() => setActiveShortcut("summary")} className="flex items-center gap-1.5 px-3 py-1.5 border border-[#EDEDEB] bg-[#FBFBFA] hover:bg-[#F1F1EF] rounded-lg text-xs font-medium transition-colors">
                <BookOpen className="h-3.5 w-3.5" /> Revision Summary (/summary)
              </button>
            </div>
          </div>

        </div>

        {/* Fixed Core Interactive Dashboard Dock */}
        <div className="p-6 border-t border-[#EDEDEB] bg-white max-w-4xl w-full mx-auto">
          <div className="border border-[#EDEDEB] rounded-xl shadow-sm bg-[#FBFBFA] focus-within:border-neutral-400 focus-within:shadow-md transition-all p-2 space-y-2">
            
            {/* Contextual Dynamic Parameters Header Badge Injection Area */}
            {activeShortcut && (
              <div className="flex flex-wrap items-center gap-2 px-2 pt-1 border-b border-[#EDEDEB] pb-2 text-xs animate-slide-down">
                <span className="bg-[#37352F] text-white font-semibold px-2 py-0.5 rounded uppercase tracking-wider text-[10px]">
                  /{activeShortcut} active
                </span>
                
                {/* Condition 1: Exam Question Input Array */}
                {activeShortcut === "exam" && (
                  <>
                    <input 
                      type="text" 
                      placeholder="Topic (e.g., Oxidation)" 
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="bg-white border border-[#EDEDEB] rounded px-2 py-1 outline-none focus:border-neutral-400 w-40"
                    />
                    <select 
                      value={marks} 
                      onChange={(e) => setMarks(e.target.value)}
                      className="bg-white border border-[#EDEDEB] rounded px-1.5 py-1 outline-none focus:border-neutral-400 cursor-pointer"
                    >
                      <option value="1">1 Mark</option>
                      <option value="2">2 Marks</option>
                      <option value="3">3 Marks</option>
                      <option value="5">5 Marks</option>
                    </select>
                  </>
                )}

                {/* Condition 2: Mock Test Input Array */}
                {activeShortcut === "mock" && (
                  <>
                    <input 
                      type="number" 
                      placeholder="Time (mins)" 
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(e.target.value)}
                      className="bg-white border border-[#EDEDEB] rounded px-2 py-1 outline-none focus:border-neutral-400 w-24"
                    />
                    <input 
                      type="number" 
                      placeholder="Q Count" 
                      value={questions}
                      onChange={(e) => setQuestions(e.target.value)}
                      className="bg-white border border-[#EDEDEB] rounded px-2 py-1 outline-none focus:border-neutral-400 w-24"
                    />
                  </>
                )}

                {/* Condition 3: Revision Summary Input Array */}
                {activeShortcut === "summary" && (
                  <input 
                    type="text" 
                    placeholder="Chapter Title" 
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    className="bg-white border border-[#EDEDEB] rounded px-2 py-1 outline-none focus:border-neutral-400 w-56"
                  />
                )}

                {/* Clear Active Template Shortcut Switch Button */}
                <button 
                  onClick={() => setActiveShortcut(null)}
                  className="text-neutral-400 hover:text-black font-medium ml-auto px-1.5 py-0.5 rounded hover:bg-neutral-200 transition-colors"
                >
                  Clear Template
                </button>
              </div>
            )}

            {/* Core Universal Text Prompt Engine Row */}
            <div className="flex items-center gap-2">
              {/* Unified Cloud Engine Model Switcher Dropdown Menu */}
              <select 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-white border border-[#EDEDEB] rounded-lg px-2.5 py-2 text-xs font-semibold text-neutral-600 outline-none hover:bg-neutral-50 shadow-sm cursor-pointer transition-colors"
              >
                <option value="gemini-flash">Gemini Flash-Lite</option>
                <option value="gemini-pro">Gemini 2.5 Pro</option>
                <option value="gpt-4o">GPT-4o Mini</option>
                <option value="claude-sonnet">Claude Sonnet</option>
              </select>

              {/* Main Prompt Bar Text Field */}
              <input
                type="text"
                placeholder={activeShortcut ? "Provide extra contextual specifics or press enter..." : "Type your custom prompt here, or use /exam, /mock, /summary..."}
                value={inputValue}
                onChange={handleInputChange}
                className="flex-1 bg-transparent text-sm text-[#37352F] outline-none placeholder-neutral-400 px-1 py-2"
              />

              {/* Execution submission indicator badge */}
              <div className="p-1.5 bg-neutral-200 text-neutral-500 rounded-lg shadow-sm flex items-center justify-center cursor-pointer hover:bg-neutral-300 hover:text-black transition-all">
                <CornerDownLeft className="h-4 w-4" />
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}