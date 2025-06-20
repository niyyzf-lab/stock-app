<script lang="ts">
    import BaseNode from "./base-node.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Handle, Position, type NodeProps, useSvelteFlow } from "@xyflow/svelte";
    import { Button } from "../ui/button";
    import { MoreHorizontalIcon } from "@lucide/svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    let { id, data, selected }: NodeProps = $props();
    let { updateNodeData } = useSvelteFlow();
</script>

<BaseNode id={id} data={data} selected={selected} hideRightHandle hideLeftHandle title="文本节点" description="请输入常量文本内容">
    <div class="flex items-center relative p-2">
        <Input bind:value={data.text} oninput={(e: Event) => {
            const input = e.target as HTMLInputElement;
            updateNodeData(id, { text: input.value });
        }} />
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