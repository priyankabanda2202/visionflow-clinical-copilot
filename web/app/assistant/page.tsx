"use client";

import { useEffect, useRef, useState } from "react";
import UrgencyBadge from "@/components/UrgencyBadge";
import { fetchPatients, Patient, wsUrl } from "@/lib/api";

type Message = { role: "user" | "assistant"; content: string };

export default function AssistantPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPatients().then((data) => {
      setPatients(data);
      if (data.length) setSelected(data[0]);
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    setMessages([]);
    const ws = new WebSocket(wsUrl(selected.id));
    wsRef.current = ws;
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      if (data.content)
        setMessages((m) => [...m, { role: "assistant", content: data.content }]);
    };
    return () => ws.close();
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    if (!input.trim() || !wsRef.current) return;
    setMessages((m) => [...m, { role: "user", content: input }]);
    wsRef.current.send(JSON.stringify({ question: input }));
    setInput("");
  }

  return (
    <div className="animate-fade-up grid h-[calc(100vh-4rem)] grid-cols-[320px_1fr] gap-6">
      <div className="glass flex flex-col p-5">
        <h3 className="font-medium text-white">Active Case</h3>
        <select
          className="mt-3 rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-white"
          value={selected?.id ?? ""}
          onChange={(e) =>
            setSelected(patients.find((p) => p.id === Number(e.target.value)) || null)
          }
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {selected && (
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <p>Age: {selected.age}</p>
            <p>{selected.symptoms}</p>
            <UrgencyBadge urgency={selected.urgency} />
          </div>
        )}
        <p className="mt-auto text-xs text-slate-500">
          {connected ? "● Real-time connected" : "○ Connecting…"}
        </p>
      </div>

      <div className="glass flex flex-col overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold text-white">Clinical Assistant</h2>
          <p className="text-xs text-slate-500">WebSocket · live reasoning</p>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                m.role === "user"
                  ? "ml-auto bg-accent text-white"
                  : "bg-canvas text-slate-300 border border-border"
              }`}
            >
              {m.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="flex gap-2 border-t border-border p-4">
          <input
            className="flex-1 rounded-xl border border-border bg-canvas px-4 py-2 text-white outline-none focus:border-accent"
            placeholder="Ask about this case…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            onClick={send}
            className="rounded-xl bg-accent px-5 py-2 font-medium text-white hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
