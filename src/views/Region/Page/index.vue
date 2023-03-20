<template>
  <div>
    <template v-if="itemDelete">
      <DeleteRegionComponent
        :deleteDlgProp="dialogDelete"
        :deleteItemProp="itemDelete"
      ></DeleteRegionComponent>
    </template>
    <v-container fluid>
      <v-card min-height="40rem" elevation="10" shaped class="pa-5">
        <v-card-title>
          <v-icon size="30" color="#081D38">mdi-bank-outline</v-icon>
          <v-divider class="mx-5" vertical></v-divider>
          <span class="font-weight-bold text-color">إعدادات المناطق</span>
          <v-spacer />

          <InsertOrUpdateComponent
            :dialogProp="dialogUpdate"
            :updateItemProp="itemUpdate"
            @refresh-data="getRegions"
          ></InsertOrUpdateComponent>
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <template v-if="regions.length == 0 || !regions">
            <EmptyComponent message="لابوجد بيانات ليتم عرضها" />
          </template>
          <template v-else>
            <v-row>
              <v-col
                cols="12"
                lg="4"
                md="6"
                v-for="(item, index) in regions"
                :key="index"
              >
                <v-card elevation="5">
                  <v-card-text>
                    <v-list-item>
                      <v-list-item-avatar
                        class="text-center justify-center"
                        color="#536DFE"
                      >
                        <span class="white--text">{{ item.regionNumber }}</span>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold text-color">
                          {{ item.regionName }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                          class="font-weight-bold text-color"
                        >
                          تاريخ الإنشاء : {{ item.createRegionDate }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions class="text-center justify-end">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="#536DFE"
                          @click="editItem(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-text-box-edit</v-icon>
                        </v-btn>
                      </template>
                      <span>تعديل المنطقة</span>
                    </v-tooltip>

                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          color="#E91D62"
                          @click="deleteItem(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <span>إلغاء المنطقة</span>
                    </v-tooltip>
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
import InsertOrUpdateComponent from "../Components/InsertOrUpdateComponents.vue";
import DeleteRegionComponent from "../Components/DeleteRegionComponent.vue";
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
    DeleteRegionComponent,
  },
  created() {
    this.getRegions();
    EventBus.$on("refreshData", () => {
      this.getRegions();
    });
    EventBus.$on("closeDialogUpdateRegion", () => {
      this.dialogUpdate = false;
      this.itemUpdate = null;
    });
    EventBus.$on("closeDeleteDialogRegion", () => {
      this.dialogDelete = false;
      this.itemDelete = null;
    });
  },
  data: () => ({
    dialogUpdate: false,
    itemUpdate: null,

    dialogDelete: false,
    itemDelete: null,

    filterRegion: {
      regionName: null,
      regionNo: null,
    },
  }),
  computed: {
    ...mapFields("regionStore", {
      regions: "regions",
    }),
  },

  methods: {
    ...mapActions({
      GetRegionStore: "regionStore/GetRegions",
    }),

    editItem(item) {
      this.dialogUpdate = true;
      this.itemUpdate = item;
    },
    deleteItem(item) {
      this.dialogDelete = true;
      this.itemDelete = item;
    },

    getRegions() {
      this.$store.dispatch("loading", true);
      this.GetRegionStore(this.filterRegion)
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
