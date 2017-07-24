const { ipcRenderer, remote } = require('electron')

const SketchPane = require('../sketch-pane')
const StoryboarderSketchPane = require('./storyboarder-sketch-pane')

let el = document.getElementById('storyboarder-sketch-pane')
// el.style.width = '1600px'
// el.style.height = '900px'
let rect = el.getBoundingClientRect()
let elSize = [rect.width, rect.height].map(n => n * window.devicePixelRatio)

let storyboarderSketchPane = new StoryboarderSketchPane(
  el,
  elSize
)

// placeholder
storyboarderSketchPane.toolbar = {
  getIsQuickErasing: () => false,
  state: {
    transformMode: null
  },
  emit: () => console.log('emit', arguments)
}

const load = (event, filename, scriptData, locations, characters, boardSettings, currentPath) => {
  setTimeout(() => remote.getCurrentWindow().show(), 200)
}

ipcRenderer.on('load', load)
