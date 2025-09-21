"use client";
import React, { useState } from "react";

// Suggested app name: "CoinBuy Planner"
// Main title: "My Coin Buy List"
// Tabs: "Planned Coins", "Bought Coins"

type CoinTask = {
  _id: string;
  name: string;
  value: string;
  deadline: string;
  bought: boolean;
  editing?: boolean;
};

const PRIMARY = "#3a185c"; // dark purple
const SECONDARY = "#7c3aed"; // soft purple
const TERTIARY = "#fbbf24"; // gold/yellow

export default function Home() {
  const [tasks, setTasks] = useState<CoinTask[]>([]);
  const [tab, setTab] = useState<"planned" | "bought">("planned");

  const [form, setForm] = useState<{
    name: string;
    value: string;
    deadline: string;
    bought: boolean;
  }>({ name: "", value: "", deadline: "", bought: false });

  const [anim, setAnim] = useState(false);

  // Fetch tasks from DB on mount
  React.useEffect(() => {
    fetch("/api/save")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTasks(data.data);
        }
      });
  }, []);

  const addTask = async () => {
    if (!form.name.trim() || !form.value.trim() || !form.deadline.trim())
      return;
    const res = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        value: form.value,
        deadline: form.deadline,
        bought: false,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setTasks((prev) => [...prev, data.data]);
      setForm({ name: "", value: "", deadline: "", bought: false });
      setAnim(true);
      setTimeout(() => setAnim(false), 400);
    } else {
      alert("Failed to save to database");
    }
  };

  const toggleTask = async (_id: string) => {
    const task = tasks.find((t) => t._id === _id);
    if (!task) return;
    const res = await fetch(`/api/save?_id=${_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bought: !task.bought }),
    });
    if (res.ok) {
      setTasks((tasks) =>
        tasks.map((t) => (t._id === _id ? { ...t, bought: !t.bought } : t))
      );
    }
  };

  const deleteTask = async (_id: string) => {
    const res = await fetch(`/api/save?_id=${_id}`, { method: "DELETE" });
    if (res.ok) {
      setTasks((tasks) => tasks.filter((task) => task._id !== _id));
    }
  };

  const startEdit = (_id: string) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task._id === _id
          ? { ...task, editing: true }
          : { ...task, editing: false }
      )
    );
  };

  const saveEdit = async (
    _id: string,
    newName: string,
    newValue: string,
    newDeadline: string
  ) => {
    const res = await fetch(`/api/save?_id=${_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        value: newValue,
        deadline: newDeadline,
      }),
    });
    if (res.ok) {
      setTasks((tasks) =>
        tasks.map((task) =>
          task._id === _id
            ? {
                ...task,
                name: newName,
                value: newValue,
                deadline: newDeadline,
                editing: false,
              }
            : task
        )
      );
    }
  };

  const planned = tasks.filter((t) => !t.bought);
  const bought = tasks.filter((t) => t.bought);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-10 px-4"
      style={{
        background: `linear-gradient(135deg, ${PRIMARY} 60%, ${SECONDARY} 100%)`,
      }}
    >
      <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-2xl p-8 relative animate-fade-in">
        <h1
          className="text-4xl font-extrabold mb-2 text-center"
          style={{ color: PRIMARY }}
        >
          CoinBuy Planner
        </h1>
        <p className="text-center text-lg mb-6 text-gray-700 font-medium">
          Plan your next crypto purchases
        </p>
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
              tab === "planned"
                ? "bg-[var(--primary)] text-white shadow-md"
                : "bg-gray-100 text-gray-700"
            }`}
            style={tab === "planned" ? { background: PRIMARY } : {}}
            onClick={() => setTab("planned")}
          >
            Planned Coins
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
              tab === "bought"
                ? "bg-[var(--secondary)] text-white shadow-md"
                : "bg-gray-100 text-gray-700"
            }`}
            style={tab === "bought" ? { background: SECONDARY } : {}}
            onClick={() => setTab("bought")}
          >
            Bought Coins
          </button>
        </div>
        {tab === "planned" && (
          <div
            className={`transition-all duration-300 ${
              anim ? "animate-bounce-in" : ""
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <input
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                type="text"
                placeholder="Coin name (e.g. BTC)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
                type="number"
                step="0.01"
                min="0"
                placeholder="Amount in USD (e.g. 50)"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
              <input
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--tertiary)]"
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
              <button
                className="bg-[var(--primary)] hover:bg-[var(--secondary)] text-white px-4 py-2 rounded transition font-bold"
                style={{ background: PRIMARY }}
                onClick={addTask}
              >
                Add
              </button>
            </div>
            <ul className="space-y-3">
              {planned.length === 0 && (
                <li className="text-gray-400 text-center">
                  No planned coins yet.
                </li>
              )}
              {planned.map((task) => (
                <li
                  key={task._id}
                  className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 transition hover:shadow-lg animate-fade-in"
                  style={{ borderLeft: `6px solid ${SECONDARY}` }}
                >
                  <input
                    type="checkbox"
                    checked={task.bought}
                    onChange={() => toggleTask(task._id)}
                    className="accent-[var(--primary)] w-5 h-5 transition"
                    style={{ accentColor: PRIMARY }}
                  />
                  {task.editing ? (
                    <>
                      <input
                        className="flex-1 border rounded px-2 py-1 mr-2"
                        type="text"
                        defaultValue={task.name}
                        autoFocus
                        onBlur={(e) =>
                          saveEdit(
                            task._id,
                            (e.target as HTMLInputElement).value,
                            task.value,
                            task.deadline
                          )
                        }
                      />
                      <input
                        className="w-24 border rounded px-2 py-1 mr-2"
                        type="text"
                        defaultValue={task.value}
                        onBlur={(e) =>
                          saveEdit(
                            task._id,
                            task.name,
                            (e.target as HTMLInputElement).value,
                            task.deadline
                          )
                        }
                      />
                      <input
                        className="w-36 border rounded px-2 py-1 mr-2"
                        type="date"
                        defaultValue={task.deadline}
                        onBlur={(e) =>
                          saveEdit(
                            task._id,
                            task.name,
                            task.value,
                            (e.target as HTMLInputElement).value
                          )
                        }
                      />
                    </>
                  ) : (
                    <>
                      <span
                        className="flex-1 font-semibold text-[var(--primary)]"
                        style={{ color: PRIMARY }}
                        onDoubleClick={() => startEdit(task._id)}
                      >
                        {task.name}
                      </span>
                      <span
                        className="w-24 text-center text-[var(--secondary)] font-medium"
                        style={{ color: SECONDARY }}
                      >
                        {task.value}
                      </span>
                      <span
                        className="w-36 text-center text-[var(--tertiary)] font-medium"
                        style={{ color: TERTIARY }}
                      >
                        {task.deadline
                          ? new Date(task.deadline).toLocaleDateString("en-GB")
                          : ""}
                      </span>
                    </>
                  )}
                  <button
                    className="text-xs text-[var(--secondary)] hover:underline px-1 font-bold"
                    style={{ color: TERTIARY }}
                    onClick={() => startEdit(task._id)}
                    disabled={task.editing}
                  >
                    Edit
                  </button>
                  <button
                    className="text-xs text-red-500 hover:underline px-1 font-bold"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {tab === "bought" && (
          <div className="transition-all duration-300 animate-fade-in">
            <ul className="space-y-3">
              {bought.length === 0 && (
                <li className="text-gray-400 text-center">
                  No bought coins yet.
                </li>
              )}
              {bought.map((task) => (
                <li
                  key={task._id}
                  className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 transition hover:shadow-lg animate-fade-in"
                  style={{ borderLeft: `6px solid ${TERTIARY}` }}
                >
                  <input
                    type="checkbox"
                    checked={task.bought}
                    onChange={() => toggleTask(task._id)}
                    className="accent-[var(--tertiary)] w-5 h-5 transition"
                    style={{ accentColor: TERTIARY }}
                  />
                  <span
                    className="flex-1 font-semibold text-[var(--primary)]"
                    style={{ color: PRIMARY }}
                  >
                    {task.name}
                  </span>
                  <span
                    className="w-24 text-center text-[var(--secondary)] font-medium"
                    style={{ color: SECONDARY }}
                  >
                    {task.value}
                  </span>
                  <span
                    className="w-36 text-center text-[var(--tertiary)] font-medium"
                    style={{ color: TERTIARY }}
                  >
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString("en-GB")
                      : ""}
                  </span>
                  <span className="ml-2 text-xs text-green-600 font-bold">
                    Bought
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <footer className="mt-8 text-xs text-white text-center opacity-80">
        &copy; {new Date().getFullYear()} Developed by{" "}
        <a
          href="https://portfolio-ten-woad-19.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[var(--tertiary)]"
          style={{ color: TERTIARY }}
        >
          Akili Group
        </a>
      </footer>
      <style>{`
        :root {
          --primary: ${PRIMARY};
          --secondary: ${SECONDARY};
          --tertiary: ${TERTIARY};
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in { animation: fade-in 0.5s cubic-bezier(.4,0,.2,1); }
        @keyframes bounce-in {
          0% { transform: scale(0.95); }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.4s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
}
