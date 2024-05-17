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
			traits: [],
			hand: [],
			board: [],
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
			traits: [],
			board: [ ]
		} as Player

	syncUserData(player1)
	syncUserData(player2)

	return [player1, player2]
}

export function syncUserData(player:Player) {
	// updateStats, this reloads the unit data from
	// the database to overwrite the cached version
	for(let bu of player.board) {
		if(!bu.unit)
			return
		bu.unit = UnitMap[bu.unit.id]
	}
	// updatePlayerBoard runs through the player
	// board to set each unit its player instance
	//for(let bu of player.board) {
	//	bu.player = untrack(() => player)
	//}
}

export function updatePlayer(player:Player) {
	localStorage.setItem(player.id, JSON.stringify(player))
}
