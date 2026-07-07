"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Panel from "@/components/Panel";
import ClinicalText from "@/components/ClinicalText";
import UrgencyBadge from "@/components/UrgencyBadge";
import { askCopilot, fetchPatients, Patient } from "@/lib/api";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTED_PROMPTS = [
  "What is the most likely diagnosis and why?",
  "What workup would you prioritize first?",
  "What red flags should trigger immediate referral?",
  "How would you explain this case to the patient?",
];

function AssistantContent() {
  const searchParams = useSearchParams();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPatients()
      .then((data) => {
        setPatients(data);
        const idParam = searchParams.get("id");
        if (idParam) {
          const match = data.find((p) => p.id === Number(idParam));
          if (match) {
            setSelected(match);
            return;
          }
        }
        if (data.length) setSelected(data[0]);
      })
      .catch((e) => setError(e.message));
  }, [searchParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  async function send(question?: string) {
    const text = (question ?? input).trim();
    if (!text || !selected || thinking) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setThinking(true);
    try {
      const res = await askCopilot(selected.id, text);
      setMessages((m) => [...m, { role: "assistant", content: res.answer }]);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Unable to reach clinical engine: ${err.message}` },
      ]);
    } finally {
      setThinking(false);
    }
  }

  if (error && !patients.length) {
    return <div className="glass p-6 text-red-300">{error}</div>;
  }

  if (!patients.length) {
    return <div className="glass p-6 text-amber-300">No active cases for consultation.</div>;
  }

  return (
    <div className="animate-fade-up grid h-[calc(100vh-14rem)] grid-cols-[340px_1fr] gap-6">
      <div className="glass flex flex-col p-5">
        <h3 className="font-medium text-white">Active Case</h3>
        <select
          className="mt-3 rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-white"
          value={selected?.id ?? ""}
          onChange={(e) => {
            setSelected(patients.find((p) => p.id === Number(e.target.value)) || null);
            setMessages([]);
          }}
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.urgency}
            </option>
          ))}
        </select>
        {selected && (
          <div className="mt-4 space-y-3">
            <Panel title="Case Context">
              <p>Age: {selected.age}</p>
              <p className="mt-2">Presentation: {selected.symptoms}</p>
            </Panel>
            <UrgencyBadge urgency={selected.urgency} />
          </div>
        )}
      </div>

      <div className="glass flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-semibold text-white">Clinical Assistant</h2>
            <p className="text-xs text-[#6b8cb8]">
              Grounded Q&A — cite case facts only; verify before clinical use
            </p>
          </div>
          <button
            onClick={() => setMessages([])}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-slate-400 hover:text-white"
          >
            Clear session
          </button>
        </div>
        <div className="flex flex-wrap gap-2 border-b border-border px-5 py-3">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => send(prompt)}
              disabled={thinking}
              className="rounded-full border border-border px-3 py-1 text-[11px] text-slate-400 hover:text-white disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <p className="text-sm text-[#6b8cb8]">
              Select a suggested prompt or ask a case-specific question.
            </p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "chat-user" : "chat-assistant"}>
              {m.role === "assistant" ? (
                <ClinicalText text={m.content} />
              ) : (
                <span>{m.content}</span>
              )}
            </div>
          ))}
          {thinking && (
            <div className="chat-assistant">
              <span className="text-[#6b8cb8]">Clinical reasoning…</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="flex gap-2 border-t border-border p-4">
          <input
            className="flex-1 rounded-lg border border-border bg-canvas px-4 py-2 text-white outline-none focus:border-accent"
            placeholder="Ask about this case…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={thinking}
          />
          <button
            onClick={() => send()}
            disabled={thinking || !input.trim()}
            className="rounded-lg bg-gradient-to-r from-[#1e4a6f] to-accent px-5 py-2 font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense fallback={<div className="glass p-6 text-slate-400">Loading assistant…</div>}>
      <AssistantContent />
    </Suspense>
  );
}
