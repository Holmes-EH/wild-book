const DataSource = require('typeorm').DataSource

module.exports = {
	dataSource: new DataSource({
		type: 'sqlite',
		database: './wildersdb.sqlite',
		synchronize: true,
		entities: [
			require('./entity/Wilder'),
			require('./entity/Skill'),
			require('./entity/Grades'),
		],
		logging: ['error'],
	}),
}
