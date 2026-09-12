<template>
	<div class="theme-music" :class="{ open: panelOpen }">
		<q-card v-if="panelOpen" flat class="theme-music-panel">
			<div class="text-caption text-grey-5">Now playing</div>
			<div class="text-white text-weight-medium q-mb-sm">ASA Theme</div>

			<div class="row items-center q-gutter-sm">
				<q-icon name="volume_down" color="grey-5" size="18px" />
				<q-slider v-model="volume" :min="0" :max="100" color="white" track-color="grey-8" class="col" @update:model-value="onVolumeChange" />
				<q-icon name="volume_up" color="grey-5" size="18px" />
			</div>
		</q-card>

		<q-btn round unelevated class="theme-music-fab" :class="{ playing: isPlaying }" @click="togglePlay" @mouseenter="panelOpen = true" @mouseleave="panelOpen = false">
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

		<audio ref="audioEl" src="/audio/asa-theme.mp3" loop preload="none" @play="isPlaying = true" @pause="isPlaying = false" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";

defineOptions({
	name: "ThemeMusicPlayer",
});

// Browsers block autoplay-with-sound, and it's obnoxious for visitors anyway -
// playback only ever starts from an explicit click. We just remember the
// volume (and whether the visitor had it playing) across page navigations
// and repeat visits.
const STORAGE_KEY = "asa-theme-music";

const audioEl = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const panelOpen = ref(false);
const volume = ref(50);

function readPrefs(): { volume: number; wasPlaying: boolean } {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { volume: 50, wasPlaying: false };
		const parsed = JSON.parse(raw);
		return {
			volume: typeof parsed.volume === "number" ? parsed.volume : 50,
			wasPlaying: !!parsed.wasPlaying,
		};
	} catch {
		return { volume: 50, wasPlaying: false };
	}
}

function savePrefs() {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume: volume.value, wasPlaying: isPlaying.value }));
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

	if (isPlaying.value) {
		el.pause();
	} else {
		try {
			await el.play();
		} catch {
			// Rare: some browsers still refuse a play() call. Nothing to recover here.
		}
	}
}

onMounted(() => {
	const prefs = readPrefs();
	volume.value = prefs.volume;
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
}

.theme-music-fab {
	width: 52px;
	height: 52px;
	background-color: #1a1a1e;
	color: white;
	border: 1px solid rgba(255, 255, 255, 0.12);
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);

	&.playing {
		background-color: $discord;
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
}
</style>
