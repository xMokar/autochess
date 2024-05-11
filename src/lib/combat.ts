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
			roll:'',
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
		let damage = calculateDamage(activeUnit.unit, targetUnit.unit, source.field)
		output.push(`<span class="text-${source.color}">${activeUnit.unit.name}</span>(${activeUnit.hp}) ataca a <span class="text-${target.color}">${targetUnit.unit.name}</span>(${targetUnit.hp}): <b>${damage.damage}</b> (${damage.roll})`)
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

export function combatRound(source:Player, target:Player)  {
	let output = []
	output.push(`<b class="text-${source.color}">${source.name}</b> tiene preferencia.`)
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
	let units = [...sourceUnits, ...targetUnits]
	let tick = () => {
		output.push('Tick')
		for(let unit of units) {
			unit.activeUnit.energy+=unit.activeUnit.unit.energypertick
		}
	}
	let unitsReady = () => units
		.filter(u => u.activeUnit.energy==u.activeUnit.unit.energymax)

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
	
	for(let i = 0; i < 20; i++) {
		tick()
		for(let turn of unitsReady()) {
			let attack = Attack(turn.source, turn.activeUnit, turn.target)
			if (!attack.damage)
				continue
			total[turn.source.name].dmgmax += attack.damage.max
			total[turn.source.name].dmg += attack.damage.damage
			output.push(...attack.output)
			turn.activeUnit.energy=0
		}
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
		activeUnit.energy = 0
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
	let log = [`Combate entre <span class="text-${player1.color}">${player1.name}</span> y <span class="text-${player2.color}">${player2.name}</span>`]
	initBattle(player1, player2)
	let player1Alive = true
	let player2Alive = true

	let homeFirst = Math.random()*100>50
	if (homeFirst)
		log.push(...combatRound(player1, player2))
	else
		log.push(...combatRound(player2, player1))
	player1Alive = player1.field.filter(activeUnit => activeUnit.hp>0).length>0
	player2Alive = player2.field.filter(activeUnit => activeUnit.hp>0).length>0

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
			loser: undefined,
			log
		}
	} else if (player1Alive) {
		showFieldHP(player1)
		log.push(`<b class="text-${player1.color}">${player1.name}</b> es el ganador`)
		return {
			winner: player1,
			loser: player2,
			log
		}
	} else  {
		showFieldHP(player2)
		log.push(`<b class="text-${player2.color}">${player2.name}</b> es el ganador`)
		return {
			winner: player2,
			loser: player1,
			log
		}
	}
}

export function calculateCombatTraits(attacker:Unit, defender:Unit) {
	return attacker.combatTraits.map(effect => effect(defender))
}
export function calculateTeamTraits(attacker:Unit,field:Field) {
	return attacker.teamTraits.map(effect => effect(field))
}
export function calculateDamage(attacker:Unit,defender:Unit|undefined,field:Field|undefined=undefined) {
	// ahora el daño se calculara asi:
	// obtenemos todos los effectos que apliquen de la unidad
	let teamEffects = !field? []:
		calculateTeamTraits(attacker,field)
		
	let combatEffects = !defender? []:
		calculateCombatTraits(attacker, defender)
		
	let effects = [...teamEffects, ...combatEffects]
	// obtenemos el dado unit.attack y lo tiramos
	let damage = RollDice(attacker.attack)
	let damageBeforeEffects = damage
	let min = attacker.attack.amount+attacker.attack.modifier
	let max = attacker.attack.amount*attacker.attack.sides+attacker.attack.modifier
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
	let effectDamage = damage-damageBeforeEffects
	//console.log(`Dmg: ${damage} Min: ${min}, Max: ${max}, effects: ${effectDamage}`)
	
	return {
		damage,
		min,
		max,
		roll: `${attacker.attack.amount}d${attacker.attack.sides}+${attacker.attack.modifier}+${effectDamage}`
	} as DamageRoll
}
