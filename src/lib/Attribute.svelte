<script lang="ts">
let { value, bonus, boardUnit=undefined }:{
	value:number,
	bonus:string,
	boardUnit?:BoardUnit
} = $props()

let total_bonus = (boardUnit?.effects??[])
	.reduce((total, curr) => total+(curr.type==bonus? curr.value: 0), 0)
</script>
{#if total_bonus}
	<span class="text-success fw-bold">{value+total_bonus}</span>
{:else}
	{value}
{/if}
