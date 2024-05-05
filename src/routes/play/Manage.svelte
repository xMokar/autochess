<script lang="ts">
    import { fight } from '$lib/combat';
    import type { Player } from '$lib/system';
    import ManagePlayer from './ManagePlayer.svelte';

let {players,onfold}:{players:Player[],onfold:()=>void} = $props()
let player:Player|undefined = $state(undefined)

let log:string[]=$state([])
let winner:Player|undefined=$state(undefined)
let doFight = () => {
	player = undefined
	let result = fight(players[0], players[1])
	log = result.log
	winner = result.winner
}
</script>

<h5>Ver la mano de cada jugador</h5>
{#each players as _player}
	<button onclick={() => player = _player} class="btn btn-{_player.color} me-2">
		Administrar {_player.name}
	</button>
{/each}
<button onclick={() => player = undefined} class="btn btn-outline-primary">Ocultar cartas</button>

<button onclick={() => doFight()} class="btn btn-secondary">
	Pelear
</button>
{#if winner}
	<b class="text-{winner.color}">{winner.name}</b> es el ganador!
{/if}

{#if player}
	{#snippet actions()}
		<button class="btn btn-outline-warning" onclick={onfold}>
			Retirarse
		</button>
	{/snippet}
	<ManagePlayer {player} {actions} />
{:else}
	<div>
	{#each log as msg}
	{@html msg}<br>
	{/each}
	</div>
{/if}

<p>
	<b>Instrucciones:</b><br>
	Ya llegamos a la etapa de preparación del tablero, aquí los jugadores se alternaran el dispositivo para ver y darle click en "Administrar"
	del jugador apropiado.<br>
	Selecciona una carta que quieras jugar y dale click en el boton de "Agarrar" y luego lo sueltas apretando el botón "Soltar" en la 
	rejilla de Tablero.
	Una vez que hayas acomodado tus tarjetas, puede darle click al boton "Ocultar cartas" para darle el dispositivo al otro jugador para
	que el acomode sus tarjetas.<br>
	<br>
	Cuando ambos jugadores tengan 4 unidades en el tablero y esten listos, pueden apretar el botón de "Pelear" para ejecutar una simulación automatica.<br>
	<br>
	Se recomienda jugar este juego con cartas y dados fisicos.

	
</p>

