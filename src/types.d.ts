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
