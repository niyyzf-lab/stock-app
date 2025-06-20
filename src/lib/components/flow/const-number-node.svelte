<script lang="ts">
    import BaseNode from "./base-node.svelte";
    import NumberInputWithButton from "$lib/components/inputs/number-input-with-button.svelte";
    import { Handle, Position, type NodeProps, useSvelteFlow } from "@xyflow/svelte";
    import { Button } from "../ui/button";
    import * as DropdownMenu from "@ui/dropdown-menu"
    import { MoreHorizontalIcon } from "@lucide/svelte";
    let { id, data, selected }: NodeProps = $props();
    let { updateNodeData } = useSvelteFlow();

</script>

<BaseNode id={id} data={data} selected={selected} className="w-50" hideRightHandle hideLeftHandle title="数值节点" description="请输入常量数值">
    <div class="flex items-center relative p-2">
        <NumberInputWithButton value={data.number as number} onChange={(value) => {
            updateNodeData(id, { number: value });
        }} />
        <Handle type="source" id="data-out-number" position={Position.Right} />
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