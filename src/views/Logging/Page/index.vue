<template>
    <div>

        <LogDetailsComponent :data-prop="itemToDisplayOnDetailsDialog" :dialog-prop="detailsDialog"
            @details-dialog="colseDetailsDialog">
        </LogDetailsComponent>

        <v-card min-height="40rem" color="transparent" elevation="0" height="auto" style="padding:30px; ">

            <SearchInsideLogComponent @search-data="searchData"></SearchInsideLogComponent>

            <v-data-table :headers="headers" :disable-pagination="true" :items="grids" hide-default-footer
                class="elevation-5 pa-5">
                <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-toolbar-title><v-icon>mdi-newspaper-plus</v-icon> سجل النظام
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer />
                    </v-toolbar>
                </template>

                <template v-slot:[`item.userType`]="{ item }">
                    {{ UserTypeStateToTextPublic(item.userType) }}
                </template>

                <template v-slot:[`item.eventType`]="{ item }">
                    {{ LogActionTypeToText(item.eventType) }}
                </template>
                <template v-slot:[`item.createAt`]="{ item }">
                    {{ item.createAt.substring(0, 10) }}
                </template>

                <template v-slot:[`item.action`]="{ item }">
                    <v-btn x-small fab color="#536DFE" @click="showDetails(item)">
                        <v-icon color="#fff">mdi-television</v-icon>
                    </v-btn>
                </template>

                <template v-slot:no-data>
                    <v-btn color="#081D38" class="white--text" @click="initialize">عرض البيانات</v-btn>
                </template>

            </v-data-table>

            <template class="mt-5">
                <div class="text-center mt-3">
                    <v-pagination v-model="page" :length="pageSize" circle color="#081D38" @input="onPaginationClick"
                        :total-visible="7"></v-pagination>
                </div>
            </template>
        </v-card>
    </div>
</template>
  
<script>
import { mapActions } from "vuex";
import { createHelpers } from "vuex-map-fields";
import { UserTypeStateList } from "../../../models/enum";
import LogDetailsComponent from "../Components/LogDetailsComponent.vue";
import SearchInsideLogComponent from "../Components/SearchInsideLogComponent.vue";

import {
    UserTypeStateToTextPublic,
    LogActionTypeToText,
} from "../../../models/mothedPublic.js";

const { mapFields } = createHelpers({
    getterType: "getDataFields",
    mutationType: "updateDataField",
});

export default {
    name: "",
    props: {
        source: String,
    },
    components: {
        LogDetailsComponent,
        SearchInsideLogComponent,
    },

    data: () => ({
        userPermasstion: [],
        userTypes: UserTypeStateList,

        itemToDisplayOnDetailsDialog: null,
        detailsDialog: false,

        headers: [
            {
                text: "رقم الفرع",
                value: "branchNumber",
                sortable: false,
                align: "center",
            },
            {
                text: "اسم المستخدم",
                value: "userName",
                sortable: false,
                align: "center",
            },
            {
                text: "نوع المستخدم",
                value: "userType",
                sortable: false,
                align: "center",
            },
            {
                text: "نوع العملية ",
                value: "eventType",
                sortable: false,
                align: "center",
            },
            {
                text: "Messages",
                value: "messages",
                sortable: false,
                align: "center",
            },
            {
                text: "الوقت",
                value: "createAt",
                sortable: false,
                align: "center",
            },
            { text: "عرض التفاصيل", value: "action", sortable: false, align: "center" },
        ],

        page: 1,
        pageSize: 1,

        filterData: {
            userName: null,
            branchNo: null,
            branchName: null,
            eventType: null,
            userType: null,
            from: null,
            to: null,
            pageNo: 1,
            pageSize: 30,
        },
    }),

    created() {
        this.initialize();
    },

    computed: {
        ...mapFields("loggingStore", {
            grids: "grids",
            pageCount: "pageCount",
        }),
    },

    methods: {
        ...mapActions({
            GetLogsAction:
                "loggingStore/GetLogs",
        }),

        showDetails(item) {
            this.itemToDisplayOnDetailsDialog = item;
            this.detailsDialog = true;
        },
        UserTypeStateToTextPublic(orderRequestType) {
            return UserTypeStateToTextPublic(orderRequestType);
        },

        LogActionTypeToText(logAction) {
            return LogActionTypeToText(logAction);
        },

        searchData(filter) {
            this.page = 1;
            this.filterData = filter;
            this.initialize();
        },

        colseDetailsDialog() {
            this.itemToDisplayOnDetailsDialog = null;
            this.detailsDialog = false;
        },

        initialize() {
            try {
                this.filterData.pageNo = this.page;
                this.$store.dispatch("loading", true);
                this.GetLogsAction(this.filterData)
                    .then(() => {
                        this.$store.dispatch("loading", false);
                        this.pageSize = this.pageCount;
                    })
                    .catch((error) => {
                        this.notify(`${error}`, "#1d262d");
                        this.$store.dispatch("loading", false);
                    });
            } catch (error) {
                this.$store.dispatch("loading", false);
                this.notify(error, "#1d262d");
            }
        },

        onPaginationClick(page) {
            this.page = page;
            this.initialize();
        },

        notify(text, color) {
            this.$store.commit("showMessage", { text: text, color: color });
        },
    },
};
</script>
  
<style scoped>
/* delete and edit icon disable color */
.theme--dark.v-icon--disabled {
    color: rgba(221, 59, 59, 0.5) !important;
}

/* Activate icon disable color */
.theme--light.v-icon--disabled {
    color: rgba(221, 59, 59, 0.5) !important;
}
</style>
  