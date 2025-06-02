import { useState, useRef, useEffect } from "react";
import charbotImage from "../assets/NilaLogo.png"; // Asegúrate de tener esta imagen en la ruta correcta

function ChatAyuda() {
  const [mostrarChat, setMostrarChat] = useState(false);
  const chatRef = useRef(null);

  // Cierra el chat si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setMostrarChat(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleChat = () => {
    setMostrarChat(!mostrarChat);
  };

  return (
    <>
      {/* Botón flotante (imagen del chatbot) */}
      <img
        src={charbotImage}
        alt="Chatbot"
        onClick={toggleChat}
        style={{
          cursor: "pointer",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          zIndex: 1000,
          borderRadius: "50%"
        }}
      />

      {/* Ventana flotante con iframe del chat externo */}
      {mostrarChat && (
        <div
          ref={chatRef}
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "400px",
            height: "500px",
            border: "2px solid #ccc",
            borderRadius: "10px",
            backgroundColor: "#fff",
            zIndex: 1001,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
          }}
        >
          <iframe
            src="http://127.0.0.1:5500/nilachat/index.html"
            title="Chat Externo"
            width="100%"
            height="100%"
            style={{
              border: "none",
              borderRadius: "10px"
            }}
          />
        </div>
      )}
    </>
  );
}

export default ChatAyuda;
