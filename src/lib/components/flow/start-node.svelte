<script lang="ts">
    import BaseNode from "./base-node.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Handle, Position, type NodeProps, useSvelteFlow } from "@xyflow/svelte";
    import { Button } from "../ui/button";
    import { MoreHorizontalIcon, PlayIcon, CircleSlashIcon } from "@lucide/svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { Badge } from "../ui/badge";
    
    let { id, data, selected }: NodeProps = $props();
    let { updateNodeData } = useSvelteFlow();
    
    // 定义运行状态样式映射
    type StatusType = 'idle' | 'running' | 'completed' | 'error';
    
    let statusColors: Record<StatusType, string> = {
        idle: "bg-gray-200",
        running: "bg-blue-500 animate-pulse",
        completed: "bg-green-500",
        error: "bg-red-500"
    };
</script>

<BaseNode id={id} data={data} selected={selected} title="运行节点" hideLeftHandle>
    <div class="flex flex-col gap-3 p-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <div class={`size-3 rounded-full ${data.runStatus ? statusColors[data.runStatus as StatusType] : statusColors.idle}`}></div>
                <span class="text-sm font-medium">状态: {data.runStatus || "未运行"}</span>
            </div>
            <Badge variant="outline" class="text-xs">{data.runTime || "0s"}</Badge>
        </div>
        
        <div class="flex items-center justify-center mt-1">
            <Button variant="outline" size="sm" class="w-full gap-2">
                <PlayIcon class="size-4" />
                <span>开始运行</span>
            </Button>
        </div>
    </div>
    
    {#snippet actions()}
        <div class="flex gap-1 pr-1">
            <Button variant="outline" size="icon" class="h-6 w-6">
                <PlayIcon class="size-4" />
            </Button>
            <Button variant="outline" size="icon" class="h-6 w-6">
                <CircleSlashIcon class="size-4" />
            </Button>
        </div>
    {/snippet}
    
   
</BaseNode>