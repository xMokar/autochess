<script lang="ts">
import type { Player } from "$lib/system";

let {players, onselect, onremoveplayer, onnewplayer}:{
	players:Player[], 
	onnewplayer:()=>void,
	onremoveplayer:(player:Player)=>void,
	onselect:(player:Player)=>void
} = $props()
</script>

<h5>Comprar cartas</h5>
<div class="row">
		<div class="col-12 col-md-6">
			<div class="card">
				<div class="card-header">Configuración de partida
				</div>
				<div class="card-body">
					<button onclick={onnewplayer} class="btn btn-sm btn-primary">New Player</button><br>
					{#each players as player}
						<button onclick={() => onremoveplayer(player)} class="btn btn-sm btn-danger">-</button>
						<input type="text" bind:value={player.name} />
						<span class="text-{player.color}">Color</span>
						<button onclick={() => {
							onselect(player)
						}} class="btn btn-sm btn-success me-2">
							Empezar
						</button>
						<br>
					{/each}
				</div>
			</div>
		</div>

		<p>
			<b>Instrucciones:</b><br>
			Puedes ponerle nombre a los jugadores y luego apretar el botón de empezar del jugador que comprará primero.
		</p>
</div>

