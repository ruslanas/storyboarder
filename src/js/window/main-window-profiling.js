const { ipcRenderer, remote } = require('electron')
const Color = require('color-js')

const SketchPane = require('../sketch-pane')
const StoryboarderSketchPane = require('./storyboarder-sketch-pane')

let el = document.getElementById('storyboarder-sketch-pane')
el.style.width = '1600px'
el.style.height = '900px'
let rect = el.getBoundingClientRect()
let elSize = [rect.width, rect.height].map(n => n * window.devicePixelRatio)

let storyboarderSketchPane = new StoryboarderSketchPane(
  el,
  elSize
)

// placeholder
storyboarderSketchPane.toolbar = {
  getIsQuickErasing: () => false,
  getBrushOptions: () => { return {} },
  setIsQuickErasing: () => { },
  state: {
    transformMode: null
  },
  emit: () => {}
}

storyboarderSketchPane.setBrushTool('light-pencil', {
  size: 7,
  spacing: 0.25,
  flow: 0.4,
  hardness: 0.5,
  opacity: 0.4,
  color: Color('#121212')
})

const load = (event, filename, scriptData, locations, characters, boardSettings, currentPath) => {
  remote.getCurrentWindow().show()
}

ipcRenderer.on('load', load)
