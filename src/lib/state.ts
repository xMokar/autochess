import { UnitMap, type Player } from "./system";

export function getPlayers() {
	let player1 = JSON.parse(localStorage.getItem('player1')??"null")??{ 
			id: 'player1',
			name: 'Azul',
			mirrored: false,
			color: 'primary',
			finished: false,
			maxgold: 5,
			gold: 5,
			rolls: 2,
			hand: [],
			field: [
				{
					unit: UnitMap.tank,
					hp: 0,
					setx: 0,
					sety: 0,
					x: 0,
					y: 0,
				},
				{
					hp: 0,
					unit: UnitMap.archer,
					setx: 0,
					sety: 1,
					x: 0,
					y: 0,
				}
			],
		} as Player

	let player2 = JSON.parse(localStorage.getItem('player2')??"null")??{
			id: 'player2',
			name: 'Rojo',
			mirrored: true,
			color: 'danger',
			finished: false,
			maxgold: 5,
			gold: 5,
			rolls: 2,
			hand: [],
			field: [
				{
					unit: UnitMap.druid,
					hp: 0,
					setx: 0,
					sety: 0,
					x: 0,
					y: 0,
				},
				{
					hp: 0,
					unit: UnitMap.firemage,
					setx: 0,
					sety: 1,
					x: 0,
					y: 0,
				}
			]
		} as Player

	let updateStats = (player:Player) => {
		for(let activeUnit of player.field) {
			if(!activeUnit.unit)
				return
			activeUnit.unit = UnitMap[activeUnit.unit.id]
		}
	}
	updateStats(player1)
	updateStats(player2)

	return [player1, player2]
}

export function updatePlayer(player:Player) {
	localStorage.setItem(player.id, JSON.stringify(player))
}
