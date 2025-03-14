import chroma from 'chroma-js'
import { useMediaQuery } from '@mui/material'
import { useAppSelector, useAppDispatch } from '../../hooks/store'
import { setLoading } from '../../store/wheel'

import styled from 'styled-components'

const Header = styled.h1`
  color: white;
  font-size: 2em;
  text-align: center;
  animation: fade-in-out 2s ease infinite;

  @keyframes fade-in-out {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`
const getContrastRatio = (color1, color2) => chroma.contrast(color1, color2)

const determineTextColor = hexCode => {
  const color = chroma(hexCode)
  const contrastWithWhite = getContrastRatio(color, 'white')
  const contrastWithBlack = getContrastRatio(color, 'black')

  return contrastWithWhite > contrastWithBlack ? 'white' : 'black'
}

// var FirstTimeRender = null

import React from 'react'

var previousIndex = -1
var varWheelClicked = false
var firstTime = true
var canvasContext = null
var winningSegment
var winningSegmentIndex
var segColors
var segments
var spinning = false

var WheelComponent = function WheelComponent(_ref) {
  var onFinished = _ref.onFinished,
    _ref$primaryColor = _ref.primaryColor,
    primaryColor = _ref$primaryColor === void 0 ? 'black' : _ref$primaryColor,
    _ref$contrastColor = _ref.contrastColor,
    contrastColor = _ref$contrastColor === void 0 ? 'white' : _ref$contrastColor,
    _ref$buttonText = _ref.buttonText,
    buttonText = _ref$buttonText === void 0 ? 'Spin' : _ref$buttonText,
    _ref$isOnlyOnce = _ref.isOnlyOnce,
    isOnlyOnce = _ref$isOnlyOnce === void 0 ? true : _ref$isOnlyOnce,
    _ref$upDuration = _ref.upDuration,
    upDuration = _ref$upDuration === void 0 ? 100 : _ref$upDuration,
    _ref$downDuration = _ref.downDuration,
    downDuration = _ref$downDuration === void 0 ? 1000 : _ref$downDuration,
    _ref$fontFamily = _ref.fontFamily,
    fontFamily = _ref$fontFamily === void 0 ? 'proxima-nova' : _ref$fontFamily
  var currentSegment: any = ''
  var isStarted = false

  const dispatch = useAppDispatch()

  const { names, colors } = useAppSelector(state => state.wheel)

  const getSegments = () => {
    const namesArray = names.split('\n')
    const filteredNames = namesArray.filter(name => name !== '')
    const uniqueNames = Array.from(new Set(filteredNames))
    return uniqueNames
  }

  winningSegment = _ref.winningSegment
  winningSegmentIndex = getSegments().findIndex(seg => seg === winningSegment)

  // function generateColorArray(inputArray: string[], outputLength: number) {
  //   const inputLength = inputArray.length
  //   const outputArray = []

  //   for (let i = 0; i < outputLength; i++) {
  //     // Calculate the color index based on the iteration and reset when reaching the end of inputArray
  //     const colorIndex = i % inputLength
  //     outputArray.push(inputArray[colorIndex])
  //   }

  //   return outputArray
  // }

  function getRandomElement(array) {
    let currentIndex

    // Generate a random index different from the previous one
    do {
      currentIndex = Math.floor(Math.random() * 3)
    } while (currentIndex === previousIndex)

    // Update the previous index for the next call
    previousIndex = currentIndex

    // Return the element at the randomly generated index
    return array[currentIndex]
  }

  function generateColorArray(arr: string[], length: number) {
    if (arr.length === 0 || length <= 0) {
      return []
    }

    const result = []
    let currentIndex = 0

    for (let i = 0; i < length; i++) {
      result.push(arr[currentIndex])
      currentIndex =
        i % 2 === 0 ? (currentIndex + 1) % arr.length : (arr.length - currentIndex - 1) % arr.length
    }

    return result
  }

  segColors = generateColorArray(colors, getSegments().length)
  segments = getSegments()

  var _useState = React.useState(false),
    isFinished = _useState[0],
    setFinished = _useState[1]

  var win = false
  var lengthConstant = 15 // increasing this will slow down the wheel
  var slowDownProgress = 0.9431 // speed before reaching winningDiff speed, increas to slow down
  var winningDiff = segments.length >= 70 ? 4 : segments.length >= 50 ? 3 : 2 // number of sections before the winnig section
  var winningProgress = 0.9781 // winningDiff speed, increas to slow down
  var timerHandle = 0
  var timerDelay = lengthConstant

  // var timerDelay = speedConstant
  var angleCurrent = 0
  var angleDelta = 0

  var maxSpeed = Math.PI / lengthConstant //(30 >= 20 ? 40 : 50)
  var upTime = lengthConstant * upDuration //
  var downTime = lengthConstant * downDuration //* 1.4

  var spinStart = 0
  var frames = 0

  // const viewport = useViewport()
  const [wheelClicked, setWheelClicked] = React.useState(varWheelClicked)
  const [firstLoad, setFirstLoad] = React.useState(true)
  const isMobileWidth = useMediaQuery('(max-height: 700px)')
  const isMobileHeight = useMediaQuery('(max-width: 700px)')
  const isLargeScreenWidth = useMediaQuery('(min-width: 1001px)')
  const isLargeScreenHeight = useMediaQuery('(min-height: 1150px)')

  const isLargeScreen = isLargeScreenWidth && isLargeScreenHeight
  const isMobile = isMobileWidth || isMobileHeight

  var centerX = isMobile ? 200 : isLargeScreen ? 500 : 430
  var centerY = isMobile ? 200 : isLargeScreen ? 500 : 430

  const size = isMobile ? 190 : isLargeScreen ? 500 : 410

  const handleKeyDown = event => {
    if (event.altKey && event.key === 'Enter') {
      setWheelClicked(true)
      varWheelClicked = true
      spin()
    }
  }

  React.useEffect(function () {
    setTimeout(function () {
      window.scrollTo(0, 1)
    }, 0)
    const onKeyDown = event => handleKeyDown(event)

    // Adding event listener to the window
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  React.useEffect(
    function () {
      if (!firstLoad && names.trim() !== '') {
        wheelDraw()
      } else if (!firstLoad && names.trim() === '') {
        setFirstLoad(true)
      } else {
        wheelInit()
        setFirstLoad(false)
      }
    },
    [names, colors]
  )

  var wheelInit = function wheelInit() {
    initCanvas()
    wheelDraw()
  }

  var initCanvas = function initCanvas() {
    var canvas = document.getElementById('canvas')
    if (navigator.userAgent.indexOf('MSIE') !== -1) {
      canvas = document.createElement('canvas')
      // canvas.setAttribute('width', 500)
      // canvas.setAttribute('height', 500)
      canvas.setAttribute('id', 'canvas')

      document.getElementById('wheel').appendChild(canvas)
    }
    if (canvas) {
      canvas.addEventListener('click', spin, false)
      canvasContext = (canvas as any).getContext('2d')
      // Clear the canvas
      canvasContext.clearRect(0, 0, (canvas as any).width, (canvas as any).height)
    }
  }

  var spin = function spin() {
    setWheelClicked(true)
    varWheelClicked = true
    if (spinning) return
    spinning = true
    firstTime = true
    win = false
    dispatch(setLoading(true))
    if (timerHandle === 0) {
      spinStart = new Date().getTime()
      maxSpeed = Math.PI / lengthConstant // 15
      frames = 0
      timerHandle = setInterval(onTimerTick, timerDelay)
    }
  }

  var onTimerTick = function onTimerTick() {
    frames++;
    draw();
    var duration = new Date().getTime() - spinStart;
    var progress = 0;
    var finished = false;
  
    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      progress = duration / downTime;
      if (winningSegment) {
        const slowCheck = progress >= slowDownProgress;
  
        if (
          slowCheck &&
          currentSegment - winningSegmentIndex > -0.1 &&
          currentSegment - winningSegmentIndex <= winningDiff
        ) {
          progress = winningProgress;
          win = true;
        } else if (slowCheck) {
          progress = slowDownProgress;
        }
      }
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2); // 1.6
  
      if (
        winningSegment
          ? segments[currentSegment] === winningSegment && frames > lengthConstant && win
          : progress >= 1
      )
        finished = true;
    }
  
    if (finished && firstTime) {
      firstTime = false;
      setFinished(true);
  
      // Randomize the landing position within the rigged section
      const randomOffset = Math.random() * (Math.PI / 6) - Math.PI / 12; // Random offset between -PI/12 and PI/12
      angleCurrent += randomOffset;
  
      const array = segments.length >= 30 ? [10, 90, 180] : [10, 200, 400];
      const delay = getRandomElement(array);
      console.log('delay', delay);
  
      setTimeout(() => {
        onFinished(segments[currentSegment], segColors[currentSegment]);
        clearInterval(timerHandle);
        timerHandle = 0;
        angleDelta = 0;
        spinning = false;
      }, delay);
    }
  
    // Normal wheel spin logic
    if (finished && !firstTime) {
      clearInterval(timerHandle);
      timerHandle = 0;
    } else {
      angleCurrent += angleDelta;
      while (angleCurrent >= Math.PI * 2) {
        angleCurrent -= Math.PI * 2;
      }
    }
  }
  

  var wheelDraw = function wheelDraw() {
    clear()
    drawWheel()
    drawNeedle()
  }

  var draw = function draw() {
    clear()
    drawWheel()
    drawNeedle()
  }

  var drawSegment = function drawSegment(key, lastAngle, angle) {
    var ctx = canvasContext
    var value = segments[key]
    var textColor = determineTextColor(segColors[key])
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, size, lastAngle, angle, false)
    ctx.lineTo(centerX, centerY)
    ctx.closePath()
    ctx.fillStyle = segColors[key]
    ctx.fill()
    ctx.stroke()
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((lastAngle + angle) / 2)
    ctx.fillStyle = textColor
    ctx.font =
      `${
        isMobile && segments.length >= 50
          ? 10
          : isMobile || segments.length >= 15
            ? !isLargeScreen && segments.length >= 70
              ? 12
              : segments.length >= 35
                ? 18
                : 24
            : 40
      }px ` + fontFamily
    ctx.textAlign = 'end'
    ctx.fillText(
      value.substr(0, isMobile ? 10 : isLargeScreen ? 35 : 17),
      size / 2 + (isMobile ? 90 : isLargeScreen ? 240 : 190),
      isMobile ? (segments.length >= 50 ? 0 : 5) : segments.length >= 50 ? 0 : 10
    )
    ctx.restore()
  }

  var drawWheel = function drawWheel() {
    var ctx = canvasContext
    var lastAngle = angleCurrent
    var len = segments.length
    var PI2 = Math.PI * 2
    ctx.lineWidth = 1
    ctx.strokeStyle = primaryColor
    // ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.font = '1em ' + fontFamily

    for (var i = 1; i <= len; i++) {
      var angle = PI2 * (i / len) + angleCurrent
      drawSegment(i - 1, lastAngle, angle)
      lastAngle = angle
    }

    ctx.beginPath()
    ctx.arc(centerX, centerY, isMobile ? 30 : 70, 0, PI2, false)
    ctx.fillStyle = '#fff' // Set your desired fill color
    ctx.fill()
    ctx.closePath()
    ctx.fillStyle = primaryColor
    ctx.lineWidth = 10
    ctx.strokeStyle = contrastColor
    ctx.fill()
    ctx.fillStyle = contrastColor
    ctx.textAlign = 'center'
    ctx.fillText(buttonText, centerX, centerY + 3)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(centerX, centerY, size, 0, PI2, false)
    ctx.closePath()
    ctx.lineWidth = 10
    ctx.strokeStyle = primaryColor
    ctx.stroke()
  }

  var drawNeedle = function drawNeedle() {
    var ctx = canvasContext
    ctx.lineWidth = 1
    ctx.strokeStyle = contrastColor
    ctx.fileStyle = contrastColor
    ctx.beginPath()
    // ctx.fillStyle = '#BBBBBB'
    // ctx.shadowColor = '#BBBBBB'
    // ctx.shadowBlur = 10 // Adjust the shadow blur as needed
    // var offsetX = 20 // Adjust this value to move the shape to the right or left
    // var offsetY = isMobile ? 200 : 350 // Adjust this value to move the shape up or down
    // ctx.moveTo(centerX + offsetX, centerY - offsetY)
    // ctx.lineTo(centerX - offsetX, centerY - offsetY)
    // ctx.lineTo(centerX, centerY - (offsetY - 30)) // Adjust this value to control the height of the shape
    ctx.closePath()
    ctx.fill()
    ctx.restore()
    var change = angleCurrent + Math.PI / 2
    var i = segments.length - Math.floor((change / (Math.PI * 2)) * segments.length) - 1
    if (i < 0) i = i + segments.length
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = primaryColor
    ctx.font = 'bold 1.5em ' + fontFamily
    currentSegment = i
    isStarted && ctx.fillText(segments[currentSegment], centerX + 10, centerY + size + 50)
  }

  var clear = function clear() {
    var canvas = document.getElementById('canvas')
    var ctx = canvasContext
    ctx.clearRect(0, 0, (canvas as any).width, (canvas as any).height)
  }

  if (names.trim() === '') return <Header>Enter some names to get started</Header>
  else
    return (
      <>
        <div
          id='wheel'
          style={{
            width: isMobile ? '400px' : isLargeScreen ? '1000px' : '860px',
            height: isMobile ? '400px' : isLargeScreen ? '1000px' : '860px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            transform: 'rotate(90deg)',
            position: 'relative',
            marginTop: '50px'
          }}
        >
          <canvas
            id='canvas'
            width={isMobile ? '400px' : isLargeScreen ? '1000px' : '860px'}
            height={isMobile ? '400px' : isLargeScreen ? '1000px' : '860px'}
            style={{
              pointerEvents: isFinished && isOnlyOnce ? 'none' : 'auto',
              textAlign: 'center',
              animation: wheelClicked ? '' : 'rotateAnimation 15s linear infinite'
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: isLargeScreen ? '-10px' : '0px',
              left: 'calc(50% - 25px)',
              transform: 'rotate(90deg)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                background: '#BBBBBB',
                width: '50px', // Set the width of the arrow
                height: '40px', // Set the height of the arrow
                clipPath: 'polygon(0% 0%, 70% 50%, 0% 100%)', // Use clipPath to create an arrow shape
                boxShadow: '20px 20px 20px #BBBBBB' // Increase box shadow with color #BBBBBB
              }}
            ></div>
          </div>

          {/* SVG Text */}
          {!wheelClicked && (
            <>
              <svg
                viewBox='0 0 500 500'
                style={{
                  position: 'absolute',
                  top: 5,
                  left: 20,
                  transform: 'rotate(-70deg)'
                }}
                onClick={() => {
                  spin()
                }}
              >
                <path
                  id='curve'
                  d='M73.2,148.6c4-6.1,65.5-96.8,178.6-95.6c111.3,1.2,170.8,90.3,175.1,97'
                  fill='transparent' // Set the fill to transparent
                />
                <text width='500'>
                  <textPath
                    xlinkHref='#curve'
                    style={{
                      fontSize: '40px',
                      fontWeight: 700,
                      textShadow: '4px 4px 6px rgba(0, 0, 0)'
                    }}
                    fill='#fff'
                  >
                    Click to Spin
                  </textPath>
                </text>
              </svg>

              {/* <svg
                viewBox='0 0 500 500'
                style={{
                  position: 'absolute',
                  top: isMobile ? 30 : isLargeScreen ? 100 : 50,
                  left: isLargeScreen ? 200 : 100,
                  transform: 'rotate(-110deg)',
                  paddingTop: isMobile ? 170 : 400,
                  paddingLeft: isMobile ? 35 : 120
                }}
                onClick={() => {
                  setWheelClicked(true)
                  varWheelClicked = true
                  spin()
                }}
              >
                <path
                  id='curve2'
                  d='M88,198c4,60,98,150,212,150c121,0,181-90,185-150'
                  fill='transparent' // Set the fill to transparent
                />
                <text width='500'>
                  <textPath
                    xlinkHref='#curve2'
                    style={{
                      fontSize: '40px',
                      fontWeight: 700,
                      textShadow: '4px 4px 6px rgba(0, 0, 0)'
                    }}
                    fill='#fff'
                  >
                    or press Ctl + Enter
                  </textPath>
                </text>
              </svg> */}
            </>
          )}
        </div>
      </>
    )
}

export default WheelComponent
//# sourceMappingURL=index.js.map
