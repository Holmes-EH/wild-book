const EntitySchema = require('typeorm').EntitySchema

module.exports = new EntitySchema({
	name: 'Wilder',
	columns: {
		id: {
			primary: true,
			type: 'int',
			generated: true,
		},
		name: {
			type: 'text',
		},
		description: {
			type: 'text',
			nullable: true,
		},
		city: {
			type: 'text',
			nullable: true,
		},
	},

	relations: {
		grades: {
			target: 'Grades',
			type: 'one-to-many',
			inverseSide: 'wilder',
		},
	},
})
