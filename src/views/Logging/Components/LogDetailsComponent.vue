<template>
    <v-dialog v-model="dialog" max-width="50%" persistent>
        <v-card>
            <v-card-title>
                <span class="headline">التفاصيل</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-container>
                    <h4>البيانات قبل التعديل</h4>
                    <br>
                    <!-- <template v-for="(value, name) in logOld">
                            {{ name }}  :  {{ value }}
                        </template> -->
                    {{ logOld }}

                    <br> <br>
                    <v-divider></v-divider>
                    <br>

                    <h4>البيانات بعد التعديل</h4>
                    <br>
                    {{ logNew }}
                </v-container>
            </v-card-text>

            <v-card-actions>
                <div style="width: 100%;text-align: center;">
                    <v-btn class="ma-3" @click="close" outlined color="#E91D62">
                        <v-icon dark>clear</v-icon><span>رجوع</span>
                    </v-btn>
                </div>
            </v-card-actions>

        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        dataProp: {},
        dialogProp: {},
    },
    data: () => ({
        valid: false,
        dialog: false,
        logOld: null,
        logNew: null,
    }),
    watch: {
        dataProp: {
            handler(data) {
                if (data) {
                    // this.logOld = JSON.parse(data.oldData);
                    // this.logNew = JSON.parse(data.newData);
                    this.logNew = data.newData;
                    this.logOld = data.oldData;
                }
            },
            immediate: true,
        },

        dialogProp: {
            handler(data) {
                this.dialog = data;
            },
            immediate: true,
        },
    },
    methods: {
        close() {
            this.dialog = false;
            this.valid = false;
            this.logOld = null;
            this.logNew = null;
            this.$emit("details-dialog");
        },
    }
}
</script>

<style scoped></style>