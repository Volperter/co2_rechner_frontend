<template>
  <v-form @submit.prevent="handleSubmit">
    <v-container>
      <v-row>
        <v-col cols="12" md="3">
          <v-sheet :max-height="600" :max-width="600" :min-width="300" :min-height="500" border>
            <v-text-field ref="RefStart"
                          clearable
                          variant="solo-filled"
                          :rules="[rules.required]"
                          type="text"
                          label="Startort"
            ></v-text-field>
            <v-text-field ref="RefEnd"
                          clearable
                          variant="solo-filled"
                          :rules="[rules.required]"
                          type="text"
                          label="Zielort"
            ></v-text-field>
            <v-select v-model="transportType"
                      label="Transportmethode"
                      variant="solo-filled"
                      :rules="[rules.required]"
                      :items="transport"
                      item-title="name"
                      item-value="value"
            ></v-select>
            <v-select v-model="transportVehicle" ref="RefTrans" v-if="this.transportType == 'car'"
                      clearable
                      label="Autotyp"
                      variant="solo-filled"
                      :items="cars"
                      item-title="name"
                      item-value="value"
            ></v-select>
            <v-text-field ref="Refconsumption" v-if="this.transportType == 'car'"
                          clearable
                          variant="solo-filled"
                          type="number"
                          label="Literverbrauch"
                          suffix="L/100km"
            ></v-text-field>
            <v-text-field ref="RefFuel" v-if="this.transportType == 'car'"
                          clearable
                          variant="solo-filled"
                          type="text"
                          label="Treibstoff"
            ></v-text-field>
            <v-select v-model="transportVehicle" v-if="this.transportType == 'train'"
                      label="Zugtyp"
                      variant="solo-filled"
                      :items="trains"
                      item-title="name"
                      item-value="value"
            ></v-select>
            <v-btn type="submit">
              Submit
            </v-btn>

            <!-- Just for testing -->
            <v-btn v-if="showResult" @click="clearRes">
              Clear result
            </v-btn>
            <!-- Just for testing -->

          </v-sheet>
        </v-col>
        <v-col>
          <v-container>
            <v-row>
              <v-col cols="12" md="3">
                <v-sheet :max-height="200" :max-width="1500" :min-width="400" :min-height="400" border align="center">
                  Fact
                </v-sheet>
              </v-col>
              <v-col cols="12" md="6">
                <v-sheet :max-height="200" :max-width="1500" :min-width="900" :min-height="400" border align="center">
                  Map
                </v-sheet>
              </v-col>
            </v-row>
            <v-row>
              <v-sheet :max-height="200" :max-width="1500" :min-height="100" :min-width="1300" border>
                <v-col cols="12" align="center">

                  <p v-if="!showResult">Result</p>

                  <!-- Just for testing -->
                  <p v-if="showResult">
                    Start: {{start}} <br />
                    Ziel: {{end}} <br />
                    Transportmethode: {{transportType}} <br />
                    Transportfahrzeug: {{transportVehicle}} <br />
                    L/100km: {{consumption}} <br />
                  </p>
                  <!-- Just for testing -->

                </v-col>
              </v-sheet>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: "Input",

  data(){
    return{
      fuel:'',
      consumption: 0,
      start:'',
      end:'',
      transportType:'',
      transportVehicle:'',
      rules: {
        required: value => !!value || 'Erforderlich',
      },
      transport:[{value:"car", name:"Auto"}, {value:"train",name:"Zug"}, {value:"bike",name:"Fahrrad"}, {value:"foot",name:"Fuß"}],
      cars:[{value: "pkw", name:"PKW"}, {value:"lkw", name:"LKW"}, {value:"suv", name:"SUV"} ],
      trains:[{value: "hsb", name:"HSB"}, {value:"regional", name:"Regionalbahn"}],
      showResult: false,
      co2: 0.0
    }
  },
  methods:{
    handleSubmit(){

      if(this.$refs.RefStart.value == "" || this.$refs.RefEnd.value == "" || this.transportType == "")
        return
      else {
        this.start = this.$refs.RefStart.value
        this.end = this.$refs.RefEnd.value
        if(this.$refs.Refconsumption != null)
          this.consumption = this.$refs.Refconsumption.value
        this.showResult = true
        if(this.transportType == "Auto"){
          this.traintype = ""
        }
        if(this.transportType == "Zug"){
          this.cartype = ""
          this.consumption = ""
        }
      }
    },
    clearRes(){
      this.showResult = false
    }
    /*getEmission() {
      fetch('/api/emission', {
        method: 'POST',
        body: JSON.stringify({
          "startLocation": this.start,
          "endLocation": this.end,
          "transportMediumName": this.transportType + "_" + this.transportVehicle + "_" + this.fuel,
          "transportMediumConsumption": this.consumption
        })
        .then(res => {
          return res.json();
        }
        .then((data) => {

        }
      }
    }*/
  }
}
</script>

<style>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
