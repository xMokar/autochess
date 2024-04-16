<script lang="ts">
import { ChampMap, type Player } from '$lib/system'
import ViewBattle from './ViewBattle.svelte';

let players:Player[] = [
	{ 
		name: 'player1',
		field: [
			{
				champ: ChampMap.Garen,
				hp: 0,
				x: 0,
				y: 0
			},
			{
				champ: ChampMap.Lux,
				hp: 0,
				x: 0,
				y: 2
			}
		],
	},
	{
		name: 'player2',
		field: [
			{
				champ: ChampMap.Udyr,
				hp: 0,
				x: 0,
				y: 0
			},
			{
				champ: ChampMap.Ashe,
				hp: 0,
				x: 2,
				y: 2
			}
		],
	}
]


</script>
<ViewBattle home={players[0]} visitor={players[1]} />
