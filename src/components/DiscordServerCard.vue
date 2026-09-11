<template>
	<div id="discordCard" class="discord-card-section flex flex-center q-py-xl q-px-md">
		<q-card flat class="discord-card">
			<div class="row items-center q-col-gutter-lg">
				<div class="col-auto">
					<q-avatar size="88px" class="discord-avatar">
						<img v-if="iconUrl" :src="iconUrl" alt="ASA server icon" />
						<q-icon v-else name="fab fa-discord" size="48px" color="white" />
					</q-avatar>
				</div>

				<div class="col-12 col-sm">
					<div class="text-h5 text-bold text-white">{{ guildName }}</div>
					<div class="text-caption text-grey-5 q-mb-sm">Est. {{ establishedLabel }}</div>

					<div class="row q-gutter-x-lg items-center">
						<div class="stat-line">
							<span class="status-dot" :class="{ pending: onlineCount === null }" />
							<span class="text-white">{{ onlineCount ?? "—" }} Online</span>
						</div>
						<div class="stat-line text-white">{{ memberCount ?? "—" }} Members</div>
					</div>

					<div v-if="visibleTags.length" class="row q-gutter-xs q-mt-sm">
						<q-badge v-for="tag in visibleTags" :key="tag" outline color="grey-3" :label="tag" class="tag-badge" />
						<q-badge v-if="extraTagCount > 0" outline color="grey-6" :label="`+${extraTagCount} more`" class="tag-badge" />
					</div>
				</div>

				<div class="col-12 col-sm-auto q-mt-md q-mt-sm-none">
					<q-btn
						label="Go to Server"
						class="discord-cta full-width"
						rounded
						icon="fab fa-discord"
						href="https://discord.gg/australis"
						target="_blank"
					/>
				</div>
			</div>
		</q-card>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

defineOptions({
	name: "DiscordServerCard",
});

// Data source: Discord's own public invite-lookup API. This is the exact
// data Discord uses to render its native "invite embed" card, so it stays
// accurate with zero maintenance - no bot or backend involved.
const INVITE_CODE = "australis";
const INVITE_API_URL = `https://discord.com/api/v10/invites/${INVITE_CODE}?with_counts=true&with_expiration=true`;

const guildName = ref("Australis Space Alliance");
const memberCount = ref<number | null>(null);
const onlineCount = ref<number | null>(null);
const establishedLabel = ref("Jan 2019");
const iconUrl = ref<string | null>(null);
const tags = ref<string[]>([]);

const visibleTags = computed(() => tags.value.slice(0, 3));
const extraTagCount = computed(() => Math.max(0, tags.value.length - 3));

// Discord IDs are snowflakes: the top bits encode the creation timestamp.
// Needs BigInt - the ID is a 64-bit value and a plain JS Number can't shift
// it accurately.
function snowflakeToDate(id: string): Date {
	const DISCORD_EPOCH = 1420070400000n;
	const ms = (BigInt(id) >> 22n) + DISCORD_EPOCH;
	return new Date(Number(ms));
}

onMounted(async () => {
	try {
		const res = await fetch(INVITE_API_URL);
		if (!res.ok) throw new Error(`invite lookup failed: ${res.status}`);
		const data = await res.json();

		if (data.guild?.name) guildName.value = data.guild.name;
		if (typeof data.approximate_member_count === "number") memberCount.value = data.approximate_member_count;
		if (typeof data.approximate_presence_count === "number") onlineCount.value = data.approximate_presence_count;
		if (data.guild?.id) {
			establishedLabel.value = snowflakeToDate(data.guild.id).toLocaleDateString("en-US", { month: "short", year: "numeric" });
			if (data.guild.icon) {
				iconUrl.value = `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png?size=128`;
			}
		}
		if (Array.isArray(data.profile?.traits)) {
			tags.value = data.profile.traits.map((t: { label: string }) => t.label).filter(Boolean);
		}
	} catch (err) {
		// Non-fatal: the card just falls back to showing the static "Join on
		// Discord" CTA without live counts. Never break the page over this.
		console.warn("[DiscordServerCard] couldn't load live server stats", err);
	}
});
</script>

<style lang="scss" scoped>
.discord-card-section {
	background-color: $dark-page;
}

.discord-card {
	background-color: #1a1a1e;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 16px;
	padding: 28px 32px;
	max-width: 760px;
	width: 100%;
}

.discord-avatar {
	background-color: $discord;
}

.stat-line {
	display: inline-flex;
	align-items: center;
	font-size: 15px;
	font-weight: 500;
}

.status-dot {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: $positive;
	margin-right: 8px;
	box-shadow: 0 0 6px rgba(33, 186, 69, 0.7);

	&.pending {
		background-color: $grey-7;
		box-shadow: none;
	}
}

.tag-badge {
	font-size: 11px;
	letter-spacing: 0.02em;
	text-transform: uppercase;
	padding: 4px 8px;
}

.discord-cta {
	background-color: $discord;
	color: white;
	padding: 10px 22px;
	font-size: 15px;
}
</style>

