<script lang="ts">
import { ChampMap, type Field, type Player } from '$lib/system'
    import { writable } from 'svelte/store';
import ViewBattle from './ViewBattle.svelte';

let player1 = { 
		name: 'player1',
		field: [
			{
				champ: ChampMap.Garen,
				hp: 0,
				x: 0,
				y: 0
			},
			{
				hp: 0,
				champ: ChampMap.Ashe,
				x: 0,
				y: 2
			}
		],
	}

let player2 = {
		name: 'player2',
		field: [
			{
				champ: ChampMap.Udyr,
				hp: 0,
				x: 0,
				y: 0
			},
			{
				hp: 0,
				champ: ChampMap.Lux,
				x: 2,
				y: 2
			}
		]
	}

</script>
<ViewBattle home={player1} visitor={player2} />
