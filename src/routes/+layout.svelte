<script lang="ts">
    import { onMount } from "svelte";
    import "../app.css";
    import "../main.css";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import AppSidebar from "$lib/components/app-sidebar.svelte";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import { windowState, windowStore } from "@/stores/windowStore.svelte";
    import WindowController from "$lib/components/window-controller.svelte";
    import { Toaster } from "$lib/components/ui/sonner";
    // 修复 children 声明问题
    const props = $props();
    const children = $derived(props.children);
    
    let isMaximized = $derived(windowState.isMaximized);
    
    onMount(() => {
        windowStore.initialize();
    });
    
    
   
</script>

<div class={`h-full  ${isMaximized ? 'p-0 bg-background dark:bg-background' : 'p-2.5'}`}>
    <div class={`h-full w-full overflow-hidden bg-card  ${isMaximized ? 'rounded-none' : 'rounded-lg'} shadow-[0_4px_10px_rgba(0,0,0,0.15),0_0_2px_rgba(0,0,0,0.2),inset_0_1px_5px_rgba(255,255,255,0.9)]`}>
        <Toaster />
        {@render children?.()}
    </div>
</div>