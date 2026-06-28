import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import "./App.css";

const API_URL = "https://nail-line-booking-bot.onrender.com/test-chat/library";

function Bookshelf({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[0.4, 2.8, 2.2]} />
        <meshStandardMaterial color="#7c4a2d" />
      </mesh>

      {[-0.75, -0.25, 0.25, 0.75].map((y, row) =>
        [-0.65, -0.25, 0.15, 0.55].map((z, i) => (
          <mesh key={`${row}-${i}`} position={[0.25, 1.4 + y, z]}>
            <boxGeometry args={[0.09, 0.42, 0.22]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#2563eb" : "#f97316"} />
          </mesh>
        ))
      )}
    </group>
  );
}

function ReceptionDesk() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[3.4, 1.1, 1]} />
        <meshStandardMaterial color="#8b5e34" />
      </mesh>

      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[3.7, 0.15, 1.2]} />
        <meshStandardMaterial color="#b7791f" />
      </mesh>

      <Text
        position={[0, 1.4, 0.55]}
        rotation={[-0.25, 0, 0]}
        fontSize={0.18}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Chula Library AI Reception
      </Text>
    </group>
  );
}

function Receptionist({ speech }) {
  const shortSpeech = speech.length > 120 ? speech.slice(0, 120) + "..." : speech;

  return (
    <group position={[0, 1.25, -0.55]}>
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#f2c6a0" />
      </mesh>

      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.32, 0.45, 0.85, 32]} />
        <meshStandardMaterial color="#1d4ed8" />
      </mesh>

      <mesh position={[-0.12, 0.5, 0.32]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      <mesh position={[0.12, 0.5, 0.32]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      <mesh position={[0, 1.23, 0.05]}>
        <boxGeometry args={[2.8, 0.8, 0.05]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <Text
        position={[0, 1.24, 0.09]}
        fontSize={0.12}
        maxWidth={2.55}
        color="#111827"
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {shortSpeech}
      </Text>
    </group>
  );
}

function StudyRoomDoor() {
  return (
    <group position={[3.1, 0, -2.7]} rotation={[0, -0.75, 0]}>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[1.25, 2.4, 0.12]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      <Text position={[0, 2.65, 0.08]} fontSize={0.16} color="#ffffff" anchorX="center">
        Study Room
      </Text>
    </group>
  );
}

function ComputerArea() {
  return (
    <group position={[-3.1, 0, -2.4]} rotation={[0, 0.65, 0]}>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.8, 0.2, 0.85]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      <mesh position={[-0.45, 1.0, 0]}>
        <boxGeometry args={[0.5, 0.35, 0.05]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      <mesh position={[0.45, 1.0, 0]}>
        <boxGeometry args={[0.5, 0.35, 0.05]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      <Text position={[0, 1.45, 0.05]} fontSize={0.15} color="#ffffff" anchorX="center">
        Computer Area
      </Text>
    </group>
  );
}

function Board() {
  return (
    <group position={[0, 2.25, -3.06]}>
      <mesh>
        <boxGeometry args={[3.6, 1.35, 0.08]} />
        <meshStandardMaterial color="#022c22" />
      </mesh>

      <Text position={[0, 0.42, 0.08]} fontSize={0.17} color="#ffffff" anchorX="center">
        Live Library Services
      </Text>

      <Text position={[-1.5, 0.08, 0.08]} fontSize={0.12} color="#bbf7d0" anchorX="left">
        Study Room: Ask AI
      </Text>

      <Text position={[-1.5, -0.18, 0.08]} fontSize={0.12} color="#bbf7d0" anchorX="left">
        Meeting Room: Ask AI
      </Text>

      <Text position={[-1.5, -0.44, 0.08]} fontSize={0.12} color="#bbf7d0" anchorX="left">
        Wi-Fi / Membership / Printing
      </Text>
    </group>
  );
}

function LibraryScene({ speech }) {
  return (
    <Canvas camera={{ position: [5.2, 3.8, 6.2], fov: 48 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 7, 5]} intensity={1.3} />

      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[8, 0.08, 7]} />
        <meshStandardMaterial color="#d6b98c" />
      </mesh>

      <mesh position={[0, 1.75, -3.35]}>
        <boxGeometry args={[8, 3.5, 0.12]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>

      <Bookshelf position={[-3.6, 0, 0.2]} />
      <Bookshelf position={[3.6, 0, 0.2]} />
      <ReceptionDesk />
      <Receptionist speech={speech} />
      <StudyRoomDoor />
      <ComputerArea />
      <Board />

      <Text
        position={[0, 3.35, -3.18]}
        fontSize={0.28}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        3D AI Library Reception
      </Text>

      <OrbitControls enablePan={false} minDistance={4} maxDistance={10} />
    </Canvas>
  );
}

function App() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Welcome to Chula Library AI. Ask about Wi-Fi, opening hours, membership, or book a study room.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const lastBotMessage =
    [...messages].reverse().find((m) => m.role === "bot")?.text ||
    "Welcome to Chula Library AI.";

  async function sendMessage(customText) {
    const text = (customText || input).trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text }]);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      const reply =
        data.reply ||
        data.response ||
        data.message ||
        data.answer ||
        JSON.stringify(data, null, 2);

      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Connection error. Backend may be sleeping or CORS is not ready.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <div className="scene">
        <LibraryScene speech={lastBotMessage} />
      </div>

      <div className="panel">
        <div className="panelHeader">
          <div>
            <h1>Chula Library AI</h1>
            <p>3D virtual reception connected with LINE booking backend</p>
          </div>
          <div className="status">LIVE</div>
        </div>

        <div className="quickButtons">
          <button onClick={() => sendMessage("Do you have wifi?")}>Wi-Fi</button>
          <button onClick={() => sendMessage("What are your opening hours?")}>Hours</button>
          <button onClick={() => sendMessage("I want to book a study room tomorrow at 4 PM")}>
            Book Room
          </button>
        </div>

        <div className="messages">
          {messages.map((m, index) => (
            <div key={index} className={`message ${m.role}`}>
              {m.text}
            </div>
          ))}
          {loading && <div className="message bot">Thinking...</div>}
        </div>

        <div className="inputRow">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Ask or book: I want to book a study room tomorrow at 4 PM"
          />
          <button onClick={() => sendMessage()} disabled={loading}>
            Send
          </button>
        </div>

        <div className="demoNote">
          Same backend as LINE bot → Gemini → Google Calendar
        </div>
      </div>
    </div>
  );
}

export default App;
