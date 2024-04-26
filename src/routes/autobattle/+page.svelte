<script lang="ts">
    import { getPlayers } from '$lib/state';
import Battle from './Battle.svelte';

let [ player1, player2 ] = getPlayers()
</script>
<Battle home={player1} visitor={player2} />
