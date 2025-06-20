<script lang="ts">
    import { SvelteFlow, Background, MiniMap, Controls, Panel, addEdge } from '@xyflow/svelte';
    import '@xyflow/svelte/dist/style.css';
    import ConstTextNode from '$lib/components/flow/const-text-node.svelte';
    import ConstNumberNode from '$lib/components/flow/const-number-node.svelte';
    import StartNode from '$lib/components/flow/start-node.svelte';
    import DisplayTextNode from '$lib/components/flow/display-text-node.svelte';
    import type { Connection, Edge, EdgeTypes, Node } from '@xyflow/svelte';
    import { toast } from 'svelte-sonner';
    import { debounce } from 'lodash-es';
    import ColoredEdge from '$lib/components/flow/colored-edge.svelte';
    import DisplayNumberNode from '$lib/components/flow/display-number-node.svelte';
    import dagre from '@dagrejs/dagre';
    import { Button } from '$lib/components/ui/button';
	import WindowController from '@/components/window-controller.svelte';
    import { LayoutDashboard, Undo, Redo } from '@lucide/svelte';
    const nodeTypes = {
        constTextNode: ConstTextNode,
        constNumberNode: ConstNumberNode,
        startNode: StartNode,
        displayTextNode: DisplayTextNode,
        displayNumberNode: DisplayNumberNode
    };
    
    let nodes = $state.raw([
        {
            id: '1',
            type: 'startNode',
            position: { x: 100, y: 150 },
            data: {
                //运行状态
                runStatus: 'idle',
                //运行时间
                runTime: 0,

            }
        },
        {
            id: '2',
            type: 'constTextNode',
            position: { x: 0, y: 0 },
            data: { 
                text: 'World'
            },
        },
        {
            id: '3',
            type: 'constNumberNode',
            position: { x: 100, y: 100 },
            data: { 
                number: 100,
            },
        },
        {
            id: '4',
            type: 'displayTextNode',
            position: { x: 100, y: 100 },
            data: { text: 'Hello' },
        },
        {
            id: '5',
            type: 'displayNumberNode',
            position: { x: 100, y: 100 },
            data: { value: 100 },
        },
    ]);
    
    let edges = $state.raw<Edge[]>([]);

    // 防抖的 toast error
    const showError = debounce((msg: string) => toast.error(msg), 300, { leading: true, trailing: false });

    function parseDataHandleId(id?: string) {
        if (!id) return null;
        // 例：data-in-number
        const match = id.match(/^data-(in|out)-([a-zA-Z0-9]+)$/);
        if (!match) return null;
        return {
            direction: match[1], // 'in' or 'out'
            dataType: match[2],  // 'number', 'string', ...
        };
    }

    const isValidConnection = (connection: unknown) => {
        const conn = connection as Connection;
        // 判断手柄类型，禁止执行手柄和数据手柄混连
        const isSourceExec = conn.sourceHandle === 'exec-out' || conn.sourceHandle === 'exec-in';
        const isTargetExec = conn.targetHandle === 'exec-out' || conn.targetHandle === 'exec-in';
        const isSourceData = /^data-(in|out)-/.test(conn.sourceHandle ?? '');
        const isTargetData = /^data-(in|out)-/.test(conn.targetHandle ?? '');
        // 禁止执行手柄和数据手柄混连
        if ((isSourceExec && isTargetData) || (isSourceData && isTargetExec)) {
            showError('执行手柄和数据手柄不能连接！');
            return false;
        }
        // 只对执行手柄做严格校验
        const isExec = conn.sourceHandle === 'exec-out' && conn.targetHandle === 'exec-in';
        if (isExec) {
            if (conn.source === conn.target) {
                showError('不能自己连自己！');
                return false;
            }
            if (edges.some((e: Edge) => e.target === conn.target && e.targetHandle === conn.targetHandle)) {
                showError('一个输入只能有一个输出！');
                return false;
            }
            if (edges.some((e: Edge) => e.source === conn.source && e.target === conn.target && e.sourceHandle === conn.sourceHandle && e.targetHandle === conn.targetHandle)) {
                showError('不能重复连线！');
                return false;
            }
            return true;
        }

        // 数据手柄校验
        const sourceInfo = parseDataHandleId(conn.sourceHandle ?? undefined);
        const targetInfo = parseDataHandleId(conn.targetHandle ?? undefined);
        if (sourceInfo && targetInfo) {
            // 类型必须一致
            if (sourceInfo.dataType !== targetInfo.dataType) {
                showError('数据类型不一致，无法连接！');
                return false;
            }
            // 输入只能被一个输出连接
            if (targetInfo.direction === 'in' && edges.some((e: Edge) => e.target === conn.target && e.targetHandle === conn.targetHandle)) {
                showError('该输入已被其他输出连接！');
                return false;
            }
            // 输出可以连接多个输入，不做限制
            // 不能重复连线
            if (edges.some((e: Edge) => e.source === conn.source && e.target === conn.target && e.sourceHandle === conn.sourceHandle && e.targetHandle === conn.targetHandle)) {
                showError('不能重复连线！');
                return false;
            }
            return true;
        }

        // 其他手柄类型允许自由连线
        return true;
    };

    const edgeTypes:EdgeTypes = {
        colored: ColoredEdge
    };

    function handleConnect(connection: Connection) {
        // 统一 id 生成方式，确保唯一
        const id = `e${connection.source}-${connection.sourceHandle}-${connection.target}-${connection.targetHandle}`;
        // 检查是否已存在同 id 的 edge
        if (!edges.some(e => e.id === id)) {
            const newEdge: Edge = {
                id,
                source: connection.source,
                sourceHandle: connection.sourceHandle,
                target: connection.target,
                targetHandle: connection.targetHandle,
                type: 'colored'
            };
            edges = addEdge(newEdge, edges.filter(e => !(e.source === connection.source && e.target === connection.target)));
        }
        console.log(edges);
    }

    function getNodePriority(type: string | undefined) {
        if (!type) return 99;
        // 执行流节点优先
        if (type === 'startNode' || type.startsWith('display')) return 1;
        // 数据节点其次
        if (type.startsWith('const')) return 2;
        return 3;
    }

    function layoutWithDagre(nodes: Node[], edges: Edge[], direction = 'LR') {
        const g = new dagre.graphlib.Graph();
        g.setGraph({
            rankdir: direction,
            nodesep: 100,
            ranksep: 100,
            marginx: 15,
            marginy: 15,
            align: 'UL'
        });
        g.setDefaultEdgeLabel(() => ({}));

        // 1. 所有节点都参与布局
        nodes.forEach(node => {
            g.setNode(node.id, { width: 180, height: 100 });
        });

        // 2. 统计所有有入边的节点
        const nodesWithInEdge = new Set(edges.map(e => e.target));

        // 3. 找到 startNode
        const start = nodes.find(n => n.type === 'startNode');
        const startId = start?.id;

        // 4. 添加所有真实边
        edges.forEach(edge => {
            g.setEdge(edge.source, edge.target);
        });

        // 5. 为没有入边且不是 startNode 的节点补一条虚拟边
        if (startId) {
            nodes.forEach(n => {
                if (n.id !== startId && !nodesWithInEdge.has(n.id)) {
                    g.setEdge(startId, n.id);
                }
            });
        }

        dagre.layout(g);

        return nodes.map(node => {
            const dagreNode = g.node(node.id);
            if (!dagreNode) return node;
            return {
                ...node,
                position: {
                    x: dagreNode.x - 90,
                    y: dagreNode.y - 50
                }
            };
        });
    }
</script>

<div class="h-full w-full">
    <SvelteFlow
        {nodeTypes}
        {edgeTypes}
        bind:nodes
        bind:edges
        fitView
       
        {isValidConnection}
        onconnect={handleConnect}
    >
        <MiniMap />
        <Controls />
        <Background />
        
        <Panel position="top-center">
            <div class="flex items-center justify-between w-screen max-w-3xl mx-auto px-6 py-2 bg-white/80 backdrop-blur-md rounded-xl shadow border border-gray-200" data-tauri-drag-region>
                
                <!-- 中间：工具按钮组 -->
                <div class="flex items-center gap-1" data-tauri-drag-region>
                    <Button variant="ghost" class="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
                        onclick={() => { nodes = layoutWithDagre(nodes, edges) as any; }}>
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
                <!-- 右侧：窗口控制器 -->
                <div class="flex items-center min-w-[80px] justify-end">
                    <WindowController />
                </div>
            </div>
        </Panel>
    </SvelteFlow>
</div>