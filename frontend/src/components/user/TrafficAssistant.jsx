import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles, User, RefreshCw, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const TrafficAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "হ্যালো! আমি আপনার ট্রাফিক সহকারী এআই। ঢাকা শহরের রিয়েল-টাইম ট্রাফিক অবস্থা, দুর্ঘটনার এলার্ট এবং দ্রুততম রুট সম্পর্কে আমি তথ্য দিতে পারি। নিচে কিছু প্রশ্ন বা আপনার নিজস্ব প্রশ্ন লিখে জিজ্ঞেস করুন!",
      time: "এখন"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Suggestions that match the user request examples
  const suggestions = [
    { text: "Is there congestion near Mirpur?", label: "মিরপুরে কি জ্যাম আছে?" },
    { text: "What is the fastest route to Dhaka Airport?", label: "এয়ারপোর্টে যাওয়ার দ্রুততম রুট?" },
    { text: "Is there an accident on this road?", label: "রাস্তায় কি কোনো দুর্ঘটনা ঘটেছে?" },
    { text: "Which road has less traffic?", label: "কোন রাস্তায় জ্যাম কম?" }
  ];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // AI response mapping based on real-time simulated system data
  const getAIResponse = (query) => {
    const q = query.toLowerCase();

    // 1. Mirpur query
    if (q.includes("mirpur") || q.includes("মিরপুর")) {
      return "মিরপুর ১০ নম্বর গোল চত্বরে বর্তমানে মাঝারি থেকে তীব্র জ্যাম রয়েছে। তবে মিরপুর ১১ ও ১২ নম্বর সড়ক দিয়ে গাড়ি স্বাভাবিক গতিতে চলছে। যদি আপনি মিরপুর ১০ ক্রসিং ব্যবহার করতে চান, তবে সিগন্যাল লাইনে ১০-১৫ মিনিট অপেক্ষা করতে হতে পারে।";
    }

    // 2. Airport query
    if (q.includes("airport") || q.includes("dhaka airport") || q.includes("বিমানবন্দর") || q.includes("এয়ারপোর্ট")) {
      return "আজকের রিয়েল-টাইম ডাটা অনুযায়ী কুড়িল বিশ্বরোড হয়ে বিমানবন্দর সড়কে গাড়ি চলাচল সম্পূর্ণ স্বাভাবিক রয়েছে। বনানী ও মহাখালী লেনে কিছুটা গাড়ির চাপ আছে, তাই বিজয় সরণি-মহাখালী ফ্লাইওভার হয়ে ৩ নং সেক্টর রুটটি ব্যবহার করলে আপনি ২৫ মিনিটে ঢাকা বিমানবন্দরে পৌঁছাতে পারবেন।";
    }

    // 3. Accident query
    if (q.includes("accident") || q.includes("দুর্ঘটনা") || q.includes("collision")) {
      return "হ্যাঁ, মোহাম্মদপুর বাসস্ট্যান্ড মোড়ে একটি বাস দুর্ঘটনার খবর পাওয়া গিয়েছে। এছাড়া যাত্রাবাড়ী ক্রসিংয়ে একটি ভারী মালবাহী ট্রাক বিকল হয়ে সড়ক অবরুদ্ধ হয়ে আছে। এই দুটি এলাকা এড়িয়ে চলার পরামর্শ দেওয়া হচ্ছে।";
    }

    // 4. Less traffic query
    if (q.includes("less traffic") || q.includes("কম জ্যাম") || q.includes("কম ট্রাফিক") || q.includes("fastest") || q.includes("দ্রুত")) {
      return "বর্তমানে গুলশান-২ মোড় ও প্রগতি সরণিতে ট্রাফিক অত্যন্ত কম রয়েছে। এছাড়া কুড়িল ৩০০ ফিট রাস্তা সম্পূর্ণ যানজটমুক্ত। তবে ফার্মগেট ও যাত্রাবাড়ী রুটে এই মুহূর্তে অতিরিক্ত গাড়ির চাপ আছে।";
    }

    // 5. Why congested query
    if (q.includes("why") || q.includes("কারণ") || q.includes("কেন")) {
      return "আজকে ফার্মগেটে আনন্দ সিনেমা হলের সামনের সড়কে বিক্ষোভ সমাবেশ এবং মোহাম্মদপুরে সড়ক দুর্ঘটনার কারণে সংলগ্ন সড়কগুলোতে অতিরিক্ত গাড়ির চাপ ও জ্যাম তৈরি হয়েছে।";
    }

    // Default reply
    return "আমি আপনার প্রশ্নটি বুঝতে পেরেছি। আমাদের রিয়েল-টাইম ডাটাবেজ অনুযায়ী, ঢাকায় আজ মূল ট্রাফিক হটস্পটগুলো হলো যাত্রাবাড়ী (অবরুদ্ধ - বিকল ট্রাক) এবং মোহাম্মদপুর (দুর্ঘটনা)। আপনার গন্তব্য জানালে আমি আপনাকে যানজটমুক্ত বিকল্প রুটের ম্যাপ সাজেস্ট করতে পারি।";
  };

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    // User Message
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      setIsTyping(false);
      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: getAIResponse(textToSend),
        time: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full max-h-[600px]">
      
      {/* LEFT: Suggestions / Instructions panel (Span 4) */}
      <div className="lg:col-span-4 bg-slate-950/40 border border-slate-900 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-black text-cyan-400 mb-1 flex items-center gap-2">
            <Sparkles size={16} /> AI ট্রাফিক অ্যাসিস্ট্যান্ট
          </h3>
          <p className="text-[10px] text-slate-500 font-semibold mb-5 leading-relaxed">
            লাইভ ট্রাফিক ডাটাবেজ যুক্ত এআই চ্যাটবট। শহরের যেকোনো রুটের যানজট পরিস্থিতি সম্পর্কে বাংলায় বা ইংরেজিতে প্রশ্ন করুন।
          </p>

          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block mb-2 px-1">সহজ প্রশ্নাবলি</span>
          <div className="space-y-2">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug.text)}
                className="w-full flex items-center justify-between p-3 bg-slate-900/35 border border-slate-900 hover:border-slate-800 rounded-2xl text-left text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all cursor-pointer group"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-slate-500 font-mono italic">{sug.text}</span>
                  <span className="text-xs text-slate-300 font-bold">{sug.label}</span>
                </div>
                <ArrowRight size={12} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Status display */}
        <div className="mt-4 pt-4 border-t border-slate-900/60 flex items-center justify-between text-[10px] text-slate-500">
          <span>ইঞ্জিন: GPT-4o Traffic Mini</span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[9px] font-bold text-emerald-500">অনলাইন</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Chat Area Panel (Span 8) */}
      <div className="lg:col-span-8 bg-slate-950/40 border border-slate-900 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between h-[450px] lg:h-[500px]">
        
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isBot ? "self-start" : "self-end flex-row-reverse ml-auto"}`}
              >
                {/* Avatar */}
                <div className={`h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 ${
                  isBot 
                    ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" 
                    : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                }`}>
                  {isBot ? <Sparkles size={14} /> : <User size={14} />}
                </div>

                <div className="flex flex-col gap-1">
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isBot 
                      ? "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm" 
                      : "bg-blue-600 text-white rounded-tr-sm"
                  }`}>
                    {msg.text}
                  </div>
                  <span className={`text-[8px] text-slate-650 font-semibold font-mono ${isBot ? "text-left" : "text-right"}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[80%] self-start">
              <div className="h-8 w-8 rounded-xl border bg-cyan-500/10 border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Sparkles size={14} className="animate-spin" />
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex items-center gap-2 border-t border-slate-900 pt-3 mt-1"
        >
          <input
            type="text"
            placeholder="রাস্তা বা ট্রাফিক সম্পর্কিত প্রশ্ন এখানে লিখুন..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-850 focus:border-blue-500/50 rounded-2xl px-4 py-3.5 text-xs text-white outline-none transition-all placeholder:text-slate-650"
          />
          <button
            type="submit"
            className="h-[46px] w-[46px] rounded-2xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-lg shadow-blue-500/10"
          >
            <Send size={16} />
          </button>
        </form>

      </div>

    </div>
  );
};

export default TrafficAssistant;
