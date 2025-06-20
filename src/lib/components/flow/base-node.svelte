<script lang="ts">
	import { dev } from '$app/environment';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import { Handle, Position } from '@xyflow/svelte';
	import { PlayIcon } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	const {
		id,
		selected,
		data,
		children,
		title,
		description,
		footer,
		actions,
		className,
        hideLeftHandle=false,
        hideRightHandle=false
	}: {
		id: string; 
		data: Record<string, any>;
		children: Snippet;
		title?: Snippet | string;
		description?: Snippet | string;
		footer?: Snippet | string;
		actions?: Snippet;
		className?: string;
		selected?: boolean;
        hideLeftHandle?: boolean;
        hideRightHandle?: boolean;
	} = $props();

	// 新增本地状态控制调试面板展开/收起
	let showDebug = $state(false);
</script>

<Card.Root data-selected={selected} data-id={id} class={cn('p-0 gap-0 [data-selected=true]:border-primary ', className)}>
	
		<Card.Header
			class={cn('p-2 px-0 bg-accent rounded-t-[calc(var(--radius)+3px)]', title && description ? 'gap-1' : 'gap-0', actions && 'flex items-center justify-between')}
		>
            <!-- 触发手柄 -->
           <div class=" relative mr-2">
            {#if !hideLeftHandle}
                <Handle type="target" position={Position.Left} id="exec-in" class="!w-2 !h-5 !bg-muted-foreground"/>
            {/if}
           </div>
			<div class="flex-1">
                {#if title && typeof title === 'string'}
				<Card.Title>{title}</Card.Title>
			{:else if title && typeof title === 'function'}
				{@render title?.()}
			{/if}
			{#if description && typeof description === 'string'}
				<Card.Description>{description}</Card.Description>
			{:else if description && typeof description === 'function'}
				{@render description?.()}
			{/if}
            </div>
			{#if actions && typeof actions === 'function'}
				{@render actions?.()}
			{/if}
            <div class="relative ml-1">
                {#if !hideRightHandle}
                    <Handle type="source" position={Position.Right} id="exec-out" class="!w-2 !h-5 !bg-muted-foreground">
                    </Handle>
                {/if}
               </div>
		</Card.Header>
	
	<Card.Content class="p-0 relative">
		{@render children?.()}
        {#if dev}
           <div class="text-xs text-muted-foreground px-2 pb-1"> 
            <div>ID: {id}</div>
            <div>Data: {JSON.stringify(data)}</div>
           </div>
        {/if}
	</Card.Content>
	{#if footer && typeof footer === 'string'}
		<Card.Footer class="px-2 text-sm text-muted-foreground">{footer}</Card.Footer>
	{:else if footer && typeof footer === 'function'}
		<Card.Footer class="p-0">
			{@render footer?.()}
		</Card.Footer>
	{/if}
    
</Card.Root>

<style>
    :global(.svelte-flow__handle) {
        width: 8px;
        height: 20px;
        border-radius: 4px;
        background-color: var(--primary);
        /* 添加简约优美的阴影 */
        border: 1px solid var(--border);
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08), 0 1.5px 4px 0 rgba(0,0,0,0.04);
        cursor: grab;
        &:hover {
            background-color: var(--foreground);
            opacity: 0.5;
        }
    }
    :global(.svelte-flow__handle-right, .svelte-flow__handle-left) {
        width: 8px;
        height: 20px;
        
    }
    :global(.svelte-flow__handle-top, .svelte-flow__handle-bottom) {
        width: 20px;
        height: 8px;
        
    }
    /* 根据数据类型自动赋予不同颜色 */
    :global(.svelte-flow__handle[data-handleid^="data-in-string"], .svelte-flow__handle[data-handleid^="data-out-string"]) {
        background-color: #60a5fa; /* 蓝色 */
    }
    :global(.svelte-flow__handle[data-handleid^="data-in-number"], .svelte-flow__handle[data-handleid^="data-out-number"]) {
        background-color: #f59e42; /* 橙色 */
    }
    :global(.svelte-flow__handle[data-handleid^="data-in-boolean"], .svelte-flow__handle[data-handleid^="data-out-boolean"]) {
        background-color: #10b981; /* 绿色 */
    }
    :global(.svelte-flow__handle[data-handleid^="data-in-object"], .svelte-flow__handle[data-handleid^="data-out-object"]) {
        background-color: #a78bfa; /* 紫色 */
    }
    :global(.svelte-flow__handle[data-handleid^="data-in-array"], .svelte-flow__handle[data-handleid^="data-out-array"]) {
        background-color: #f472b6; /* 粉色 */
    }
    /* 你可以继续扩展更多类型 */
</style>