<script lang="ts">
    import { onMount } from "svelte";
    import "../app.css";
    import "../main.css";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import AppSidebar from "$lib/components/app-sidebar.svelte";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    
    // 修复 children 声明问题
    const props = $props();
    const children = $derived(props.children);
    
    let isMaximized = $state(false);
    let showAlert = $state(true);
    
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

<div class={`h-full  ${isMaximized ? 'p-0 bg-background dark:bg-background' : 'p-2.5'}`}>
    <div class={`h-full w-full overflow-hidden bg-card  ${isMaximized ? 'rounded-none' : 'rounded-lg'} shadow-[0_4px_10px_rgba(0,0,0,0.15),0_0_2px_rgba(0,0,0,0.2),inset_0_1px_5px_rgba(255,255,255,0.9)]`}>
        <Sidebar.Provider style="--sidebar-width: 350px;">
            <AppSidebar />
            <Sidebar.Inset>
                <header class="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4" data-tauri-drag-region>
                    <Sidebar.Trigger class="-ml-1" />
                    <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
                    <Breadcrumb.Root>
                        <Breadcrumb.List>
                            <Breadcrumb.Item class="hidden md:block">
                                <Breadcrumb.Link href="#">All Inboxes</Breadcrumb.Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Separator class="hidden md:block" />
                            <Breadcrumb.Item>
                                <Breadcrumb.Page>Inbox</Breadcrumb.Page>
                            </Breadcrumb.Item>
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                </header>
                <div class="flex flex-1 flex-col gap-4 p-4">
                   {@render children?.()}
                </div>
            </Sidebar.Inset>
        </Sidebar.Provider>
    </div>
</div>