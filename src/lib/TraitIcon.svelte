<script lang="ts">
import { type Trait } from '$lib/system'
let { trait }:{trait:Trait} = $props()
</script>
<span class="icon" title="{trait.name}">{trait.icon}</span>
