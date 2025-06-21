<script lang="ts" module>
	import {
		AudioWaveform as AudioWaveformIcon,
		BanknoteArrowUp,
		BookOpen as BookOpenIcon,
		Bot,
		Bot as BotIcon,
		Building2,
		ChartNoAxesGantt,
		ChartPie as ChartPieIcon,
		Command as CommandIcon,
		Frame as FrameIcon,
		GalleryVerticalEnd as GalleryVerticalEndIcon,
		Layers,
		Map as MapIcon,
		Settings2 as Settings2Icon,
		SquareActivity,
		SquareTerminal as SquareTerminalIcon
	} from "@lucide/svelte/icons";

	// This is sample data.
	const data = {
		user: {
			name: "shadcn",
			email: "m@example.com",
			avatar: "/avatars/shadcn.jpg",
		},
		teams: [
			{
				name: "Acme Inc",
				logo: GalleryVerticalEndIcon,
				plan: "Enterprise",
			},
			{
				name: "Acme Corp.",
				logo: AudioWaveformIcon,
				plan: "Startup",
			},
			{
				name: "Evil Corp.",
				logo: CommandIcon,
				plan: "Free",
			},
		],
		navMain: [
			{
				title: "股票",
				url: "/work-space/stock",
				icon: Layers,
				isActive: false,
				items: [
					{ title: "公司", url: "/work-space/stock/company", icon: Building2  },
					{ title: "榜单", url: "/work-space/stock/rank", icon: ChartNoAxesGantt },
					{ title: "行业", url: "/work-space/stock/industry", icon: ChartPieIcon },
					{ title: "财报", url: "/work-space/stock/report", icon: BanknoteArrowUp  },
					{ title: "公告", url: "/work-space/stock/notice", icon: BookOpenIcon },
				],
			},
		],
		projects: [
			{
				name: "Design Engineering",
				url: "#",
				icon: FrameIcon,
			},
			{
				name: "Sales & Marketing",
				url: "#",
				icon: ChartPieIcon,
			},
			{
				name: "Travel",
				url: "#",
				icon: MapIcon,
			},
		],
	};
</script>

<script lang="ts">
	import NavMain from "./nav-main.svelte";
	import NavProjects from "./nav-projects.svelte";
	import NavUser from "./nav-user.svelte";
	import TeamSwitcher from "./team-switcher.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		collapsible = "icon",
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<TeamSwitcher teams={data.teams} />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
		<NavProjects projects={data.projects} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser user={data.user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
