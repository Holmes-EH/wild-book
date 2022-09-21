import { DataSource } from 'typeorm'
import { Skill } from './entity/Skill'
import { Wilder } from './entity/Wilder'
import { Grade } from './entity/Grade'

const AppDataSource = new DataSource({
	type: 'sqlite',
	database: './wildersdb.sqlite',
	synchronize: true,
	entities: [Wilder, Skill, Grade],
	logging: ['error'],
})

export default AppDataSource
