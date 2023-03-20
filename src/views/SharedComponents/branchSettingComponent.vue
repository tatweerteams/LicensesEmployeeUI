<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          prepend-icon="mdi-ticket-confirmation"
          v-model="companyFrom"
          dense
          :rules="[validationInput.numberOnly, validationInput.numberNotZero]"
          label="الحد الأدنى لعدد طلبات للشركات"
          required
          maxLength="10"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          prepend-icon="mdi-ticket-confirmation"
          v-model="companyTo"
          label="الحد الأعلى لعدد طلبات"
          :rules="[validationInput.numberOnly, validationInput.numberNotZero,checkEndRequestCompany]"
          required
          dense
          maxLength="10"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          prepend-icon="mdi-ticket-confirmation"
          v-model="individualFrom"
          :rules="[validationInput.numberOnly, validationInput.numberNotZero]"
          label="الحد الأدنى لعدد طلبات للأفراد"
          required
          dense
          maxLength="10"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          prepend-icon="mdi-ticket-confirmation"
          v-model="individualTo"
          label="الحد الأعلى لعدد طلبات"
          :rules="[validationInput.numberOnly, validationInput.numberNotZero,checkEndRequestIndividual]"
          required
          dense
          maxLength="10"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          prepend-icon="mdi-ticket-confirmation"
          v-model="certifiedFrom"
          :rules="[validationInput.numberOnly, validationInput.numberNotZero]"
          label="الحد الأدنى لعدد طلبات صكوك المصدقة"
          required
          dense
          maxLength="10"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          prepend-icon="mdi-ticket-confirmation"
          v-model="certifiedTo"
          :rules="[validationInput.numberOnly, validationInput.numberNotZero, checkEndRequestCertifiedFrom]"
          label="الحد الأعلى لعدد الطلبات"
          required
          dense
          maxLength="10"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          prepend-icon="mdi-ticket-confirmation"
          v-model="branchRequestCountOfDay"
          :rules="[validationInput.numberOnly, validationInput.numberNotZero]"
          label="الحد الأعلى لعدد الطلبات للفرع"
          required
          dense
          maxLength="10"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          prepend-icon="mdi-ticket-confirmation"
          v-model="individualQuentityOfDay"
          :rules="[validationInput.numberOnly, validationInput.numberNotZero]"
          label="الحد الأعلى لعدد الدفاتر للفرد في اليوم"
          required
          dense
          maxLength="10"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          prepend-icon="mdi-ticket-confirmation"
          v-model="accountChekBook"
          :rules="
            accountChekBook
              ? [
                  validationInput.numberOnly,
                  checkAccountChekBook,
                  validationInput.numberNotZero,
                  validationInput.minLengthAccount,
                ]
              : []
          "
          label="رقم الحساب الصك"
          required
          dense
          maxLength="15"
        ></v-text-field>
      </v-col>
      <v-col cols="12" dense>
        <v-switch
          label="هل إمكانية طلب أكثر من دفتر لحسابات الأفراد في اليوم ؟ "
          color="#536DFE"
          hide-details
          dense
          class="justify-center text-center d-inline-block"
          v-model="individualRequestAccountDay"
        ></v-switch>
      </v-col>
      <v-col cols="12" dense>
        <v-switch
          label="إمكانية تخويل الطلبات من قبل مدير الفرع ؟"
          color="#536DFE"
          hide-details
          dense
          class="justify-center text-center d-inline-block"
          v-model="orderRequestAuthorization"
        ></v-switch>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { createHelpers } from "vuex-map-fields";
import { validationInput } from "../../models/validationInput.js";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  name: "insert-Or-Update",
  props: {},

  data: () => ({
    validationInput: validationInput,
  }),

  computed: {
    ...mapFields("branchStore", {
      accountChekBook: "editedItem.branchSetting.accountChekBook",
      companyFrom: "editedItem.branchSetting.companyFrom",
      companyTo: "editedItem.branchSetting.companyTo",
      certifiedFrom: "editedItem.branchSetting.certifiedFrom",
      certifiedTo: "editedItem.branchSetting.certifiedTo",
      individualFrom: "editedItem.branchSetting.individualFrom",
      individualTo: "editedItem.branchSetting.individualTo",
      individualRequestAccountDay:
        "editedItem.branchSetting.individualRequestAccountDay",
      individualQuentityOfDay:
        "editedItem.branchSetting.individualQuentityOfDay",
      branchNo: "editedItem.branchNo",
      branchRequestCountOfDay: "editedItem.branchSetting.branchRequestCountOfDay",
      orderRequestAuthorization: "editedItem.branchSetting.orderRequestAuthorization",
    }),
  },

  watch: {},
  methods: {
    checkAccountChekBook(val) {
      if (!val?.startsWith(this.branchNo, 0)) {
        return `رقم الحساب غير صحيح`;
       } else {
         return true;
       }
    },

    checkEndRequestCompany(val) {
      if(parseInt(val) <= parseInt(this.companyFrom))
      {
        return `يجب إدخال النهاية الطلب أكبر من بداية الطلب`;
       } else {
         return true;
       }
    },

   
    checkEndRequestIndividual(val) {
      if(parseInt(val) <= parseInt(this.individualFrom))
      {
        return `يجب إدخال النهاية الطلب أكبر من بداية الطلب`;
       } else {
         return true;
       }
    },

    checkEndRequestCertifiedFrom(val) {
      if(parseInt(val) <= parseInt(this.certifiedFrom))
      {
        return `يجب إدخال النهاية الطلب أكبر من بداية الطلب`;
       } else {
         return true;
       }
    },
  },
};
</script>

<style></style>
