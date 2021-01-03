<template>
  <div>
    <v-select
        label="Highlight"
        :items="items"
        item-text="label"
        item-value="name"
        v-model="selected"
        clearable
        hide-details
        filled
        style="z-index: 1; background: white;"
    >
    </v-select>

    <div style="position: absolute; bottom: 10px; left: 10px; z-index: 1" v-if="selected">
      <v-card rounded width="200">
        <v-card-title class="pb-0" style="text-align: center">
          {{ selectedItem.label }}
        </v-card-title>
        <div class="pa-2">
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
          description: ""
        },
        {
          label: "Cameras",
          name: "cameras",
          description: ""
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

    calculatePanelPosition() {
      let vector3 = new THREE.Vector3( -0.95, -0.95, 0.8).unproject(this.camera);
      vector3.x -= 0.2;
      vector3.y -= 0.27;
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

        this.panel = HighlightPanel.createHighlightPlane(this.calculatePanelPosition(), this.camera, this.scene, this.model, this.componentNames[this.selected][0]);
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
