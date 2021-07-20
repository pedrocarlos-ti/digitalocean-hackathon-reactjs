import { useState, useEffect } from "react";

import "../styles/tasklist.scss";

import { FiTrash, FiCheckSquare } from "react-icons/fi";

interface Task {
  id: string;
  title: string;
  isComplete: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    fetch("https://digitalocean-hackathon-nodejs-thzwu.ondigitalocean.app/todo")
      .then((response) => response.json())
      .then((data) => setTasks(data.todo));
  }, []);

  function handleCreateNewTask() {
    // Crie uma nova task com um id random, não permita criar caso o título seja vazio.
    if (newTaskTitle === "") return;

    const task: Task = {
      id: String(Date.now()),
      title: newTaskTitle,
      isComplete: false,
    };

    fetch(
      "https://digitalocean-hackathon-nodejs-thzwu.ondigitalocean.app/todo",
      {
        method: "POST",
        headers: { "Content-type": "application/json;charset=UTF-8" },
        body: JSON.stringify(task),
      }
    ).then((_) => {
      setTasks((oldTaks) => [...oldTaks, task]);
      setNewTaskTitle("");
    });
  }

  function handleToggleTaskCompletion(id: string) {
    // Altere entre `true` ou `false` o campo `isComplete` de uma task com dado ID
    let _todo;
    const tasksList = tasks.map((task) => {
      if (task.id === id) {
        task.isComplete = !task.isComplete;
        _todo = task;
      }

      return task;
    });

    fetch(
      `https://digitalocean-hackathon-nodejs-thzwu.ondigitalocean.app/todo/${id}`,
      {
        method: "PUT",
        headers: { "Content-type": "application/json;charset=UTF-8" },
        body: JSON.stringify(_todo),
      }
    ).then((_) => {
      setTasks(tasksList);
    });
  }

  function handleRemoveTask(id: string) {
    // Remova uma task da listagem pelo ID
    const tasksList = tasks.filter((task) => task.id !== id);

    fetch(
      `https://digitalocean-hackathon-nodejs-thzwu.ondigitalocean.app/todo/${id}`,
      { method: "DELETE" }
    ).then(() => {
      setTasks(tasksList);
    });
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Adicionar novo todo"
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
          />
          <button
            type="submit"
            data-testid="add-task-button"
            onClick={handleCreateNewTask}
          >
            <FiCheckSquare size={16} color="#fff" />
          </button>
        </div>
      </header>

      <main>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <div
                className={task.isComplete ? "completed" : ""}
                data-testid="task"
              >
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button
                type="button"
                data-testid="remove-task-button"
                onClick={() => handleRemoveTask(task.id)}
              >
                <FiTrash size={16} />
              </button>
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
}
