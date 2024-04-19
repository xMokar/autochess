interface ArmorType {
	id: string;
	name: string;
}

interface Targetting {
	id: string;
	name: string;
	targets: number;
}

let targetting:Targetting[] = [
	{
		id: 'closest1',
		name: 'Más cercano',
		targets: 1,
	},
	{
		id: 'farthest1',
		name: 'Más lejano',
		targets: 1,
	},
	{
		id: 'farthest3',
		name: '3 Más lejanos',
		targets: 3,
	},
	
	{
		id: 'farthest1_direct',
		name: 'Más lejano directo',
		targets: 1,
	}
]

let TargettingMap = Object.fromEntries(targetting.map(t => [ t.id, t ]))
export interface Champ {
	id: string;
	name: string;
	hp: number,
	attack: number;
	defense: number;
	movespeed: number;
	armorType: ArmorType;
	targetting: Targetting;
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
	{
		id: 'greencloth',
		name: 'Green cloth'
	},
]
let ArmorTypeMap = Object.fromEntries(ArmorTypes.map(c => [ c.id, c ]))

export interface ChampInstance {
	champ:Champ
	setx:number
	sety:number
	hp: number
	x:number
	y:number
}

export type Field = ChampInstance[]
export interface Player {
	name: string,
	field: Field,
	mirrored: boolean,
}

let costFrequency = [ 0, 29, 22, 18, 12, 10 ]

export let Champs:Champ[] = [ 
	{ 
		id: 'assassin',
		name: 'Asesino',
		hp: 10,
		attack: 6,
		defense:1,
		movespeed: 7,
		armorType: ArmorTypeMap.cloth,
		targetting: TargettingMap.farthest1,
		cost: 1,
		armorpen: {
			iron: 1,
			cloth: 2,
			leather: 2,
		}
	},
	{ 
		id: 'tank',
		name: 'Tanque',
		hp: 10,
		attack: 4,
		defense:3,
		movespeed: 5,
		armorType: ArmorTypeMap.iron,
		targetting: TargettingMap.closest1,
		cost: 1,
		armorpen: {
			iron: 2,
			cloth: 2,
			leather: 2,
		}
	},
	{
		id: 'mage',
		name: 'Mago',
		hp: 10,
		attack: 6,
		defense: 0,
		movespeed: 5,
		armorType: ArmorTypeMap.cloth,
		targetting: TargettingMap.closest1,
		cost: 1,
		armorpen: {
			cloth: 1,
			leather: 2,
			iron:4
		}
	},
	{
		id: 'archer',
		name: 'Arquero',
		hp: 10,
		attack: 3,
		defense: 1,
		movespeed: 6,
		armorType: ArmorTypeMap.cloth,
		targetting: TargettingMap.farthest3,
		cost: 1,
		armorpen: {
			cloth: 2,
			leather: 2,
			iron: 1,
		}
	},
	{
		id: 'gunner',
		name: 'Pistolero',
		hp: 10,
		attack: 5,
		defense: 1,
		movespeed: 6,
		armorType: ArmorTypeMap.cloth,
		targetting: TargettingMap.farthest1_direct,
		cost: 1,
		armorpen: {
			cloth: 2,
			leather: 3,
			iron: 4,
		}
	},
	{
		id: 'fighter',
		name: 'Peleador',
		movespeed: 6,
		armorType: ArmorTypeMap.leather,
		targetting: TargettingMap.closest1,
		hp: 15,
		attack: 5,
		defense:2,
		cost: 1,
		armorpen: {
			cloth: 3,
			leather: 2,
			iron: 2,
		}
	},
		
]

export let ChampMap = Object.fromEntries(Champs.map(card => [ card.id, card ]))

export let Pool = Champs.flatMap(card => Array(costFrequency[card.cost]).fill(card))

function AttackRolls(attacker:Champ, defender:Champ, sides:number) {
	if(!sides)
		return [0]
	let roll = () => Math.max(Math.floor(Math.random()*sides)+1, 0)
	return Object.entries(attacker.armorpen)
		.filter(([target, _]) => defender.armorType.id == target)
		.flatMap(([_, dice]) => Array(dice).fill(0).map(roll))
}

export interface DamageRoll {
	rolls:number[],
	total:number,
	sides:number,
	max:number
}
export function calculateDamage(source:Champ, target:Champ) {
	let sides = Math.max(source.attack-target.defense,0)
	let rolls = AttackRolls(source, target, sides)
	let total = rolls.reduce((total, v) => total+v)
	let num_dice = rolls.length
	let max = num_dice*sides

	return {
		rolls,
		total,
		sides,
		max
	} as DamageRoll
}
