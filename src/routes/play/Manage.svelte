<script lang="ts">
import type { Player } from '$lib/system';
import Combat from './Combat.svelte';
import ManagePlayer from './ManagePlayer.svelte';

let {players,ondamage,onendcombat}:{
	players:Player[],
	ondamage:(player:Player, amount:number)=>void,
	onendcombat:()=>void,
} = $props()
let player:Player|undefined = $state(undefined)
let view = $state("main")

let doFight = () => {
	player = undefined
	view = "combat"
}
let onclose = () => {
	player = undefined
	view = "main"
}

let onmanage = (p:Player) => {
	player = p
	view = "manage"
}
</script>

<h5>Etapa de administración de tablero y de batalla.</h5>

{#if view == "main"}
	<div class="row">
		<div class="col-3">
			<table class="table table-bordered">
			<tbody>
			<tr>
				<td>Nombre</td>
				<td>HP</td>
				<td title="Unidades en el tablero">Unidades</td>
				<td>Acciones</td>
			</tr>
			{#each players as p}
			<tr>
				<td>{p.name}</td>
				<td>{p.hp}</td>
				<td>{p.field.length}</td>
				<td>
					<button onclick={() => onmanage(p)} class="btn btn-{p.color} me-2">
						Administrar
					</button>
				</td>
			</tr>
			{/each}
			<tr>
				<td colspan="3"></td>
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
{:else if view == "manage" && player}
	{#snippet actions()}
		<button class="btn btn-secondary" onclick={onclose}>
			Cerrar
		</button>
	{/snippet}
	<ManagePlayer {player} {actions} />
{:else if view == "combat"}
	<Combat {players} {ondamage} {onendcombat} />
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

