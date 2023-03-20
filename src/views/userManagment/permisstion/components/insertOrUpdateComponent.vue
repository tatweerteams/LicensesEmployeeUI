<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <template v-slot:activator="{ on }">
      <template>
        <v-btn
          color="#536DFE"
          class="white--text "
          @click="openDialog"
          v-on="on"
          elevation="5"
        >
          <v-icon class="ml-2">mdi-plus-circle</v-icon
          ><span> إضافة صلاحية</span>
        </v-btn>
      </template>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-form ref="formReasonRefuse" v-model="valid">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editItem.name"
                  prepend-icon="mdi-file-document-alert"
                  dense
                  :rules="[
                    validationInput.isEmpty,
                    validationInput.englishOnly,
                    validationInput.minLength,
                  ]"
                  label="اسم الصلاحية"
                  required
                  maxLength="30"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editItem.description"
                  prepend-icon="mdi-file-document-alert"
                  dense
                  :rules="[
                    validationInput.isEmpty,
                    validationInput.isArabic,
                    validationInput.minLength,
                    validationInput.currectInput,
                  ]"
                  label="وصف الصلاحية"
                  required
                  maxLength="50"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <div style="width: 100%;text-align: center;">
          <v-btn
            @click="save"
            class="mx-2 white--text"
            :disabled="!valid"
            color="#536DFE"
          >
            <v-icon>save</v-icon>
            <span>حفظ البيانات</span>
          </v-btn>
          <v-btn class="mx-2 white--text" @click="close" color="#E91D62">
            <v-icon dark>clear</v-icon>
            <span>إغلاق</span>
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { validationInput } from "../../../../models/validationInput.js";
import { mapActions } from "vuex";
export default {
  name: "insert-Or-Update",
  props: {
    updateItemProp: {},
  },
  components: {},

  data: () => ({
    dialog: false,
    valid: false,
    validationInput: validationInput,

    editItem: {
      id: null,
      name: null,
      description: null,
    },

    defaultItem: {
      id: null,
      name: null,
      description: null,
    },
  }),

  computed: {
    formTitle() {
      return this.editItem.id ? "تعديل بيانات الصلاحية" : "إضافة صلاحية جديد";
    },
  },

  watch: {
    updateItemProp: {
      handler(data) {
        if (data) this.editSelected(data);
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      InsertPermisstionStore: "permisstionStore/InsertPermisstion",
      UpdatePermisstionStore: "permisstionStore/UpdatePermisstion",
    }),

    openDialog() {
      this.dialog = true;
    },

    editSelected(item) {
      this.editItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.editItem = Object.assign({}, this.defaultItem);
      this.resetValidation();
      this.$emit("close-dialog-InsertOrUpdate");
    },

    save() {
      if (this.editItem.id) {
        this.UpdatePermisstion();
      } else {
        this.InsertPermisstion();
      }
    },

    UpdatePermisstion() {
      this.$store.dispatch("loading", true);
      this.UpdatePermisstionStore(this.editItem)
        .then((res) => {
          this.notify(`${res}`, "#1d262d");
          this.$emit("refresh-data");
          this.close();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },
    InsertPermisstion() {
      this.$store.dispatch("loading", true);
      this.InsertPermisstionStore(this.editItem)
        .then((res) => {
          this.notify(`${res}`, "#1d262d");
          this.$emit("refresh-data");

          this.close();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    resetValidation() {
      this.$refs.formReasonRefuse?.reset();
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
