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
let onclose = () => {
	player = undefined
}
</script>

<h5>Etapa de administración de tablero y de batalla.</h5>

{#if player}
	{#snippet actions()}
		<button class="btn btn-warning" onclick={onfold}>
			Darse por vencido
		</button>
		<button class="btn btn-secondary" onclick={onclose}>
			Cerrar
		</button>
	{/snippet}
	<ManagePlayer {player} {actions} />
{:else}
	<div class="row">
		<div class="col-3">
			<table class="table table-bordered">
			<tbody>
			<tr>
				<td>Nombre</td>
				<td title="Unidades en el tablero">Unidades</td>
				<td>Acciones</td>
				<td></td>
			</tr>
			{#each players as p}
			<tr>
				<td>{p.name}</td>
				<td>{p.field.length}</td>
				<td>
					<button onclick={() => player = p} class="btn btn-{p.color} me-2">
						Administrar
					</button>
				</td>
				<td>
					{#if winner?.name == p.name}
						GANADOR
					{/if}
			</tr>
			{/each}
			<tr>
				<td colspan="2"></td>
				<td colspan="2">
					<button disabled={!(players[0].field.length==3 && players[1].field.length==3)} 
						onclick={() => doFight()} class="btn btn-secondary">
						Pelear
					</button>
				</td>
			</tr>
			</tbody>
			</table>
		</div>
	</div>
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

