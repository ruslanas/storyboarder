const SketchPane = require('../../src/js/sketch-pane')
const StoryboarderSketchPane = require('../../src/js/storyboarder-sketch-pane')

let wrapperEl = document.querySelector('.wrapper')

let rect = wrapperEl.getBoundingClientRect()
let size = [rect.width, rect.height].map(n => n * window.devicePixelRatio)
let storyboarderSketchPane = new StoryboarderSketchPane(wrapperEl, size)

const render = () => {
  storyboarderSketchPane.resize()
}
window.addEventListener('resize', render)
render()
