<script lang="ts">
import { Units, type Player, type Unit } from "$lib/system";
import Hand from "./Hand.svelte";
import ShopContents from "./ShopContents.svelte";

let {player, oncontinue, onroll, onbuy}:{
		player:Player,
		oncontinue:()=>void,
		onroll:(player:Player)=>void,
		onbuy:(player:Player, unit:Unit)=>void,
	} = $props()

let view = $state("shop")

let newDeck = Units
	.flatMap(unit => Array(5).fill(unit))
	.map((unit,index) => ({...unit, index}) as Unit)


let shuffle = (deck:Unit[]) => deck
	.map(unit => ({ unit, order: Math.random()*deck.length }))
	.sort((a, b) => b.order-a.order)
	.map(({unit}) => unit)

let deck = $state(shuffle(newDeck))
let cards:Unit[] = $state([])
let rolled = $state(false)
let roll = () => {
	deck.push(...cards)
	cards = deck.splice(0,4)
	rolled = true
	onroll(player)
}
let _onbuy = (index:number) => {
	if(player.gold==0)
		return;
	let [card] = cards.splice(index, 1)
	onbuy(player, card)
}
let _oncontinue = () => {
	deck.push(...cards)
	cards = []
	rolled = false
	oncontinue()
}
let viewhand = () => {
	view="hand"
}
</script>

{#if view=="shop"}
{#snippet buttons()}
	{#if !rolled}
		<button class="btn btn-outline-primary" onclick={roll}>Pedir unidades</button>
	{/if}
	<button onclick={viewhand} class="btn btn-outline-secondary">Ver mano</button>

	<button onclick={_oncontinue} class="btn btn-outline-danger">Siguiente jugador</button>
{/snippet}
	<ShopContents {player} {buttons} {cards} onbuy={_onbuy} {rolled} />
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
