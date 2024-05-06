<script lang="ts">
    import type { Player, Unit } from "$lib/system";
    import Hand from "./Hand.svelte";
    import ShopContents from "./ShopContents.svelte";

let {cards, player = $bindable(), oncontinue, ontake}:{
		cards:Unit[],
		player:Player,
		oncontinue:()=>void,
		ontake:(index:number)=>Unit
	} = $props()

let view = $state("shop")

let onbuy = (index:number) => {
	if(player.gold==0)
		return;
	player.gold--
	player.hand.push(ontake(index))
}
let _oncontinue = () => {
	show = false
	oncontinue()
}
let viewhand = () => {
	view="hand"
}
let show = $state(false)
</script>

{#if view=="shop"}
{#snippet buttons()}
	{#if !show}
		<button class="btn btn-outline-primary" onclick={() => show = true}>Mostrar cartas</button>
	{/if}
	<button onclick={viewhand} class="btn btn-outline-secondary">Ver mano</button>

	<button onclick={_oncontinue} class="btn btn-outline-danger">Siguiente jugador</button>
{/snippet}
	<ShopContents {player} {buttons} {cards} {show} {onbuy} />
{:else}
	<Hand {player} onclose={() => view="shop"} boardActions={undefined} onclick={() => undefined} closeText="Regresar" />
{/if}
		<p>
			<b>Instrucciones:</b><br>
			Ya empezó el juego, el primer jugador toma el control de este dispositivo y le puede dar click al botón "Mostrar Cartas".<br>
			A continuación, verá las cartas que le tocaron y tiene una cantidad de oro limitada para comprar algunas, para agregarlas a su mano. (Volvera a ver otras cartas más adelante)<br>
			En cualquier momento puedes ver que cartas tienes en la mano dandole click al botón "Ver mano".<br>
			Cuando ya no le interesé ninguna carta, le puede dar click en "Siguiente jugador" y le da el dispositivo al otro jugador, quien puede ver sus cartas y elegir si quiere comprar alguna.<br>
			Este proceso se puede repetir algunas veces, cuando se haya repetido suficientes veces, pasarán a la siguiente etapa.<br>

		</p>
