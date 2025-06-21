<script lang="ts">
    import { TauriApi } from "@/services/dotNetController.svelte";
    import { onMount } from "svelte";
    import Button from "@/components/ui/button/button.svelte";
    const greet = async ()=>{
        const  userData = { user: "666", pass: '<secret>' }
        const result = await TauriApi.invokePlugin<string>({ controller: 'home', action: 'login', data: userData })
        console.log(result)
    }
</script>

<Button onclick={greet}>
    测试
</Button>