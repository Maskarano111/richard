import { Section } from "./ui/Section";
import { motion } from "motion/react";
import { Mail, ArrowRight, Github, Linkedin, MapPin, Phone, MessageSquare } from "lucide-react";
import { useState, FormEvent } from "react";
import { Toast } from "./ui/Toast";

const socialLinks = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/Maskarano111",
    handle: "@Maskarano111",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/richard-abiola-masika-9b21b622a",
    handle: "Richard Abiola Masika",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:richardabiolamasika@gmail.com",
    handle: "richardabiolamasika@gmail.com",
  },
];


export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Honeypot bot prevention
    if (honeypot.trim()) {
      setSubmitSuccess(true);
      setShowToast(true);
      setName("");
      setEmail("");
      setMessage("");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) {
      setSubmitError("Please enter your name.");
      return;
    }
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setSubmitError("Please enter a valid email address.");
      return;
    }
    if (!message.trim()) {
      setSubmitError("Please enter a message.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Submit to backend — API key is securely stored server-side
      const contactResponse = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const resData = await contactResponse.json().catch(() => ({}));
      if (!contactResponse.ok) {
        console.error("Contact submission error:", resData);
        throw new Error(resData.error || "Failed to submit contact form.");
      }

      setSubmitSuccess(true);
      setShowToast(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      console.error("Form submit error:", err);
      setSubmitError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 sm:py-3 text-white text-base md:text-sm min-h-12 sm:min-h-auto " +
    "focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 " +
    "focus-visible:ring-2 focus-visible:ring-brand-500 " +
    "transition-all placeholder:text-gray-600 disabled:opacity-50";

  return (
    <Section id="contact" title="Get in Touch" subtitle="Contact">
      <Toast
        message="Message sent successfully!"
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gray-300 text-lg font-light mb-8 max-w-md">
            I'm currently open to new opportunities. Whether you have a question
            or just want to say hi, I'll try my best to get back to you!
          </p>

          {submitSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-center max-w-md backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                ✓
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Message Sent!</h4>
              <p className="text-gray-300 text-sm font-light mb-6">
                Thank you for reaching out. Richard will review your message and get back to you as soon as possible.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="px-6 py-2.5 bg-brand-500 hover:bg-brand-500/90 text-white text-sm font-medium rounded-full transition-all cursor-pointer"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {/* Spam Honeypot Field */}
              <div className="sr-only opacity-0 absolute pointer-events-none" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>
              {submitError && (
                <div className="p-4 rounded-lg bg-red-500/15 border border-red-500/20 text-red-400 text-sm font-light">
                  {submitError}
                </div>
              )}
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  required
                  disabled={isSubmitting}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  required
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-gray-400 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  disabled={isSubmitting}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${inputClass} resize-none`}
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 sm:py-4 bg-brand-500 hover:bg-brand-500/90 text-white font-medium rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] disabled:bg-gray-700 disabled:hover:shadow-none disabled:cursor-not-allowed cursor-pointer min-h-12 sm:min-h-auto text-base sm:text-base"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </form>
          )}
        </motion.div>

        {/* Right: Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col justify-center gap-6"
        >
          {/* Location & Phone */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
                <MapPin size={18} />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">
                  Location
                </div>
                <div className="text-white font-medium">
                  Koforidua, Eastern Region, Ghana
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
                <Phone size={18} />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">
                  Phone
                </div>
                <a
                  href="tel:+233541136756"
                  className="text-white font-medium hover:text-brand-500 transition-colors"
                >
                  +233 54 113 6756
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500">
                <MessageSquare size={18} />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">
                  WhatsApp
                </div>
                <a
                  href="https://wa.me/233592639157"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white font-medium hover:text-brand-500 transition-colors"
                >
                  +233 59 263 9157
                </a>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel={
                  link.href.startsWith("mailto")
                    ? undefined
                    : "noopener noreferrer"
                }
                aria-label={link.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-500/30 transition-all duration-300 group"
              >
                <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                  <link.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">
                    {link.label}
                  </div>
                  <div className="text-sm text-gray-300 truncate">
                    {link.handle}
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-600 group-hover:text-brand-500 group-hover:translate-x-1 transition-all duration-300"
                />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
