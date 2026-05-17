const express = require('express')
const cors = require('cors')
const db = require('./queries')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Student Task Tracker API is running' })
})

app.get('/tasks', db.getTasks)
app.get('/tasks/:id', db.getTaskById)
app.post('/tasks', db.createTask)
app.put('/tasks/:id', db.updateTask)
app.delete('/tasks/:id', db.deleteTask)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})