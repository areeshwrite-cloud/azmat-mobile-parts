import { MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.jsx';

export default function FloatingWhatsAppButton() {
  const { config } = useSettings();
  const number = (config.whatsapp || config.contact_phone || '').replace(/\D/g, '');
  const link = `https://wa.me/${number}?text=${encodeURIComponent('Salam! I have a question regarding Azmat Mobile Parts products.')}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      title="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-all hover:scale-105 hover:bg-emerald-700 hover:shadow-xl"
    >
      <MessageCircle size={26} />
    </a>
  );
}
