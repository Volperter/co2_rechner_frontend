<template>
  <v-form @submit.prevent="handleSubmit">
    <v-container>
      <v-row>
        <v-col cols="12" md="3">
          <v-sheet :max-height="600" :max-width="600" :min-width="300" :min-height="530" border>
            <v-text-field v-model="end"
                          clearable
                          variant="solo-filled"
                          :rules="[rules.required]"
                          type="text"
                          label="Startort"
            ></v-text-field>
            <v-text-field v-model="start"
                          clearable
                          variant="solo-filled"
                          :rules="[rules.required]"
                          type="text"
                          label="Zielort"
            ></v-text-field>
            <v-select v-model="transportType" @update:modelValue="resetVehicle"
                      label="Transportmethode"
                      variant="solo-filled"
                      :rules="[rules.required]"
                      :items="transport"
                      item-title="name"
                      item-value="value"
            ></v-select>
            <v-select v-model="transportVehicle" v-if="this.transportType == 'Car'" @update:modelValue="resetFuel"
                      clearable
                      label="Autotyp"
                      variant="solo-filled"
                      :items="cars"
                      item-title="name"
                      item-value="value"
            ></v-select>
            <v-text-field v-model="consumption" v-if="this.transportType == 'Car'"
                          clearable
                          variant="solo-filled"
                          type="number"
                          label="Literverbrauch"
                          suffix="L/100km"
            ></v-text-field>
            <v-select  v-model="fuel" v-if="this.transportType == 'Car'"
                      clearable
                       :disabled="selectDisable"
                      label="Treibstoff"
                      variant="solo-filled"
                      :items=getFuels
                      item-title="name"
                      item-value="value"
            ></v-select>
            <v-select  v-model="size" v-if="this.transportType == 'Car'"
                       clearable
                       label="Größe"
                       variant="solo-filled"
                       :items=getSizes
                       item-title="name"
                       item-value="value"
            ></v-select>
            <v-select v-model="transportVehicle" v-if="this.transportType == 'Train'" @update:modelValue="resetFuel"
                      label="Zugtyp"
                      variant="solo-filled"
                      :items="trains"
                      item-title="name"
                      item-value="value"
            ></v-select>
            <v-select  v-model="fuel" v-if="this.transportType == 'Train'"
                       clearable
                       :disabled="selectDisable"
                       label="Treibstoff"
                       variant="solo-filled"
                       :items=getFuels
                       item-title="name"
                       item-value="value"
            ></v-select>
            <v-select v-model="transportVehicle" v-if="this.transportType == 'Bus'" @update:modelValue="resetFuel"
                      label="Bustyp"
                      variant="solo-filled"
                      :items="busses"
                      item-title="name"
                      item-value="value"
            ></v-select>
            <v-select  v-model="fuel" v-if="this.transportVehicle == 'Bus_Public'"
                       clearable
                       :disabled="selectDisable"
                       label="Treibstoff"
                       variant="solo-filled"
                       :items=getFuels
                       item-title="name"
                       item-value="value"
            ></v-select>
            <v-btn type="submit"
                   :loading="loadingSubmit"
              >
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
                    start: {{start}} <br />
                    end: {{end}} <br />
                    transportType: {{transportType}} <br />
                    transportVehicle: {{transportVehicle}} <br />
                    fuel: {{fuel}} <br />
                    size: {{size}} <br />
                    consumption (L/100km): {{consumption}} <br />
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
import {watch} from "vue";

export default {
  name: "Input",

  data(){
    return{
      selectDisable: false,
      loadingSubmit: false,
      size:'',
      fuel:'',
      consumption: null,
      start:'',
      end:'',
      transportType:'',
      transportVehicle:'',
      showResult: false,
      co2: 0.0,
      transport:[{value:"Car", name:"Auto"}, {value:"Train",name:"Zug"}, {value:"Bike",name:"Fahrrad"}, {value:"Bus", name:"Bus"}],
      cars: [{value: "Pkw", name:"PKW"}],
      busses: [{value: "Bus_Public", name:"Bus"}, {value:"Bus_Tour", name:"Reisebus"}],
      trains: [{value: "Train", name:"Zug"}],
      sizes: [{value: 1, name: "Klein"}, {value: 2,name:"Mittel"},  {value: 3,name:"Gross"}],
      fuels: [ {value: "diesel",name:"Diesel", user:["Pkw", "Bus_Public", "Train"]}, {value: "petrol",name:"Benzin",user:["Pkw"]}, {value: "electric",name:"elektrisch",user:["Pkw","Train"]},
               {value: "phev_otto",name:"Benzin Plug-In Hybrid",user:["Pkw"]}, {value: "phev_diesel",name:"Diesel Plug-In Hybrid",user:["Pkw"]} , {value: "lpg",name:"Autogas",user:["Pkw"]},
               {value: "cng",name:"Erdgas",user:["Bus_Public"]}   ],
      rules: {
        required: value => !!value || 'Erforderlich',
      },
    }
  },
  methods:{
    handleSubmit(){
      if(this.start == "" || this.end == "" || this.transportType == "")
        return;
      this.loadingSubmit = true;
      this.getEmission();
    },
    clearRes(){
      this.showResult = false;
    },
    resetVehicle(){
      this.transportVehicle = "";
      this.resetFuel()
      this.resetSize()
    },
    resetFuel(){
      this.fuel = "";
    },
    resetSize(){
      this.size = "";
    },
    async getEmission() {

      const bodyData = {
        "startLocation": this.start,
        "endLocation": this.end,
        "transportMediumDTO": {
          "transportMediumName": this.transportVehicle,
          "transportMediumSize": this.size,
          "transportMediumFuel": this.fuel
        }
      };
      console.log("GET EMISSION: " + JSON.stringify(bodyData));
      await fetch('api/emission', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(bodyData)
      }).then(res => {
        return res.json();
      }).then((data) => {
        this.co2 = data;
        this.showResult = true;
        this.loadingSubmit = false;
      });
    },
    /*
    fetchTransport(){
      fetch('api/transport')
          .then(res => {
            return res.json();
          })
          .then((data) => {
            //TODO fuel values in array, size values in array (exlcude "DEFAULT"), transportMedium values in array

            console.log(data);
          })
    }
    */
  },
  /*
  mounted() {
    this.fetchTransport();
  },
  */
  computed: {
    getSizes(){
      if(this.fuel == "lpg")
        return [ {value: 2,name:"Mittel"}];
      if(this.fuel == "electric")
        return [{value: 1, name: "Klein"}, {value: 2,name:"Mittel"}];
      return this.sizes;
    },
    getFuels()
    {
      let tempFuels = [];
      for(let i = 0; i < this.fuels.length; i++){
        if(this.fuels[i].user.includes(this.transportVehicle))
          tempFuels.push({value: this.fuels[i].value, name: this.fuels[i].name});
      }
      if(tempFuels.length == 0)
          this.selectDisable = true;
      else
        this.selectDisable = false;
      return tempFuels;
    }
  },
  watch: {

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
