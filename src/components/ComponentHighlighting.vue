<template>
  <div>
    <v-row no-gutters>
      <v-col>
        <v-row>
          <v-col class="pt-0 pb-0" style="color: white; z-index: 1; font-size: 20px">
            Highlight components
          </v-col>
        </v-row>
        <v-btn-toggle color="primary" v-model="selected" style="display: unset">
          <v-row v-for="item in items" :key="item.id">
            <v-col class="pb-0">
              <v-btn elevation="-1" style="z-index: 1" :value="item.name">
                {{item.label}}
              </v-btn>
            </v-col>
          </v-row>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <div style="position: absolute; bottom: 10px; left: 10px; z-index: 1" v-if="selected">
      <v-card rounded width="200">
        <v-card-title class="pb-0" style="text-align: center">
          {{ selectedItem.label }}
        </v-card-title>
        <div class="pa-4">
          {{ selectedItem.description }}
        </div>
      </v-card>
    </div>
  </div>
</template>
<script>

import HighlightPanel from "@/utils/highlightPanel";
import * as THREE from "three";

export default {
  name: 'ComponentHighlighting',

  props: {
    model: {},
    camera: {},
    scene: {},
  },

  data() {
    return {
      componentNames: {
        "cameras": [
            "Earth_Observation_Camera_1",
            "Earth_Observation_Camera_2"
        ],
        "esail": [
            "esail"
        ],
        "reactionWheels": [
            "Reaction_Wheel_X",
            "Reaction_Wheel_Y",
            "Reaction_Wheel_Z"
        ],
        "startracker": [
            "StarTracker_Baffle",
            "StarTracker_Optics"
        ]
      },

      selected: undefined,

      items: [
        {
          label: "E-sail",
          name: "esail",
          description: "The electric solar wind sail is a novel method of propulsion within the Solar system using the flow of electrically charged particles emanating from the Sun, or the solar wind."
        },
        {
          label: "Cameras",
          name: "cameras",
          description: "CAM is the satellite's on-board camera. It is used during the mission to take images of the tether, the endmass, and the Earth."
        },
        {
          label: "Reaction wheels",
          name: "reactionWheels",
          description: "An attitude control system which uses rotating flywheels to rotate the satellite without the need for rockets."
        },
        {
          label: "StarTracker",
          name: "startracker",
          description: "A small camera which takes pictures of the sky and by looking at the position of starts it calculates the rotation of the satellite."
        }
      ],

      panel: undefined
    }
  },

  computed: {
    selectedItem() {
      if (!this.selected) {
        return "";
      }

      return this.items.filter(item => item.name === this.selected)[0];
    }
  },

  methods: {
    highlight() {
      this.model.highlightPart(this.scene, ...this.componentNames[this.selected]);
    },

    calculateLinePosition() {
      let vector3 = new THREE.Vector3( -1, -1, 0.8).unproject(this.camera);
      vector3.x += 0.2;
      vector3.y += 0.15;
      return vector3
    }
  },

  watch: {
    selected() {
      this.model.resetHighlight();
      if (this.selected) {
        this.highlight();

        if (this.panel) {
          this.panel.destroy();
          this.panel = undefined;
        }

        this.panel = HighlightPanel.createHighlightPlane(this.calculateLinePosition(), this.camera, this.scene, this.model, this.componentNames[this.selected][0]);
        this.$emit('panelUpdate', this.panel.updatePanel());

      } else {
        if (this.panel) {
          this.panel.destroy();
          this.panel = undefined;
          this.$emit('panelUpdate', undefined);
        }

        console.log("remove panel");
      }
    }
  }
}
</script>
<style>
.outlinedText {
  color: white;
  text-shadow:
      -1px -1px 0 #000,
      1px -1px 0 #000,
      -1px 1px 0 #000,
      1px 1px 0 #000;
}

.v-btn--active {
  background-color: #8a8a8a !important;
}
</style>
