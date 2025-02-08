import { useState, useRef } from "react"
import axios from "axios"
import { Camera } from "lucide-react"
import "./CameraPage.css"
import WasteInstructions from "../components/WasteInstructions"

const CameraPage = () => {
  const videoRef = useRef(null)
  const [results, setResults] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
      setCameraActive(true)
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const stopCamera = () => {
    const stream = videoRef.current.srcObject
    if (stream) {
      const tracks = stream.getTracks()
      tracks.forEach((track) => {
        track.stop()
      })
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }

  const captureImage = async () => {
    const video = videoRef.current
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext("2d").drawImage(video, 0, 0)

    canvas.toBlob(async (blob) => {
      const formData = new FormData()
      formData.append("image", blob, "capture.jpg")

      try {
        const response = await axios.post("http://localhost:8000/api/classify/", formData)
        setResults(response.data)
      } catch (error) {
        console.error("Error:", error)
      }
    }, "image/jpeg")
  }

  return (
    <div className="camera-page">
      <div className="camera-controls">
        <button className="modern-button start-button" onClick={startCamera} disabled={cameraActive}>
          Start Camera
        </button>
        <button className="modern-button stop-button" onClick={stopCamera} disabled={!cameraActive}>
          Stop Camera
        </button>
      </div>
      <div className="content-wrapper">
        <div className="camera-container">
          <video ref={videoRef} autoPlay playsInline muted />
          {cameraActive && (
            <button className="capture-button" onClick={captureImage} aria-label="Capture and classify image">
              <Camera />
            </button>
          )}
        </div>
        {results && (
          <div className="results-containers">
            <h3>Classification Results</h3>
            <ul>
              {results.predictions?.map((prediction, index) => (
                <li key={index}>
                  <span>{prediction.class}</span>
                  <span>{Math.round(prediction.confidence * 100)}%</span>
                </li>
              ))}
            </ul>
            {results?.instructions && <WasteInstructions instructions={results.instructions} />}
          </div>
        )}
      </div>
    </div>
  )
}

export default CameraPage

