<script lang="ts">
import { CardMap, type Player } from '$lib/cards'
import ViewBattle from './ViewBattle.svelte';

let players:Player[] = [
	{ 
		name: 'player1',
		field: [
			{
				champ: CardMap.Garen,
				hp: 0,
				x: 0,
				y: 0
			},
			{
				champ: CardMap.Lux,
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
				champ: CardMap.Udyr,
				hp: 0,
				x: 0,
				y: 0
			},
			{
				champ: CardMap.Ashe,
				hp: 0,
				x: 1,
				y: 1
			},
			{
				champ: CardMap.Ashe,
				hp: 0,
				x: 2,
				y: 2
			}
		],
	}
]


</script>
<ViewBattle home={players[0]} visitor={players[1]} />
