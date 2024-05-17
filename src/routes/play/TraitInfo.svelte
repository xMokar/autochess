<script lang="ts">
    import Modal from "$lib/Modal.svelte";
    import TraitIcon from "$lib/TraitIcon.svelte";

let { trait }: {
	trait: TraitRankActive
} = $props()

let modal = $state(false)
</script>
{#snippet type(type:string)}
	{#if type=="attack.modifier"}
		Daño
	{:else if type=="hp"}
		HP
	{:else}
		{type}
	{/if}
{/snippet}
{#snippet info()}
	<div class="card">
		<div class="card-header">Rasgo activo</div>
		<div class="card-body">
			{#each trait.effects as effect}
				<TraitIcon trait={effect.target} /> {@render type(effect.type)}: {effect.value>0? '+'+effect.value:effect.value}
				<br>
			{/each}
		</div>
	</div>
{/snippet}
{#if modal}
<Modal onclose={() => modal = false} body={info} />
{/if}
<button class="btn btn-secondary btn-sm p-0" onclick={()=> modal=true}><span class="bi bi-info-circle-fill"></span></button>
{trait.trait.name}: {trait.active}/{trait.levels[trait.level].amount}
