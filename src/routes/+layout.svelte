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

<Toaster />
<div class="h-screen w-screen bg-background">
    {@render children?.()}
</div>