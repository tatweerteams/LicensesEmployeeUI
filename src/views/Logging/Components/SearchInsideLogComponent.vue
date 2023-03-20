<template>
    <div>
        <v-card elevation="3" height="auto" class="px-5">
            <v-row>
                <v-subheader>
                    <v-icon class="mx-2">search</v-icon>
                    إسم الفرع
                </v-subheader>
            </v-row>
            <v-form ref="formSearch" v-model="valid">
                <v-row dense class="px-5">
                    <v-col dense cols="12" sm="6" md="4">
                        <v-text-field v-model="searchBranchName" label="إسم الفرع" clearable :rules="searchBranchName ? [validationInput.isEmpty, validationInput.numberAndArabic] : []
                        " dense prepend-icon="mdi-numeric" persistent-hint></v-text-field>
                    </v-col>

                    <v-col dense cols="12" sm="6" md="4">
                        <v-text-field v-model="searchBranchNumber" label="رقم الفرع" clearable :maxlength="3" :rules="searchBranchNumber ? [validationInput.isEmpty, validationInput.numberOnly] : []
                        " dense prepend-icon="mdi-numeric" persistent-hint></v-text-field>
                    </v-col>

                    <v-col dense cols="12" sm="6" md="4">
                        <v-text-field v-model="searchUserName" label="اسم المستخدم" clearable :rules="searchUserName ? [validationInput.isEmpty, validationInput.numberAndArabic] : []
                        " dense prepend-icon="mdi-numeric" persistent-hint></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                        <v-select v-model="selectUserTypeStateList" :items="enumModel.UserTypeStateList"
                            label="بحث عن نوع المستخدم" item-text="name" item-value="id" dense clearable persistent-hint
                            prepend-icon="mdi-account-search"></v-select>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                        <v-select v-model="selectEventTypeState" :items="enumModel.LogActionType" label="بحث عن نوع العملية"
                            item-text="name" item-value="id" dense clearable persistent-hint
                            prepend-icon="mdi-account-search"></v-select>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                        <v-menu ref="menu1" v-model="menu1" :close-on-content-click="false" transition="scale-transition"
                            offset-y max-width="290px" min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="searchDateFrom" label="من تاريخ" hint="MM/DD/YYYY" persistent-hint
                                    prepend-icon="event" v-bind="attrs" v-on="on" dense></v-text-field>
                            </template>
                            <v-date-picker v-model="pickedDateFrom" no-title @input="menu1 = false"></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                        <v-menu ref="menu1" v-model="menu2" :close-on-content-click="false" transition="scale-transition"
                            offset-y max-width="290px" min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="searchDateTo" label="الي تاريخ" hint="MM/DD/YYYY" persistent-hint
                                    prepend-icon="event" v-bind="attrs" v-on="on" dense></v-text-field>
                            </template>
                            <v-date-picker v-model="pickedDateTo" no-title @input="menu2 = false"></v-date-picker>
                        </v-menu>
                    </v-col>

                    <v-col cols="12" class="text-center mb-3">
                        <v-btn v-if="filterIsSelected" color="#081D38" class="white--text" @click="searchData"
                            :disabled="!valid">بــحــث</v-btn>
                        <v-btn v-if="isSearchData" color="red" class="white--text mx-3" @click="clearFilterData"
                            :disabled="!valid">إلغاء البحث</v-btn>
                    </v-col>
                </v-row>

            </v-form>
        </v-card>
    </div>
</template>
  
<script>

import * as enums from "../../../models/enum.js";
import { validationInput } from "../../../models/validationInput.js";

export default {
    name: "Serach-compnent",
    props: {},
    data: () => ({
        menu1: false,
        menu2: false,
        valid: false,

        validationInput: validationInput,

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

        defaultFilterData: {
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

        enumModel: enums,

        isSearchData: false,

        isLoading: false,
        searchBank: null,
        filterBankData: {
            bankName: null,
        },

        pickedDateFrom: null,
        pickedDateTo: null,

        searchBranchName: "",
        searchBranchNumber: "",
        searchUserName: "",
        searchDateFrom: null,
        searchDateTo: null,

        selectEventTypeState: null,
        selectUserTypeStateList: null,

    }),

    watch: {
        searchBranchName(val) {
            this.filterData.branchName = val;
        },
        searchDateFrom(val) {
            this.filterData.from = val;
        },
        searchDateTo(val) {
            this.filterData.to = val;
        },
        searchBranchNumber(val) {
            this.filterData.branchNo = val;
        },
        searchUserName(val) {
            this.filterData.userName = val;
        },
        pickedDateFrom(val){
            this.searchDateFrom = val;
        },
        pickedDateTo(val){
            this.searchDateTo = val;
        }
    },

    computed: {
        filterIsSelected() {
            if (this.filterData.branchName || this.filterData.branchNo || this.filterData.userName || this.selectEventTypeState || this.selectUserTypeStateList) return true;
            else return false;
        },
    },
    methods: {

        parseDate(date) {
            if (!date) return null
            const [month, day, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },

        formatDate(date) {
            if (!date) return null
            const [year, month, day] = date.split('-')
            return `${month}/${day}/${year}`
        },
        searchData() {
            this.filterData.eventType = this.selectEventTypeState ?? null;
            this.filterData.userType = this.selectUserTypeStateList ?? null;
            this.isSearchData = true;
            this.$emit("search-data", this.filterData);
        },

        clearFilterData() {
            this.clearData();
            this.isSearchData = false;
            this.$emit("search-data", this.filterData);
        },

        clearData() {
            this.filterData = Object.assign({}, this.defaultFilterData);
            this.clearBankData();
        },

        clearBankData() {
            this.isLoading = false;
            this.selectEventTypeState = null;
            this.selectUserTypeStateList = null,
            this.searchBranchName = "",
            this.searchBranchNumber = null,
            this.searchDateFrom = null;
        },

        notify(text, color) {
            this.$store.commit("showMessage", { text: text, color: color });
        },
    },
};
</script>
  
<style></style>
  