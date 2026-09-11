<template>
	<div id="twitchCard" class="twitch-card-section flex flex-center q-pb-xl q-px-md">
		<q-card flat class="twitch-card">
			<div class="row items-center q-col-gutter-md q-mb-md">
				<div class="col-12 col-sm">
					<div class="text-h5 text-bold text-white">Watch Live</div>
					<div class="text-caption text-grey-5">
						We stream most days, roughly 10am-2pm and 7-11pm AEST - drop in and say hi.
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
					:src="embedUrl"
					class="twitch-player"
					allowfullscreen
					scrolling="no"
					frameborder="0"
					title="Australis Space Alliance Twitch stream"
				/>
			</div>
		</q-card>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
defineOptions({
	name: "TwitchStreamCard",
});
// Twitch's official embed player - shows the live stream automatically when
// we're on air, and falls back to Twitch's own offline/channel screen when
// we're not. No API key or backend needed, unlike a "LIVE" status badge
// would require; Twitch just needs the embedding domain(s) whitelisted via
// repeated `parent` params.
const CHANNEL = "AustralisSpaceAlliance";
const PARENT_DOMAINS = ["asaorg.au", "www.asaorg.au", "asa-public-website.pages.dev", "localhost"];
const embedUrl = computed(() => {
	const params = new URLSearchParams();
	params.set("channel", CHANNEL);
	for (const domain of PARENT_DOMAINS) params.append("parent", domain);
	return `https://player.twitch.tv/?${params.toString()}`;
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
</style>

