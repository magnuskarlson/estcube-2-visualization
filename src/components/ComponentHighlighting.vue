<template>
  <v-row style="position: absolute; top: 0; right: 0; flex-grow: 0; z-index: 1" class="mr-0">
    <v-col>
      <v-card class="highlight">
        <v-select
            label="Highlight"
            multiple
            :items="items"
            item-text="label"
            item-value="name"
            v-model="selected"
            clearable
            hide-details
            style="z-index: 1; background: white;max-width: 200px"
            class="pt-4 pa-2 pb-0"
        >
        </v-select>
      </v-card>
    </v-col>
  </v-row>
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
