import { FormEvent, useEffect, useState } from "react";
import { createItem, deleteItem, listItems, TodoItem, updateItem } from "./api";

export default function App() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadItems();
  }, []);

  async function loadItems() {
    try {
      setError(null);
      setLoading(true);
      setItems(await listItems());
    } catch {
      setError("Unable to load items from the backend.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;

    try {
      const created = await createItem(title.trim());
      setItems((current) => [created, ...current]);
      setTitle("");
    } catch {
      setError("Unable to create item.");
    }
  }

  async function toggleItem(item: TodoItem) {
    try {
      const updated = await updateItem(item.id, !item.completed);
      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === updated.id ? updated : currentItem,
        ),
      );
    } catch {
      setError("Unable to update item.");
    }
  }

  async function removeItem(id: number) {
    try {
      await deleteItem(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch {
      setError("Unable to delete item.");
    }
  }

  return (
    <main className="app-shell">
      <section className="card">
        <p className="eyebrow">Class project starter</p>
        <h1>React + FastAPI + SQLite</h1>
        <p className="description">
          Add items below to confirm the frontend is talking to the backend.
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <input
            aria-label="New item title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a new task"
          />
          <button type="submit">Add</button>
        </form>

        {error ? <p className="error">{error}</p> : null}

        <div className="list-wrap">
          {loading ? (
            <p>Loading…</p>
          ) : items.length === 0 ? (
            <p>No items yet.</p>
          ) : (
            <ul className="list">
              {items.map((item) => (
                <li key={item.id} className={item.completed ? "done" : ""}>
                  <button
                    type="button"
                    className="toggle"
                    onClick={() => void toggleItem(item)}
                  >
                    {item.completed ? "✓" : "○"}
                  </button>
                  <span>{item.title}</span>
                  <button
                    type="button"
                    className="delete"
                    onClick={() => void removeItem(item.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
