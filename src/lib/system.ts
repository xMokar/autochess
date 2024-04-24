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

export interface ActiveUnit {
	unit:Unit
	setx:number
	sety:number
	hp: number
	x:number
	y:number
}

export type Field = ActiveUnit[]
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
		info: 'Es un Ninja de la aldea de agua.',
		hp: 10,
		attackName: 'Lanzar varios shurikens de agua.',
		defense:0,
		movespeed: 1,
		element: ElementMap.water,
		targetting: TargettingMap.farthest1,
		cost: 1,
		elementStrength: [
			{ element: ElementMap.fire, dice: 2, sides: 4, modifier: 1 },
			{ element: ElementMap.earth, dice: 2, sides: 4, modifier: 0 },
			{ element: ElementMap.metal, dice: 2, sides: 4, modifier: 0 },
			{ element: ElementMap.water, dice: 2, sides: 4, modifier: 0 },
			{ element: ElementMap.wood, dice: 2, sides: 4, modifier: 0 },
		]
	},
	{ 
		id: 'gunner',
		name: 'Pistolero',
		info: 'Es un rebelde sín causa que resuelve las cosas a balazos.',
		hp: 10,
		attackName: 'Disparar con la pistola.',
		defense:0,
		movespeed: 2,
		element: ElementMap.metal,
		targetting: TargettingMap.farthest1_direct,
		cost: 1,
		elementStrength: [
			{ element: ElementMap.fire, dice: 1, sides: 4, modifier: 3 },
			{ element: ElementMap.earth, dice: 1, sides: 4, modifier: 3 },
			{ element: ElementMap.metal, dice: 1, sides: 4, modifier: 3 },
			{ element: ElementMap.water, dice: 1, sides: 4, modifier: 3 },
			{ element: ElementMap.wood, dice: 1, sides: 4, modifier: 5 },
		]
	},
	{ 
		id: 'tank',
		name: 'Tanque',
		info: 'Es un soldado con armadura de oro.',
		hp: 15,
		defense:1,
		movespeed: 1,
		attackName: 'Dar un espadazo.',
		element: ElementMap.metal,
		targetting: TargettingMap.closest1,
		cost: 1,
		elementStrength: [
			{ element: ElementMap.fire, dice: 1, sides: 6, modifier: 0 },
			{ element: ElementMap.earth, dice: 1, sides: 6, modifier: 0 },
			{ element: ElementMap.metal, dice: 1, sides: 6, modifier: 0 },
			{ element: ElementMap.water, dice: 1, sides: 6, modifier: 0 },
			{ element: ElementMap.wood, dice: 1, sides: 6, modifier: 1 },
		]
	},
	{
		id: 'firemage',
		name: 'Mago',
		info: 'Es un mago elemental de fuego.',
		hp: 10,
		defense: 0,
		movespeed: 1,
		attackName: 'Lanzar una bola de fuego.',
		element: ElementMap.fire,
		targetting: TargettingMap.closest1,
		cost: 1,
		elementStrength: [
			{ element: ElementMap.fire, dice: 1, sides: 8, modifier: 0 },
			{ element: ElementMap.earth, dice: 1, sides: 8, modifier: 0 },
			{ element: ElementMap.metal, dice: 1, sides: 8, modifier: 2 },
			{ element: ElementMap.water, dice: 1, sides: 8, modifier: 0 },
			{ element: ElementMap.wood, dice: 1, sides: 8, modifier: 0 },
		]
	},
	{
		id: 'archer',
		name: 'Arquero',
		info: 'Es un soldado con arco y flecha.',
		hp: 10,
		defense: 0,
		movespeed: 2,
		attackName: 'Disparar una lluvia de flechas.',
		element: ElementMap.wood,
		targetting: TargettingMap.farthest2,
		cost: 1,
		elementStrength: [
			{ element: ElementMap.fire, dice: 1, sides: 4, modifier: 0 },
			{ element: ElementMap.earth, dice: 1, sides: 4, modifier: 2 },
			{ element: ElementMap.metal, dice: 1, sides: 4, modifier: 0 },
			{ element: ElementMap.water, dice: 1, sides: 4, modifier: 0 },
			{ element: ElementMap.wood, dice: 1, sides: 4, modifier: 0 },
		]
	},
	{
		id: 'treant',
		name: 'Arbol humanoide',
		info: 'Es una criatura humanoide de madera viva, por algun motivo solo puede decir "yo soy noob".',
		hp: 18,
		defense: 0,
		movespeed: 1,
		attackName: 'Atacar con un latigo de raices.',
		element: ElementMap.wood,
		targetting: TargettingMap.closest1,
		cost: 1,
		elementStrength: [
			{ element: ElementMap.fire, dice: 1, sides: 6, modifier: 0 },
			{ element: ElementMap.earth, dice: 1, sides: 6, modifier: 2 },
			{ element: ElementMap.metal, dice: 1, sides: 6, modifier: 0 },
			{ element: ElementMap.water, dice: 1, sides: 6, modifier: 0 },
			{ element: ElementMap.wood, dice: 1, sides: 6, modifier: 0 },
		]
	},
	{
		id: 'druid',
		name: 'Druida',
		info: 'Es un hechicero que controla las fuerzas de la naturaleza.',
		movespeed: 0,
		element: ElementMap.earth,
		targetting: TargettingMap.random,
		hp: 10,
		defense:0,
		cost: 1,
		attackName: 'Lanzar un mini meteorito.',
		elementStrength: [
			{ element: ElementMap.fire, dice: 1, sides: 10, modifier: 0 },
			{ element: ElementMap.earth, dice: 1, sides: 10, modifier: 0 },
			{ element: ElementMap.metal, dice: 1, sides: 10, modifier: 0 },
			{ element: ElementMap.water, dice: 1, sides: 10, modifier: 2 },
			{ element: ElementMap.wood, dice: 1, sides: 10, modifier: 0 },
		]
	},
		
]

export let UnitMap = Object.fromEntries(Units.map(card => [ card.id, card ]))

export let Pool = Units.flatMap(card => Array(costFrequency[card.cost]).fill(card))

export function calculateDamage(attacker:Unit, defender:Unit) {
	let roll = (es:ElementStrength) => Math.max(
		Math.floor(Math.random()*es.sides)+1+es.modifier-defender.defense
		, 0)

	let multiRoll = (es:ElementStrength) => Array(es.dice)
		.fill(es)
		.map(roll)
		.reduce((total, v) => {
			total.damage += v
			total.min += Math.max(1+es.modifier-defender.defense, 0)
			total.max += Math.max(es.sides+es.modifier-defender.defense, 0)
			return total
		}, {
			damage: 0,
			min: 0,
			max: 0
		} as DamageRoll)
	return attacker.elementStrength
		.filter((es) => defender.element.id == es.element.id)
		.map(multiRoll)
		.reduce((total, d) => ({
			damage: total.damage+d.damage,
			max: total.max+d.max,
			min: total.min+d.min
		}))
}

export interface DamageRoll {
	damage:number,
	max:number,
	min:number
}
