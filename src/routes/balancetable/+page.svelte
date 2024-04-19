<script>
    import { Champs, calculateDamage } from "$lib/system";
</script>
<div class="container">
	<a href="/">Regresar</a><br>
	Tabla de balance de daño:<br>
	<div class="row">
		{#each Champs as source}
		<div class="col-4 mb-2 g-1">
			<div class="card">
				<div class="card-header">{source.name}</div>
				<div class="card-body p-0" >
					<table class="table table-bordered table-striped mb-0">
					<thead><tr>
						<th class="w-100">Contra</th>
						<th title="Objetivos">Objs</th>
						<th title="Dados">Dds</th>
						<th title="Rango de daño">Rng</th>
						<th title="Promedio de daño">Prm</th>
					</tr></thead>
				
					<tbody>
					{#each Champs as target}
						{@const damage = calculateDamage(source, target)}
						<tr>
							<td>{target.name}</td>
							<td>{source.targetting.targets}</td>
							<td class="text-end">{damage.rolls.length*source.targetting.targets}d{damage.sides}</td>
							<td class="text-end">{damage.rolls.length*source.targetting.targets}-{damage.max*source.targetting.targets}</td>
							<td class="text-end">{(damage.rolls.length*source.targetting.targets+damage.max*source.targetting.targets)/2}</td>
						</tr>
					{/each}
					</tbody>
					</table>
				</div>
			</div>
			</div>
		{/each}
	</div>
</div>
