import React from "react";
import RulesAdmin from "./components/rulesadmin";
import LiveCounters from "./components/LiveCounters";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <Toaster position="top-center" />
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Advanced Rate Limiter — Admin</h1>
        <p className="text-sm text-gray-600 mt-1">Create rules, watch live counters, and demo traffic.</p>
      </header>

      <main className="grid grid-cols-1 gap-6">
        <RulesAdmin />
        <LiveCounters />
      </main>
    </div>
  );
}
