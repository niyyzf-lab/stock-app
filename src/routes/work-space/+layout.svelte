<script lang="ts">
   
    import AppSidebar from "$lib/components/app-sidebar.svelte";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { windowState } from "@/stores/windowStore.svelte";
    import WindowController from "$lib/components/window-controller.svelte";
    // 修复 children 声明问题
    const props = $props();
    const children = $derived(props.children);
    
 
    
    
   
</script>

<Sidebar.Provider style="--sidebar-width: 250px;">
    <AppSidebar />
    <Sidebar.Inset>
        <div class="flex-1 h-full w-full">
           {@render children?.()}
        </div>
    </Sidebar.Inset>
</Sidebar.Provider>