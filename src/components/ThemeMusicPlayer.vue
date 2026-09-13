<template>
	<div class="theme-music" :class="{ open: panelOpen }">
		<transition name="theme-music-panel-fade">
			<q-card v-if="panelOpen" flat class="theme-music-panel">
				<div class="text-caption text-grey-5">Now playing</div>
				<div class="text-white text-weight-medium q-mb-sm">ASA Theme</div>

				<div class="row items-center q-gutter-sm">
					<q-icon name="volume_down" color="grey-5" size="18px" />
					<q-slider v-model="volume" :min="0" :max="100" color="white" track-color="grey-8" class="col" @update:model-value="onVolumeChange" />
					<q-icon name="volume_up" color="grey-5" size="18px" />
				</div>
			</q-card>
		</transition>

		<q-btn
			round
			unelevated
			class="theme-music-fab"
			:class="{ playing: isPlaying, attention: showAttentionPulse }"
			@click="togglePlay"
			@mouseenter="panelOpen = true"
			@mouseleave="panelOpen = false"
		>
			<span class="equalizer" v-if="isPlaying">
				<span />
				<span />
				<span />
			</span>
			<q-icon v-else name="music_note" size="22px" />
			<q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 8]">
				{{ isPlaying ? "Pause ASA Theme" : "Play ASA Theme" }}
			</q-tooltip>
		</q-btn>

		<audio ref="audioEl" src="/audio/Australis%20Space%20Alliance.mp3" loop preload="none" @play="isPlaying = true" @pause="isPlaying = false" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";

defineOptions({
	name: "ThemeMusicPlayer",
});

// Browsers block autoplay-with-sound, and it's obnoxious for visitors anyway -
// playback only ever starts from an explicit click. We remember the volume,
// whether the visitor had it playing, and whether they've ever touched the
// control at all, across page navigations and repeat visits.
const STORAGE_KEY = "asa-theme-music";

const audioEl = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const panelOpen = ref(false);
const volume = ref(50);
const everInteracted = ref(false);

// A gentle pulse invites a first-time visitor to notice the control exists.
// It stops for good the moment someone actually presses it, so it never
// keeps nagging a returning visitor who already knows it's there.
const showAttentionPulse = computed(() => !everInteracted.value && !isPlaying.value);

function readPrefs(): { volume: number; wasPlaying: boolean; discovered: boolean } {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { volume: 50, wasPlaying: false, discovered: false };
		const parsed = JSON.parse(raw);
		return {
			volume: typeof parsed.volume === "number" ? parsed.volume : 50,
			wasPlaying: !!parsed.wasPlaying,
			discovered: !!parsed.discovered,
		};
	} catch {
		return { volume: 50, wasPlaying: false, discovered: false };
	}
}

function savePrefs() {
	try {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ volume: volume.value, wasPlaying: isPlaying.value, discovered: everInteracted.value }),
		);
	} catch {
		// Storage can be unavailable (private browsing, quota) - not worth breaking playback over.
	}
}

function onVolumeChange() {
	if (audioEl.value) audioEl.value.volume = volume.value / 100;
	savePrefs();
}

async function togglePlay() {
	const el = audioEl.value;
	if (!el) return;

	everInteracted.value = true;

	if (isPlaying.value) {
		el.pause();
	} else {
		try {
			await el.play();
		} catch {
			// Rare: some browsers still refuse a play() call. Nothing to recover here.
		}
	}
	savePrefs();
}

onMounted(() => {
	const prefs = readPrefs();
	volume.value = prefs.volume;
	everInteracted.value = prefs.discovered;
	if (audioEl.value) audioEl.value.volume = prefs.volume / 100;

	// A visitor who had it playing on a previous page keeps hearing it after
	// a full navigation/reload - but only via an already-established user
	// gesture context browsers grant right after a click-through, never a
	// blind autoplay attempt on a fresh, uninteracted tab.
	if (prefs.wasPlaying) {
		audioEl.value?.play().catch(() => {
			// Autoplay was refused (no recent user gesture) - visitor just clicks to start it themselves.
		});
	}
});

watch(isPlaying, savePrefs);
</script>

<style lang="scss" scoped>
.theme-music {
	position: fixed;
	right: 24px;
	bottom: 24px;
	z-index: 4000;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.theme-music-panel {
	background-color: rgba(20, 20, 24, 0.92);
	backdrop-filter: blur(6px);
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 12px;
	padding: 14px 16px;
	margin-bottom: 12px;
	width: 220px;
	max-width: calc(100vw - 64px);
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.theme-music-panel-fade-enter-active,
.theme-music-panel-fade-leave-active {
	transition: opacity 0.16s ease, transform 0.16s ease;
}
.theme-music-panel-fade-enter-from,
.theme-music-panel-fade-leave-to {
	opacity: 0;
	transform: translateY(6px);
}

.theme-music-fab {
	position: relative;
	width: 56px;
	height: 56px;
	background: linear-gradient(145deg, #26262e, #17171b);
	color: white;
	border: 1px solid rgba(114, 137, 218, 0.35);
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45);
	transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

	&:hover {
		transform: scale(1.06);
		border-color: rgba(114, 137, 218, 0.6);
	}

	&:active {
		transform: scale(0.96);
	}

	&.playing {
		background-color: $discord;
		border-color: rgba(255, 255, 255, 0.25);
	}

	&.attention::before {
		content: "";
		position: absolute;
		inset: 0;
		border-radius: 50%;
		box-shadow: 0 0 0 0 rgba(114, 137, 218, 0.55);
		animation: attention-pulse 2.4s ease-out infinite;
		pointer-events: none;
	}
}

@keyframes attention-pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(114, 137, 218, 0.55);
	}
	70% {
		box-shadow: 0 0 0 14px rgba(114, 137, 218, 0);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(114, 137, 218, 0);
	}
}

.equalizer {
	display: flex;
	align-items: flex-end;
	gap: 3px;
	height: 16px;

	span {
		width: 3px;
		background-color: white;
		border-radius: 2px;
		animation: eq 0.9s ease-in-out infinite;

		&:nth-child(1) {
			animation-delay: -0.6s;
		}
		&:nth-child(2) {
			animation-delay: -0.3s;
		}
		&:nth-child(3) {
			animation-delay: 0s;
		}
	}
}

@keyframes eq {
	0%,
	100% {
		height: 4px;
	}
	50% {
		height: 16px;
	}
}

@media (prefers-reduced-motion: reduce) {
	.equalizer span {
		animation: none;
		height: 10px;
	}
	.theme-music-fab.attention::before {
		animation: none;
		box-shadow: 0 0 0 3px rgba(114, 137, 218, 0.35);
	}
}

@media (max-width: 600px) {
	.theme-music {
		right: 16px;
		bottom: calc(16px + env(safe-area-inset-bottom, 0px));
	}

	.theme-music-fab {
		width: 48px;
		height: 48px;
	}
}
</style>
