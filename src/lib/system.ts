import { untrack } from "svelte";

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
		name: 'El enemigo más cercano',
		targets: 1,
	},
	{
		id: 'nearby',
		name: 'Uno de los dos enemigos mas cercanos',
		targets: 1,
	},
	{
		id: 'farthest1',
		name: 'El enemigo más lejano',
		targets: 1,
	},
	{
		id: 'farthest2',
		name: 'Los 2 enemigos más lejanos',
		targets: 2,
	},
	
	{
		id: 'farthest1_direct',
		name: 'Un enemigo no bloqueado',
		targets: 1,
	},
	{
		id: 'weakest1',
		name: 'El énemigo con menos HP',
		targets: 1,
	},
	{
		id: 'everyone',
		name: 'Todos los enemigos',
		targets: 1,
	},
	{
		id: 'random',
		name: 'Un enemigo al azar',
		targets: 1,
	}
]

let TargettingMap = Object.fromEntries(targetting.map(t => [ t.id, t ]))
interface Dice {
	amount: number,
	sides: number,
	modifier: number,
}
interface ElementStrength extends Dice{
	element: Element,
}


interface Effect {
	name: string,
	value: number
}

interface EffectFunctionArgs {
	attacker: ActiveUnit
	defender?: ActiveUnit
	field?: Field
}

type EffectFunction = (args:EffectFunctionArgs) => Effect
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
	attack: Dice;
	effects: EffectFunction[];
//	elementStrength: ElementStrength[];
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
	player?:Player,
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
	finished: boolean,
	maxgold: number,
	gold: number,
	rolls: number,
	hand: Unit[]
}

let costFrequency = [ 0, 29, 22, 18, 12, 10 ]

function changeDamageAgainstElement(element:Element, value:number) {
	return ({defender}:EffectFunctionArgs) => {
		if(!defender || defender.unit.element.id !== element.id)
			return { name: `nodamage`, value }
		return { name: 'damage', value } as Effect
	}
} 

function changeDamageWithSupportingElementAtLeastN(element:Element, min:number, value:number) {
	return ({field}:EffectFunctionArgs) => {
		let support = field?.filter(u => u.unit.element.id==element.id).length??0
		if(support < min)
			return { name: `nodamage:${support}<${min}:${field}`, value }
		return { name: 'damage', value } as Effect
	}
}


export let Units:Unit[] = [ 
	{ 
		id: 'watermage',
		name: 'Sirena',
		info: `Es una bella chica peliroja con cola de pez.
[+1 contra <span class="armor fire"></span>][-1 contra <span class="armor water"></span>]
[+1 si tienes 1 <span class="armor metal"></span>]`,
		hp: 10,
		attackName: 'Invocar una ola magica desde atrás.',
		attack: { amount: 2, sides: 4, modifier: 2 },
		effects: [
			changeDamageWithSupportingElementAtLeastN(ElementMap.metal, 1, 1),
			changeDamageAgainstElement(ElementMap.fire, 1),
			changeDamageAgainstElement(ElementMap.water, -1),
		],
		defense:0,
		movespeed: 1,
		element: ElementMap.water,
		targetting: TargettingMap.farthest1,
		cost: 1,
//		elementStrength: [
//			{ element: ElementMap.fire, dice: 2, sides: 4, modifier: 2 },
//			{ element: ElementMap.earth, dice: 2, sides: 4, modifier: 1 },
//			{ element: ElementMap.metal, dice: 2, sides: 4, modifier: 1 },
//			{ element: ElementMap.water, dice: 2, sides: 4, modifier: 0 },
//			{ element: ElementMap.wood, dice: 2, sides: 4, modifier: 1 },
//		]
	},
	{ 
		id: 'waterelemental',
		name: 'Elemental de agua',
		info: `Es una creatura de agua viva, con grandes poderes mágicos.
	[+1 contra <span class="armor fire"></span>][-1 contra <span class="armor water"></span>]
	[+1 si tienes 1 <span class="armor metal"></span>]`,
		hp: 10,
		attackName: 'Invocar un remolino de agua rasgador.',
		defense:0,
		movespeed: 1,
		element: ElementMap.water,
		targetting: TargettingMap.weakest1,
		cost: 1,
		attack: { amount: 1, sides: 6, modifier: 0 },
		effects: [
			changeDamageWithSupportingElementAtLeastN(ElementMap.metal, 1, 1),
			changeDamageAgainstElement(ElementMap.fire, 1),
			changeDamageAgainstElement(ElementMap.water, -1),
		],
//		elementStrength: [
//			{ element: ElementMap.fire, dice: 1, sides: 6, modifier: 1 },
//			{ element: ElementMap.earth, dice: 1, sides: 6, modifier: 0 },
//			{ element: ElementMap.metal, dice: 1, sides: 6, modifier: 0 },
//			{ element: ElementMap.water, dice: 1, sides: 4, modifier: 0 },
//			{ element: ElementMap.wood, dice: 1, sides: 6, modifier: 0 },
//		]
	},
	{ 
		id: 'gunner',
		name: 'Pistolero',
		info: `Es un rebelde sín causa que resuelve las problemas a balazos.
	[+1 contra <span class="armor wood"></span>][-1 contra <span class="armor metal"></span>]
	[+1 si tienes 1 <span class="armor earth"></span>]`,
		hp: 10,
		attackName: 'Disparar con la pistola.',
		defense:0,
		movespeed: 2,
		element: ElementMap.metal,
		targetting: TargettingMap.farthest1_direct,
		cost: 1,
		attack: { amount: 1, sides: 4, modifier: 4 },
		effects: [
			changeDamageWithSupportingElementAtLeastN(ElementMap.earth, 1, 1),
			changeDamageAgainstElement(ElementMap.wood, 1),
			changeDamageAgainstElement(ElementMap.metal, -1),
		],
//		elementStrength: [
//			{ element: ElementMap.fire, dice: 1, sides: 4, modifier: 4 },
//			{ element: ElementMap.earth, dice: 1, sides: 4, modifier: 4 },
//			{ element: ElementMap.metal, dice: 1, sides: 4, modifier: 3 },
//			{ element: ElementMap.water, dice: 1, sides: 4, modifier: 4 },
//			{ element: ElementMap.wood, dice: 1, sides: 4, modifier: 5 },
//		]
	},
	{ 
		id: 'tank',
		name: 'Tanque',
		info: `Es un soldado con armadura de oro.
	[+1 contra <span class="armor wood"></span>][-1 contra <span class="armor metal"></span>]
	[+1 si tienes 1 <span class="armor earth"></span>]`,
		hp: 15,
		defense:1,
		movespeed: 1,
		attackName: 'Dar un espadazo.',
		element: ElementMap.metal,
		targetting: TargettingMap.closest1,
		cost: 1,
		attack: { amount: 1, sides: 6, modifier: 0 },
		effects: [
			changeDamageWithSupportingElementAtLeastN(ElementMap.earth, 1, 1),
			changeDamageAgainstElement(ElementMap.wood, 1),
			changeDamageAgainstElement(ElementMap.metal, -1),
		],
//		elementStrength: [
//			{ element: ElementMap.fire, dice: 1, sides: 6, modifier: 0 },
//			{ element: ElementMap.earth, dice: 1, sides: 6, modifier: 0 },
//			{ element: ElementMap.metal, dice: 1, sides: 4, modifier: 0 },
//			{ element: ElementMap.water, dice: 1, sides: 6, modifier: 0 },
//			{ element: ElementMap.wood, dice: 1, sides: 6, modifier: 1 },
//		]
	},
	{
		id: 'firemage',
		name: 'Mago',
		info: `Es un mago elemental de fuego.
			[+1 contra <span class="armor metal"></span>][-1 contra <span class="armor fire"></span>]
			[+1 si tienes 1 <span class="armor wood"></span>]`,
		hp: 10,
		defense: 0,
		movespeed: 1,
		attackName: 'Lanzar una bola de fuego.',
		element: ElementMap.fire,
		targetting: TargettingMap.farthest1_direct,
		cost: 1,
		attack: { amount: 1, sides: 8, modifier: 0 },
		effects: [
			changeDamageWithSupportingElementAtLeastN(ElementMap.wood, 1, 1),
			changeDamageAgainstElement(ElementMap.metal, 1),
			changeDamageAgainstElement(ElementMap.fire, -1),
		],
//		elementStrength: [
//			{ element: ElementMap.fire, dice: 1, sides: 6, modifier: 0 },
//			{ element: ElementMap.earth, dice: 1, sides: 8, modifier: 0 },
//			{ element: ElementMap.metal, dice: 1, sides: 8, modifier: 2 },
//			{ element: ElementMap.water, dice: 1, sides: 8, modifier: 0 },
//			{ element: ElementMap.wood, dice: 1, sides: 8, modifier: 0 },
//		]
	},
	{
		id: 'archer',
		name: 'Arquero',
		info: `Es un soldado con arco y flecha.
	[+1 contra <span class="armor earth"></span>][-1 contra <span class="armor wood"></span>]
	[+1 si tienes 1 <span class="armor water"></span>]`,
		hp: 10,
		defense: 0,
		movespeed: 2,
		attackName: 'Disparar una lluvia de flechas.',
		element: ElementMap.wood,
		targetting: TargettingMap.farthest2,
		cost: 1,
		attack: { amount: 1, sides: 4, modifier: 1 },
		effects: [
			changeDamageWithSupportingElementAtLeastN(ElementMap.water, 1, 1),
			changeDamageAgainstElement(ElementMap.earth, 1),
			changeDamageAgainstElement(ElementMap.wood, -1),
		],
//		elementStrength: [
//			{ element: ElementMap.fire, dice: 1, sides: 4, modifier: 1 },
//			{ element: ElementMap.earth, dice: 1, sides: 4, modifier: 2 },
//			{ element: ElementMap.metal, dice: 1, sides: 4, modifier: 1 },
//			{ element: ElementMap.water, dice: 1, sides: 4, modifier: 1 },
//			{ element: ElementMap.wood, dice: 1, sides: 4, modifier: 0 },
//		]
	},
	{
		id: 'treant',
		name: 'Arbol humanoide',
		info: `Es una criatura humanoide de madera viva, por algun motivo solo puede decir "yo soy noob".
	[+1 contra <span class="armor earth"></span>][-1 contra <span class="armor wood"></span>]
	[+1 si tienes 1 <span class="armor water"></span>]`,
		hp: 20,
		defense: 0,
		movespeed: 1,
		attackName: 'Atacar con un latigo de raices.',
		element: ElementMap.wood,
		targetting: TargettingMap.nearby,
		cost: 1,
		attack: { amount: 1, sides: 6, modifier: 0 },
		effects: [
			changeDamageWithSupportingElementAtLeastN(ElementMap.water, 1, 1),
			changeDamageAgainstElement(ElementMap.earth, 1),
			changeDamageAgainstElement(ElementMap.wood, -1),
		],
//		elementStrength: [
//			{ element: ElementMap.fire, dice: 1, sides: 6, modifier: 0 },
//			{ element: ElementMap.earth, dice: 1, sides: 6, modifier: 2 },
//			{ element: ElementMap.metal, dice: 1, sides: 6, modifier: 0 },
//			{ element: ElementMap.water, dice: 1, sides: 6, modifier: 0 },
//			{ element: ElementMap.wood, dice: 1, sides: 4, modifier: 0 },
//		]
	},
	{
		id: 'earthelemental',
		name: 'Elemental de tierra',
		info: `Creatura magica de tierra viva.
	[+1 contra <span class="armor water"></span>][-1 contra <span class="armor earth"></span>]
	[+1 si tienes 1 <span class="armor fire"></span>]`,
		movespeed: 0,
		element: ElementMap.earth,
		targetting: TargettingMap.everyone,
		hp: 10,
		defense:0,
		cost: 1,
		attackName: 'Hacer temblar la tierra.',
		attack: { amount: 1, sides: 4, modifier: 1 },
		effects: [
			changeDamageWithSupportingElementAtLeastN(ElementMap.fire, 1, 1),
			changeDamageAgainstElement(ElementMap.water, 1),
			changeDamageAgainstElement(ElementMap.earth, -1),
		],
//		elementStrength: [
//			{ element: ElementMap.fire, dice: 1, sides: 4, modifier: 1 },
//			{ element: ElementMap.earth, dice: 1, sides: 4, modifier: 0 },
//			{ element: ElementMap.metal, dice: 1, sides: 4, modifier: 1 },
//			{ element: ElementMap.water, dice: 1, sides: 4, modifier: 2 },
//			{ element: ElementMap.wood, dice: 1, sides: 4, modifier: 1 },
//		]
	},
	{
		id: 'druid',
		name: 'Druida',
		info: `Es un hechicero que controla las fuerzas de la naturaleza.
	[+1 contra <span class="armor water"></span>][-1 contra <span class="armor earth"></span>]
	[+1 si tienes 1 <span class="armor fire"></span>]`,

		movespeed: 0,
		element: ElementMap.earth,
		targetting: TargettingMap.random,
		hp: 10,
		defense:0,
		cost: 1,
		attackName: 'Lanzar un mini meteorito.',
		attack: { amount: 1, sides: 10, modifier: 1 },
		effects: [
			changeDamageWithSupportingElementAtLeastN(ElementMap.fire, 1, 1),
			changeDamageAgainstElement(ElementMap.water, 1),
			changeDamageAgainstElement(ElementMap.earth, -1),
		],
//		elementStrength: [
//			{ element: ElementMap.fire, dice: 1, sides: 10, modifier: 0 },
//			{ element: ElementMap.earth, dice: 1, sides: 8, modifier: 0 },
//			{ element: ElementMap.metal, dice: 1, sides: 10, modifier: 0 },
//			{ element: ElementMap.water, dice: 1, sides: 10, modifier: 2 },
//			{ element: ElementMap.wood, dice: 1, sides: 10, modifier: 0 },
//		]
	},
		
]

export let UnitMap = Object.fromEntries(Units.map(card => [ card.id, card ]))

export let Pool = Units.flatMap(card => Array(costFrequency[card.cost]).fill(card))

export function RollDice(dice:Dice) {
	return Array(dice.amount)
		.fill(0)
		.map(_ => Math.floor(Math.random()*dice.sides)+1+dice.modifier)
		.reduce((total, num) => total+num)
}


export function calculateDamage({attacker,defender,field}:EffectFunctionArgs) {
	// ahora el daño se calculara asi:
	// obtenemos todos los effectos que apliquen de unit
	let effects = attacker.unit.effects.map(effect => effect({attacker,defender,field}))
	// obtenemos el dado unit.attack y lo tiramos
	let damage = RollDice(attacker.unit.attack)
	let min = damage
	let max = attacker.unit.attack.amount*attacker.unit.attack.sides+attacker.unit.attack.modifier
	// aplicamos los efectos de dañó
	for (let effect of effects) {
		if(effect.name=="damage") {
			damage += effect.value
			max += effect.value
		}
		if(effect.name=="nodamage" && effect.value>0) max += effect.value
	}
	return {
		damage,
		min,
		max,
		effects:damage-min
	} as DamageRoll
}
export function calculateDamageStats(attacker:Unit, defender:Unit) {
	return calculateDamage({
		attacker: {
			unit: attacker,
			hp: 1, 
			x: 0, y: 0,
			setx: 0, sety: 0,
		}, 
		defender: {
			unit: defender,
			hp: 1, 
			x: 0, y: 0,
			setx: 0, sety: 0,
		}
	})
}

export interface DamageRoll {
	damage:number,
	max:number,
	min:number
}

export interface Coordinate {
	x: number;
	y: number;
}
