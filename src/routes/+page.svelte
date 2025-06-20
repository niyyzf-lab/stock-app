<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    onMount(() => {
        goto("/work-space");
    });
</script>

<div>
    <h1>Hello World</h1>
</div>