<script lang="ts">
    import { getPlayers } from '$lib/state';
import Battle from './Battle.svelte';

let [ _player1, _player2 ] = getPlayers()
let player1 = $state(_player1)
let player2 = $state(_player2)
</script>
<Battle bind:home={player1} bind:visitor={player2} />
