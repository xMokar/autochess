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
		id: 'farthest2',
		name: '2 Más lejanos',
		targets: 2,
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
	attackModifier: number;
	defense: number;
	movespeed: number;
	armorType: ArmorType;
	targetting: Targetting;
	cost: number;
	armorpen: {[key:string]:number};
}


let ArmorTypes:ArmorType[] = [
	{
		id: 'fire',
		name: 'Fuego',
	},
	{
		id: 'earth',
		name: 'Tierra',
	},
	{
		id: 'metal',
		name: 'Metal',
	},
	{
		id: 'water',
		name: 'Water'
	},
	{
		id: 'wood',
		name: 'Wood'
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
	id: string,
	name: string,
	field: Field,
	mirrored: boolean,
}

let costFrequency = [ 0, 29, 22, 18, 12, 10 ]

export let Champs:Champ[] = [ 
	{ 
		id: 'watermage',
		name: 'Mago de Agua',
		hp: 10,
		attack: 5,
		attackModifier: 1,
		defense:1,
		movespeed: 7,
		armorType: ArmorTypeMap.water,
		targetting: TargettingMap.farthest1,
		cost: 1,
		armorpen: {
			fire: 2,
			earth: 1,
			metal: 1,
			water: 1,
			wood: 1,
		}
	},
	{ 
		id: 'tank',
		name: 'Tanque de Metal',
		hp: 10,
		attack: 5,
		attackModifier: 0,
		defense:2,
		movespeed: 5,
		armorType: ArmorTypeMap.metal,
		targetting: TargettingMap.closest1,
		cost: 1,
		armorpen: {
			fire: 1,
			earth: 1,
			metal: 1,
			water: 1,
			wood: 2,
		}
	},
	{
		id: 'firemage',
		name: 'Mago de Fuego',
		hp: 10,
		attack: 5,
		attackModifier: 1,
		defense: 1,
		movespeed: 5,
		armorType: ArmorTypeMap.fire,
		targetting: TargettingMap.closest1,
		cost: 1,
		armorpen: {
			fire: 1,
			earth: 1,
			metal: 2,
			water: 1,
			wood: 1,
		}
	},
	{
		id: 'archer',
		name: 'Arquero de Madera',
		hp: 10,
		attack: 5,
		attackModifier: 0,
		defense: 1,
		movespeed: 6,
		armorType: ArmorTypeMap.wood,
		targetting: TargettingMap.farthest2,
		cost: 1,
		armorpen: {
			fire: 1,
			earth: 2,
			metal: 1,
			water: 1,
			wood: 1,
		}
	},
	{
		id: 'goblin',
		name: 'Goblin de Tierra',
		movespeed: 6,
		armorType: ArmorTypeMap.earth,
		targetting: TargettingMap.closest1,
		hp: 15,
		attack: 5,
		attackModifier: 0,
		defense:1,
		cost: 1,
		armorpen: {
			fire: 1,
			earth: 1,
			metal: 1,
			water: 2,
			wood: 1,
		}
	},
		
]

export let ChampMap = Object.fromEntries(Champs.map(card => [ card.id, card ]))

export let Pool = Champs.flatMap(card => Array(costFrequency[card.cost]).fill(card))

function AttackRolls(attacker:Champ, defender:Champ, sides:number) {
	if(!sides)
		return [0]
	let roll = () => Math.max(Math.floor(Math.random()*sides)+1+attacker.attackModifier, 0)
	return Object.entries(attacker.armorpen)
		.filter(([target, _]) => defender.armorType.id == target)
		.flatMap(([_, dice]) => Array(dice).fill(0).map(roll))
}

export interface DamageRoll {
	rolls:number[],
	total:number,
	sides:number,
	max:number,
	min:number
}
export function calculateDamage(source:Champ, target:Champ) {
	let sides = Math.max(source.attack-target.defense,0)
	let rolls = AttackRolls(source, target, sides)
	let total = rolls.reduce((total, v) => total+v)
	let num_dice = rolls.length
	let min = num_dice+source.attackModifier
	let max = num_dice*sides+num_dice*source.attackModifier

	return {
		rolls,
		total,
		sides,
		min,
		max
	} as DamageRoll
}
