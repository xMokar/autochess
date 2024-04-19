interface ArmorType {
	id: string;
	name: string;
}

interface Targetting {
	id: string;
	name: string;
}

let targetting:Targetting[] = [
	{
		id: 'closest1',
		name: 'Enemigo mas cercano',
	},
	{
		id: 'farthest1',
		name: 'Enemigo mas lejano',
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
			cloth: 3,
			leather: 3,
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
			iron:3
		}
	},
	{
		id: 'archer',
		name: 'Arquero',
		hp: 10,
		attack: 5,
		defense: 1,
		movespeed: 6,
		armorType: ArmorTypeMap.cloth,
		targetting: TargettingMap.farthest1,
		cost: 1,
		armorpen: {
			cloth: 2,
			leather: 3,
			iron: 1,
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
			iron: 1,
		}
	},
		
]

export let ChampMap = Object.fromEntries(Champs.map(card => [ card.id, card ]))

export let Pool = Champs.flatMap(card => Array(costFrequency[card.cost]).fill(card))
