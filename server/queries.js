const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
})

const getTasks = (req, res) => {
  pool.query('SELECT * FROM tasks ORDER BY id ASC', (error, results) => {
    if (error) {
      console.error(error)
      res.status(500).json({ error: 'Database error' })
      return
    }
    res.status(200).json(results.rows)
  })
}

const getTaskById = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('SELECT * FROM tasks WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.error(error)
      res.status(500).json({ error: 'Database error' })
      return
    }
    res.status(200).json(results.rows[0])
  })
}

const createTask = (req, res) => {
  const { title, description, due_date } = req.body

  pool.query(
    'INSERT INTO tasks (title, description, due_date) VALUES ($1, $2, $3) RETURNING *',
    [title, description, due_date],
    (error, results) => {
      if (error) {
        console.error(error)
        res.status(500).json({ error: 'Database error' })
        return
      }
      res.status(201).json(results.rows[0])
    }
  )
}

const updateTask = (req, res) => {
  const id = parseInt(req.params.id)
  const { title, description, due_date, completed } = req.body

  pool.query(
    'UPDATE tasks SET title = $1, description = $2, due_date = $3, completed = $4 WHERE id = $5 RETURNING *',
    [title, description, due_date, completed, id],
    (error, results) => {
      if (error) {
        console.error(error)
        res.status(500).json({ error: 'Database error' })
        return
      }
      res.status(200).json(results.rows[0])
    }
  )
}

const deleteTask = (req, res) => {
  const id = parseInt(req.params.id)

  pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id], (error, results) => {
    if (error) {
      console.error(error)
      res.status(500).json({ error: 'Database error' })
      return
    }
    res.status(200).json({ message: 'Task deleted', task: results.rows[0] })
  })
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
}