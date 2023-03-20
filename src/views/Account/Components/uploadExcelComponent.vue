<template >
  <v-dialog v-model="dialogUploadData" max-width fullscreen scrollable hide-overlay transition="dialog-bottom-transition"
    persistent>

    <template v-slot:activator="{ on }">
      <template>
        <v-btn color="#536DFE" @click="openDialog" v-on="on" class="white--text  mr-2">
          <v-icon>mdi-file-upload-outline</v-icon>
          <span class="mr-2">رفع ملف اكسل الحسابات</span>
        </v-btn>
      </template>
    </template>

    <v-card>
      <v-card-title class="ma-0 pa-0">

      </v-card-title>

      <v-card-text>
        <v-container>

          <template>
            <v-row>
              <v-col cols="12" sm="6" v-if="hasPermassion(['AdminSystem'])">
                <v-autocomplete v-model="selectedBank" :items="banks" :loading="isLoadingBanks" single-line dense
                  :search-input.sync="searchBank" item-text="name" item-value="bankId" label="اختر المصرف"
                  placeholder="بحث عن المصرف" return-object no-data-text=" ابحث عن اسم المصرف" clearable
                  prepend-icon="mdi-bank" @change="onBankChangeLoadRegions">
                </v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6" v-if="hasPermassion(['AdminSystem', 'AddAccountsToOtherBranches'])">
                <v-autocomplete v-model="selectedRegion" :items="regions" :loading="isLoadingRegion" single-line dense
                  required :search-input.sync="searchRegion" item-text="regionName" item-value="bankRegionId"
                  label="اختر المنطقة" placeholder="بحث عن المنطقة" return-object no-data-text="لايوجد بيانات" clearable
                  prepend-icon="mdi-map-marker" @change="onRegionChangeLoadBranches">
                </v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6" v-if="hasPermassion(['AdminSystem', 'AddAccountsToOtherBranches'])">
                <v-autocomplete v-model="selectedBranch" :items="activeBranchs" :loading="isLoadingBranch" single-line
                  dense :search-input.sync="searchBranch" item-text="name" item-value="id" label="اختر الفرع"
                  allow-overflowplaceholder="بحث عن الفرع" return-object no-data-text="لايوجد بيانات" clearable
                  prepend-icon="mdi-bank" @change="onBranchChanges">
                </v-autocomplete>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select v-model="selectAccountType" :items="accountTypeOptions" item-text="text" item-value="value"
                  dense label="نوع الحساب" placeholder="نوع الحساب" no-data-text="لايوجد بيانات" return-object single-line
                  prepend-icon="mdi-bank" @change="onAccountTypeChanged">
                </v-select>
              </v-col>
            </v-row>
          </template>
        </v-container>

        <template>
          <div class="mt-3">
            <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls"
              @change="handleClick" />
            <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
              اسحب وافلت ملف اكسل الحسابات هنا
              <el-button :loading="loading" style="margin-left: 16px" size="mini" type="primary" @click="handleUpload">
                اختر ملف
              </el-button>
            </div>
          </div>
        </template>

        <template>
          <div class="text-center">
            <v-btn color="#E91D62" outlined @click="closeDialogUploadData" class="ma-3">
              <v-icon>mdi-close</v-icon> <span class="mr-2">اغلاق</span>
            </v-btn>
            <v-btn color="#536DFE" outlined @click="clearUploadData" class="ma-3" v-if="!isValidExcelData">
              <v-icon>clear</v-icon> <span class="mr-2">تفريغ البيانات </span>
            </v-btn>
            <v-btn color="#536DFE" @click="SaveData" class="white--text  mr-2" v-if="isValidExcelData">
              حفظ الحسابات</v-btn>
          </div>

          <div class="text-center">
            <label color="#536DFE"> {{ this.errorMessageLabel }} </label>
          </div>

          <v-data-table :headers="headersDataFromExcel" :items="excelData" class="elevation-5 ma-3">
          </v-data-table>

        </template>
      </v-card-text>

    </v-card>
  </v-dialog>
</template>
  
<script>
// import XLSX from "xlsx";
import * as XLSX from 'xlsx'

import { createHelpers } from "vuex-map-fields";
import { mapActions } from "vuex";

const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});

export default {
  name: "Add-accounts-File",
  props: {
    dlgInsertFileProp: {},
  },
  data: () => ({
    dialogUploadData: false,
    loading: false,

    errorMessageLabel: "",

    userInfo: null,

    banks: [],
    regions: [],
    activeBranchs: [],
    isLoadingBanks: false,
    isLoadingRegion: false,
    isLoadingBranch: false,
    searchRegion: null,
    searchBank: null,
    searchBranch: null,
    selectedBank: null,
    selectedBranch: null,
    selectedRegion: null,
    filterRegionData: {
      bankId: null,
      regionName: null,
    },

    filterBankData: {
      bankName: null,
    },

    filterBranchData: {
      branchRegionId: null,
      NameOrNumber: null,
    },
    //

    selectAccountType: null,
    accountTypeOptions: [
      { text: "افراد", value: 1 },
      { text: "شركات", value: 2 },
    ],

    headersDataFromExcel: [
      { text: "اسم الحساب", value: "accountName", sortable: true, align: "right", },
      { text: "رقم الحساب", value: "accountNo", sortable: true, align: "center" },
      { text: "رقم الهاتف", value: "phoneNumber", sortable: false, align: "center" },
      { text: "", value: "message", sortable: true, align: "center", },
    ],
  }),

  watch: {
    dlgInsertFileProp: {
      handler(data) {
        this.dialogUploadData = data;
        this.getUserInfo();
        // console.log(this.userInfo)
      },
      immediate: true,
    },
    searchBank(val) {
      if (this.isLoadingBanks) return;
      this.filterBankData.bankName = val;
      this.getBanks();
    },
    searchRegion(val) {
      if (this.isLoadingRegion) return;
      if (val === this.selectedRegion?.regionName) return;
      this.filterRegionData.regionName = val;
      this.getBankRegions();
    },

    searchBranch(val) {
      if (this.isLoadingBranch) return;
      if (val === this.selectedBranch?.name) return;
      this.filterBranchData.branchRegionId = this.selectedRegion?.bankRegionId;
      this.filterBranchData.NameOrNumber = val;
      this.GetBranches();
    },
  },

  computed: {
    ...mapFields("excelAccountsStore", {
      excelData: "excelData",
      excelBranchId: "excelBranchId",
    }),
    // isValidExcelData() {
    //   return this.excelData.some(s => !s?.message)
    // },
    isValidExcelData() {
      let result = this.excelData.find(s => s?.message != null) ?? null
      if(result){
        return false;
      }else{
        return true;
      }
    },
  },

  methods: {
    openDialog() {
      this.dialogUploadData = true;
    },

    ...mapActions({
      InsertListOfAccountsAction: "excelAccountsStore/InsertListOfAccounts",
      ClearExcelDataAction: "excelAccountsStore/ClearExcelData",
      GetBankStore: "bankStore/GetBanks",
      GetActiveBankRegions: "bankRegionStore/GetActiveBankRegions",
      GetActiveBranchesAction: "branchStore/GetActiveBranchs",
    }),

    hasPermassion(crrentUser) {
      this.userPermasstion = this.$store.getters["auth/getRole"];
      var result = this.userPermasstion.some((item) =>
        crrentUser.includes(item)
      );
      return result;
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name);
    },


    // Bank /region /branch dropdown list functions

    getUserInfo() {
      this.userInfo = this.$store.getters["auth/getInfo"];
    },
    onBankChangeLoadRegions() {
      this.getBankRegions();
    },
    onRegionChangeLoadBranches() {
      this.clearUploadData();
      this.filterBranchData.branchRegionId = this.selectedRegion?.bankRegionId;
      this.GetBranches();
    },

    getBankRegions() {
      this.filterRegionData.bankId = this.selectedBank?.bankId;
      try {
        this.isLoadingRegion = true;
        this.GetActiveBankRegions(this.filterRegionData)
          .then(() => {
            this.regions = [];
            this.regions = [...this.$store.getters["bankRegionStore/GET_ACTIVE_BANKREGIONS"],];
            this.isLoadingRegion = false;
          })
          .catch(() => {
            //this.notify(`${error}`, "#1d262d");
            this.isLoadingRegion = false;
          });
      } catch (error) {
        this.isLoadingRegion = false;
        //this.notify(error, "#1d262d");
      }
    },
    getBanks() {
      try {
        this.isLoading = true;
        this.GetBankStore(this.filterBankData)
          .then(() => {
            this.banks = [];
            this.banks = [
              ...this.$store.getters["bankStore/GET_ACTIVE_BANKS"],
            ];
            this.isLoading = false;
          })
          .catch((error) => {
            this.notify(`${error}`, "#1d262d");
            this.isLoading = false;
          });
      } catch (error) {
        this.isLoading = false;
        this.notify(error, "#1d262d");
      }
    },
    GetBranches() {
      try {
        //this.isLoadingBranch = true;
        this.GetActiveBranchesAction(this.filterBranchData)
          .then(() => {
            this.activeBranchs = [
              ...this.$store.getters["branchStore/GET_ACTIVE_BRANCHS"],
            ];
            this.isLoadingBranch = false;
          })
          .catch(() => {
            //this.notify(`${error}`, "#1d262d");
            this.isLoadingBranch = false;
          });
      } catch (error) {
        //this.isLoadingBranch = false;
        this.notify(error, "#1d262d");
      }
    },

    onBranchChanges(item) {
      this.clearUploadData();
      this.selectedBranchNum = item?.branchNo;
    },

    //end Bank /region /branch dropdown list functions


    onAccountTypeChanged() {
      this.ClearExcelDataAction();
      this.errorMessageLabel = "";
    },

    handleDrop(e) {
      e.stopPropagation();
      e.preventDefault();
      if (this.loading) return;

      const files = e.dataTransfer.files;

      if (files.length !== 1) {
        this.notify("قم باختيار ملف واحد فقط", "#1d262d");
        return;
      }
      const rawFile = files[0]; // only use files[0]

      if (!this.isExcel(rawFile)) {
        this.notify("يجب رفع ملف اكسل فقط", "#1d262d");
        return false;
      }
      this.upload(rawFile);
      e.stopPropagation();
      e.preventDefault();
    },

    upload(rawFile) {
      this.$refs["excel-upload-input"].value = null; // fix can't select the same excel
      if (!this.beforeUpload) {
        this.readerData(rawFile);
        return;
      }
      const before = this.beforeUpload(rawFile);
      if (before) {
        this.readerData(rawFile);
      }
    },

    beforeUpload(file) {
      const isLessThan10M = file.size / 1024 / 1024 < 10;

      if (isLessThan10M == false) {
        this.notify("حجم ملف الاكسل يجب ان يكون اقل من 10 ميجابايت", "#1d262d");
        return false;
      }

      if (!(this.selectAccountType?.value === 1 || this.selectAccountType?.value === 2)) {
        this.notify("الرجاء اختيار نوع الحسابات أفراد او شركات", "#1d262d");
        return false;
      }

      if (this.userInfo?.branchId === null && this.selectedBranch === null) {
        this.notify("الرجاء اختيار الفرع قبل رفع ملف الاكسل", "#1d262d");
        return false;
      }
      return true;
    },

    readerData(rawFile) {
      this.loading = true;
      this.excelBranchId = this.selectedBranch ? this.selectedBranch.id : this.userInfo?.branchId;

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const results = XLSX.utils.sheet_to_json(worksheet);
          let filterData = results
            .filter((row) => {
              if (Object.keys(row).length > 1) return row;
            })
            .map((item) => {
              var newitem = {
                accountName: item.accountName ? item.accountName : "",
                accountNo: item.accountNumber ? this.addLeadingZeros(item.accountNumber, 14) : "",
                phoneNumber: item.phoneNumber ? this.addLeadingZeros(item.phoneNumber, 10) : "",
                accountType: this.selectAccountType ? this.selectAccountType?.value : 0,
                message: this.validateData(item) ?? null,
                accountState: 1
              };
              return newitem;
            });

          this.excelData = filterData;
          this.loading = false;
          resolve();
        };
        reader.readAsArrayBuffer(rawFile);
      });
    },

    validateData(element) {
      let branchNumber = this.selectedBranch ? this.selectedBranch.branchNo : this.userInfo?.branchNumber;
      if (element.accountNumber.length < 14) {
        return "طول الحساب اقل من 14 رقم"
      }
      if (this.addLeadingZeros(element.accountNumber, 14).substring(0, 3) != branchNumber) {
        return " رقم الحساب لا ينتمي للفرع"
      }
      if (!(!element.phoneNumber || this.addLeadingZeros(element.phoneNumber, 10).length === 10)) {
        return " خطأ في رقم الهاتف "
      }
      if (element.phoneNumber) {
        if (!(
          this.addLeadingZeros(element.phoneNumber, 10).substring(0, 3) === "091" ||
          this.addLeadingZeros(element.phoneNumber, 10).substring(0, 3) === "092" ||
          this.addLeadingZeros(element.phoneNumber, 10).substring(0, 3) === "094"
        )) {
          return " خطأ في رقم الهاتف "
        }
      }
    },

    addLeadingZeros(num, totalLength) {
      return String(num).padStart(totalLength, '0');
    },

    handleDragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },

    handleClick(e) {
      const files = e.target.files;
      const rawFile = files[0];
      if (!rawFile) return;
      this.upload(rawFile);
    },

    handleUpload() {
      this.$refs["excel-upload-input"].click();
    },

    closeDialogUploadData() {
      this.dialogUploadData = false;
      this.clearUploadData();
      this.clearInput();
    },

    clearInput() {
      this.banks = [];
      this.regions = [];
      this.activeBranchs = [];
      this.selectAccountType = null;

      this.selectedBank = null;
      this.selectedBranch = null;
      this.selectedRegion = null;

      this.searchRegion = null;
      this.searchBank = null;
      this.earchBranch = null;
    },

    clearUploadData() {
      this.ClearExcelDataAction();
      this.errorMessageLabel = "";
      this.$refs["excel-upload-input"].value = "";
    },

    SaveData() {
      if (this.excelData.length == 0) {
        this.notify("الرجاء اختيار ملف الاكسل ", "#1d262d");
        return;
      }
      this.$store.dispatch("loading", true);
      this.InsertListOfAccountsAction()
        .then((res) => {
          //this.$emit("refresh-data");
          this.$store.dispatch("loading", false);
          this.notify(`${res}`, "#1d262d");
          this.close();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });

    },

    close() {
      this.dialogUploadData = false;
      this.clearInput();
      setTimeout(() => {
        this.clearUploadData();
      }, 300);
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}

.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 150px;
  line-height: 150px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>