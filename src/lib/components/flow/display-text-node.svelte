<script lang="ts">
    import BaseNode from "./base-node.svelte";
    import { Handle, Position, type NodeProps } from "@xyflow/svelte";
    import { Button } from "../ui/button";
    import { MoreHorizontalIcon } from "@lucide/svelte";
    import * as DropdownMenu from "@ui/dropdown-menu"
    let { id, data, selected }: NodeProps = $props();

</script>

<BaseNode id={id} data={data} selected={selected} className="min-w-60"  title="显示文本" description="显示文本内容">
    <div class="flex items-center relative p-2">
        <Handle type="target" id="data-in-string" position={Position.Left} />
        <p class="text-sm flex-1 text-center">{data.text}</p>
        <Handle type="source" id="data-out-string" position={Position.Right} />
    </div>  
    {#snippet actions()}
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <Button variant="outline" size="icon">
                <MoreHorizontalIcon class="size-4" />
            </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Group>
            <DropdownMenu.Item>清空</DropdownMenu.Item>
            <DropdownMenu.Item>删除</DropdownMenu.Item>
            <DropdownMenu.Item>复制</DropdownMenu.Item>
            <DropdownMenu.Item>粘贴</DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    {/snippet}
</BaseNode>