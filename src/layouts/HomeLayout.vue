<template>
	<q-layout view="lHh Lpr lFf">
		<q-header class="bg-black flex justify-center row items-center">
			<q-space />

			<div style="display: flex; justify-content: space-between; align-items: center">
				<template v-for="(item, index) in menuItems" :key="index">
					<q-btn
						v-if="!item.subMenu"
						flat
						:label="item.label"
						:icon="item.icon"
						:to="item.route"
						:href="item.externalLink"
						:target="item.externalLink ? '_blank' : undefined"
					/>
					<q-btn-dropdown v-else flat :label="item.label" :icon="item.icon">
						<q-list>
							<q-item
								v-for="(subItem, subIndex) in item.subMenu"
								:key="subIndex"
								:to="subItem.route"
								:href="subItem.externalLink"
								:target="subItem.externalLink ? '_blank' : undefined"
								clickable
								v-close-popup
							>
								<q-item-section>
									{{ subItem.label }}
								</q-item-section>
							</q-item>
						</q-list>
					</q-btn-dropdown>
				</template>
			</div>
		</q-header>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineOptions({
	name: "HomeLayout",
});

interface ILinkOption {
	label: string;
	icon?: string;
	route?: string;
	externalLink?: string;
	subMenu?: ILinkOption[];
}

const menuItems = ref<ILinkOption[]>([
			{ label: "Home", route: "/" },
			{ label: "Roster", route: "/roster" },
			{ label: "Discord", icon: "fab fa-discord", externalLink: "https://discord.gg/australis" },
		]);
</script>

<style lang="scss">
html {
	scroll-behavior: smooth;
}
</style>
