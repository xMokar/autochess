<script lang="ts">
import { type Trait } from '$lib/system'
let { trait }:{trait:Trait} = $props()
</script>
<span class="float-end armor {trait.id}" title="{trait.name}"></span>
