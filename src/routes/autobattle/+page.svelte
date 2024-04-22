<script lang="ts">
import { ChampMap, type Field, type Player } from '$lib/system'
import Battle from './Battle.svelte';

let player1 = JSON.parse(localStorage.getItem('player1')??"null")??{ 
		id: 'player1',
		name: 'Argentina',
		mirrored: false,
		field: [
			{
				champ: ChampMap.tank,
				hp: 0,
				setx: 0,
				sety: 0,
				x: 0,
				y: 0,
			},
			{
				hp: 0,
				champ: ChampMap.archer,
				setx: 0,
				sety: 1,
				x: 0,
				y: 0,
			}
		],
	}

let player2 = JSON.parse(localStorage.getItem('player2')??"null")??{
		id: 'player2',
		name: 'Mexico',
		mirrored: true,
		field: [
			{
				champ: ChampMap.dryad,
				hp: 0,
				setx: 0,
				sety: 0,
				x: 0,
				y: 0,
			},
			{
				hp: 0,
				champ: ChampMap.firemage,
				setx: 0,
				sety: 1,
				x: 0,
				y: 0,
			}
		]
	}

function updateStats(player:Player) {
	for(let ci of player.field) {
		if(!ci.champ)
			return
		ci.champ = ChampMap[ci.champ.id]
	}
}
updateStats(player1)
updateStats(player2)

</script>
<div class="container mt-2">
	<a class="btn btn-primary" href="/">Guía del juego</a>
</div>
<Battle home={player1} visitor={player2} />
