import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import Wilder from './components/Wilder'
import AddWilder from './components/AddWilder'

import {
	IncomingWilder,
	IWilderData,
	IWilderToEdit,
} from './interfaces/interfaces'

export const refactorData = (data: IncomingWilder[]): IWilderData[] => {
	return data.map((wilder: IncomingWilder) => {
		const refactoredSkills = wilder.grades.map((grade) => {
			return {
				id: grade.skill.id,
				title: grade.skill.title,
				votes: grade.grade,
			}
		})
		return {
			id: wilder.id,
			name: wilder.name,
			city: wilder.city,
			description: wilder.description,
			grades: refactoredSkills,
		}
	})
}

const App = () => {
	const [wilders, setWilders] = useState<IWilderData[]>([])
	const [addNewWilder, setAddNewWilder] = useState(false)
	const [wilderToEdit, setWilderToEdit] = useState<IWilderToEdit>({
		isEditing: false,
		editName: '',
		editCity: '',
		editDescription: '',
		editGrades: [],
	})

	useEffect(() => {
		const fetchData = async () => {
			const { data } = await axios.get(
				'http://localhost:5000/api/wilders'
			)
			setWilders(refactorData(data))
		}
		fetchData()
	}, [])

	return (
		<div>
			<header>
				<div className='container'>
					<h1>Wilders Book</h1>
				</div>
			</header>
			<main className='container'>
				<div className='topActions'>
					<button
						onClick={() => {
							setWilderToEdit({
								isEditing: false,
								editName: '',
								editCity: '',
								editDescription: '',
								editGrades: [],
							})
							setAddNewWilder(!addNewWilder)
						}}
					>
						{addNewWilder
							? 'Hide form'
							: wilderToEdit.isEditing
							? 'Save Wilder'
							: 'Add new Wilder'}
					</button>
				</div>
				{addNewWilder && (
					<AddWilder
						isEditing={Object.hasOwn(wilderToEdit, 'editId')}
						setWilderToEdit={setWilderToEdit}
						setAddNewWilder={setAddNewWilder}
						wilders={wilders}
						setWilders={setWilders}
						editId={wilderToEdit.editId}
						editName={wilderToEdit.editName}
						editCity={wilderToEdit.editCity}
						editDescription={wilderToEdit.editDescription}
						editGrades={wilderToEdit.editGrades}
					/>
				)}
				<h2>Wilders</h2>
				<section className='card-row'>
					{wilders.map((wilder, index) => {
						return (
							<Wilder
								key={`wilder-${index}`}
								id={wilder.id}
								name={wilder.name}
								city={wilder.city}
								description={wilder.description}
								grades={wilder.grades}
								setAddNewWilder={setAddNewWilder}
								setWilderToEdit={setWilderToEdit}
								wilders={wilders}
								setWilders={setWilders}
							/>
						)
					})}
				</section>
			</main>
			<footer>
				<div className='container'>
					<p>&copy; 2022 Wild Code School</p>
				</div>
			</footer>
		</div>
	)
}

export default App
