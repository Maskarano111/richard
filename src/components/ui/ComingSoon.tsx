import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export function ComingSoon() {
  // Target date set to 60 days from now
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 60);
    return date.getTime();
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      // Formulate request to Web3Forms using the public key
      const formData = {
        access_key: "aa4d9385-631b-4ce0-834a-c5ce5d00b704",
        subject: "New Coming Soon Subscription on Richard's Portfolio",
        name: "Coming Soon Subscriber",
        email: email,
        message: `User subscribed to updates on the coming soon page with email: ${email}`
      };

      // Direct client-side fetch to Web3Forms API to avoid Cloudflare backend issues
      const resWeb3 = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(formData)
      });

      // Also log it locally to our backend
      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Coming Soon Subscriber",
            email: email,
            message: `User subscribed to updates from the coming soon page.`
          })
        });
      } catch (err) {
        console.warn("Backend log failed, but Web3Forms submit was initiated", err);
      }

      if (resWeb3.ok) {
        setStatus("success");
        setEmail("");
      } else {
        throw new Error("Web3Forms submission failed");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const timerItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-12 relative z-10 select-none">
      {/* Back button */}
      <a
        href="#/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors bg-white/5 border border-white/10 hover:border-white/20 px-4 py-2 rounded-full backdrop-blur-md"
      >
        <ArrowLeft size={14} />
        Back Home
      </a>

      <div className="w-full max-w-3xl text-center flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-medium text-brand-400 mb-6"
        >
          <Clock size={12} className="animate-pulse" />
          Under Construction
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white mb-6"
        >
          Something Big is <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-indigo-400 to-brand-500 animate-shimmer">
            Coming Soon
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed mb-12 font-light"
        >
          I am currently refactoring the backend system architecture, expanding project single pages, and upgrading the design.
        </motion.p>

        {/* Countdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl mb-12">
          {timerItems.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.08 }}
              className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-brand-500/20 transition-all duration-300 shadow-xl"
            >
              {/* Decorative faint background shape */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="text-4xl md:text-5xl font-bold font-display text-white tracking-tighter mb-2 tabular-nums">
                {String(item.value).padStart(2, "0")}
              </div>
              <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Subscribe Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 shadow-xl relative overflow-hidden"
        >
          {status === "success" ? (
            <div className="flex flex-col items-center text-center py-4">
              <CheckCircle2 size={40} className="text-emerald-500 mb-3" />
              <div className="text-sm font-semibold text-white">Subscription Successful!</div>
              <div className="text-xs text-gray-400 mt-1">You will receive an alert as soon as the updates land.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-left">
                <div className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Get Updates</div>
                <div className="text-[11px] text-gray-500">Subscribe to receive email alerts when the new modules release.</div>
              </div>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  disabled={status === "loading"}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500/50 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading" || !email}
                className="w-full py-3 bg-brand-500 text-white text-xs font-semibold rounded-xl hover:bg-brand-500/90 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {status === "loading" ? "Subscribing..." : "Notify Me"}
              </button>

              {status === "error" && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg text-left">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
