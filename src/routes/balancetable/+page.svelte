<script>
    import { Champs, calculateDamage } from "$lib/system";
</script>
<div class="container">
	<a href="/">Regresar</a><br>
	Tabla de balance de daño:<br>
	<div class="row">
		{#each Champs as source}
		<div class="col-4">
			<table class="table table-bordered table-striped">
			<thead><tr>
				<th>Origen</th>
				<th>Destino</th>
				<th>Dados</th>
				<th>Rango</th>
				<th>Prom</th>
			</tr></thead>
		
			<tbody>
			{#each Champs as target}
				{@const damage = calculateDamage(source, target)}
				<tr>
					<td>{source.name}</td>
					<td>{target.name}</td>
					<td class="text-end">{damage.rolls.length}d{damage.sides}</td>
					<td class="text-end">{damage.rolls.length}-{damage.max}</td>
					<td class="text-end">{(damage.rolls.length+damage.max)/2}</td>
				</tr>
			{/each}
			</tbody>
			</table>
			</div>
		{/each}
	</div>
</div>
