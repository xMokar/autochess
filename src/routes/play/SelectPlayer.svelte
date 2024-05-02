<script lang="ts">
    import type { Player } from "$lib/system";

let {players, onselect}:{players:Player[], onselect:(player:Player)=>void} = $props()
let activePlayers = players.filter(player => !player.finished)
</script>

<h5>Comprar cartas</h5>
<div class="row">
	{#each activePlayers as player}
		<div class="col-6">
			<div class="card">
				<div class="card-header">
					<input type="text" bind:value={player.name} />
				</div>
				<div class="card-body">
					<button onclick={() => {
						onselect(player)
					}} class="btn btn-success me-2">
						Iniciar turno de compra
					</button>
				</div>
			</div>
		</div>
	{/each}
</div>

