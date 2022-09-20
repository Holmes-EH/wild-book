const express = require('express')
const cors = require('cors')
const dataSource = require('./utils').dataSource
const wilderController = require('./controller/wilder')
const skillController = require('./controller/skill')
const gradeController = require('./controller/grade')

const app = express()
const port = 5000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
	res.send('Hello World!')
})

// Wilder routes
app.post('/api/wilders', wilderController.create)
app.get('/api/wilders', wilderController.findAll)
app.put('/api/wilders', wilderController.update)

app.post('/api/wilders/addSkill', gradeController.noteSkill)

app.delete('/api/wilders', wilderController.delete)

// Skill Routes
app.post('/api/skills', skillController.create)
app.get('/api/skills', skillController.findAll)
app.put('/api/skills', skillController.update)
app.delete('/api/skills', skillController.delete)

app.use((req, res, next) => {
	res.status(404).send('Route does not exist...')
})

const start = async () => {
	await dataSource.initialize()
	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`)
	})
}

start()
