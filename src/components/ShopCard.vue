<template>
	<div id="shopCard" class="shop-card-section flex flex-center q-pb-xl q-px-md">
		<q-card flat class="shop-card">
			<div class="row items-center q-col-gutter-lg">
				<div class="col-auto">
					<q-avatar size="88px" class="shop-avatar">
						<q-icon name="storefront" size="44px" color="white" />
					</q-avatar>
				</div>

				<div class="col-12 col-sm">
					<div class="row items-center q-gutter-sm no-wrap">
						<div class="text-h5 text-bold text-white">BadDogZ Industries</div>
						<q-badge outline color="positive" label="20% off for ASA" class="tag-badge" />
					</div>
					<div class="text-caption text-grey-5 q-mb-sm">Member-run crafting shop, in conjunction with ASA</div>
					<div class="text-body2 text-grey-4">Crafted armor, weapons &amp; ship components - priced in aUEC, verified through Discord.</div>
				</div>

				<div class="col-12 col-sm-auto q-mt-md q-mt-sm-none">
					<q-btn
						label="Visit the Shop"
						class="shop-cta full-width"
						rounded
						icon="storefront"
						href="https://baddogz.cloud/shop.html"
						target="_blank"
					/>
				</div>
			</div>
		</q-card>
	</div>
</template>

<script setup lang="ts">
defineOptions({
	name: "ShopCard",
});
</script>

<style lang="scss" scoped>
.shop-card-section {
	background-color: $dark-page;
}

.shop-card {
	background-color: #1a1a1e;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 16px;
	padding: 28px 32px;
	max-width: 760px;
	width: 100%;
}

.shop-avatar {
	background-color: #b8892f;
}

.tag-badge {
	font-size: 11px;
	letter-spacing: 0.02em;
	text-transform: uppercase;
	padding: 4px 8px;
}

.shop-cta {
	background-color: #b8892f;
	color: #17130a;
	padding: 10px 22px;
	font-size: 15px;
}
</style>

