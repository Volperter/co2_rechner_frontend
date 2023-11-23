<template>
  <v-form @submit.prevent="handleSubmit">
    <v-container>
      <v-row>
        <v-col cols="12" md="3">
          <v-sheet :max-height="600" :max-width="600" :min-width="300" :min-height="530" border>
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
            <v-select  ref="RefFuel" v-if="this.transportType == 'car'"
                      clearable
                      label="Treibstoff"
                      variant="solo-filled"
                      :items="fuels"
                      item-title="name"
                      item-value="value"
            ></v-select>
            <v-select  ref="RefSize" v-if="this.transportType == 'car'"
                       clearable
                       label="Größe"
                       variant="solo-filled"
                       :items="sizes"
                       item-title="name"
                       item-value="value"
            ></v-select>
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

                  <p v-if="!showResult">Fact</p>

                  <!-- Just for testing -->
                  <p v-if="showResult">
                    Start: {{start}} <br />
                    Ziel: {{end}} <br />
                    Transportmethode: {{transportType}} <br />
                    Transportfahrzeug: {{transportVehicle}} <br />
                    L/100km: {{consumption}} <br />
                  </p>
                  <!-- Just for testing -->

                </v-sheet>
              </v-col>
              <v-col cols="12" md="6">
                <v-sheet :max-height="200" :max-width="1500" :min-width="900" :min-height="400" border align="center">

                  Map

                </v-sheet>
              </v-col>
            </v-row>
            <v-row>
              <v-sheet :max-height="200" :max-width="1500" :min-height="100" :min-width="1240" border>
                <v-col cols="12" align="center">

                  <p v-if="!showResult">Result</p>

                  <p v-if="showResult"> C02-Verbrauch: {{ co2 }} </p>

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
      size:'',
      fuel:'',
      consumption: 0,
      start:'',
      end:'',
      transportType:'',
      transportVehicle:'',
      showResult: false,
      co2: 0.0,
      transport:[{value:"car", name:"Auto"}, {value:"train",name:"Zug"}, {value:"bike",name:"Fahrrad"}, {value:"foot",name:"Fuß"}],
      cars:[{value: "Pkw", name:"PKW"}, {value:"Lkw", name:"LKW"}, {value:"Suv", name:"SUV"} ],
      trains:[{value: "hsb", name:"HSB"}, {value:"regional", name:"Regionalbahn"}],
      sizes:[{value: 1, name: "Klein"}, {value: 2,name:"Mittel"},  {value: 3,name:"Gross"}],
      fuels:[ {value: "diesel",name:"Diesel"}, {value: "petrol",name:"Benzin"}, {value: "electro",name:"elektrisch"}],
      rules: {
        required: value => !!value || 'Erforderlich',
      },
    }
  },
  methods:{
    handleSubmit(){

      if(this.$refs.RefStart.value == "" || this.$refs.RefEnd.value == "" || this.transportType == "")
        return
      this.start = this.$refs.RefStart.value
      this.end = this.$refs.RefEnd.value
      this.size = this.$refs.RefSize.value
      this.fuel = this.$refs.RefFuel.value
      if(this.$refs.Refconsumption != null)
        this.consumption = this.$refs.Refconsumption.value
       this.showResult = true
      this.getEmission()
    },
    clearRes(){
      this.showResult = false
    },
    //TODO uses localhost, should use proxy
    getEmission() {
      fetch('/api/emission', {
        method: 'POST',
        body: {
          "startLocation": this.start,
          "endLocation": this.end,
          "transportMediumDTO": {
            "transportMediumName": this.transportVehicle,
            "transportMediumSize": this.size,
            "transportMediumFuel": this.fuel
          }
        }
      })
      .then(res => {
        return res.json();
      })
      .then((data) => {
        this.co2 = data.emission
      })
    }
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
