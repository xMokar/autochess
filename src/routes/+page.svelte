<script lang="ts">
import { ChampMap, type Field, type Player } from '$lib/system'
import ViewBattle from './ViewBattle.svelte';

let player1 = { 
		name: 'Argentina',
		field: [
			{
				champ: ChampMap.tank,
				hp: 0,
				x: 0,
				y: 0
			},
			{
				hp: 0,
				champ: ChampMap.archer,
				x: 0,
				y: 1
			}
		],
	}

let player2 = {
		name: 'Mexico',
		field: [
			{
				champ: ChampMap.fighter,
				hp: 0,
				x: 0,
				y: 0
			},
			{
				hp: 0,
				champ: ChampMap.mage,
				x: 0,
				y: 1
			}
		]
	}

</script>
<ViewBattle home={player1} visitor={player2} />
