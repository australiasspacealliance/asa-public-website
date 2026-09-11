<template>
	<q-page class="roster-page">
		<div class="roster-hero q-px-md q-pt-xl q-pb-lg">
			<div class="roster-hero-inner">
				<div class="text-overline text-primary">Australis Space Alliance</div>
				<div class="text-h3 text-bold text-white">Roster</div>
				<div class="text-subtitle1 text-grey-5 q-mt-sm roster-hero-copy">
					Every RSI-verified member and talent pool contact{{ roster.length ? ` - ${roster.length} people and counting` : "" }}.
					Talent pool members are past, prospective, or occasional members who are still welcome at ASA events.
				</div>

				<q-input
					v-if="!loading && !errored"
					v-model="search"
					dense
					outlined
					clearable
					placeholder="Search by name"
					class="roster-search q-mt-lg"
					color="primary"
				>
					<template #prepend>
						<q-icon name="search" />
					</template>
				</q-input>
			</div>
		</div>

		<div class="roster-body q-px-md q-pb-xl">
			<div v-if="loading" class="flex flex-center q-py-xl">
				<q-spinner color="primary" size="42px" />
			</div>

			<div v-else-if="errored" class="flex flex-center column q-py-xl q-gutter-sm">
				<q-icon name="fab fa-discord" size="32px" color="grey-6" />
				<div class="text-subtitle1 text-grey-5">Couldn't load the roster right now.</div>
				<q-btn flat color="primary" label="Try again" @click="load" />
			</div>

			<div v-else-if="filteredGroups.length === 0" class="flex flex-center q-py-xl">
				<div class="text-subtitle1 text-grey-6">No members match "{{ search }}".</div>
			</div>

			<div v-else class="roster-groups-inner">
				<section v-for="group in filteredGroups" :key="group.title" class="roster-group q-mb-xl">
					<div class="roster-group-header row items-center q-mb-md">
						<div class="roster-group-title text-subtitle2 text-bold">{{ group.title }}</div>
						<div class="roster-group-count text-caption text-grey-6 q-ml-sm">{{ group.members.length }}</div>
					</div>
					<div class="roster-grid">
						<div v-for="member in group.members" :key="member.name" class="roster-tile">
							<div class="roster-tile-name">{{ member.name }}</div>
							<div class="roster-tile-rank">{{ member.rank }}</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	</q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

defineOptions({
	name: "RosterPage",
});

interface IRosterMember {
	name: string;
	rank: string;
}

interface IRosterGroup {
	title: string;
	members: IRosterMember[];
}

const ROSTER_API_URL = "https://asa-ops-bot.australiasspacealliance.workers.dev/public/roster";

// Groups the flat, already-priority-sorted list the bot returns into
// display sections. Kept in sync with the RANK_ROLES priority list in
// bot/server.js's /public/roster handler.
const LEADERSHIP_RANKS = new Set([
	"CEO",
	"Server Admin",
	"Head of Security",
	"Combat Flight Instructor",
	"Head of Biomedical Science & Exploration",
	"Head of Mining",
	"Head of Salvage",
	"Command Group",
]);
const MILITARY_RANKS = new Set(["Captain", "Commander", "Lieutenant", "Specialist", "Operator", "Crewman"]);

function groupTitleFor(rank: string): string {
	if (LEADERSHIP_RANKS.has(rank)) return "Leadership";
	if (MILITARY_RANKS.has(rank)) return "Ranks";
	if (rank === "Member") return "Members";
	return "Talent Pool";
}

const roster = ref<IRosterMember[]>([]);
const loading = ref(true);
const errored = ref(false);
const search = ref("");

async function load() {
	loading.value = true;
	errored.value = false;
	try {
		const res = await fetch(ROSTER_API_URL);
		if (!res.ok) throw new Error(`roster fetch failed: ${res.status}`);
		roster.value = await res.json();
	} catch (err) {
		console.warn("[RosterPage] couldn't load roster", err);
		errored.value = true;
	} finally {
		loading.value = false;
	}
}

onMounted(load);

const GROUP_ORDER = ["Leadership", "Ranks", "Members", "Talent Pool"];

const filteredGroups = computed<IRosterGroup[]>(() => {
	const query = search.value.trim().toLowerCase();
	const byTitle = new Map<string, IRosterMember[]>();
	for (const member of roster.value) {
		if (query && !member.name.toLowerCase().includes(query)) continue;
		const title = groupTitleFor(member.rank);
		if (!byTitle.has(title)) byTitle.set(title, []);
		byTitle.get(title)!.push(member);
	}
	return GROUP_ORDER.filter((title) => byTitle.has(title)).map((title) => ({ title, members: byTitle.get(title)! }));
});
</script>

<style lang="scss" scoped>
.roster-page {
	background-color: $dark-page;
}

.roster-hero {
	background: linear-gradient(180deg, rgba(25, 118, 210, 0.12) 0%, rgba(18, 18, 18, 0) 100%);
	border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.roster-hero-inner,
.roster-groups-inner {
	max-width: 1100px;
	margin: 0 auto;
}

.roster-hero-copy {
	max-width: 640px;
}

.roster-search {
	max-width: 320px;
}

.roster-group-header {
	border-left: 3px solid $primary;
	padding-left: 12px;
}

.roster-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 10px;
}

.roster-tile {
	background-color: #1a1a1e;
	border: 1px solid rgba(255, 255, 255, 0.07);
	border-radius: 10px;
	padding: 12px 16px;
}

.roster-tile-name {
	color: white;
	font-weight: 600;
	font-size: 14px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.roster-tile-rank {
	color: rgba(255, 255, 255, 0.5);
	font-size: 12px;
	text-transform: uppercase;
	letter-spacing: 0.03em;
	margin-top: 2px;
}
</style>

