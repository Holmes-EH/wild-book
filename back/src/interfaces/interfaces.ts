import { Request, Response } from 'express'

export interface IController {
	[key: string]: (arg0: Request, arg1: Response) => {}
}

export interface IGrade {
	id: number
	wilderId: number
	skillId: number
	grade: number
}

export interface IIncomingGrade {
	id: number
	title: string
	grade: number
}
export interface IIncomingWilder {
	id?: number
	name: string
	city: string
	description: string
	grades: IIncomingGrade[]
}
