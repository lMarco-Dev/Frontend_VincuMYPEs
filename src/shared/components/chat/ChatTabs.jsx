import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Users, Building2 } from "lucide-react";

const TABS = [
  {
    id: "EQUIPO",
    label: "Equipo",
    icon: Users,
    desc: "Solo estudiantes",
  },
  {
    id: "PROYECTO",
    label: "Proyecto",
    icon: Building2,
    desc: "Equipo + MYPE",
  },
];

export function ChatTabs({ activeTab, onTabChange, chats }) {
  const chatEquipo = chats?.find((c) => c.tipo === "EQUIPO");
  const chatProyecto = chats?.find((c) => c.tipo === "PROYECTO");

  return (
    <div className="flex gap-2 p-2 bg-gray-100 rounded-xl">
      {TABS.map((tab) => {
        const chat = tab.id === "EQUIPO" ? chatEquipo : chatProyecto;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
            {chat?.mensajesNoLeidos > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {chat.mensajesNoLeidos}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}