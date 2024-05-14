<script lang="ts">
    import { Units, type Unit } from "$lib/system";
    import { goto } from "$app/navigation";
    import { calculateDamage } from "$lib/combat";
    import UnitTraits from "$lib/UnitTraits.svelte";
    import UnitInfo from "$lib/UnitInfo.svelte";
	let sides = [1,2,3,4,5,6]
	function table(face:number) {
		// No me gusta la distribución matematica del cuatro
		// esta distribuida parejo, prefiero que este distribuida
		// prefiriendo numeros altos
		if (face==4) 
			return [1,2,3,3,4,4]
		return sides.map(x => Math.ceil(x/(6/(face))))
	}
	let units = [...Units].sort((a,b) => (a.energymax/a.energypertick)-(b.energymax/b.energypertick))
	let targetTable = (source:Unit) => {
		return units.map((target) => ({
			target,
			damage: calculateDamage(source, target)
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
			<div class="col-3 mb-2">
				<div class="card">
					<div class="card-header"><UnitTraits {unit} />{unit.name}</div>
					<div class="card-body">
						<UnitInfo {unit} />
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
				Para calcular el daño tienes que tirar dados según la indicación, por ejemplo <b>2d6+1</b> significa 2 dados de 6 caras y al resultado le sumas 1<br>
			</p>

			<h5>¿Cómo puedo armar una partida?</h5>
			<p>
				Para armar un partida, necesitas un deck de cartas de unidades,
				La carta puede tener el dibujo de cada unidad, no necesita tener la estadísticas físicamente.

				Las cartas deben estar distribuidas de forma pareja a menos que alguna unidad sea demasiado fuerte, 
				pueden haber menos unidades de esta.<br>
				La distribución sugerida es 5 de cada unidad.<br>

				Necesitas varios dados de 6 caras y al menos un dado de 4, 8 y 10 caras.<br>

				A parte, necesitas estas instrucciones impresas para tenerlas de referencia.<br>
			</p>
			
			<h5>¿Cómo se juega?</h5>

			<ol>
			<li>Se recomienda jugar con un numero par de jugadores.</li>
			<li>Se revuelven las cartas de unidades.</li>

			<li><b>Empieza la etapa de compra.</b> A cada jugador se la da 10 de oro.</li>
			<li>Se tira una moneda para ver quien compra primero.</li>

			<li>El primer jugador paga 2 de oro y pide un set de 4 cartas, puede comprar las que quiera usando su oro disponible. Se repite este paso con los siguientes jugadores avanzando en el sentido de las manecillas de reloj.</li>

			<li>Se puede regresar al paso anterior una vez más, cada jugador tiene derecho a ver 2 sets de unidades para comprar.</li>

			<li>Todos los jugadores eligen 3 unidades de su mano y las voltean, distribuyéndola en una rejilla personal de 3x3 y luego colocan indicadores de HP sobre cada una de ellas.</li>

			<li>Cada jugador tira un dado y se ordenaran de menor a mayor y en este orden jugaran uno contra uno.</li>

			<li>En este momento <b>empieza una etapa de ronda de combate</b>, en cada combate, se tira una moneda para decidir quien tiene preferencia.</li>

			<li>El combate gira al rededor de "ticks" de juego, en cada tick, se le agrega la cantidad de energía por tick apropiada a cada unidad en el tablero, 
				cuando alguna unidad acumule suficiente energía podrá actuar, en caso de empate, las unidades del jugador con preferencia atacan primero. Se repite este
				proceso las veces que consideren necesarias hasta que alguien se quede sin unidades.</li>

			<li>A la hora de atacar se <b>determinan los objetivos</b> apropiados según lo que dice la unidad que ataca leyendo debajo de "Objetivos"</li>
			<li>Se <b>tiran los dados</b> según el ataque de la unidad atacando y se determinan los efectos activos para aumentar una bonificación.</li>

			<li>Después de atacar, <b>la unidad atacando puede ser movida</b> a cualquier lugar de su rejilla personal.</li>

			<li>Los perdedores perderán vida según el numero de unidades vivas en el territorio de su oponente.</li>
			<li>Se regresa a la <u>etapa de compra</u> para continuar jugando contra otros jugadores</li>

		</div>

	<div class="text-lighter d-print-none" style="font-size: 70%">
		Si por algún motivo al entrar al AutoBattle solo sale una página en blanco, puedes resetear la memoria:
		<button class="btn btn-sm btn-secondary" onclick={reset} style="font-size: 70%">Reset</button>
	</div>

	</div><!--row-->

