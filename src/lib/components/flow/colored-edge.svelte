<script lang="ts">
  import { BaseEdge, EdgeLabel, getBezierPath, type EdgeProps, Position, useSvelteFlow } from "@xyflow/svelte";
	import Badge from "../ui/badge/badge.svelte";
  import { onMount, onDestroy } from 'svelte';
	import { Button } from "../ui/button";
	import { Trash2Icon } from "@lucide/svelte";

  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceHandleId,
    targetHandleId,
    selected
  }: EdgeProps = $props();

  // 获取SvelteFlow实例以删除边
  const { deleteElements } = useSvelteFlow();
  
  // 悬浮状态（仅用于label）
  let labelHovered = $state(false);

  // 解析类型
  function getTypeFromHandleId(id?: string) {
    if (!id) return '';
    const match = id.match(/^data-(in|out)-([a-zA-Z0-9]+)/);
    return match ? match[2] : undefined;
  }

  const type = getTypeFromHandleId(sourceHandleId ?? '') ?? getTypeFromHandleId(targetHandleId ?? '');
  
  const colorMap = {
    string: "#60a5fa",
    number: "#f59e42",
    boolean: "#10b981",
    object: "#a78bfa",
    array: "#f472b6"
  };

  // 判断是否为 exec 边
  const isExecEdge = (sourceHandleId?.startsWith('exec') || targetHandleId?.startsWith('exec'));

  // 颜色和样式
  const edgeColor = isExecEdge
    ? '#888'
    : colorMap[type as keyof typeof colorMap] ?? '#888';
  // exec 边用 class 控制动画
  const edgeClass = isExecEdge ? 'exec-animated-edge' : '';
  // 如果 labelHovered 或 selected，就用红色、虚线并加动画，否则按原样
  const edgeStyle = selected
    ? 'stroke: #ef4444; stroke-width: 2; stroke-dasharray: 8 4; animation: dashmove 1s linear infinite;'
    : (isExecEdge
        ? 'stroke: #888; stroke-width: 2; stroke-dasharray: 8 4; stroke-dashoffset: 0;'
        : `stroke: ${edgeColor}; stroke-width: 2;`
      );

  const [edgePath, labelX, labelY] = $derived(getBezierPath({ 
    sourceX, 
    sourceY, 
    targetX, 
    targetY, 
    sourcePosition: Position.Right, 
    targetPosition: Position.Left 
  }) );

  // 删除边的方法
  function deleteEdge(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    deleteElements({ edges: [{ id }] });
  }

  // 处理键盘事件
  function handleKeyDown(event: KeyboardEvent) {
    if ((event.key === 'Delete' || event.key === 'Backspace') && selected) {
      deleteEdge();
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
  });

  onDestroy(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });
</script>

<style>
  @keyframes dashmove {
    to {
      stroke-dashoffset: -24;
    }
  }
  .edge-animated-red {
    stroke: #ef4444 !important;
    stroke-width: 2;
    stroke-dasharray: 8 4;
    animation: dashmove 1s linear infinite;
  }
</style>

<BaseEdge
  {id}
  path={edgePath}
  style={
    selected && !isExecEdge
      ? 'stroke: #ef4444; stroke-width: 2; stroke-dasharray: 8 4; stroke-dashoffset: 0; animation: dashmove 1s linear infinite;'
      : isExecEdge
        ? 'stroke: #888; stroke-width: 2; stroke-dasharray: 8 4; stroke-dashoffset: 0; animation: dashmove 1s linear infinite;'
        : `stroke: ${edgeColor}; stroke-width: 2;`
  }
  class={selected ? 'edge-animated-red' : (isExecEdge ? 'exec-animated-edge' : '')}
/> 
  
  {#if !isExecEdge}
    <EdgeLabel class="!bg-transparent"
      x={labelX}
      y={labelY}
    >
      <div 
        onmouseenter={() => labelHovered = true}
        onmouseleave={() => labelHovered = false}
        aria-label="删除边"
        role="button"
        tabindex="0"
        onkeydown={(e) => e.key === 'Enter' && deleteEdge()}
        style="display: inline-flex; align-items: center;"
      >
      {#if labelHovered || selected}
      <Button variant="destructive" size="icon"  onclick={deleteEdge}>
        <Trash2Icon class="w-4 h-4" />
      </Button>
        
      {:else}
      <Badge variant="default" class="text-xs" style="background-color: {edgeColor};">{type}</Badge>
      {/if}
        
</div>
    </EdgeLabel>
  {/if}