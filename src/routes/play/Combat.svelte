<script lang="ts">
import { fight } from "$lib/combat";

let { players, onendcombat, ondamage }:{
	players:Player[],
	ondamage: (player:Player, amount:number)=>void,
	onendcombat: ()=>void,
} = $props()

let shuffledPairs = () => {
	let shuffled = players
		.filter(p => p.hp>0)
		.map(i => ({ order: Math.random(), value: i}))
		.sort((a, b)=>a.order-b.order)
		.map(({value}) => value)
	return shuffled.reduce((result, _, index, array) => { 
		if(index%2==0) 
			result.push(array.slice(index, index+2)); 
		return result
	}, [] as Player[][] )
}
let pairs = shuffledPairs()

let log:string[]=$state([])
let winner:Player|undefined=$state(undefined)
let nextFight = () => {
	let next = pairs.shift()
	if(!next) {
		onendcombat()
		return
	}
	let [p1, p2] = next
	if(p1===undefined || p2===undefined) {
			onendcombat()
			return
	}
	let result = fight(p1, p2)
	log = result.log
	winner = result.winner
	if(result.loser) {
		let unitsAlive = result.winner.board.filter(u => u.hp>0).length
		ondamage(result.loser, unitsAlive)
	}

}
nextFight()
</script>
<button class="btn btn-sm btn-success" onclick={nextFight}>Continuar</button>
{#if winner}
Ganador: <span class="fw-bold text-{winner.color}">{winner.name}</span>
{/if}
<div>
{#each log as msg}
{@html msg}<br>
{/each}
</div>

