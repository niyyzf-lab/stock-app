<script lang="ts">
	import BaseNode from './base-node.svelte';
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';
	import { Button } from '../ui/button';
	import { MoreHorizontalIcon } from '@lucide/svelte';
	import * as DropdownMenu from '@ui/dropdown-menu';
	let { id, data, selected }: NodeProps = $props();
	// 格式化数值（千分位，最多两位小数）
	function formatNumber(val: number | string) {
		let num = Number(val);
		if (isNaN(num)) return val;
		return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
	}
</script>

<BaseNode {id} {data} {selected} title="显示数值" description="显示数值内容">
	<div
		class="relative p-4 rounded-xl bg-white flex items-center justify-center min-w-[160px] min-h-[60px]"
	>
		<Handle type="target" id="data-in-number" position={Position.Left} />
		<p class="text-2xl font-bold text-blue-700 text-center w-full break-words">
			{formatNumber(data.value as number)}
		</p>
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
