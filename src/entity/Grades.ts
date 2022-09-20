const EntitySchema = require('typeorm').EntitySchema

module.exports = new EntitySchema({
	name: 'Grades',
	columns: {
		id: {
			primary: true,
			type: 'int',
			generated: true,
		},
		grade: {
			type: 'int',
		},
	},
	relations: {
		wilder: {
			type: 'many-to-one',
			target: 'Wilder',
			cascade: true,
			onDelete: 'CASCADE',
		},
		skill: {
			type: 'many-to-one',
			target: 'Skill',
		},
	},
})
