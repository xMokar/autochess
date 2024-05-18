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
		id: 'unit',
		name: '',
		icon: '*️',
	},
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
	{
		id: 'female',
		name: 'Mujer',
		icon: '♀️',
	},
	{
		id: 'male',
		name: 'Hombre',
		icon: '♂️',
	},
	{
		id: 'guardian',
		name: 'Guardian',
		icon: '🛡️'
	},
]
export let TraitMap = Object.fromEntries(Traits.map(c => [ c.id, c ]))


function damageAgainstUnitEffect(trait:Trait, value:number): CombatTraitFunction {
	return (defender: BoardUnit) => {
		let fullvalue = value>=0?`+${value}`:value
		let message = `${fullvalue} contra <span class="icon">${trait.icon}</span>`
		let type = "attack.modifier"
		let def_trait= defender.unit.traits.find(t => t.id===trait.id)
		if(!defender || !def_trait || def_trait.id !== trait.id)
			return [{ type, value, message, active: false, target: TraitMap.unit }]
		return [{ type , value, message, active: true, target: TraitMap.unit }]
	}
} 

export let boardTraitRanks:TraitRank[] = [
	{ 
		trait: TraitMap.fire, 
		message: 'Al quemarse, el Fuego produce cenizas, que enriquecen y fertilizan la Tierra.<br>Las unidades de tierra harán más daño.',
		levels: [
			{
				amount: 1,
				effects: [{type: "attack.modifier", value: 1, target: TraitMap.earth }]
			},
			{
				amount: 2,
				effects: [{type: "attack.modifier", value: 3, target: TraitMap.earth }]
			},
		],
	},
	{
		trait: TraitMap.earth, 
		message: 'Dentro de la Tierra, los minerales y metales se forman y se extraen.<br>Las unidades de metal harán más daño.',
		levels: [
			{
				amount: 1,
				effects: [{type: "attack.modifier", value: 1, target: TraitMap.metal }]
			},
			{
				amount: 2,
				effects: [{type: "attack.modifier", value: 3, target: TraitMap.metal }]
			},
		],
	},
	{
		trait: TraitMap.wood,
		message: 'La Madera, representada por árboles y plantas, es el combustible que alimenta el Fuego.<br>Las unidades de fuego harán más daño',
		levels: [
			{
				amount: 1,
				effects: [{type: "attack.modifier", value: 1, target: TraitMap.fire }]
			},
			{
				amount: 2,
				effects: [{type: "attack.modifier", value: 3, target: TraitMap.fire }]
			},
		],
	},
	{
		trait: TraitMap.water, 
		message: 'El Agua nutre las semillas y plantas, permitiendo que crezcan y se conviertan en Madera.<br>Las unidades de agua harán más daño',
		levels: [
			{
				amount: 1,
				effects: [
					{type: "attack.modifier", value: 1, target: TraitMap.wood },
					{type: "hp", value: 4, target: TraitMap.unit},
				]
			},
			{
				amount: 2,
				effects: [
					{type: "attack.modifier", value: 3, target: TraitMap.wood },
					{type: "hp", value: 4, target: TraitMap.unit},
				]
			},
		],
	},
	{
		trait: TraitMap.metal, 
		message: 'El Metal, especialmente en forma de minerales, puede atraer y condensar agua. Además, en un sentido simbólico, el metal puede representar la pureza y la estructura que permite la conducción y el flujo del agua.<br>Las unidades de agua harán más daño',
		levels: [
			{
				amount: 1,
				effects: [{type: "attack.modifier", value: 1, target: TraitMap.water }]
			},
			{
				amount: 2,
				effects: [{type: "attack.modifier", value: 3, target: TraitMap.water }]
			},
		],
	}
]

export function updatePlayerTraits(player:Player) {
	let countUnitTraits = (trait:Trait) => player.board
		.reduce((total, curr) => total+(curr.unit.traits.map(t=>t.id).includes(trait.id)? 1: 0), 0)
	player.traits = boardTraitRanks.map(traitrank => (
		{ ...traitrank, 
			active: countUnitTraits(traitrank.trait),
			level: 0 
		} as TraitRankActive))
		.filter(traitrank => traitrank.active>0)
		.map(traitrank => {
			// create a copy of the levels sorted by amount descending
			// to get the first biggest level matching
			traitrank.level = traitrank.levels.findLastIndex(rank => traitrank.active>=rank.amount)
			traitrank.effects = traitrank.levels[traitrank.level].effects
			return traitrank
		})
	player.board = player.board.map(bu => {
		bu.effects = player.traits.flatMap(trait => trait.effects)
			.filter(trait => bu.unit.traits.map(t => t.id).includes(trait.target.id))
		return bu
	})
}

export let Units:Unit[] = [ 
	{ 
		id: 'mermaid',
		name: 'Sirena',
		info: `Es una bella chica de cabello azul con cola de pez. Ataca invocando una ola magica desde atras del enemigo.`,
		hp: 15,
		attack: { amount: 2, sides: 4, modifier: 1 },
		combatTraits: [
			damageAgainstUnitEffect(TraitMap.fire, 3),
			damageAgainstUnitEffect(TraitMap.water, -3),
		],
		defense:0,
		energymax: 4,
		energypertick: 1,
		traits: [TraitMap.unit, TraitMap.water, TraitMap.female],
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
		traits: [TraitMap.unit, TraitMap.water, TraitMap.guardian],
		targetting: TargettingMap.nearby,
		cost: 1,
		attack: { amount: 1, sides: 4, modifier: 3 },
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
		traits: [TraitMap.unit, TraitMap.metal, TraitMap.male],
		targetting: TargettingMap.farthest1_direct,
		cost: 1,
		attack: { amount: 1, sides: 4, modifier: 4 },
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
		traits: [TraitMap.unit, TraitMap.metal, TraitMap.guardian],
		targetting: TargettingMap.closest1,
		cost: 1,
		attack: { amount: 1, sides: 4, modifier: 3 },
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
		traits: [TraitMap.unit, TraitMap.fire, TraitMap.female],
		targetting: TargettingMap.farthest1_direct,
		cost: 1,
		attack: { amount: 1, sides: 8, modifier: 2 },
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
		traits: [TraitMap.unit, TraitMap.fire, TraitMap.guardian],
		targetting: TargettingMap.closest1,
		cost: 1,
		attack: { amount: 1, sides: 4, modifier: 3 },
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
		traits: [TraitMap.unit, TraitMap.wood, TraitMap.male],
		targetting: TargettingMap.farthest2,
		cost: 1,
		attack: { amount: 1, sides: 4, modifier: 1 },
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
		traits: [TraitMap.unit, TraitMap.wood, TraitMap.guardian],
		targetting: TargettingMap.nearby,
		cost: 1,
		attack: { amount: 1, sides: 4, modifier: 3 },
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
		traits: [TraitMap.unit, TraitMap.earth, TraitMap.guardian],
		targetting: TargettingMap.everyone,
		hp: 20,
		defense:0,
		cost: 1,
		attack: { amount: 1, sides: 4, modifier: 0 },
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
		traits: [TraitMap.unit, TraitMap.earth,TraitMap.male],
		targetting: TargettingMap.random,
		hp: 15,
		defense:0,
		cost: 1,
		attack: { amount: 1, sides: 10, modifier: 1 },
		combatTraits: [
			damageAgainstUnitEffect(TraitMap.water, 3),
			damageAgainstUnitEffect(TraitMap.earth, -3),
		],
	},
		
]

export let UnitMap = Object.fromEntries(Units.map(card => [ card.id, card ]))

let costFrequency = [ 0, 29, 22, 18, 12, 10 ]
export let Pool = Units.flatMap(card => Array(costFrequency[card.cost]).fill(card))


