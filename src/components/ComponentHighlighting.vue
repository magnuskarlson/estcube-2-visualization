<template>
  <v-select
      label="Highlight"
      multiple
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

      selected: [],

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
      this.model.highlightPart(...this.selected.flatMap(name => this.componentNames[name]));
    }
  },

  watch: {
    selected() {
      this.model.resetHighlight();
      if (this.selected.length) {
        this.highlight();

        if (!this.panel) {
          this.panel = HighlightPanel.createHighlightPlane(new THREE.Vector3(-1, 0, 0), this.camera, this.scene);
        }
      } else {
        if (this.panel) {
          this.scene.remove(this.panel);
          this.panel.geometry.dispose();
          this.panel.material.dispose();
          this.panel = undefined;
        }

        console.log("remove panel");
      }
    }
  }
}
</script>
