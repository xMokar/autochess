<script lang="ts">
import { type Element } from '$lib/system'
let { element }:{element:Element} = $props()
</script>
<span class="armor {element.id}" title="{element.name}"></span>
