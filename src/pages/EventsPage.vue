<template>
	<q-page class="events-page">
		<div class="events-hero q-px-md q-pt-xl q-pb-lg">
			<div class="events-hero-inner">
				<div class="text-overline text-primary">Australis Space Alliance</div>
				<div class="text-h3 text-bold text-white">Events</div>
				<div class="text-subtitle1 text-grey-5 q-mt-sm events-hero-copy">
					Upcoming ops, training runs, and hangouts{{ events.length ? ` - ${events.length} scheduled` : "" }}. Times shown in
					your local timezone - click through to RSVP on Discord.
				</div>
			</div>
		</div>

		<div class="events-body q-px-md q-pb-xl">
			<div v-if="loading" class="flex flex-center q-py-xl">
				<q-spinner color="primary" size="42px" />
			</div>

			<div v-else-if="errored" class="flex flex-center column q-py-xl q-gutter-sm">
				<q-icon name="fab fa-discord" size="32px" color="grey-6" />
				<div class="text-subtitle1 text-grey-5">Couldn't load events right now.</div>
				<q-btn flat color="primary" label="Try again" @click="load" />
			</div>

			<div v-else-if="events.length === 0" class="flex flex-center q-py-xl">
				<div class="text-subtitle1 text-grey-6">No events scheduled right now.</div>
			</div>

			<div v-else class="events-grid-inner">
				<a v-for="event in events" :key="event.id" :href="event.url" target="_blank" rel="noopener" class="event-card">
					<div v-if="event.image" class="event-card-image" :style="{ backgroundImage: `url(${event.image})` }" />
					<div class="event-card-body">
						<div class="event-card-date text-caption text-primary text-bold">{{ formatDate(event.startAt) }}</div>
						<div class="event-card-name text-subtitle1 text-bold">{{ event.name }}</div>
						<div class="event-card-location text-caption text-grey-6">
							<q-icon name="place" size="14px" /> {{ event.location }}
						</div>
						<div class="event-card-desc text-body2 text-grey-5">{{ event.description }}</div>
						<div class="event-card-footer row items-center justify-between q-mt-sm">
							<div class="text-caption text-grey-6">
								{{ event.interestedCount === null ? "" : `${event.interestedCount} interested` }}
							</div>
							<div class="text-caption text-primary">View on Discord →</div>
						</div>
					</div>
				</a>
			</div>
		</div>
	</q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
defineOptions({
	name: "EventsPage",
});
interface IEvent {
	id: string;
	name: string;
	description: string;
	startAt: string;
	endAt: string | null;
	isLive: boolean;
	location: string;
	image: string | null;
	interestedCount: number | null;
	url: string;
}
const EVENTS_API_URL = "https://asa-ops-bot.australiasspacealliance.workers.dev/public/events";
const events = ref<IEvent[]>([]);
const loading = ref(true);
const errored = ref(false);
async function load() {
	loading.value = true;
	errored.value = false;
	try {
		const res = await fetch(EVENTS_API_URL);
		if (!res.ok) throw new Error(`events fetch failed: ${res.status}`);
		events.value = await res.json();
	} catch (err) {
		console.warn("[EventsPage] couldn't load events", err);
		errored.value = true;
	} finally {
		loading.value = false;
	}
}
onMounted(load);
function formatDate(iso: string): string {
	const date = new Date(iso);
	return date.toLocaleString(undefined, {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}
</script>

<style lang="scss" scoped>
.events-page {
	background-color: $dark-page;
}
.events-hero {
	background: linear-gradient(180deg, rgba(25, 118, 210, 0.12) 0%, rgba(18, 18, 18, 0) 100%);
	border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.events-hero-inner,
.events-grid-inner {
	max-width: 1100px;
	margin: 0 auto;
}
.events-hero-copy {
	max-width: 640px;
}
.events-grid-inner {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 16px;
}
.event-card {
	display: block;
	background-color: #1a1a1e;
	border: 1px solid rgba(255, 255, 255, 0.07);
	border-radius: 10px;
	overflow: hidden;
	text-decoration: none;
	color: inherit;
	transition: border-color 0.15s ease, transform 0.15s ease;
}
.event-card:hover {
	border-color: rgba(25, 118, 210, 0.5);
	transform: translateY(-2px);
}
.event-card-image {
	height: 140px;
	background-size: cover;
	background-position: center;
	background-color: #111;
}
.event-card-body {
	padding: 12px 16px 16px;
}
.event-card-desc {
	margin-top: 6px;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	white-space: pre-line;
}
</style>

