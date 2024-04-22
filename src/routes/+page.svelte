<script lang="ts">
    import { Champs, calculateDamage } from "$lib/system";
    import ElementIcon from "$lib/ElementIcon.svelte";
    import Unit from "$lib/Unit.svelte";
	let sides = [1,2,3,4,5,6]
	function table(face:number) {
		return sides.map(x => Math.ceil(x/(6/face)))
	}
</script>
<div class="container mt-2">
	<a class="btn btn-success" href="/autobattle">AutoBattle</a><br>
	<h4>Tablas de balance</h4>
	<div class="row">
		{#each Champs as source}
		<div class="col-12 col-lg-6 mb-2 g-1">
			<div class="card">
				<div class="card-header"><ElementIcon element={source.element} /> {source.name}</div>
				<div class="card-body p-0" >
					<table class="table table-bordered table-striped mb-0">
					<thead><tr>
						<th class="w-100">Contra</th>
						<th title="Rango de daño">Rango</th>
						<th title="Promedio de daño">Prm</th>
						<th title="HP de esta unidad">HP</th>
						<th title="Rango de portentage de daño">Rango%HP</th>
					</tr></thead>
				
					<tbody>
					{#each Champs as target}
						{@const damage = calculateDamage(source, target)}
						<tr>
							<td>
								<ElementIcon element={target.element} />
								{target.name} 
							</td>
							<td class="text-end">{damage.min}-{damage.max}</td>
							<td class="text-end">{(damage.min+damage.max)/2}</td>
							<td class="text-end">{target.hp}</td>
							<td class="text-end">{Math.floor(damage.min/target.hp*100)}-{Math.floor(damage.max/target.hp*100)}%</td>
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
		<h4>Lista de Unidades</h4>
		</div>

	<div class="row">
		{#each Champs as champ}
			<div class="col-12 col-md-6  col-lg-4 col-xl-3 mb-2 g-1">
				<div class="card">
					<div class="card-header">{champ.name}</div>
					<div class="card-body">
						<Unit {champ} />
					</div>
				</div>
			</div>
		{/each}
		
		
		<div>
			<h5>Cálculos matemáticos de dados.</h5>
			<p>
				Para calcular el daño tienes que tirar dados según la indicación, por ejemplo <b>2d6</b> significa 2 dados de 6 caras<br>
				Mientras que <b>2d6+1</b> significa 2 dados de 6 caras y al resultado se le suma 1.
			</p>

			<p>
				Estatisticamente eso significa que si tiras dos 1s, el valor minimo es un 2. Y si tiras dos 6s, el valor maximo es 12.
			</p>

			<h5>¿Qué hago si solo tengo dados de 6?</h5>
			<p>
				Si solo tienes dados de seis caras, puedes tirarlo y usar la siguiente relación:
			</p>

				<table class="table table-striped table-bordered" style="width: 150px">
				<thead>
				<tr>
					<th>C</th>
					<th>1</th>
					<th>2</th>
					<th>3</th>
					<th>4</th>
					<th>5</th>
					<th>6</th>
				</tr>
				</thead>
				<tbody>
				{#each sides.slice(1, sides.length-1) as n1}
					<tr>
						<td>{n1}</td>
						{#each table(n1) as n2}
							<td>{n2}</td>
						{/each}
					</tr>
				{/each}
						
				</tbody>
				</table>

			<p>
				Alternativamente puedes crear una baraja con cartas de numeros del 1
				al numero máximo que sea alcanzable por las unidades que estas usando.
				Cuando necesites un numero, dejas solo las cartas con los números 
				validos, las revuelves y agarras una.
			</p>
			<h5>¿Comó puedo armar una partida?</h5>
			<p>
				Para armar un partida, necesitas un deck de cartas de unidades,
				La carta puede tener el dibujo de cada unidad, no necesita tener la estadisticas fisicamente.

				Las cartas deben estar distribuidas de forma pareja a menos que alguna unidad sea demasiado fuerte, 
				pueden haber menos unidades de esta.<br>
a			La distribución sugerida es 5 de cada unidad.<br>

				A parte, necesitas estas instrucciones impresas para tenerlas de referencia.
			</p>
			
			<h5>¿Cómo se juega?</h5>

			<p>Se revuelven las cartas, a un jugador se le dan 5 cartas en privado, puede escoger 3 de ellas y colocarlas boca abajo.</p>

			<p>Tiene la opcion de hacer un reroll pedir un cambio de cartas.</p>

			<p>Se repite el proceso con el otro jugador.</p>

			<p>Una vez que esten listos, pueden voltear sus cartas.</p>

			<p>Se tira una moneda para decidir quien tiene preferencia.</p>

			<p>Se determina el orden de ataque, las cartas que tengan mas velocidad (SPD) atacan primero, en caso de empate el que tenga preferencia ataca primero.</p>

			<p>La unidad mas rapida atacara contra los objetivos apropiados segun lo que dice la unidad en "Objetivos", se tira la cantidad de dados apropiados segun se indique</p>

			<p>En una hoja de papel, cada persona tendra por escrito el nombre de sus unidades con su vida (HP), aqui le irán reduciendo el numero segun los dados que vayan tirando.</p>
			
			<p>Se continua el proceso con las siguientes unidades, empezando por las unidades mas rapidas y terminando con las mas lentas.</p>

			<p>Una vez que todos hayan atacado, termina la ronda, el jugador con mayor HP gana! Pueden jugar varias rondas hasta que algún jugador se quede sin unidades.</p>


		</div>
	</div><!--row-->
</div>
