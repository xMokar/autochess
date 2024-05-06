import { RollDice, type ActiveUnit, type Coordinate, type DamageRoll, type EffectFunctionArgs, type Field, type Player, type Unit } from "./system";

function coordinatesBetween(point1:Coordinate, point2:Coordinate) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    
    // Calculate the number of points to interpolate (including both endpoints)
    const numPoints = Math.max(Math.abs(dx), Math.abs(dy));
	let coordinates = Array(numPoints).fill(null).map((_, i) => {
        const x = Math.round(point1.x + i * (dx / numPoints));
        const y = Math.round(point1.y + i * (dy / numPoints));
        return { x, y };
    })
	return coordinates.slice(1)
}

function coordinatesToActiveUnits(field:Field) {
	return (c:Coordinate) => field.find(activeUnit => activeUnit.x==c.x && activeUnit.y==c.y)
}

let calculateDistance = (source:ActiveUnit, target:ActiveUnit) => {
	let distance = Math.sqrt(
		Math.pow(source.x- target.x, 2)+
		Math.pow(source.y- target.y, 2)
	)
	return { target, distance }
}
let targetting:{[key:string]: (c:ActiveUnit, f:Field) => ActiveUnit[]} = {
		random: (_:ActiveUnit, target:Field) => !target.length? []:
			[target[Math.floor(Math.random()*target.length)]]
		,
		everyone: (_:ActiveUnit, target:Field) => target,
		nearby: (attacker:ActiveUnit, target:Field) => {
			let closest = target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => a.distance-b.distance)
				.map(({target}) => target) 
				.slice(0, 2)
			return !closest.length? []: [closest[Math.floor(Math.random()*closest.length)]]
		},
		closest1: (attacker:ActiveUnit, target:Field) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => a.distance-b.distance)
				.map(({target}) => target) 
				.slice(0,1)
		,
		weakest1: (attacker:ActiveUnit, target:Field) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a,b) => (a.target.hp-b.target.hp))
				.map(({target}) => target)
				.slice(0, 1)
		,
		farthest1: (attacker:ActiveUnit, target:Field) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target) 
				.slice(0,1)
		, 
		farthest2: (attacker:ActiveUnit, target:Field) => target
				.map((target) => calculateDistance(attacker, target))
				.sort((a, b) => b.distance-a.distance)
				.map(({target}) => target) 
				.slice(0,2)
		, 
		farthest1_direct: (attacker:ActiveUnit, target:Field) => {
			let [farthest1] = targetting.farthest1(attacker, target)
			if(!farthest1) return []
			let blocker = coordinatesBetween(attacker, farthest1)
				.map(coordinatesToActiveUnits(target))
				.filter(x => x)
				.shift()
			return [blocker??farthest1]
		}
}

function Attack(source:Player, activeUnit:ActiveUnit, target:Player) {
	let output:string[] = []
	let damage:DamageRoll = {
			damage:0,
			max:0,
			min:0,
	}
	if(!activeUnit.hp) {
		return {
			output,
			damage,
		}
	}
	let targets = targetting[activeUnit.unit.targetting.id](activeUnit, 
		target.field.filter(activeUnit => activeUnit.hp>0))
	if(!targets) {
		//log.push(`<b>${turn.player.name}</b>: ${turn.activeUnit.unit.name} esta fuera de combate.`)
		return {
			output,
			damage,
		}
	}
	for(let targetUnit of targets) {
		let damage = calculateDamage({attacker:activeUnit, defender:targetUnit, field:source.field})
		output.push(`<span class="text-${source.color}">${activeUnit.unit.name}</span>(${activeUnit.hp}) ataca a <span class="text-${target.color}">${targetUnit.unit.name}</span>(${targetUnit.hp}): <b>${damage.damage}</b> (efectos: ${damage.effects})`)
		targetUnit.hp = Math.max(targetUnit.hp-damage.damage, 0)
		if (targetUnit.hp==0) {
			output.push(`* <span class="text-${target.color}">${targetUnit.unit.name}</b></span> <span class="text-warning">ha caido</span>`)
		}
	}
	return {
		output,
		damage
	}
}

interface Turn {
	activeUnit:ActiveUnit,
	source:Player,
	target:Player,
}

type TurnsBySpeed = {[key:string]:Turn[]}
function *createTurnOrder(source:Player, target:Player) {
	let sourceUnits:Turn[] = source.field
		.filter(activeUnit => activeUnit.hp>0)
		.map(activeUnit => ({
			activeUnit, source, target
		}))
	let targetUnits:Turn[] = target.field
		.filter(activeUnit => activeUnit.hp>0)
		.map(activeUnit => ({
			activeUnit, source:target, target: source
		}))

	let splitUnitsBySpeed = (player:Turn[]) => player 
		.reduce((total, u) => {
			if(!total[String(u.activeUnit.unit.movespeed)])
				total[String(u.activeUnit.unit.movespeed)] = []
			total[String(u.activeUnit.unit.movespeed)].push(u)
			return total
		}, {} as TurnsBySpeed)

	let sourceUnitsBySpeed = splitUnitsBySpeed(sourceUnits)
	let targetUnitsBySpeed = splitUnitsBySpeed(targetUnits)

	let allUnitsBySpeed = splitUnitsBySpeed([...sourceUnits, ...targetUnits])
	let speeds = [...Object.keys(allUnitsBySpeed)]
		.map(Number)
		.sort((a,b)=>b-a)
		.map(String)

	for(let speed of speeds) {
		let pop = (turns:TurnsBySpeed) => {
			if(!turns[speed]) return undefined
			return turns[speed].pop()
		}
		while(true) {
			let sourceTurn = pop(sourceUnitsBySpeed)
			if(sourceTurn) yield(sourceTurn)
			let targetTurn = pop(targetUnitsBySpeed)
			if(targetTurn) yield(targetTurn)
			if(!sourceTurn && !targetTurn) break;
		}
	}
}

export function combatRound(source:Player, target:Player)  {
	let output = []
	output.push(`<b class="text-${source.color}">${source.name}</b> tiene preferencia.`)
	let turns = createTurnOrder(source, target)

	let total = {
		[source.name]: {
			dmgmax: 0,
			dmg: 0,
		},
		[target.name]: {
			dmgmax: 0,
			dmg: 0,
		}
	}
	
	for(let turn of turns) {
		let attack = Attack(turn.source, turn.activeUnit, turn.target)
		if (!attack.damage)
			continue
		total[turn.source.name].dmgmax += attack.damage.max
		total[turn.source.name].dmg += attack.damage.damage
		output.push(...attack.output)
	}
	output.push('')
	return output
}

function setBattleCoordinates(player:Player) {
	for(let activeUnit of player.field) {
		activeUnit.x = activeUnit.setx
		activeUnit.y = player.mirrored? -activeUnit.sety-1: activeUnit.sety
	}
}

function resetUnits(player:Player) {
	for(let activeUnit of player.field) {
		activeUnit.hp = activeUnit.unit.hp
	}
}

export function initBattle(player1:Player, player2: Player) {
	for(let player of [player1, player2]) {
		resetUnits(player)
		setBattleCoordinates(player)
	}
}

export function fight(player1:Player, player2:Player) {
	let log = []
	initBattle(player1, player2)
	let player1Alive = true
	let player2Alive = true
	for(let i=0; i<5; i++) {
		let homeFirst = Math.random()*100>50
		if (homeFirst)
			log.push(...combatRound(player1, player2))
		else
			log.push(...combatRound(player2, player1))
		player1Alive = player1.field.filter(activeUnit => activeUnit.hp>0).length>0
		player2Alive = player2.field.filter(activeUnit => activeUnit.hp>0).length>0
		if(!player1Alive || !player2Alive) 
			break
	}
	let showFieldHP = (player:Player) => {
		log.push('Unidades vivas:')
		for(let unit of player.field) {
			if(unit.hp===0)
				continue
			log.push(`${unit.unit.name}: ${unit.hp}/${unit.unit.hp}`)
		}
	}
	if (player1Alive && player2Alive) {
		log.push("Empate!")
		return {
			winner: undefined,
			log
		}
	} else if (player1Alive) {
		showFieldHP(player1)
		log.push(`<b class="text-${player1.color}">${player1.name}</b> es el ganador`)
		return {
			winner: player1,
			log
		}
	} else  {
		showFieldHP(player2)
		log.push(`<b class="text-${player2.color}">${player2.name}</b> es el ganador`)
		return {
			winner: player2,
			log
		}
	}
}

export function calculateEffects({attacker,defender,field}: EffectFunctionArgs) {
	return attacker.unit.effects.map(effect => effect({attacker,defender,field}))
}
export function calculateFieldEffects(attacker:Unit,field:Field|undefined) {
	return attacker.effects.map(effect => effect({attacker:{
		unit:attacker,
	} as ActiveUnit,field}))
}
export function calculateDamage({attacker,defender,field}:EffectFunctionArgs) {
	// ahora el daño se calculara asi:
	// obtenemos todos los effectos que apliquen de unit
	let effects = calculateEffects({attacker,defender,field})
	// obtenemos el dado unit.attack y lo tiramos
	let damage = RollDice(attacker.unit.attack)
	let min = attacker.unit.attack.amount+attacker.unit.attack.modifier
	let max = attacker.unit.attack.amount*attacker.unit.attack.sides+attacker.unit.attack.modifier
	//console.log(`${attacker.unit.name} ataca a ${defender?.unit.name} con ${attacker.unit.attack.amount}d${attacker.unit.attack.sides}+${attacker.unit.attack.modifier}`)
	// aplicamos los efectos de dañó
	for (let effect of effects) {
		if(effect.type != "damage") continue;
		if(effect.active) {
			//console.log(`- Agregar efecto ${effect.value} (${effect.message})`)
			damage += effect.value
			max += effect.value
			min += effect.value
		} 
	}
	min = Math.max(min, 0)
	//console.log(`Min: ${min}, Max: ${max}, effects: ${effects}`)
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
