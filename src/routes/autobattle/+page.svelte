<script lang="ts">
import { ChampMap, type Field, type Player } from '$lib/system'
import Battle from './Battle.svelte';

let player1 = { 
		name: 'Argentina',
		mirrored: false,
		field: [
			{
				champ: ChampMap.tank,
				hp: 0,
				setx: 0,
				sety: 0
			},
			{
				hp: 0,
				champ: ChampMap.archer,
				setx: 0,
				sety: 1
			}
		],
	}

let player2 = {
		name: 'Mexico',
		mirrored: true,
		field: [
			{
				champ: ChampMap.fighter,
				hp: 0,
				setx: 0,
				sety: 0
			},
			{
				hp: 0,
				champ: ChampMap.mage,
				setx: 0,
				sety: 1
			}
		]
	}

</script>
<div class="container mt-2">
	<a class="btn btn-primary" href="/">Guía del juego</a>
</div>
<Battle home={player1} visitor={player2} />
