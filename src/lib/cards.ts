export interface Player {
	name: string,
	field: Field,
}

interface Class {
	id: string;
	name: string;
}

export interface Champ {
	id: string;
	name: string;
	hp: number,
	attack: number;
	defense: number;
	movespeed: number;
	class: Class;
	cost: number;
	bonuses: {[key:string]:number};
}


let Classes:Class[] = [
	{
		id: 'tank',
		name: 'Tank',
	},
	{
		id: 'archer',
		name: 'Archer',
	},
	{
		id: 'mage',
		name: 'Mage',
	},
	{
		id: 'fighter',
		name: 'Fighter',
	}
]

export interface ChampInstance {
	champ:Champ
	x:number
	y:number
	hp: number
}

export type Field = ChampInstance[]
let ClassMap = Object.fromEntries(Classes.map(c => [ c.id, c ]))
let costFrequency = [ 0, 29, 22, 18, 12, 10 ]

function roll(base:number, dice:number) {
	return Array(dice)
		.fill(0)
		.map(_ => Math.floor(Math.random()*6)+1)
		.reduce((total, value) => total+value, base) 
}

export let Cards:Champ[] = [ 
	{ 
		id: 'Garen',
		name: 'Tanque',
		hp: 20,
		attack: 6,
		defense: 4,
		movespeed: 5,
		class: ClassMap.tank,
		cost: 1,
		bonuses: {
			archer: 3
		}
	},
	{
		id: 'Lux',
		name: 'Mago',
		hp: 10,
		attack: 8,
		defense: 2,
		movespeed: 5,
		class: ClassMap.mage,
		cost: 1,
		bonuses: {
			tank: 3
		}
	},
	{
		id: 'Ashe',
		name: 'Arquero',
		hp: 15,
		attack: 7,
		defense: 3,
		movespeed: 6,
		class: ClassMap.archer,
		cost: 1,
		bonuses: {
			mage: 3
		}
	},
	{
		id: 'Udyr',
		name: 'Peleador',
		movespeed: 6,
		class: ClassMap.fighter,
		hp: 25,
		attack: 5,
		defense: 3,
		cost: 1,
		bonuses: {
			mage: 1,
			archer: 1,
		}
	},
		
]

export let CardMap = Object.fromEntries(Cards.map(card => [ card.id, card ]))
export let Attack = (attacker:Champ, defender:Champ) => {
	let ar = roll(attacker.attack, 1)
	let dr = roll(defender.defense, 1)
	let bonus = Object.entries(attacker.bonuses)
		.filter(([target, _]) => defender.class.id == target)
		.reduce((total, [_,value]) => total+value, 0) 
	return Math.max(ar+bonus-dr, 0);
}

export let Deck = Cards.flatMap(card => Array(costFrequency[card.cost]).fill(card))
