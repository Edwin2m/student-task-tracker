import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState('all')

  const API_URL = 'https://student-task-tracker-2hhs.onrender.com/tasks'

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL)
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.post(API_URL, {
        title,
        description,
        due_date: dueDate,
      })

      setTitle('')
      setDescription('')
      setDueDate('')

      fetchTasks()
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      fetchTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const toggleComplete = async (task) => {
    try {
      await axios.put(`${API_URL}/${task.id}`, {
        ...task,
        completed: !task.completed,
      })

      fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  return (
    <div className="container">
      <h1>Student Task Tracker</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button type="submit">Add Task</button>
      </form>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All Tasks</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
      </select>

      <div className="tasks">
        {tasks
          .filter((task) => {
            if (filter === 'completed') return task.completed
            if (filter === 'incomplete') return !task.completed
            return true
          })
          .map((task) => (
            <div key={task.id} className="task-card">
              <h3>{task.title}</h3>

              <p>{task.description}</p>

              <p>
                <strong>Due:</strong> {task.due_date}
              </p>

              <p>
                <strong>Status:</strong>{' '}
                {task.completed ? 'Completed' : 'Incomplete'}
              </p>

              <button onClick={() => toggleComplete(task)}>
                Mark {task.completed ? 'Incomplete' : 'Complete'}
              </button>

              <button onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}

export default App