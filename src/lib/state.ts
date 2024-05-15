import { UnitMap } from "./database";

export function getPlayers() {
	let player1 = JSON.parse(localStorage.getItem('player1')??"null")??{ 
			id: 'player1',
			name: 'Azul',
			hp: 3,
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
					energy: 0,
				},
				{
					hp: 0,
					unit: UnitMap.archer,
					setx: 0,
					sety: 1,
					x: 0,
					y: 0,
					energy: 0,
				}
			],
		} as Player

	let player2 = JSON.parse(localStorage.getItem('player2')??"null")??{
			id: 'player2',
			name: 'Rojo',
			hp: 3,
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
					energy: 0,
				},
				{
					hp: 0,
					unit: UnitMap.firemage,
					setx: 0,
					sety: 1,
					x: 0,
					y: 0,
					energy: 0,
				}
			]
		} as Player

	syncUserData(player1)
	syncUserData(player2)

	return [player1, player2]
}

export function syncUserData(player:Player) {
	// updateStats, this reloads the unit data from
	// the database to overwrite the cached version
	for(let au of player.field) {
		if(!au.unit)
			return
		au.unit = UnitMap[au.unit.id]
	}
	// updatePlayerField runs through the player
	// field to set each unit its player instance
	//for(let au of player.field) {
	//	au.player = untrack(() => player)
	//}
}

export function updatePlayer(player:Player) {
	localStorage.setItem(player.id, JSON.stringify(player))
}
