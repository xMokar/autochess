export interface Trait {
	
	id: string;
	name: string;
	icon: string;
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

export interface Effect {
	type: string,
	message: string,
	active: boolean,
	value: number
}

export type CombatTraitFunction = (defender:Unit) => Effect
export type TeamTraitFunction = (field:Field) => Effect

export interface EffectFunctionArgs {
	attacker: Unit
	defender?: Unit
	field?: Field
}

export type EffectFunction = (args:EffectFunctionArgs) => Effect

export interface Unit {
	id: string;
	name: string;
	info: string;
	hp: number,
	defense: number;
	energymax: number;
	energypertick: number;
	traits: Trait[];
	targetting: Targetting;
	cost: number;
	attack: Dice;
	combatTraits: CombatTraitFunction[];
	teamTraits: TeamTraitFunction[];
}

export let NoUnit = {
	id: '',
	name: '',
	info: '',
	hp: 0,
	defense: 0,
	energymax: 0,
	energypertick: 0,
	traits: [],
	targetting: TargettingMap.closest1,
	cost: 0,
	attack: { amount: 1, sides: 1, modifier: 1 },
	combatTraits: [],
	teamTraits: [],
}

let Traits:Trait[] = [
	{
		id: 'fire',
		name: 'Fuego',
		icon: '🔥',
		
	},
	{
		id: 'earth',
		name: 'Tierra',
		icon: '⛰️',
	},
	{
		id: 'metal',
		name: 'Metal',
		icon: '⚙️',
	},
	{
		id: 'water',
		name: 'Agua',
		icon: '💧',
	},
	{
		id: 'wood',
		name: 'Madera',
		icon: '🪵',
	},
]
export let TraitMap = Object.fromEntries(Traits.map(c => [ c.id, c ]))

export interface ActiveUnit {
	player?:Player,
	unit:Unit
	setx:number
	sety:number
	hp: number
	x:number
	y:number
	energy:number
}

export type Field = ActiveUnit[]
export interface Player {
	id: string,
	name: string,
	hp: number,
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

function damageAgainstUnitEffect(trait:Trait, value:number): CombatTraitFunction {
	return (defender: Unit) => {
		let fullvalue = value>=0?`+${value}`:value
		let message = `${fullvalue} contra <span class="icon">${trait.icon}</span>`
		let type = "damage"
		let def_trait= defender.traits.find(t => t.id===trait.id)
		if(!defender || !def_trait || def_trait.id !== trait.id)
			return { type, value, message, active: false } as Effect
		return { type , value, message, active: true } as Effect
	}
} 

function teamTraitsBetween(trait:Trait, min:number, max:number, value:number): TeamTraitFunction {
	return (field:Field) => {
		let fullvalue = value>=0?`+${value}`:value
		let rangeMessage = ""
		if (min==max)
			rangeMessage = `solo ${min}`
		else if (max<9) 
			rangeMessage = `de ${min} a ${max}`
		else 
			rangeMessage = `al menos ${min}`
		let message = `${fullvalue} si tienes ${rangeMessage} <span class="icon">${trait.icon}</span>`
		let type = "damage"
		let support = field?.filter(u => u.hp>0 && u.unit.traits.find(t => t.id==trait.id)).length??0
		if((support >= min) && (support <= max))
			return { type, value, message, active: true } as Effect
		return { type, value, message, active: false }
	}
}


export let Units:Unit[] = [ 
	{ 
		id: 'mermaid',
		name: 'Sirena',
		info: `Es una bella chica de cabello azul con cola de pez. Ataca invocando una ola magica desde atras del enemigo.`,
		hp: 15,
		attack: { amount: 2, sides: 4, modifier: 1 },
		teamTraits: [
			teamTraitsBetween(TraitMap.metal, 1, 9, 1),
		],
		combatTraits: [
			damageAgainstUnitEffect(TraitMap.fire, 3),
			damageAgainstUnitEffect(TraitMap.water, -3),
		],
		defense:0,
		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.water],
		targetting: TargettingMap.farthest1,
		cost: 1,
	},
	{ 
		id: 'waterelemental',
		name: 'Elemental de agua',
		info: `Es una creatura de agua viva, con grandes poderes mágicos. Ataca invocando un remolino de agua rasgador.`,
		hp: 20,
		defense:0,
		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.water],
		targetting: TargettingMap.nearby,
		cost: 1,
		attack: { amount: 1, sides: 4, modifier: 3 },
		teamTraits: [
			teamTraitsBetween(TraitMap.metal, 1, 9, 1),
		],
		combatTraits: [
			damageAgainstUnitEffect(TraitMap.fire, 3),
			damageAgainstUnitEffect(TraitMap.water, -3),
		],
	},
	{ 
		id: 'gunner',
		name: 'Pistolero',
		info: `Es un rebelde sín causa que resuelve las problemas a balazos.\nAtaca disparando su pistola.`,
		hp: 15,
		defense:0,
		energymax: 3,
		energypertick: 1,
		traits: [TraitMap.metal],
		targetting: TargettingMap.farthest1_direct,
		cost: 1,
		attack: { amount: 1, sides: 4, modifier: 4 },
		teamTraits: [
			teamTraitsBetween(TraitMap.earth, 1, 9, 1),
		],
		combatTraits: [
			damageAgainstUnitEffect(TraitMap.wood, 3),
			damageAgainstUnitEffect(TraitMap.metal, -3),
		],
	},
	{ 
		id: 'metalelemental',
		name: 'Elemental de metal',
		info: `Es un soldado con armadura de oro.\nAtaca dando un espadazo.`,
		hp: 20,
		defense:1,
		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.metal],
		targetting: TargettingMap.closest1,
		cost: 1,
		attack: { amount: 1, sides: 4, modifier: 3 },
		teamTraits: [
			teamTraitsBetween(TraitMap.earth, 1, 9, 1),
		],
		combatTraits: [
			damageAgainstUnitEffect(TraitMap.wood, 3),
			damageAgainstUnitEffect(TraitMap.metal, -3),
		],
	},
	{
		id: 'firemage',
		name: 'Mago de fuego',
		info: `Es un mago elemental de fuego.\nAtaca lanzando una bola de fuego.`,
		hp: 15,
		defense: 0,
		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.fire],
		targetting: TargettingMap.farthest1_direct,
		cost: 1,
		attack: { amount: 1, sides: 8, modifier: 2 },
		teamTraits: [
			teamTraitsBetween(TraitMap.wood, 1, 9, 1),
		],
		combatTraits: [
			damageAgainstUnitEffect(TraitMap.metal, 3),
			damageAgainstUnitEffect(TraitMap.fire, -3),
		],
	},
	{
		id: 'fireelemental',
		name: 'Elemental de fuego',
		info: `Es una creatura de fuego vivo.\nAtaca dando un puñetazo ardiente.`,
		hp: 20,
		defense: 0,
		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.fire],
		targetting: TargettingMap.closest1,
		cost: 1,
		attack: { amount: 1, sides: 4, modifier: 3 },
		teamTraits: [
			teamTraitsBetween(TraitMap.wood, 1, 9, 1),
		],
		combatTraits: [
			damageAgainstUnitEffect(TraitMap.metal, 3),
			damageAgainstUnitEffect(TraitMap.fire, -3),
		],
	},
	{
		id: 'archer',
		name: 'Arquero',
		info: `Es un soldado con arco y flecha.\nAtaca disparando una lluvia de flechas.`,
		hp: 15,
		defense: 0,
		energymax: 3,
		energypertick: 1,
		traits: [TraitMap.wood],
		targetting: TargettingMap.farthest2,
		cost: 1,
		attack: { amount: 1, sides: 4, modifier: 1 },
		teamTraits: [
			teamTraitsBetween(TraitMap.water, 1, 9, 1),
		],
		combatTraits: [
			damageAgainstUnitEffect(TraitMap.earth, 3),
			damageAgainstUnitEffect(TraitMap.wood, -3),
		],
	},
	{
		id: 'woodelemental',
		name: 'Elemental de madera',
		info: `Es una criatura humanoide de madera viva, por algun motivo solo puede decir "yo soy noob". Ataca con un latigo de raices.`,
		hp: 20,
		defense: 0,
		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.wood],
		targetting: TargettingMap.nearby,
		cost: 1,
		attack: { amount: 1, sides: 4, modifier: 3 },
		teamTraits: [
			teamTraitsBetween(TraitMap.water, 1, 9, 1),
		],
		combatTraits: [
			damageAgainstUnitEffect(TraitMap.earth, 3),
			damageAgainstUnitEffect(TraitMap.wood, -3),
		],
	},
	{
		id: 'earthelemental',
		name: 'Elemental de tierra',
		info: `Creatura magica de tierra viva.\nAtaca haciendo temblar la tierra.`,
		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.earth],
		targetting: TargettingMap.everyone,
		hp: 20,
		defense:0,
		cost: 1,
		attack: { amount: 1, sides: 4, modifier: 0 },
		teamTraits: [
			teamTraitsBetween(TraitMap.fire, 1, 9, 1),
		],
		combatTraits: [
			damageAgainstUnitEffect(TraitMap.water, 3),
			damageAgainstUnitEffect(TraitMap.earth, -3),
		],
	},
	{
		id: 'druid',
		name: 'Druida',
		info: `Es un hechicero que controla las fuerzas de la naturaleza.\nAtaca lanzando un mini-meteorito.`,

		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.earth],
		targetting: TargettingMap.random,
		hp: 15,
		defense:0,
		cost: 1,
		attack: { amount: 1, sides: 10, modifier: 1 },
		teamTraits: [
			teamTraitsBetween(TraitMap.fire, 1, 9, 1),
		],
		combatTraits: [
			damageAgainstUnitEffect(TraitMap.water, 3),
			damageAgainstUnitEffect(TraitMap.earth, -3),
		],
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


export interface DamageRoll {
	damage:number,
	max:number,
	min:number,
	roll:string,
}

export interface Coordinate {
	x: number;
	y: number;
}
