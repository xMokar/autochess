declare global {
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
	interface Dice {
		amount: number,
		sides: number,
		modifier: number,
	}

	export interface Effect {
		target: Trait,
		type: string,
		value: number
	}

	export type CombatTraitFunction = (defender:BoardUnit) => Effect[]
	export type TeamTraitFunction = (board:Board) => Effect[]

	export interface EffectFunctionArgs {
		attacker: Unit
		defender?: Unit
		board?: Board
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
	}
	export interface BoardUnit {
		player?:Player,
		unit:Unit
		setx:number
		sety:number
		hp: number
		x:number
		y:number
		energy:number
		effects: Effect[]
	}

	interface TraitRank {
		trait: Trait
		levels: {
			amount: number
			effects: Effect[]
		}[]
	}

	interface TraitRankActive extends TraitRank {
		active: number,
		level: number
		effects: Effect[]
	}
	export type Board = BoardUnit[]
	export interface Player {
		id: string,
		name: string,
		hp: number,
		board: Board,
		mirrored: boolean,
		color: string,
		finished: boolean,
		maxgold: number,
		gold: number,
		rolls: number,
		traits: TraitRankActive[],
		hand: Unit[]
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

}
export {}
