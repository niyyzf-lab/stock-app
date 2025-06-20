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
            <div class="ml-auto">
                <WindowController />
            </div>
        </header>
        <div class="flex-1 h-full w-full">
           {@render children?.()}
        </div>
    </Sidebar.Inset>
</Sidebar.Provider>