import {
  Mail,
  Phone,
  Globe,
  Send,
  Gift,
  Github,
  ArrowRight,
} from "lucide-react";

const contacts = [
  {
    label: "Email",
    icon: <Mail className="w-5 h-5" />,
    url: "mailto:onlysanka78@gmail.com",
  },
  {
    label: "CS Whatsapp",
    icon: <Phone className="w-5 h-5" />,
    url: "https://wa.me/6285838836448",
  },
  {
    label: "Tiktok",
    icon: <Globe className="w-5 h-5" />,
    url: "https://www.tiktok.com/@sandikaaa78",
  },
  {
    label: "Telegram",
    icon: <Send className="w-5 h-5" />,
    url: "https://t.me/OnlySankaaa",
  },
  {
    label: "Sosiabuzz",
    icon: <Gift className="w-5 h-5" />,
    url: "https://sociabuzz.com/sankanime/tribe",
  },
  {
    label: "GitHub",
    icon: <Github className="w-5 h-5" />,
    url: "https://github.com/SankaVollereii",
  },
];

const ContactCS = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-6 rounded-xl shadow-2xl bg-white/90 backdrop-blur-md border border-pink-300">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Contact CS
        </h1>
        <div className="space-y-4">
          {contacts.map(({ label, icon, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-pink-200 hover:bg-pink-300 text-black font-semibold py-3 px-4 rounded-xl shadow-md hover:scale-[1.03] transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                {icon}
                {label}
              </div>
              <ArrowRight className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactCS;
