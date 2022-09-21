import express, { Request, Response } from 'express'
import cors from 'cors'
import AppDataSource from './utils'
import wilderController from './controller/wilder'
import skillController from './controller/skill'
import gradeController from './controller/grade'

const app = express()
const port = 5000

app.use(express.json())
app.use(cors())

app.get('/api', (req: Request, res: Response) => {
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

app.use((req: Request, res: Response, next) => {
	res.status(404).send('Route does not exist...')
})

const start = async (): Promise<void> => {
	await AppDataSource.initialize()
	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`)
	})
}

void start()
