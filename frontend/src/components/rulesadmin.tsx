import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

type Rule = {
  _id?: string;
  identifier: string;
  capacity: number;
  refillRate: number;
};

export default function RulesAdmin() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [form, setForm] = useState<Rule>({ identifier: "", capacity: 10, refillRate: 1 });
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadRules() {
    try {
      const res = await axios.get<Rule[]>("/api/rules");
      setRules(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load rules");
    }
  }

  useEffect(() => {
    loadRules();
  }, []);

  async function createOrUpdate() {
    try {
      if (editingId) {
        await axios.put(`/api/rules/${editingId}`, form);
        toast.success("Rule updated");
      } else {
        await axios.post("/api/rules", form);
        toast.success("Rule created");
      }
      setForm({ identifier: "", capacity: 10, refillRate: 1 });
      setEditingId(null);
      loadRules();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Request failed");
    }
  }

  async function remove(id?: string) {
    if (!id) return;
    await axios.delete(`/api/rules/${id}`);
    toast.success("Rule deleted");
    loadRules();
  }

  function startEdit(r: Rule) {
    setEditingId(r._id || null);
    setForm({ identifier: r.identifier, capacity: r.capacity, refillRate: r.refillRate });
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="font-semibold mb-3">Rate Limit Rules</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="identifier (api-key:abc or ip:1.2.3.4 or route:/api/data)"
          value={form.identifier}
          onChange={(e) => setForm({ ...form, identifier: e.target.value })}
        />
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="capacity"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
        />
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="refillRate (tokens/sec)"
          value={form.refillRate}
          onChange={(e) => setForm({ ...form, refillRate: Number(e.target.value) })}
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={createOrUpdate}>
          {editingId ? "Update Rule" : "Create Rule"}
        </button>
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => {
            setForm({ identifier: "", capacity: 10, refillRate: 1 });
            setEditingId(null);
          }}
        >
          Reset
        </button>
      </div>

      <div>
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left">
              <th className="p-2">Identifier</th>
              <th className="p-2">Capacity</th>
              <th className="p-2">Refill/sec</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-2 font-mono">{r.identifier}</td>
                <td className="p-2">{r.capacity}</td>
                <td className="p-2">{r.refillRate}</td>
                <td className="p-2">
                  <button className="text-sm mr-2 text-blue-600" onClick={() => startEdit(r)}>
                    Edit
                  </button>
                  <button className="text-sm text-red-600" onClick={() => remove(r._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr>
                <td className="p-2 text-gray-500" colSpan={4}>
                  No rules yet — create one to control limits.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
