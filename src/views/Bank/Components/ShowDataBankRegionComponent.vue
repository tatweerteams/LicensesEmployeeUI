<template>
  <div>
    <template v-if="itemDelete">
      <deleteBankRegionComponent
        :deleteDlgProp="dialogDelete"
        :deleteItemProp="itemDelete"
      ></deleteBankRegionComponent>
    </template>
    <v-list class="transparent">
      <v-list-item v-for="(item, index) in bankRegions" :key="index">
        <v-list-item-avatar
          class="text-center justify-center"
          :color="item.isActive ? '#536DFE' : '#C5C5C5'"
          :class="
            item.isActive ? 'white--text elevation-5' : 'elevation-5 text-color'
          "
        >
          <span class="white--text">{{ item.regionNumber }}</span>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="font-weight-bold text-color">
            {{ item.regionName }}
          </v-list-item-title>
          <v-list-item-subtitle class="font-weight-bold text-color">
            عدد الفروع : {{ item?.branchCount ?? 0 }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action class="">
          <v-row>
            <v-switch
              dense
              color="#536DFE"
              :input-value="item.isActive"
              @change="activationBankRagion(item)"
            ></v-switch>

            <v-btn small icon color="#E91D62" class="mx-4">
              <v-icon class="mb-1" @click="deleteItem(item)"
                >mdi-close-thick</v-icon
              >
            </v-btn>
          </v-row>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { EventBus } from "../../../eventBus";
import deleteBankRegionComponent from "../../BankRegion/Components/DeleteBankRegionComponent.vue";
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  name: "Show-Bank-Region",
  props: {},
  components: {
    deleteBankRegionComponent,
  },

  data: () => ({
    dialogDelete: false,
    itemDelete: null,
  }),

  computed: {
    ...mapFields("bankRegionStore", {
      bankRegions: "bankRegions",
    }),
  },
  created() {
    EventBus.$on("closeDeleteDialogBankRegion", () => {
      this.dialogDelete = false;
      this.itemDelete = null;
    });
  },

  methods: {
    ...mapActions({
      ActivateBankRegionStore: "bankRegionStore/ActivationBankRegion",
    }),

    deleteItem(item) {
      this.dialogDelete = true;
      this.itemDelete = item;
    },
    activationBankRagion(item) {
      // this.$store.dispatch("loading", true);
      this.ActivateBankRegionStore(item)
        .then(() => {
          this.$store.dispatch("loading", false);
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
