<script lang="ts">
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
				<div class="card-header">Configuración de partida </div>
				<div class="card-body">
					<button onclick={onnewplayer} class="btn btn-sm btn-primary mb-2">New Player</button><br>
					{#each players as player}
					<div class="row row-cols-2">
						<div class="col">
							<input class="form-control" type="text" bind:value={player.name} />
						</div>
						<div class="col">
							<button onclick={() => {
								onselect(player)
							}} class="btn btn-sm me-2 btn-{player.color}">
								Empezar
							</button>
							<button onclick={() => onremoveplayer(player)} class="btn btn-sm btn-danger">Eliminar</button>
						</div>
					</div>
					{/each}
				</div>
			</div>
		</div>

		<p>
			<b>Instrucciones:</b><br>
			Puedes ponerle nombre a los jugadores y luego apretar el botón de empezar del jugador que comprará primero.
		</p>
</div>

