<template>
	<div id="header" class="row justify-between">
		<q-parallax src="/images/bg/sc3.avif" :height="900">
			<q-img src="@/assets/images/asa-full-transparent.png" height="100px" fit="contain" />
			<div class="q-pa-xl">
				<q-btn
					label="Join on Discord"
					color="white"
					text-color="black"
					rounded
					class="q-mt-lg"
					style="padding: 10px 20px; font-size: 16px"
					icon="fab fa-discord"
					href="https://discord.gg/australis"
					target="_blank"
				/>
			</div>
		</q-parallax>
	</div>
	<DiscordServerCard />
	<TwitchStreamCard />
	<div id="about" class="body--light text-dark column flex-center" style="min-height: 400px; background-color: #ededed">
		<div class="centered full-width">
			<div class="row q-pa-lg q-ml-xl justify-between items-center">
				<div class="col-12 col-md-7">
					<div class="text-h3 text-bold">About</div>
					<div class="text-h5 q-pt-lg">
						<span class="text-bold">Australis Space Alliance</span> is an industrial-focused Star Citizen organisation based in Australia, with members from around the
						globe.
						<br />
						<br />
						Our main focuses are mining, trading and construction with auxiliary functions of security, medical and exploratory gameplay.
					</div>
				</div>
				<div class="col-12 col-md-4 q-pa-lg">
					<q-img src="@\assets\images\Logo_Star_Citizen.png" style="max-height: 300px" fit="contain" />
				</div>
			</div>
		</div>
	</div>

	<div id="breaker1">
		<DiagonalSlice side="left" :topClip="40" :bottomClip="50" minHeight="800px">
			<template #background>
				<q-parallax src="/images/bg/sc4.avif" :height="800" :speed="1.5" />
			</template>
			<template #content>
				<div class="row items-center full-height">
					<div class="text-h5 q-pa-xl" style="max-width: 80%">
						With a legacy spanning more than half a decade, ASA boasts a rich history of exploration, camaraderie, and collective achievement in the vast universe of
						Star Citizen.
					</div>
				</div>
			</template>
		</DiagonalSlice>
	</div>

	<div>
		<div class="relative-position">
			<q-img src="/images/lupin2.png" class="full-width" style="height: 100vh">
				<div id="eventContent" class="absolute-full column items-center justify-center q-pa-md q-pa-lg-xl">
					<div class="text-h3 text-center">Weekly events for all interests</div>
					<div class="text-h5 q-pa-md text-center">We host a whopping 14 events each week, catering to every aspect of Star Citizen gameplay.</div>
					<div class="text-h5 q-pa-md text-center">
						Whether you're a thrill-seeker, a resource gatherer, a combat enthusiast, or a savvy trader, we have an event tailored just for you.
					</div>
				</div>
			</q-img>
		</div>
	</div>

	<div id="breaker1">
		<DiagonalSlice side="right" :topClip="50" :bottomClip="40" minHeight="800px">
			<template #background>
				<q-parallax src="/images/bg/sc6.avif" :height="800" :speed="2" />
			</template>
			<template #content>
				<div class="row items-center full-height">
					<div class="text-h5 q-pa-xl" style="max-width: 80%">
						Becoming a part of Australis Space Alliance means more than just joining an organization; it means becoming a part of a family united by the love of space
						exploration and the thrill of Star Citizen. Whether you're a seasoned veteran or a rookie looking to learn the ropes, ASA welcomes you with open arms.
					</div>
				</div>
			</template>
		</DiagonalSlice>
	</div>

	<div>
		<!-- <q-parallax src="/images/lupin2.png" :height="800" :speed="2" /> -->
		<div class="relative-position">
			<q-img src="/images/bg/sc7.avif" style="height: 100vh">
				<div id="eventContent" class="absolute-full column items-center justify-center q-pa-xl">
					<div class="text-h3">Training Programs</div>
					<div class="text-h5 q-pa-md">ASA understands that to conquer the cosmos, you need skills that match the enormity of space itself.</div>
					<div class="text-h5 q-mx-xl">
						That's why we offer a diverse range of training programs, designed to help you become a master of your chosen field, and to prepare you for the challenges
						that await us in the 'verse.
					</div>
					<div class="text-h5 q-pa-md q-mx-xl">
						Pathways including mining, bunker operations, cargo logistics, salvage operations, medical response, trade strategies, space combat tactics, and ground
						combat proficiency.
					</div>
					<!-- <div v-for="division in divisions" class="col-4">
						<img :src="division.image" :alt="division.name" style="max-width: 200px; z-index: 999" class="full-width"> </img>
					</div> -->
					<div class="row justify-center items-center q-gutter-xl q-mt-lg">
						<div v-for="division in divisions" :key="division.name" class="text-center">
							<img :src="division.image" height="200" />
						</div>
					</div>
				</div>
			</q-img>
		</div>
	</div>

	<div id="join" class="body--light text-dark column flex-center q-py-xl" style="min-height: 400px; background-color: #ededed">
		<div class="centered full-width">
			<div class="row q-pa-lg q-ml-xl justify-between items-center">
				<div class="col-12 col-md-7">
					<div class="text-h3 text-bold">Interested in joining?</div>
					<div class="text-h5 q-pt-lg">
						<span class="text-bold">Australis Space Alliance</span> is open to all.
						<br />
						<br />
						We are a friendly, welcoming, and active community. Join our <a href="https://discord.gg/australis" class="link" target="_blank">Discord</a> to learn more
						about us and our events, speak to one of our leaders, and to fill out an application.
						<br />
						<br />
						<span class="text-bold">ASA</span> expects a level of activity and respects open communication.
						<br />
						<br />
						<q-btn
							label="Join on Discord"
							color="black"
							text-color="white"
							rounded
							style="padding: 10px 20px; font-size: 16px"
							icon="fab fa-discord"
							href="https://discord.gg/australis"
							target="_blank"
						/>
					</div>
				</div>
				<div class="col-12 col-md-4 q-pa-lg">
					<q-img src="@\assets\images\Logo_discord.png" style="max-height: 300px" fit="contain" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import DiagonalSlice from "@/components/DiagonalSlice.vue";
import DiscordServerCard from "@/components/DiscordServerCard.vue";
import TwitchStreamCard from "@/components/TwitchStreamCard.vue";

defineOptions({
	name: "HomePage",
});

//TODO Extract to types
export interface IDivision {
	name: string;
	image: string;
}

const divisions: IDivision[] = [
	{
		name: "Mining",
		image: "/icons/divisions/ico_mining.png",
	},
	{
		name: "Salvage",
		image: "/icons/divisions/ico_salvage.png",
	},
	{
		name: "Crafting",
		image: "/icons/divisions/ico_crafting.png",
	},
	{
		name: "Logistics",
		image: "/icons/divisions/ico_logistics.png",
	},
	{
		name: "Command",
		image: "/icons/divisions/ico_command.png",
	},
	{
		name: "Medical",
		image: "/icons/divisions/ico_medical.png",
	},
	{
		name: "Security",
		image: "/icons/divisions/ico_security_alt.png",
	},
];
</script>

<style lang="scss" scoped>
.diagonal-container {
	position: relative;
	overflow: hidden;
}

.diagonal-overlay {
	position: absolute;
	top: 0;
	right: 0;
	width: 100%;
	height: 100%;
	background: black;
	clip-path: polygon(50% 0, 100% 0, 100% 100%, 0 100%);
	z-index: 1;
}

.link {
	text-decoration: none;
	color: inherit;
	transition: color 0.3s ease;
	font-size: inherit;
	font-weight: bold;
	&:hover {
		color: #0008ff;
	}
}
</style>
