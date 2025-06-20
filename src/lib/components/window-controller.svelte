<script lang="ts">
  import { windowState, windowStore } from "@/stores/windowStore.svelte";
  import { 
    MinusCircle, 
    Minus, 
    LayoutGrid, 
    Maximize, 
    X, 
    XCircle,
    Minimize2,
    SquareAsterisk
  } from "@lucide/svelte";
  
  let {
    position = "right",
    className = "",
    iconStyle = "modern" // modern, classic, circle
  } = $props();
  
  // 使用 runes 语法获取窗口状态
  const isMaximized = $derived(windowState.isMaximized);
  
  // 根据图标样式选择图标
  function getIcons() {
    if (iconStyle === "circle") {
      return {
        minimize: MinusCircle,
        maximize: Maximize,
        restore: LayoutGrid,
        close: XCircle
      };
    } else if (iconStyle === "classic") {
      return {
        minimize: Minimize2,
        maximize: Maximize,
        restore: SquareAsterisk,
        close: X
      };
    } else {
      // modern 默认样式
      return {
        minimize: Minus,
        maximize: Maximize,
        restore: LayoutGrid,
        close: X
      };
    }
  }
  
  const icons = getIcons();
</script>

<div class="flex items-center gap-3 {position === 'right' ? 'justify-end' : ''} {className}">
  <!-- 最小化按钮 -->
  <button
    class="flex items-center justify-center h-7 w-7 rounded-sm border border-border hover:border-ring focus:outline-none transition-colors"
    onclick={() => windowStore.toggleMinimize()}
    title="最小化"
  >
    <svelte:component this={icons.minimize} class="size-4" strokeWidth={1.5} />
  </button>
  
  <!-- 最大化/还原按钮 -->
  <button
    class="flex items-center justify-center h-7 w-7 rounded-sm border border-border hover:border-ring focus:outline-none transition-colors"
    onclick={() => windowStore.toggleMaximize()}
    title={isMaximized ? "还原" : "最大化"}
  >
    <svelte:component this={isMaximized ? icons.restore : icons.maximize} class="size-4" strokeWidth={1.5} />
  </button>
  
  <!-- 关闭按钮 -->
  <button
    class="flex items-center justify-center h-7 w-7 rounded-sm border border-border hover:border-destructive hover:text-destructive focus:outline-none transition-colors"
    onclick={() => windowStore.toggleClose()}
    title="关闭"
  >
    <svelte:component this={icons.close} class="size-4" strokeWidth={1.5} />
  </button>
</div> 