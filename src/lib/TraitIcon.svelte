<script lang="ts">
import { type Trait } from '$lib/system'
let { trait }:{trait:Trait} = $props()
</script>
<span class="armor {trait.id}" title="{trait.name}"></span>
