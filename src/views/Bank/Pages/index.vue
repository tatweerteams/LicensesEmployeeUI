<template>
  <div>
    <template v-if="itemDelete">
      <DeleteBankComponent
        :deleteDlgProp="dialogDelete"
        :deleteItemProp="itemDelete"
      ></DeleteBankComponent>
    </template>

    <template v-if="itemBankRegion">
      <BankRegionsComponent
        :dialogProp="dialogBankRegion"
        :selectedItemProp="itemBankRegion"
      ></BankRegionsComponent>
    </template>
    <v-container fluid>
      <v-card min-height="40rem" elevation="10" shaped class="pa-5">
        <v-card-title>
          <v-icon size="30" color="#081D38">mdi-bank-outline</v-icon>
          <v-divider class="mx-5" vertical></v-divider>
          <span class="font-weight-bold text-color">إعدادات المصارف</span>
          <v-spacer />

          <InsertOrUpdateComponent
            :dialogProp="dialogUpdate"
            :updateItemProp="itemUpdate"
          ></InsertOrUpdateComponent>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <template v-if="banks.length == 0 || !banks">
            <EmptyComponent message="لابوجد بيانات ليتم عرضها" />
          </template>
          <template v-else>
            <v-row>
              <v-col
                cols="12"
                lg="4"
                md="6"
                v-for="(item, index) in banks"
                :key="index"
              >
                <v-card elevation="5">
                  <v-card-text>
                    <v-list-item>
                      <v-list-item-avatar
                        class="text-center justify-center "
                        :color="item.isActive ? '#536DFE' : '#C5C5C5'"
                        :class="
                          item.isActive
                            ? 'white--text elevation-5'
                            : 'elevation-5 text-color'
                        "
                      >
                        <span>{{ item.bankNo }}</span>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold text-color">
                          {{ item.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                          class="font-weight-bold text-color"
                        >
                          عدد المناطق للمصرف : {{ item.bankRegionCount }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-switch
                          color="#536DFE"
                          :input-value="item.isActive"
                          @click="activationBank(item)"
                        ></v-switch>
                      </v-list-item-action>
                    </v-list-item>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions class="text-center justify-center ">
                    <v-btn icon color="#536DFE" @click="showDetails(item)">
                      <v-icon>mdi-television</v-icon>
                    </v-btn>
                    <v-btn icon color="#536DFE" @click="editItem(item)">
                      <v-icon>mdi-text-box-edit</v-icon>
                    </v-btn>
                    <v-btn icon color="#E91D62" @click="deleteItem(item)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import InsertOrUpdateComponent from "../Components/InsertOrUpdateComponent.vue";
import DeleteBankComponent from "../Components/deleteBankComponent.vue";
import BankRegionsComponent from "../Components/BankRegionComponent.vue";
import EmptyComponent from "../../SharedComponents/EmptyComponent.vue";

import { mapActions } from "vuex";
import { EventBus } from "../../../eventBus.js";

import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});

export default {
  components: {
    EmptyComponent,
    InsertOrUpdateComponent,
    DeleteBankComponent,
    BankRegionsComponent,
  },
  created() {
    this.getBanks();
    EventBus.$on("refreshData", () => {
      this.getBanks();
   
    });
    EventBus.$on("closeDialogUpdateBank", () => {
      this.dialogUpdate = false;
      this.itemUpdate = null;
    });
    EventBus.$on("closeDeleteDialogBank", () => {
      this.dialogDelete = false;
      this.itemDelete = null;
    });
    EventBus.$on("closeDialogBankRegion", () => {
      this.dialogBankRegion = false;
      this.itemBankRegion = null;
    });
  },
  data: () => ({
    dialogUpdate: false,
    itemUpdate: null,

    dialogDelete: false,
    itemDelete: null,

    dialogBankRegion: false,
    itemBankRegion: null,
  }),
  computed: {
    ...mapFields("bankStore", {
      banks: "grids",
    }),
  },

  methods: {
    ...mapActions({
      GetBankStore: "bankStore/GetBanks",
      ActivateBankStore: "bankStore/ActivateBank",
    }),

    editItem(item) {
      this.dialogUpdate = true;
      this.itemUpdate = item;
    },
    deleteItem(item) {
      this.dialogDelete = true;
      this.itemDelete = item;
    },
    activationBank(item) {
      this.$store.dispatch("loading", true);

      this.ActivateBankStore(item)
        .then(() => {
          this.getBanks();
          this.$store.dispatch("loading", false);
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },
    showDetails(item) {
      this.dialogBankRegion = true;
      this.itemBankRegion = item;

    },

    getBanks() {
      this.$store.dispatch("loading", true);
      this.GetBankStore()
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

<style>
.text-color {
  color: #081d38;
}
.text-header-color {
  color: #ededed;
}
</style>
