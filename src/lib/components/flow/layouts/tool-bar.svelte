<script lang="ts">
  import { useSvelteFlow, type Edge } from '@xyflow/svelte';
  import { LayoutDashboard, Undo, Redo } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import type { Node } from '@xyflow/svelte';

  interface ToolbarProps {
    layoutWithDagre: (nodes: Node[], edges: Edge[], direction?: string) => Node[];
    nodes: Node[];
    edges: Edge[];
    setNodes: (nodes: Node[]) => void;
  }

  const { layoutWithDagre, nodes, edges, setNodes }: ToolbarProps = $props();
  const flow = useSvelteFlow();

  function autoLayout() {
    setNodes(layoutWithDagre(nodes, edges));
    flow.fitView();
  }
</script>

<div class="flex items-center gap-1" data-tauri-drag-region>
  <Button
    variant="ghost"
    class="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
    onclick={autoLayout}>
    <LayoutDashboard class="w-5 h-5" />
    <span>自动排序</span>
  </Button>
  <Button variant="ghost" class="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
    onclick={() => {/* 撤销逻辑 */}}>
    <Undo class="w-5 h-5" />
    <span>撤销</span>
  </Button>
  <Button variant="ghost" class="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
    onclick={() => {/* 重做逻辑 */}}>
    <Redo class="w-5 h-5" />
    <span>重做</span>
  </Button>
  <!-- 可继续添加更多按钮 -->
</div> 