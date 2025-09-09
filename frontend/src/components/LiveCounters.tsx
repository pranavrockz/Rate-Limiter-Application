import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

type Counter = {
  key: string;
  remaining?: number;
  capacity?: number;
  timestamp?: string;
};

export default function LiveCounters() {
  const [counters, setCounters] = useState<Record<string, Counter>>({});

  useEffect(() => {
    // initial load
    axios
      .get("/api/counters")
      .then((res) => {
        const map: Record<string, Counter> = {};
        res.data.forEach((d: any) => (map[d.key] = { key: d.key, remaining: d.remaining, capacity: d.capacity }));
        setCounters(map);
      })
      .catch(() => {});

    const base = axios.defaults.baseURL?.replace(/\/$/, "") || "";
    const es = new EventSource(`${base}/api/counters/stream`);

    es.addEventListener("counter", (e: MessageEvent) => {
      const payload = JSON.parse(e.data);
      setCounters((prev) => ({
        ...prev,
        [payload.key]: { key: payload.key, remaining: payload.remaining, capacity: payload.capacity, timestamp: payload.timestamp },
      }));
    });

    es.addEventListener("rule", (e: MessageEvent) => {
      const payload = JSON.parse(e.data);
      toast.success(`Rule ${payload.action ?? "changed"}: ${payload.identifier ?? payload._id ?? ""}`);
    });

    es.onerror = (err) => {
      console.error("SSE error", err);
      es.close();
    };

    return () => es.close();
  }, []);

  const sendSpam = async (key: string) => {
    // simulate 5 rapid requests (non-blocking)
    for (let i = 0; i < 5; i++) {
      axios.get("/api/demo", { headers: { "x-api-key": key.includes(":") ? key.split(":")[1] : key } }).catch(() => {});
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="font-semibold mb-3">Live Counters</h2>
      <div className="space-y-2">
        <AnimatePresence>
          {Object.values(counters).length === 0 && <div className="text-sm text-gray-500">No counters yet</div>}
          {Object.values(counters).map((c) => {
            const pct = c.capacity ? (c.remaining ?? 0) / c.capacity : 0;
            const color =
              pct > 0.6 ? "bg-green-100 text-green-700" : pct > 0.3 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";
            return (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-between border p-3 rounded-lg bg-gray-50"
              >
                <div className="truncate max-w-xs font-mono text-sm">{c.key}</div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
                    {c.remaining ?? "-"} / {c.capacity ?? "-"}
                  </span>
                  <button
                    onClick={() => sendSpam(c.key)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Spam
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
