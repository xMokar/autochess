<script lang="ts">
import type { Player } from "$lib/system";

let {players, onselect}:{players:Player[], onselect:(player:Player)=>void} = $props()
</script>

<h5>Comprar cartas</h5>
<div class="row">
		<div class="col-12 col-md-6">
			<div class="card">
				<div class="card-header">Configuración de partida
				</div>
				<div class="card-body">
					{#each players as player}
						<input type="text" bind:value={player.name} />
						<button onclick={() => {
							onselect(player)
						}} class="btn btn-sm btn-success me-2">
							Empezar
						</button><br>
					{/each}
				</div>
			</div>
		</div>

		<p>
			<b>Instrucciones:</b><br>
			Puedes ponerle nombre a los jugadores y luego apretar el botón de empezar del jugador que comprará primero.
		</p>
</div>

