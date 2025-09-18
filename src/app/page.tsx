"use client";
import { useState } from "react";

// Suggested app name: "CoinBuy Planner"
// Main title: "My Coin Buy List"
// Tabs: "Planned Coins", "Bought Coins"

type CoinTask = {
  id: number;
  coin: string;
  amount: number;
  deadline: string;
  completed: boolean;
  editing?: boolean;
};

const PRIMARY = "#3a185c"; // dark purple
const SECONDARY = "#7c3aed"; // soft purple
const TERTIARY = "#fbbf24"; // gold/yellow

export default function Home() {
  const [tasks, setTasks] = useState<CoinTask[]>([]);
  const [tab, setTab] = useState<"planned" | "bought">("planned");
  const [form, setForm] = useState<{
    coin: string;
    amount: string;
    deadline: string;
  }>({ coin: "", amount: "", deadline: "" });
  const [anim, setAnim] = useState(false);

  const addTask = () => {
    if (!form.coin.trim() || !form.amount.trim() || !form.deadline.trim())
      return;
    const amountNum = parseFloat(form.amount);
    if (isNaN(amountNum)) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        coin: form.coin.trim(),
        amount: amountNum,
        deadline: form.deadline,
        completed: false,
      },
    ]);
    setForm({ coin: "", amount: "", deadline: "" });
    setAnim(true);
    setTimeout(() => setAnim(false), 400);
  };

  const toggleTask = (id: number) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
  };

  const startEdit = (id: number) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id
          ? { ...task, editing: true }
          : { ...task, editing: false }
      )
    );
  };

  const saveEdit = (
    id: number,
    newCoin: string,
    newAmount: string,
    newDeadline: string
  ) => {
    const amountNum = parseFloat(newAmount);
    if (isNaN(amountNum)) return;
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              coin: newCoin,
              amount: amountNum,
              deadline: newDeadline,
              editing: false,
            }
          : task
      )
    );
  };

  const planned = tasks.filter((t) => !t.completed);
  const bought = tasks.filter((t) => t.completed);

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
                value={form.coin}
                onChange={(e) => setForm({ ...form, coin: e.target.value })}
              />
              <input
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
                type="number"
                step="0.01"
                min="0"
                placeholder="Amount in USD (e.g. 50)"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
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
                  key={task.id}
                  className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 transition hover:shadow-lg animate-fade-in"
                  style={{ borderLeft: `6px solid ${SECONDARY}` }}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="accent-[var(--primary)] w-5 h-5 transition"
                    style={{ accentColor: PRIMARY }}
                  />
                  {task.editing ? (
                    <>
                      <input
                        className="flex-1 border rounded px-2 py-1 mr-2"
                        type="text"
                        defaultValue={task.coin}
                        autoFocus
                        onBlur={(e) =>
                          saveEdit(
                            task.id,
                            e.target.value,
                            task.amount.toString(),
                            task.deadline
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveEdit(
                              task.id,
                              (e.target as HTMLInputElement).value,
                              task.amount.toString(),
                              task.deadline
                            );
                          }
                        }}
                      />
                      <input
                        className="w-24 border rounded px-2 py-1 mr-2"
                        type="text"
                        defaultValue={task.amount}
                        onBlur={(e) =>
                          saveEdit(
                            task.id,
                            task.coin,
                            e.target.value,
                            task.deadline
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveEdit(
                              task.id,
                              task.coin,
                              (e.target as HTMLInputElement).value,
                              task.deadline
                            );
                          }
                        }}
                      />
                      <input
                        className="w-36 border rounded px-2 py-1 mr-2"
                        type="date"
                        defaultValue={task.deadline}
                        onBlur={(e) =>
                          saveEdit(
                            task.id,
                            task.coin,
                            task.amount.toString(),
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveEdit(
                              task.id,
                              task.coin,
                              task.amount.toString(),
                              (e.target as HTMLInputElement).value
                            );
                          }
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <span
                        className="flex-1 font-semibold text-[var(--primary)]"
                        style={{ color: PRIMARY }}
                        onDoubleClick={() => startEdit(task.id)}
                      >
                        {task.coin}
                      </span>
                      <span
                        className="w-24 text-center text-[var(--secondary)] font-medium"
                        style={{ color: SECONDARY }}
                      >
                        {task.amount}
                      </span>
                      <span
                        className="w-36 text-center text-[var(--tertiary)] font-medium"
                        style={{ color: PRIMARY }}
                      >
                        {task.deadline}
                      </span>
                    </>
                  )}
                  <button
                    className="text-xs text-[var(--secondary)] hover:underline px-1 font-bold"
                    style={{ color: TERTIARY }}
                    onClick={() => startEdit(task.id)}
                    disabled={task.editing}
                  >
                    Edit
                  </button>
                  <button
                    className="text-xs text-red-500 hover:underline px-1 font-bold"
                    onClick={() => deleteTask(task.id)}
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
                  key={task.id}
                  className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 transition hover:shadow-lg animate-fade-in"
                  style={{ borderLeft: `6px solid ${TERTIARY}` }}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="accent-[var(--tertiary)] w-5 h-5 transition"
                    style={{ accentColor: TERTIARY }}
                  />
                  <span
                    className="flex-1 font-semibold text-[var(--primary)]"
                    style={{ color: PRIMARY }}
                  >
                    {task.coin}
                  </span>
                  <span
                    className="w-24 text-center text-[var(--secondary)] font-medium"
                    style={{ color: SECONDARY }}
                  >
                    {task.amount}
                  </span>
                  <span
                    className="w-36 text-center text-[var(--tertiary)] font-medium"
                    style={{ color: TERTIARY }}
                  >
                    {task.deadline}
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
