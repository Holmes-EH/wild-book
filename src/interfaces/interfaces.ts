import { Dispatch, SetStateAction } from 'react'

export interface ISkill {
	id?: number
	title: string
	votes: number
}

export interface IncomingGrades {
	id: number
	wilderId: number
	skillId: number
	grade: number
	skill: {
		id: number
		title: string
	}
}

export interface IncomingWilder {
	id: number
	name: string
	city: string
	description: string
	grades: IncomingGrades[]
}

export interface IWilderToEdit {
	isEditing: boolean
	setWilderToEdit: Dispatch<SetStateAction<any>>
	editId?: number
	editName: string
	editCity: string
	editDescription: string
	editGrades: ISkill[]
}

export interface IWilderData {
	id: number
	name: string
	city: string
	description: string
	grades: ISkill[]
}

export interface IWilderProps extends IWilderData {
	setAddNewWilder: Dispatch<SetStateAction<boolean>>
	setWilderToEdit: Dispatch<SetStateAction<any>>
}
