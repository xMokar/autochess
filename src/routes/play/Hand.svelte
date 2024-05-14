<script lang="ts">
    import UnitCard from "$lib/UnitCard.svelte";
    import type { Player, Unit } from "$lib/system";
    import type { Snippet } from "svelte";

let {player, onclick, onrelease, boardActions, takenUnit}:{
	player:Player, 
	boardActions:Snippet|undefined,
	onclick:(i:number)=>void,
	onrelease:()=>void,
	takenUnit:Unit|undefined,
	closeText:string
} = $props();

</script>
<div class="card mt-2" id="hand">
	<div class="card-header bg-{player.color} text-light">
		Viendo la mano de {player.name}
		{#if boardActions}
		<div class="float-end">
		{@render boardActions()}
		</div>
		{/if}
	</div>
	<div class="card-body">
		{#if player.hand.length==0}
			No tienes cartas en la mano.
		{/if}
		<div class="row">
			{#each player.hand as unit, index}
				<div class="col-3 mb-2 d-flex align-items-stretch">
					<UnitCard {unit} onclick={() => onclick(index)} actions={undefined} field={undefined} />
				</div>
			{/each}
			{#if takenUnit}
				<div class="col-3 mb-2 d-flex align-items-stretch">
					<div class="card w-100">
						<div class="card-header">Soltar</div>
						<div class="card-body">
							<button class="btn btn-primary w-100 h-100" onclick={onrelease}>Soltar {takenUnit.name} aquí</button>
						</div>
					</div>
				</div>

			{/if}
		</div>
	</div>
</div>

