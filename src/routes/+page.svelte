<script lang="ts">
    import { Units, type Unit } from "$lib/system";
    import UnitInfo from "$lib/UnitInfo.svelte";
    import { goto } from "$app/navigation";
    import { calculateDamageStats } from "$lib/combat";
    import UnitTraits from "$lib/UnitTraits.svelte";
	let sides = [1,2,3,4,5,6]
	function table(face:number) {
		// No me gusta la distribución matematica del cuatro
		// esta distribuida parejo, prefiero que este distribuida
		// prefiriendo numeros altos
		if (face==4) 
			return [1,2,3,3,4,4]
		return sides.map(x => Math.ceil(x/(6/(face))))
	}
	let units = [...Units].sort((a,b) => b.movespeed-a.movespeed)
	let targetTable = (source:Unit) => {
		return units.map((target) => ({
			target,
			damage: calculateDamageStats(source, target)
			}))
			.sort((a, b) => ((b.damage.min+b.damage.max)/2)-((a.damage.min+a.damage.max)/2))
	}

	function reset() {
		localStorage.removeItem("player1")
		localStorage.removeItem("player2")
		goto("/autobattle")
	}
</script>
<div class="container mt-2">
	<div class="d-print-none">
		<a class="btn btn-success" href="/autobattle">AutoBattle</a>
		<a class="btn btn-secondary" href="/play">Jugar</a>
		<br>
	</div>
	<div class="row">
		<div class="col-12">
		<h4>Lista de Unidades</h4>
		</div>

		{#each units as unit}
			<div class="col-12 col-md-6  col-lg-4 col-xl-3 mb-2 g-1">
				<div class="card">
					<div class="card-header">
						<UnitTraits {unit} />
						{unit.name}
					</div>
					<div class="card-body">
						<UnitInfo {unit} field={undefined}/>
					</div>
				</div>
			</div>
		{/each}
	</div>
	<h4>Tablas de balance</h4>
	<div class="row">
		{#each units as source}
		<div class="col-12 col-lg-6 mb-2 g-1">
			<div class="card">
				<div class="card-header">{source.name}</div>
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
					{#each targetTable(source) as dmg}
						
						<tr>
							<td>
								<UnitTraits unit={dmg.target} />
								{dmg.target.name} 
							</td>
							<td class="text-end">{dmg.damage.min}-{dmg.damage.max}</td>
							<td class="text-end">{(dmg.damage.min+dmg.damage.max)/2}</td>
							<td class="text-end">{dmg.target.hp}</td>
							<td class="text-end">{Math.floor(dmg.damage.min/dmg.target.hp*100)}-{Math.floor(dmg.damage.max/dmg.target.hp*100)}%</td>
						</tr>
					{/each}
					</tbody>
					</table>
				</div>
			</div>
			</div>
		{/each}
	</div><!--row-->

		<div>
			<h5>Cálculos matemáticos de dados.</h5>
			<p>
				Para calcular el daño tienes que tirar dados según la indicación, por ejemplo <b>2d6</b> significa 2 dados de 6 caras<br>
				Mientras que <b>2d6+1</b> significa 2 dados de 6 caras y al resultado se le suma 1.
			</p>

			<p>
				Estatisticamente eso significa que si tiras dos 1s, el valor minimo es un 2+2. Y si tiras dos 6s, el valor maximo es 12+2 (+1 por cada dado que tires).
			</p>

			<h5>¿Qué hago si solo tengo dados de 6?</h5>
			<p>
				Si solo tienes dados de seis caras, puedes tirarlo y usar la siguiente relación, una manera facil de recordarlo es:
			</p>
			<ul>
				<li>d2: de 1-3 es 1, de 4-6 es 2</li>
				<li>d3: lo divides entre 2, si da exacto usas el numero, si no, le sumas 1 y lo divides entre 2.</li>
				<li>d4: de 3-4 es 3, de 5-6 es 4</li>
				<li>d5: el 6 es 5</li>
			</ul>

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

			<ol>
			<li>Se revuelven las cartas de unidades.</li>

			<li>A cada jugador se la da 6 de oro.</li>
			<li><b>Empieza la etapa de compra.</b> Se tira una moneda para ver quien compra primero.</li>

			<li>Se le entregan 4 cartas al jugador que ganó la tirada de moneda, puede comprar las que quiera usando su oro.</li>

			<li>Se repite el paso anterior con el otro jugador.</li>

			<li>Se puede regresar al paso 4 una vez más, cada jugador tiene derecho a recibir 2 sets de unidades para comprar.</li>

			<li>Ambos jugadores voltean sus unidades, distribuyendolas en una rejilla personal de 3x3 y luego colocan indicadores de HP sobre cada una de ellas.</li>

			<li>En este momento <b>empieza una etapa de ronda de combate</b></li>

			<li>Se tira una moneda para decidir quien tiene preferencia.</li>

			<li>Se determina el orden de ataque, <b>las cartas que tengan mas velocidad atacan primero</b>, en caso de empate el jugador que tenga preferencia ataca primero, cuando un jugador tenga varias unidades con la misma velocidad, el puede elegir cual actua primero.</li>

			<li>Se <b>determinan los objetivos</b> apropiados segun lo que dice la unidad que ataca leyendo debajo de "Objetivos"</li>
			<li>Se <b>tiran los dados</b> apropiados segun el elemento del objetivo</li>

			<li>Antes o despues de atacar (pero solo una vez), <b>la unidad atacando puede ser movida</b> a cualquier lugar de su rejilla personal.</li>

			<li>Una vez que una unidad ataque, se <b>gira esa carta</b>, colocandola horizontalmente, para indicar que ya fue usada en esta ronda.</li>
			
			<li>Se continua el proceso con las unidades que no hayan actuado alternando entre un jugador y otro.</li>

			<li>Una vez que todas las unidades hayan actuado, termina la ronda y pueden empezar una ronda nueva (<i>regresando al paso 9</i>) hasta que algún jugador se quede sin unidades.</li>

			<li>Al terminar la partida, <b>puede ofrecerse una revancha u otro jugador puede retar al vencedor</b>. El vencedor tiene que usar las mismas cartas mientras que el oponente realiza su proceso de compra, teniendo el derecho de recibir 2 sets de 4 cartas, por separado, para comprar y continuar en el paso 7.</li>
			</ol>


		</div>

	<div class="text-lighter d-print-none" style="font-size: 70%">
		Si por algún motivo al entrar al AutoBattle solo sale una página en blanco, puedes resetear la memoria:
		<button class="btn btn-sm btn-secondary" onclick={reset} style="font-size: 70%">Reset</button>
	</div>

	</div><!--row-->

