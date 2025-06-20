<script lang="ts">
    const { children } = $props();
    import { onMount } from "svelte";
    import "../main.css";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    // import { windowState } from "$lib/window.svelte";
    // $effect(() => {
    //     console.log(windowState);
    // });
    
    let isMaximized = $state(false);
    
    onMount(() => {
        const window = getCurrentWindow();
        
        // Get initial maximized state
        window.isMaximized().then((maximized) => {
            isMaximized = maximized;
            
        });
        
        // Listen for window resize events (including maximize/minimize)
        let unlisten: (() => void) | undefined;
        window.onResized(() => {
            window.isMaximized().then((maximized) => {
                isMaximized = maximized;
                
            });
        }).then(unlistenFn => {
            unlisten = unlistenFn;
        });
        
        return () => {
            // Clean up listener when component is destroyed
            unlisten && unlisten();
        };
    });
    
    
    
    $effect(() => {
        console.log('Window maximized state:', isMaximized);
    });
</script>

<div class="container" class:maximized={isMaximized}>
    <div class="content">
        <div class="header" data-tauri-drag-region>
            <!-- You can add UI elements here that reflect the maximized state -->
            {#if isMaximized}
                <span class="window-state">最大化</span>
            {:else}
                <span class="window-state">正常</span>
            {/if}
        </div>
      
        {@render children?.()}
    </div>
</div>

<style>
    .container{
        height: 100%;
        padding: 10px;
        overflow: hidden;
    }
    .content{
        height: 100%;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15),
                    0 0 2px rgba(0, 0, 0, 0.2),
                    inset 0 1px 5px rgba(255, 255, 255, 0.9);
        width: 100%;
        padding: 10px;
        background-color: #fff;
        border-radius: 10px;
    }
    
    .container.maximized {
        padding: 0;
        background-color: #000;
    }
    .maximized .content{
        border-radius: 0;
    }
    
    .header{
        background-color: #000;
        width: 100%;
        height: 50px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 15px;
    }
    
  
    
    .window-state {
        color: white;
        font-size: 14px;
    }
</style>