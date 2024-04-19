<script>
    import { Champs, calculateDamage } from "$lib/system";
    import ViewUnit from "../viewUnit.svelte";
</script>
<div class="container">
	<a href="/">Regresar</a><br>
	Tabla de balance de daño, puedes usar esto para saber cuantos dados tirar y de cuantas caras.<br>
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
			<h5>Cálculos matemáticos de dados.</h5>
			<p>
				Para calcular el daño tienes que tirar dados según la indicación, por ejemplo <b>2d6</b> significa 2 dados con 6 caras
			</p>

			<p>
				Estatisticamente eso significa que si tiras dos 1s, el valor minimo es un 2. Y si tiras dos 6s, el valor maximo es 12.
			</p>

			<h5>¿Qué hago si solo tengo dados de 6?</h5>
			<p>
				Si solo tienes dados de seis caras, lo que haras es tirar el dado hasta que salga un numero igual o menor al que buscas.<br>
				Por ejemplo, para <b>1d4</b>, si tiras 5 o 6, tienes que volver a tirar, y asi sucesivamente hasta que te salga algo del 1 al 4.<br>
			</p>

			<h5>¿Comó puedo armar una partida?</h5>
			<p>
				Para armar un partida, necesitas un deck de cartas de unidades,
				La carta puede tener el dibujo de cada unidad, no necesita tener la estadisticas fisicamente.

				Las cartas deben estar distribuidas de forma pareja a menos que alguna unidad sea demasiado fuerte, 
				pueden haber menos unidades de esta.<br>
				La distribución sugerida es 5 de cada unidad.<br>

				A parte, necesitas estas instrucciones impresas para tenerlas de referencia.
			</p>
			
			<h5>¿Cómo se juega?</h5>

			<p>Se revuelven las cartas, a un jugador se le dan 5 cartas en privado, puede escoger 3 de ellas y colocarlas boca abajo.</p>

			<p>Tiene la opcion de hacer un reroll pedir un cambio de cartas.</p>

			<p>Se repite el proceso con el otro jugador.</p>

			<p>Una vez que esten listos, pueden voltear sus cartas.</p>

			<p>Se tira una moneda para decidir quien tiene preferenica.</p>

			<p>Se determina el orden de ataque, las cartas que tengan mas velocidad (SPD) atacan primero, en caso de empate el que tenga preferencia ataca primero.</p>

			<p>La unidad mas rapida atacara contra los objetivos apropiados segun lo que dice la unidad en "Objetivos", se tira la cantidad de dados apropiados segun la tabla de unidades.</p>

			<p>En una hoja de papel, cada persona tendra por escrito el nombre de sus unidades con su vida (HP), aqui le haran reduciendo el numero segun los dados que vayan cayendo.</p>

			<p>Se continua el proceso con las siguientes unidades, empezando por las unidades mas rapidas y terminando con las mas lentas.</p>

			<p>Una vez que todos hayan atacado, termina la ronda, el jugador con mayor HP gana!</p>


		</div>
	</div><!--row-->
</div>
