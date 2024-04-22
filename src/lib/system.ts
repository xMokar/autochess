export interface Element {
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
interface ElementStrength {
	element: Element,
	dice: number,
	sides: number,
	modifier: number,
}
export interface Champ {
	id: string;
	name: string;
	hp: number,
	defense: number;
	movespeed: number;
	element: Element;
	targetting: Targetting;
	cost: number;
	elementStrength: ElementStrength[];
}


let Elements:Element[] = [
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
		name: 'Agua'
	},
	{
		id: 'wood',
		name: 'Madera'
	},
]
export let ElementMap = Object.fromEntries(Elements.map(c => [ c.id, c ]))

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
	color: string,
}

let costFrequency = [ 0, 29, 22, 18, 12, 10 ]

export let Champs:Champ[] = [ 
	{ 
		id: 'watermage',
		name: 'Hidromancer',
		hp: 10,
		defense:1,
		movespeed: 5,
		element: ElementMap.water,
		targetting: TargettingMap.farthest1,
		cost: 1,
		elementStrength: [
			{ element: ElementMap.fire, dice: 2, sides: 5, modifier: 1 },
			{ element: ElementMap.earth, dice: 1, sides: 5, modifier: 1 },
			{ element: ElementMap.metal, dice: 1, sides: 5, modifier: 1 },
			{ element: ElementMap.water, dice: 1, sides: 5, modifier: 1 },
			{ element: ElementMap.wood, dice: 1, sides: 5, modifier: 1 },
		]
	},
	{ 
		id: 'tank',
		name: 'Tanque',
		hp: 10,
		defense:2,
		movespeed: 5,
		element: ElementMap.metal,
		targetting: TargettingMap.closest1,
		cost: 1,
		elementStrength: [
			{ element: ElementMap.fire, dice: 1, sides: 5, modifier: 1 },
			{ element: ElementMap.earth, dice: 1, sides: 5, modifier: 1 },
			{ element: ElementMap.metal, dice: 1, sides: 5, modifier: 1 },
			{ element: ElementMap.water, dice: 1, sides: 5, modifier: 1 },
			{ element: ElementMap.wood, dice: 2, sides: 5, modifier: 1 },
		]
	},
	{
		id: 'firemage',
		name: 'Mago',
		hp: 10,
		defense: 1,
		movespeed: 5,
		element: ElementMap.fire,
		targetting: TargettingMap.closest1,
		cost: 1,
		elementStrength: [
			{ element: ElementMap.fire, dice: 1, sides: 5, modifier: 1 },
			{ element: ElementMap.earth, dice: 1, sides: 5, modifier: 1 },
			{ element: ElementMap.metal, dice: 2, sides: 5, modifier: 2 },
			{ element: ElementMap.water, dice: 1, sides: 5, modifier: 1 },
			{ element: ElementMap.wood, dice: 1, sides: 5, modifier: 1 },
		]
	},
	{
		id: 'archer',
		name: 'Arquero',
		hp: 10,
		defense: 1,
		movespeed: 6,
		element: ElementMap.wood,
		targetting: TargettingMap.farthest2,
		cost: 1,
		elementStrength: [
			{ element: ElementMap.fire, dice: 1, sides: 2, modifier: 2 },
			{ element: ElementMap.earth, dice: 2, sides: 2, modifier: 2 },
			{ element: ElementMap.metal, dice: 1, sides: 2, modifier: 2 },
			{ element: ElementMap.water, dice: 1, sides: 2, modifier: 2 },
			{ element: ElementMap.wood, dice: 1, sides: 2, modifier: 2 },
		]
	},
	{
		id: 'dryad',
		name: 'Driada',
		movespeed: 5,
		element: ElementMap.earth,
		targetting: TargettingMap.closest1,
		hp: 10,
		defense:1,
		cost: 1,
		elementStrength: [
			{ element: ElementMap.fire, dice: 1, sides:5, modifier: 1 },
			{ element: ElementMap.earth, dice: 1, sides:5, modifier: 1 },
			{ element: ElementMap.metal, dice: 1, sides:5, modifier: 1 },
			{ element: ElementMap.water, dice: 2, sides:5, modifier: 1 },
			{ element: ElementMap.wood, dice: 1, sides:5, modifier: 1 },
		]
	},
		
]

export let ChampMap = Object.fromEntries(Champs.map(card => [ card.id, card ]))

export let Pool = Champs.flatMap(card => Array(costFrequency[card.cost]).fill(card))

export function calculateDamage(attacker:Champ, defender:Champ) {
	let roll = (es:ElementStrength) => ({
			damage: Math.max(Math.floor(Math.random()*es.sides)+1+es.modifier-defender.defense, 0),
			sides: es.sides,
			max: Math.max((es.dice*es.sides)+es.modifier-defender.defense, 0),
			min: Math.max(es.dice+es.modifier-defender.defense, 0),
		} as DamageRoll)
	return attacker.elementStrength
		.filter((es) => defender.element.id == es.element.id)
		.map(roll)
		.reduce((total, d) => ({
			damage: total.damage+d.damage,
			sides: total.sides+d.sides,
			max: total.max+d.max,
			min: total.min+d.min
		}), {
			damage: 0,
			sides: 0,
			max: 0,
			min: 0,
		})
}

export interface DamageRoll {
	damage:number,
	sides:number,
	max:number,
	min:number
}
