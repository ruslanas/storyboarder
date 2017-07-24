const { ipcRenderer, remote } = require('electron')

const SketchPane = require('../sketch-pane')
const Brush = require('../sketch-pane/brush.js')

let containerSize = [1600, 900]

let el = document.getElementById('storyboarder-sketch-pane')
el.style.width = containerSize[0] + 'px'
el.style.height = containerSize[1] + 'px'
let canvasSize = containerSize.map(n => n * window.devicePixelRatio)

// brush pointer
let brushPointerContainer = document.createElement('div')
brushPointerContainer.className = 'brush-pointer'
brushPointerContainer.style.position = 'absolute'
brushPointerContainer.style.pointerEvents = 'none'
document.body.appendChild(brushPointerContainer)

// sketchpane
let sketchPane = new SketchPane()
sketchPane.setCanvasSize(...canvasSize)
let sketchPaneDOMElement = sketchPane.getDOMElement()

sketchPane.addLayer(0) // reference
sketchPane.fillLayer('#fff')
sketchPane.addLayer(1) // main
sketchPane.addLayer(2) // onion skin
sketchPane.addLayer(3) // notes
sketchPane.addLayer(4) // guides
sketchPane.addLayer(5) // composite
sketchPane.selectLayer(1)

let brush = new Brush()
brush.setSize(20)
brush.setColor('#000')
brush.setSpacing(0.02)
brush.setFlow(1)
brush.setHardness(0.7)
sketchPane.setTool(brush)

sketchPane.setToolStabilizeLevel(10)
sketchPane.setToolStabilizeWeight(0.2)

// container
let containerEl = document.createElement('div')
containerEl.classList.add('container')

// add SketchPane to container
containerEl.appendChild(sketchPaneDOMElement)

// add container to element
el.appendChild(containerEl)


// update the cursor
let image = null
let threshold = 0xff
let brushPointer = sketchPane.createBrushPointer(image, brush.getSize(), brush.getAngle(), threshold, true)
brushPointer.style.setProperty('margin-left', '-' + (brushPointer.width * 0.5) + 'px')
brushPointer.style.setProperty('margin-top', '-' + (brushPointer.height * 0.5) + 'px')
brushPointerContainer.innerHTML = ''
brushPointerContainer.appendChild(brushPointer)




// event listeners
let canvasPointerUp = (e) => {
    let pointerPosition = getRelativePosition(e.clientX, e.clientY)
    sketchPane.up(pointerPosition.x, pointerPosition.y, e.pointerType === "pen" ? e.pressure : 1)
    // if (e.shiftKey == true) {
    //   sketchPane.setPaintingKnockout(false)
    // }
    document.removeEventListener('pointermove', canvasPointerMove)
    document.removeEventListener('pointerup', canvasPointerUp)
}
let canvasPointerDown = (e) => {
  var pointerPosition = getRelativePosition(e.clientX, e.clientY)
  // if (e.shiftKey == true) {
  //   sketchPane.setPaintingKnockout(true)
  // }
  sketchPane.down(pointerPosition.x, pointerPosition.y, e.pointerType === "pen" ? e.pressure : 1)
  document.addEventListener('pointermove', canvasPointerMove)
  document.addEventListener('pointerup', canvasPointerUp)
}
let canvasPointerMove = (e) => {
  let pointerPosition = getRelativePosition(e.clientX, e.clientY)
  sketchPane.move(pointerPosition.x, pointerPosition.y, e.pointerType === "pen" ? e.pressure : 1)
}
let containerCursorMove = (e) => {
  let x = e.clientX + window.pageXOffset
  let y = e.clientY + window.pageYOffset
  brushPointerContainer.style.setProperty('left', x + 'px')
  brushPointerContainer.style.setProperty('top', y + 'px')
}
let canvasPointerOver = (e) => { }
let canvasPointerOut = (e) => { }

let sketchPaneDOMElementRect
let onResize = (e) => {
  // throws "[Violation] Forced reflow while executing JavaScript took 34ms"
  sketchPaneDOMElementRect = sketchPaneDOMElement.getBoundingClientRect()
}
function getRelativePosition(absoluteX, absoluteY) {
  let left = sketchPaneDOMElementRect.left
  let top = sketchPaneDOMElementRect.top
  return { x: absoluteX - left, y: absoluteY - top }
}

containerEl.addEventListener('pointerdown', canvasPointerDown)
// this.sketchPaneDOMElement.addEventListener('pointerover', this.canvasPointerOver)
// this.sketchPaneDOMElement.addEventListener('pointerout', this.canvasPointerOut)
sketchPaneDOMElement.addEventListener('pointermove', containerCursorMove)
window.addEventListener('resize', onResize)
onResize()

const load = (event, filename, scriptData, locations, characters, boardSettings, currentPath) => {
  remote.getCurrentWindow().show()
}

ipcRenderer.on('load', load)