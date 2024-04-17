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
let ArmorTypeMap = Object.fromEntries(ArmorTypes.map(c => [ c.id, c ]))

export interface ChampInstance {
	champ:Champ
	x:number
	y:number
	hp: number
}

export type Field = ChampInstance[]
export interface Player {
	name: string,
	field: Field,
}

let costFrequency = [ 0, 29, 22, 18, 12, 10 ]

function roll(base:number, dice:number) {
	return Array(dice)
		.fill(0)
		.map(_ => Math.floor(Math.random()*6)+1)
		.reduce((total, value) => total+value, base) 
}

export let Champs:Champ[] = [ 
	{ 
		id: 'tank',
		name: 'Tanque',
		hp: 20,
		attack: 8,
		defense:10,
		movespeed: 5,
		armorType: ArmorTypeMap.iron,
		cost: 1,
		armorpen: {
		}
	},
	{
		id: 'mage',
		name: 'Mago',
		hp: 10,
		attack: 14,
		defense: 7,
		movespeed: 5,
		armorType: ArmorTypeMap.cloth,
		cost: 1,
		armorpen: {
			cloth: 2,
			leather: 1,
			iron: 1,
		}
	},
	{
		id: 'archer',
		name: 'Arquero',
		hp: 15,
		attack: 13,
		defense: 8,
		movespeed: 6,
		armorType: ArmorTypeMap.leather,
		cost: 1,
		armorpen: {
			cloth: 2,
			leather: 1,
			iron: 0,
		}
	},
	{
		id: 'fighter',
		name: 'Peleador',
		movespeed: 6,
		armorType: ArmorTypeMap.leather,
		hp: 25,
		attack: 14,
		defense:8,
		cost: 1,
		armorpen: {
			cloth: 1,
			leather: 1,
			iron: 1,
		}
	},
		
]

export let ChampMap = Object.fromEntries(Champs.map(card => [ card.id, card ]))
export let Attack = (attacker:Champ, defender:Champ) => {
	let ar = attacker.attack
	let dr = defender.defense
	let bonus = Object.entries(attacker.armorpen)
		.filter(([target, _]) => defender.armorType.id == target)
		.map(([_, dice]) => roll(0, dice))
		
	return [Math.max(ar-dr,0), ...bonus]
}

export let Pool = Champs.flatMap(card => Array(costFrequency[card.cost]).fill(card))
