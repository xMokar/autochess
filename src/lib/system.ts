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
	},
	{
		id: 'random',
		name: 'Enemigo al azar',
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
export interface Unit {
	id: string;
	name: string;
	info: string;
	hp: number,
	attackName: string,
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

export interface UnitInstance {
	unit:Unit
	setx:number
	sety:number
	hp: number
	x:number
	y:number
}

export type Field = UnitInstance[]
export interface Player {
	id: string,
	name: string,
	field: Field,
	mirrored: boolean,
	color: string,
}

let costFrequency = [ 0, 29, 22, 18, 12, 10 ]

export let Units:Unit[] = [ 
	{ 
		id: 'watermage',
		name: 'Ninja',
		info: 'Ninja de la aldea de agua',
		hp: 10,
		attackName: 'Shuriken de agua',
		defense:0,
		movespeed: 5,
		element: ElementMap.water,
		targetting: TargettingMap.farthest1,
		cost: 1,
		elementStrength: [
			{ element: ElementMap.fire, dice: 3, sides: 3, modifier: 1 },
			{ element: ElementMap.earth, dice: 2, sides: 3, modifier: 0 },
			{ element: ElementMap.metal, dice: 2, sides: 3, modifier: 0 },
			{ element: ElementMap.water, dice: 2, sides: 3, modifier: 0 },
			{ element: ElementMap.wood, dice: 2, sides: 3, modifier: 0 },
		]
	},
	{ 
		id: 'tank',
		name: 'Tanque',
		info: 'Soldado con armadura de oro',
		hp: 15,
		defense:1,
		movespeed: 5,
		attackName: 'Escudazo',
		element: ElementMap.metal,
		targetting: TargettingMap.closest1,
		cost: 1,
		elementStrength: [
			{ element: ElementMap.fire, dice: 1, sides: 6, modifier: 0 },
			{ element: ElementMap.earth, dice: 1, sides: 6, modifier: 0 },
			{ element: ElementMap.metal, dice: 1, sides: 6, modifier: 0 },
			{ element: ElementMap.water, dice: 1, sides: 6, modifier: 0 },
			{ element: ElementMap.wood, dice: 2, sides: 6, modifier: 2 },
		]
	},
	{
		id: 'firemage',
		name: 'Mago',
		info: 'Mago elemental de fuego',
		hp: 10,
		defense: 0,
		movespeed: 5,
		attackName: 'Bola de fuego',
		element: ElementMap.fire,
		targetting: TargettingMap.closest1,
		cost: 1,
		elementStrength: [
			{ element: ElementMap.fire, dice: 1, sides: 6, modifier: 0 },
			{ element: ElementMap.earth, dice: 1, sides: 6, modifier: 0 },
			{ element: ElementMap.metal, dice: 2, sides: 6, modifier: 2 },
			{ element: ElementMap.water, dice: 1, sides: 6, modifier: 0 },
			{ element: ElementMap.wood, dice: 1, sides: 6, modifier: 0 },
		]
	},
	{
		id: 'archer',
		name: 'Arquero',
		info: 'Soldado con arco y flecha.',
		hp: 10,
		defense: 0,
		movespeed: 6,
		attackName: 'Lluvia de flechas',
		element: ElementMap.wood,
		targetting: TargettingMap.farthest2,
		cost: 1,
		elementStrength: [
			{ element: ElementMap.fire, dice: 1, sides: 4, modifier: 1 },
			{ element: ElementMap.earth, dice: 2, sides: 4, modifier: 1 },
			{ element: ElementMap.metal, dice: 1, sides: 4, modifier: 1 },
			{ element: ElementMap.water, dice: 1, sides: 4, modifier: 1 },
			{ element: ElementMap.wood, dice: 1, sides: 4, modifier: 1 },
		]
	},
	{
		id: 'druid',
		name: 'Druida',
		info: 'Hechicero que controla las fuerzas de la naturaleza',
		movespeed: 5,
		element: ElementMap.earth,
		targetting: TargettingMap.random,
		hp: 10,
		defense:0,
		cost: 1,
		attackName: 'Mini meteorito',
		elementStrength: [
			{ element: ElementMap.fire, dice: 1, sides: 10, modifier: 0 },
			{ element: ElementMap.earth, dice: 1, sides: 10, modifier: 0 },
			{ element: ElementMap.metal, dice: 1, sides: 10, modifier: 0 },
			{ element: ElementMap.water, dice: 2, sides: 10, modifier: 1 },
			{ element: ElementMap.wood, dice: 1, sides: 10, modifier: 0 },
		]
	},
		
]

export let UnitMap = Object.fromEntries(Units.map(card => [ card.id, card ]))

export let Pool = Units.flatMap(card => Array(costFrequency[card.cost]).fill(card))

export function calculateDamage(attacker:Unit, defender:Unit) {
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
