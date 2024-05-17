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
	{:else}
		{type}
	{/if}
{/snippet}
{#snippet info()}
	<div class="card">
		<div class="card-header">Rasgo activo</div>
		<div class="card-body">
			<ul>
			{#each trait.effects as effect}
				<li>
					<TraitIcon trait={effect.target} /> {@render type(effect.type)}: {effect.value>0? '+'+effect.value:effect.value}
				</li>
			{/each}
			</ul>
		</div>
	</div>
{/snippet}
<Modal bind:show={modal} body={info} />
<button class="btn btn-secondary btn-sm p-0" onclick={()=> modal=true}><span class="bi bi-info-circle-fill"></span></button>
{trait.trait.name}: {trait.active}/{trait.levels[trait.level].amount}
