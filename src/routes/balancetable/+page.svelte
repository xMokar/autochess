<script>
    import { Champs, calculateDamage } from "$lib/system";
    import ViewUnit from "../viewUnit.svelte";
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
	</div><!--row-->

		<div class="col-12">
		<h4>Unidades disponibles</h4>
		</div>

	<div class="row">
		{#each Champs as champ}
			<div class="col-3 mb-2">
				<div class="card">
					<div class="card-header">{champ.name}</div>
					<div class="card-body">
						<ViewUnit {champ} />
					</div>
				</div>
			</div>
		{/each}
		
		
		<div>
			<p>
				Hay algunas maneras de calcular el daño, por ejemplo 2d6 significa 2 dados con 6 caras
			</p>

			<p>
				Estatisticamente eso significa que si tiras dos 1s, el valor minimo es un 2. Y si tiras dos 6s, el valor maximo es 20.
			</p>

			<p>
				Para armar un partida, necesitas un deck de unidades, que son cartas o moneditas o simbolitos que representen a cada unidad. Las cartas deben estar distribuidas de forma pareja a menos que alguna unidad sea demasiado fuerte, pueden haber menos unidades de esta.<br>
				A parte, necesitas abrir esta pagina en algun dispositivo, para ver las instrucciones y las combinaciones<br>
			</p>

		</div>
	</div><!--row-->
</div>
