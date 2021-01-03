<template>
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
          name: "esail"
        },
        {
          label: "Cameras",
          name: "cameras"
        },
        {
          label: "Reaction wheels",
          name: "reactionWheels"
        },
        {
          label: "StarTracker",
          name: "startracker"
        }
      ],

      panel: undefined
    }
  },

  methods: {
    highlight() {
      this.model.highlightPart(this.scene, ...this.componentNames[this.selected]);
    },

    calculatePanelPosition() {
      let vector3 = new THREE.Vector3( 1, 1, 0.8).unproject(this.camera);
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
