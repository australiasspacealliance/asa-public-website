<template>
	<div id="twitchCard" class="twitch-card-section flex flex-center q-pb-xl q-px-md">
		<q-card flat class="twitch-card">
			<div class="row items-center q-col-gutter-md q-mb-md">
				<div class="col-12 col-sm">
					<div class="row items-center q-gutter-sm no-wrap">
						<span class="status-dot" :class="{ live: isLive }" />
						<div class="text-h5 text-bold text-white">{{ isLive ? "We're Live!" : "Watch Live" }}</div>
					</div>
					<div class="text-caption text-grey-5">
						<template v-if="isLive && streamTitle">{{ streamTitle }}</template>
						<template v-else>We stream most days, roughly 10am-2pm and 7-11pm AEST - drop in and say hi.</template>
					</div>
				</div>
				<div class="col-12 col-sm-auto">
					<q-btn
						label="Go to Channel"
						class="twitch-cta full-width"
						rounded
						icon="fab fa-twitch"
						href="https://twitch.tv/AustralisSpaceAlliance"
						target="_blank"
					/>
				</div>
			</div>

			<div class="twitch-player-wrap">
				<iframe
					v-if="isLive"
					:src="embedUrl"
					class="twitch-player"
					allowfullscreen
					scrolling="no"
					frameborder="0"
					title="Australis Space Alliance Twitch stream"
				/>
				<div v-else class="twitch-offline">
					<q-icon name="fab fa-twitch" size="40px" class="twitch-offline-icon" />
					<div class="text-subtitle1 text-white text-bold">Not live right now</div>
					<div class="text-caption text-grey-5">Follow on Twitch to get notified when we go live.</div>
				</div>
			</div>
		</q-card>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
defineOptions({
	name: "TwitchStreamCard",
});
// Twitch's own built-in "offline" embed screen (its recommended-channels
// carousel) is known to hang on an endless spinner for a lot of visitors -
// most likely third-party-cookie blocking breaking the extra calls it
// makes. Rather than embed that unreliable screen, we check live status
// ourselves via Twitch's public GraphQL endpoint - the same Client-Id
// Twitch's own web client uses, so no login/API key needed, same
// zero-maintenance approach as the Discord card's invite-lookup - and only
// mount the video iframe when actually live. When offline we show our own
// simple placeholder that can never hang.
const CHANNEL = "AustralisSpaceAlliance";
const PARENT_DOMAINS = ["asaorg.au", "www.asaorg.au", "asa-public-website.pages.dev", "localhost"];
const embedUrl = computed(() => {
	const params = new URLSearchParams();
	params.set("channel", CHANNEL);
	for (const domain of PARENT_DOMAINS) params.append("parent", domain);
	params.set("muted", "true");
	params.set("autoplay", "true");
	return `https://player.twitch.tv/?${params.toString()}`;
});
const isLive = ref(false);
const streamTitle = ref<string | null>(null);
const TWITCH_PUBLIC_CLIENT_ID = "kimne78kx3ncx6brgo4mv6wki5h1ko";
onMounted(async () => {
	try {
		const res = await fetch("https://gql.twitch.tv/gql", {
			method: "POST",
			headers: { "Client-Id": TWITCH_PUBLIC_CLIENT_ID, "Content-Type": "application/json" },
			body: JSON.stringify({
				variables: { login: CHANNEL.toLowerCase() },
				query: "query($login: String!) { user(login: $login) { stream { id title } } }",
			}),
		});
		if (!res.ok) throw new Error(`live status check failed: ${res.status}`);
		const data = await res.json();
		const stream = data?.data?.user?.stream;
		if (stream) {
			isLive.value = true;
			streamTitle.value = stream.title ?? null;
		}
	} catch (err) {
		// Non-fatal: falls back to the "not live" placeholder, same as the
		// Discord card falling back to its static CTA when its own fetch fails.
		console.warn("[TwitchStreamCard] couldn't check live status", err);
	}
});
</script>

<style lang="scss" scoped>
.twitch-card-section {
	background-color: $dark-page;
}
.twitch-card {
	background-color: #1a1a1e;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 16px;
	padding: 28px 32px;
	max-width: 760px;
	width: 100%;
}
.status-dot {
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background-color: $grey-7;
	flex-shrink: 0;
	&.live {
		background-color: #ff3b3b;
		box-shadow: 0 0 6px rgba(255, 59, 59, 0.7);
	}
}
.twitch-cta {
	background-color: $twitch;
	color: white;
	padding: 10px 22px;
	font-size: 15px;
}
.twitch-player-wrap {
	position: relative;
	width: 100%;
	aspect-ratio: 16 / 9;
	border-radius: 10px;
	overflow: hidden;
	background-color: #000;
}
.twitch-player {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	border: 0;
}
.twitch-offline {
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 6px;
	background: linear-gradient(160deg, rgba(145, 70, 255, 0.14) 0%, #0a0a0c 70%);
	text-align: center;
	padding: 24px;
}
.twitch-offline-icon {
	color: $twitch;
	opacity: 0.6;
	margin-bottom: 4px;
}
</style>
