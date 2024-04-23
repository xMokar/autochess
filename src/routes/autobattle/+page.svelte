<script lang="ts">
import { UnitMap, type Field, type Player } from '$lib/system'
import Battle from './Battle.svelte';

let player1 = JSON.parse(localStorage.getItem('player1')??"null")??{ 
		id: 'player1',
		name: 'Azul',
		mirrored: false,
		color: 'primary',
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

function updateStats(player:Player) {
	for(let unitinstance of player.field) {
		if(!unitinstance.unit)
			return
		unitinstance.unit = UnitMap[unitinstance.unit.id]
	}
}
updateStats(player1)
updateStats(player2)

</script>
<Battle home={player1} visitor={player2} />
