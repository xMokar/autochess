<script lang="ts">
import type { Unit } from "$lib/system";

let { onclick, unit }:{
	unit:Unit,
	onclick:()=>void
}= $props()
</script>
<div class="card w-100">
	<div class="card-header">&nbsp;</div>
	<div class="card-body">
		<button {onclick} class="btn btn-sm btn-primary h-100 w-100">Soltar {unit.name} aquí</button>
	</div>
</div>
