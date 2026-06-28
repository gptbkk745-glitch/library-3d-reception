import { useMemo, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  Text,
  Environment,
  ContactShadows,
  RoundedBox,
  Float,
  OrbitControls,
} from "@react-three/drei";
import "./App.css";

const API_URL = "https://nail-line-booking-bot.onrender.com/test-chat/library";

const SERVICES = {
  reception: {
    icon: "🎓",
    title: "Reception Help",
    short: "Services, hours, Wi-Fi, membership",
    type: "ask",
    prompt: "What services can the library receptionist help with?",
  },
  wifi: {
    icon: "📶",
    title: "Wi-Fi Access",
    short: "Ask about internet access",
    type: "ask",
    prompt: "Do you have wifi?",
  },
  study: {
    icon: "📚",
    title: "Book Study Room",
    short: "Interactive room booking",
    type: "booking",
    mode: "study_room",
  },
  computer: {
    icon: "💻",
    title: "Computer Slot",
    short: "Reserve computer use",
    type: "booking",
    mode: "computer",
  },
  line: {
    icon: "💬",
    title: "LINE Bot",
    short: "Continue on mobile",
    type: "ask",
    prompt: "How can I use the LINE bot?",
  },
};

const BOOKING_TYPES = {
  study_room: {
    title: "Study Room Booking",
    serviceLabel: "study room",
    prompt: "I want to book a study room",
    icon: "📚",
  },
  meeting_room: {
    title: "Meeting Room Booking",
    serviceLabel: "meeting room",
    prompt: "I want to book a meeting room",
    icon: "👥",
  },
  computer: {
    title: "Computer Use Slot",
    serviceLabel: "computer use slot",
    prompt: "I want to reserve a computer use slot",
    icon: "💻",
  },
  librarian: {
    title: "Librarian Help",
    serviceLabel: "librarian help appointment",
    prompt: "I want to book librarian help",
    icon: "🧑‍🏫",
  },
};

function makeWoodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#b98f58";
  ctx.fillRect(0, 0, 512, 512);

  for (let y = 0; y < 512; y += 42) {
    ctx.fillStyle = y % 84 === 0 ? "#d7b477" : "#b6844b";
    ctx.fillRect(0, y, 512, 38);

    ctx.strokeStyle = "rgba(70, 40, 15, 0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();

    for (let x = 0; x < 512; x += 92) {
      ctx.strokeStyle = "rgba(70, 40, 15, 0.18)";
      ctx.beginPath();
      ctx.moveTo(x + ((y / 42) % 2) * 46, y);
      ctx.lineTo(x + ((y / 42) % 2) * 46, y + 38);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeWallTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#e9e1d2";
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 1200; i++) {
    const shade = Math.floor(210 + Math.random() * 35);
    ctx.fillStyle = `rgba(${shade}, ${shade - 8}, ${shade - 20}, 0.12)`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeProfessionalQRTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 512, 512);

  function finder(x, y) {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x, y, 110, 110);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 18, y + 18, 74, 74);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + 36, y + 36, 38, 38);
  }

  finder(36, 36);
  finder(366, 36);
  finder(36, 366);

  const cells = [
    [5, 2], [6, 2], [8, 2], [2, 5], [9, 5], [11, 5],
    [4, 7], [7, 7], [10, 7], [13, 7], [3, 10], [6, 10],
    [8, 10], [12, 10], [14, 10], [5, 12], [9, 12], [11, 12],
    [13, 13], [6, 14], [8, 14], [10, 14], [12, 15],
    [14, 16], [4, 16], [7, 17], [10, 17], [13, 18],
    [15, 18], [9, 19], [11, 20], [6, 21], [14, 21]
  ];

  ctx.fillStyle = "#0f172a";
  for (const [cx, cy] of cells) {
    ctx.fillRect(36 + cx * 22, 36 + cy * 22, 18, 18);
  }

  ctx.fillStyle = "#06c755";
  ctx.beginPath();
  ctx.roundRect(188, 214, 136, 72, 22);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 34px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("LINE", 256, 250);

  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 502, 502);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function Floor() {
  const texture = useMemo(() => makeWoodTexture(), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
      <planeGeometry args={[18, 18]} />
      <meshStandardMaterial map={texture} roughness={0.72} metalness={0.02} />
    </mesh>
  );
}

function Walls() {
  const texture = useMemo(() => makeWallTexture(), []);
  return (
    <>
      <mesh position={[0, 1.8, -3.5]} receiveShadow>
        <boxGeometry args={[8.6, 3.6, 0.12]} />
        <meshStandardMaterial map={texture} roughness={0.9} />
      </mesh>

      <mesh position={[-4.3, 1.8, 0]} receiveShadow>
        <boxGeometry args={[0.12, 3.6, 7.2]} />
        <meshStandardMaterial color="#d8cdbb" roughness={0.92} />
      </mesh>

      <mesh position={[4.3, 1.8, 0]} receiveShadow>
        <boxGeometry args={[0.12, 3.6, 7.2]} />
        <meshStandardMaterial color="#d8cdbb" roughness={0.92} />
      </mesh>

      <mesh position={[0, 3.55, 0]} receiveShadow>
        <boxGeometry args={[8.6, 0.12, 7.2]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.96} />
      </mesh>
    </>
  );
}

function Bookshelf({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const bookColors = ["#1d4ed8", "#f97316", "#059669", "#7c3aed", "#dc2626"];

  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.5, 2.4, 1.9]} radius={0.035} castShadow receiveShadow>
        <meshStandardMaterial color="#5b341c" roughness={0.78} />
      </RoundedBox>

      {[0.45, 0.9, 1.35, 1.8].map((y) => (
        <mesh key={y} position={[0.27, y - 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.04, 0.05, 1.75]} />
          <meshStandardMaterial color="#2f1b0f" roughness={0.85} />
        </mesh>
      ))}

      {Array.from({ length: 28 }).map((_, i) => {
        const row = Math.floor(i / 7);
        const col = i % 7;
        return (
          <mesh
            key={i}
            position={[0.3, 0.36 + row * 0.48, -0.72 + col * 0.23]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.08, 0.32 + (i % 3) * 0.04, 0.14]} />
            <meshStandardMaterial color={bookColors[i % bookColors.length]} roughness={0.55} />
          </mesh>
        );
      })}
    </group>
  );
}

function ReceptionDesk({ onAsk }) {
  return (
    <group position={[0, 0, 0]}>
      <RoundedBox
        args={[3.25, 1.05, 1.0]}
        radius={0.06}
        position={[0, 0.55, 0]}
        castShadow
        receiveShadow
        onClick={() => onAsk("reception")}
      >
        <meshStandardMaterial color="#6f431f" roughness={0.62} metalness={0.03} />
      </RoundedBox>

      <RoundedBox
        args={[3.55, 0.14, 1.18]}
        radius={0.04}
        position={[0, 1.14, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#b97928" roughness={0.38} metalness={0.08} />
      </RoundedBox>

      <mesh position={[0, 0.72, 0.52]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.42, 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.15} />
      </mesh>

      <Text position={[0, 0.72, 0.55]} fontSize={0.14} color="#ffffff" anchorX="center">
        Chula Library AI
      </Text>
    </group>
  );
}

function Receptionist({ speech, thinking }) {
  const displayText = thinking
    ? "Checking the library system..."
    : speech.length > 110
    ? speech.slice(0, 110) + "..."
    : speech;

  return (
    <group position={[0, 1.2, -0.45]}>
      <Float speed={thinking ? 2.2 : 1.3} rotationIntensity={0.08} floatIntensity={thinking ? 0.18 : 0.08}>
        <mesh castShadow receiveShadow position={[0, 0.38, 0]}>
          <sphereGeometry args={[0.28, 48, 48]} />
          <meshStandardMaterial color="#f0c9a7" roughness={0.8} />
        </mesh>

        <mesh castShadow receiveShadow position={[0, -0.12, 0]}>
          <capsuleGeometry args={[0.23, 0.48, 10, 24]} />
          <meshStandardMaterial color={thinking ? "#f97316" : "#1d4ed8"} roughness={0.55} />
        </mesh>

        <mesh position={[-0.08, 0.42, 0.24]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color="#111827" />
        </mesh>

        <mesh position={[0.08, 0.42, 0.24]}>
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      </Float>

      <RoundedBox position={[0, 1.18, 0.02]} args={[2.8, 0.66, 0.04]} radius={0.025}>
        <meshStandardMaterial color={thinking ? "#fff7ed" : "#f8fafc"} roughness={0.96} />
      </RoundedBox>

      <Text
        position={[0, 1.19, 0.055]}
        fontSize={0.105}
        maxWidth={2.45}
        lineHeight={1.15}
        color="#111827"
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {displayText}
      </Text>
    </group>
  );
}

function ServiceBoard({ speech, thinking }) {
  const text = thinking
    ? "Processing request..."
    : speech.length > 90
    ? speech.slice(0, 90) + "..."
    : speech;

  return (
    <group position={[0, 2.32, -3.04]}>
      <RoundedBox args={[3.8, 1.25, 0.08]} radius={0.04} castShadow receiveShadow>
        <meshStandardMaterial color="#0f3b2f" roughness={0.78} />
      </RoundedBox>

      <Text position={[0, 0.38, 0.065]} fontSize={0.15} color="#ffffff" anchorX="center">
        AI Service Board
      </Text>

      <RoundedBox position={[0, -0.1, 0.06]} args={[3.15, 0.55, 0.02]} radius={0.025}>
        <meshStandardMaterial color={thinking ? "#fff7ed" : "#f8fafc"} roughness={0.98} />
      </RoundedBox>

      <Text
        position={[0, -0.1, 0.085]}
        fontSize={0.095}
        color="#111827"
        maxWidth={2.75}
        lineHeight={1.18}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
}

function StudyDoor({ onAsk }) {
  return (
    <group position={[3.05, 0.05, -2.35]} rotation={[0, -0.5, 0]}>
      <RoundedBox
        args={[1.25, 2.45, 0.08]}
        radius={0.025}
        castShadow
        receiveShadow
        onClick={() => onAsk("study")}
      >
        <meshStandardMaterial color="#1f2937" roughness={0.5} />
      </RoundedBox>

      <mesh position={[0, 0.2, 0.045]} castShadow receiveShadow>
        <boxGeometry args={[0.82, 1.5, 0.02]} />
        <meshPhysicalMaterial color="#93c5fd" transparent opacity={0.28} roughness={0.08} />
      </mesh>

      <Text position={[0, 1.52, 0.08]} fontSize={0.14} color="#ffffff" anchorX="center">
        Study Room
      </Text>
    </group>
  );
}

function ComputerArea({ onAsk }) {
  return (
    <group position={[-3.05, 0.08, -2.15]} rotation={[0, 0.42, 0]}>
      <RoundedBox
        args={[1.9, 0.16, 0.82]}
        radius={0.025}
        position={[0, 0.55, 0]}
        castShadow
        receiveShadow
        onClick={() => onAsk("computer")}
      >
        <meshStandardMaterial color="#64748b" roughness={0.58} />
      </RoundedBox>

      <mesh position={[-0.45, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.28, 0.035]} />
        <meshStandardMaterial color="#020617" roughness={0.5} />
      </mesh>

      <mesh position={[0.45, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.28, 0.035]} />
        <meshStandardMaterial color="#020617" roughness={0.5} />
      </mesh>

      <Text position={[0, 1.36, 0.06]} fontSize={0.13} color="#e2e8f0" anchorX="center">
        Computer Area
      </Text>
    </group>
  );
}

function LineQRBoard({ onAsk }) {
  const qrTexture = useMemo(() => makeProfessionalQRTexture(), []);

  return (
    <group position={[2.45, 1.25, 0.85]} rotation={[0, -0.45, 0]}>
      <RoundedBox
        args={[1.18, 1.5, 0.08]}
        radius={0.04}
        castShadow
        receiveShadow
        onClick={() => onAsk("line")}
      >
        <meshStandardMaterial color="#f8fafc" roughness={0.68} metalness={0.02} />
      </RoundedBox>

      <RoundedBox position={[0, 0.58, 0.055]} args={[0.95, 0.24, 0.025]} radius={0.025}>
        <meshStandardMaterial color="#06c755" roughness={0.38} />
      </RoundedBox>

      <Text position={[0, 0.585, 0.08]} fontSize={0.08} color="#ffffff" anchorX="center">
        LINE Assistant
      </Text>

      <mesh position={[0, -0.06, 0.065]} castShadow receiveShadow onClick={() => onAsk("line")}>
        <planeGeometry args={[0.72, 0.72]} />
        <meshBasicMaterial map={qrTexture} toneMapped={false} />
      </mesh>

      <Text position={[0, -0.62, 0.07]} fontSize={0.055} color="#334155" anchorX="center">
        Scan to continue on mobile
      </Text>
    </group>
  );
}

function AreaGlow({ activeService }) {
  const positions = {
    reception: [0, 0.035, 1.05],
    wifi: [0, 0.035, 1.05],
    study: [2.65, 0.035, -2.2],
    computer: [-2.8, 0.035, -2.0],
    line: [2.25, 0.035, 0.65],
  };

  return (
    <mesh position={positions[activeService]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.58, 0.72, 64]} />
      <meshStandardMaterial color="#22c55e" transparent opacity={0.55} />
    </mesh>
  );
}

function LibraryRoom({ speech, thinking, activeService, onAsk }) {
  return (
    <>
      <Environment preset="city" />
      <color attach="background" args={["#0f172a"]} />
      <ambientLight intensity={0.45} />

      <directionalLight
        position={[4, 7, 4]}
        intensity={1.65}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <spotLight position={[0, 5.4, 2]} angle={0.48} penumbra={0.7} intensity={2.0} castShadow />

      <OrbitControls
        makeDefault
        enableRotate
        enableZoom
        enablePan
        target={[0, 1.05, -0.45]}
        minDistance={2.3}
        maxDistance={9.5}
      />

      <Floor />
      <Walls />
      <AreaGlow activeService={activeService} />

      <Bookshelf position={[-3.35, 1.2, 0.2]} />
      <Bookshelf position={[3.35, 1.2, 0.2]} rotation={[0, 0.08, 0]} />

      <ReceptionDesk onAsk={onAsk} />
      <Receptionist speech={speech} thinking={thinking} />
      <ServiceBoard speech={speech} thinking={thinking} />
      <StudyDoor onAsk={onAsk} />
      <ComputerArea onAsk={onAsk} />
      <LineQRBoard onAsk={onAsk} />

      <ContactShadows position={[0, 0.01, 0]} opacity={0.45} scale={10} blur={2.5} far={5} />
    </>
  );
}

function Scene({ speech, thinking, activeService, onAsk }) {
  return (
    <Canvas shadows camera={{ position: [3.8, 2.4, 4.8], fov: 47 }} gl={{ antialias: true }}>
      <LibraryRoom
        speech={speech}
        thinking={thinking}
        activeService={activeService}
        onAsk={onAsk}
      />
    </Canvas>
  );
}

function BookingWizard({ open, onClose, onConfirm, loading, initialType }) {
  const [type, setType] = useState(initialType || "study_room");
  const [day, setDay] = useState("tomorrow");
  const [time, setTime] = useState("5 PM");

  if (!open) return null;

  const selected = BOOKING_TYPES[type];

  return (
    <div className="wizardOverlay">
      <div className="wizardWindow">
        <div className="wizardHeader">
          <div>
            <span>Smart Booking</span>
            <h2>{selected.title}</h2>
          </div>
          <button onClick={onClose}>×</button>
        </div>

        <div className="wizardBody">
          <div className="wizardSection">
            <label>Select Service</label>
            <div className="wizardGrid">
              {Object.entries(BOOKING_TYPES).map(([key, item]) => (
                <button
                  key={key}
                  className={type === key ? "active" : ""}
                  onClick={() => setType(key)}
                >
                  <span>{item.icon}</span>
                  <strong>{item.title}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="wizardSection">
            <label>Select Day</label>
            <div className="chipRow">
              {["today", "tomorrow", "next Monday"].map((d) => (
                <button key={d} className={day === d ? "active" : ""} onClick={() => setDay(d)}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="wizardSection">
            <label>Select Time</label>
            <div className="chipRow">
              {["10 AM", "2 PM", "4 PM", "5 PM", "6 PM"].map((t) => (
                <button key={t} className={time === t ? "active" : ""} onClick={() => setTime(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="bookingPreview">
            <span>Request Preview</span>
            <p>{selected.prompt} {day} at {time}</p>
          </div>

          <button
            className="confirmBooking"
            disabled={loading}
            onClick={() => onConfirm(`${selected.prompt} ${day} at ${time}`)}
          >
            {loading ? "Checking Calendar..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatPopup({ open, onClose, messages, input, setInput, sendMessage, loading }) {
  if (!open) return null;

  return (
    <div className="chatOverlay modalTopLayer">
      <div className="chatWindow">
        <div className="chatHeader">
          <div>
            <span>Ask More</span>
            <h2>Library AI Assistant</h2>
          </div>
          <button onClick={onClose}>×</button>
        </div>

        <div className="chatMessages">
          {messages.map((m, index) => (
            <div key={index} className={`chatBubble ${m.role}`}>
              {m.text}
            </div>
          ))}
          {loading && <div className="chatBubble bot">Thinking...</div>}
        </div>

        <div className="chatInput">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Ask anything about the library..."
          />
          <button onClick={() => sendMessage()} disabled={loading}>Send</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Welcome to Chula Library AI. Select a service card or ask more.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeService, setActiveService] = useState("reception");
  const [chatOpen, setChatOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardType, setWizardType] = useState("study_room");
  const [toast, setToast] = useState("Select a service card to interact with the AI receptionist.");

  const lastBotMessage =
    [...messages].reverse().find((m) => m.role === "bot")?.text ||
    "Welcome to Chula Library AI.";

  async function sendMessage(customText) {
    const text = (customText || input).trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);
    setToast("AI receptionist is processing your request...");
    setMessages((prev) => [...prev, { role: "user", text }]);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setToast(reply);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Connection error. Please try again.",
        },
      ]);
      setToast("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function runService(key) {
    setActiveService(key);

    if (SERVICES[key].type === "booking") {
      const mode = SERVICES[key].mode;
      setWizardType(mode);
      setWizardOpen(true);
      setToast(`Interactive ${SERVICES[key].title} wizard opened.`);
      return;
    }

    sendMessage(SERVICES[key].prompt);
  }

  async function confirmWizard(prompt) {
    await sendMessage(prompt);
    setWizardOpen(false);
  }

  return (
    <div className="app">
      <div className={`scene ${chatOpen || wizardOpen ? "chatMode" : ""}`}>
        <Scene
          speech={lastBotMessage}
          thinking={loading}
          activeService={activeService}
          onAsk={runService}
        />

        <div className="serviceCards">
          {Object.entries(SERVICES).map(([key, service]) => (
            <button
              key={key}
              className={activeService === key ? "active" : ""}
              onClick={() => runService(key)}
            >
              <span className="serviceIcon">{service.icon}</span>
              <span className="serviceText">
                <strong>{service.title}</strong>
                <small>{service.short}</small>
              </span>
            </button>
          ))}
        </div>

        <div className="smartToast">
          <span>AI Response</span>
          <p>{loading ? "Thinking..." : toast}</p>
        </div>

        <button className="askMoreFab" onClick={() => setChatOpen(true)} aria-label="Ask AI">
          <span className="askMoreFabIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path d="M4 5.5C4 4.12 5.12 3 6.5 3h11C18.88 3 20 4.12 20 5.5v7C20 13.88 18.88 15 17.5 15H9l-5 4v-4.8C2.8 13.8 2 12.67 2 11.4V5.5Z" fill="currentColor"/>
              <circle cx="8" cy="9" r="1" fill="#ffffff"/>
              <circle cx="12" cy="9" r="1" fill="#ffffff"/>
              <circle cx="16" cy="9" r="1" fill="#ffffff"/>
            </svg>
          </span>
          <span className="askMoreFabText">Ask AI</span>
        </button>

        <BookingWizard
          open={wizardOpen}
          onClose={() => setWizardOpen(false)}
          onConfirm={confirmWizard}
          loading={loading}
          initialType={wizardType}
        />

        <ChatPopup
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          messages={messages}
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;
