export interface Player {
	name: string,
	field: Field,
}

interface ArmorType {
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
	armorType: ArmorType;
	cost: number;
	armorpen: {[key:string]:number};
}


let ArmorTypes:ArmorType[] = [
	{
		id: 'iron',
		name: 'Iron',
	},
	{
		id: 'leather',
		name: 'Leather',
	},
	{
		id: 'cloth',
		name: 'cloth',
	},
]

export interface ChampInstance {
	champ:Champ
	x:number
	y:number
	hp: number
}

export type Field = ChampInstance[]
let ArmorTypeMap = Object.fromEntries(ArmorTypes.map(c => [ c.id, c ]))
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
		attack: 10,
		defense:12,
		movespeed: 5,
		armorType: ArmorTypeMap.iron,
		cost: 1,
		armorpen: {
			leather: 1
		}
	},
	{
		id: 'Lux',
		name: 'Mago',
		hp: 10,
		attack: 16,
		defense: 7,
		movespeed: 5,
		armorType: ArmorTypeMap.cloth,
		cost: 1,
		armorpen: {
			iron: 1
		}
	},
	{
		id: 'Ashe',
		name: 'Arquero',
		hp: 15,
		attack: 13,
		defense: 9,
		movespeed: 6,
		armorType: ArmorTypeMap.leather,
		cost: 1,
		armorpen: {
			cloth: 1
		}
	},
	{
		id: 'Udyr',
		name: 'Peleador',
		movespeed: 6,
		armorType: ArmorTypeMap.leather,
		hp: 25,
		attack: 14,
		defense:10,
		cost: 1,
		armorpen: {
			cloth: 1,
			leather: 1,
		}
	},
		
]

export let CardMap = Object.fromEntries(Cards.map(card => [ card.id, card ]))
export let Attack = (attacker:Champ, defender:Champ) => {
	let ar = attacker.attack
	let dr = defender.defense
	let bonus = Object.entries(attacker.armorpen)
		.filter(([target, _]) => defender.armorType.id == target)
		.reduce((total, [_,value]) => total+roll(0, value), 0) 
	return Math.max(ar+bonus-dr, 0);
}

export let Deck = Cards.flatMap(card => Array(costFrequency[card.cost]).fill(card))
