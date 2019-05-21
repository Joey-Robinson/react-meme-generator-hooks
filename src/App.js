import React, { useState, useEffect } from "react"
import { Meme } from "./meme"

const objectToQueryParam = obj => {
  const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`)
  return "?" + params.join("&")
}

const App = () => {
  const [templates, setTemplates] = useState([])
  const [template, setTemplate] = useState(null)
  const [topText, setTopText] = useState("")
  const [bottomText, setBottomText] = useState("")
  const [meme, setMeme] = useState(null)

  useEffect(() => {
    fetch(
      "https://cors-anywhere.herokuapp.com/https://api.imgflip.com/get_memes"
    )
      .then(x => x.json())
      .then(response => setTemplates(response.data.memes))
  }, [])

  if (meme) {
    return (
      <div style={{ textAlign: "center" }}>
        <a href={meme} target="_blank" rel="noopener norferrer">
          <img src={meme} alt="custom meme" />
        </a>
      </div>
    )
  }

  return (
    <div className="App">
      {template && (
        <form
          onSubmit={async event => {
            event.preventDefault()
            const params = {
              template_id: template.id,
              text0: topText,
              text1: bottomText,
              username: "allboutdamemes",
              password: "1234qwerpassword"
            }
            const response = await fetch(
              `https://cors-anywhere.herokuapp.com/https://api.imgflip.com/caption_image${objectToQueryParam(
                params
              )}`
            )
            const json = await response.json()
            setMeme(json.data.url)
          }}
        >
          <Meme template={template} />
          <input
            placeholder="Top Text"
            value={topText}
            onChange={event => setTopText(event.target.value)}
          />
          <input
            placeholder="Bottom Text"
            value={bottomText}
            onChange={event => setBottomText(event.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      )}
      {!template && (
        <>
          <h1>Pick A Template</h1>
          {templates.map(template => {
            return (
              <Meme
                template={template}
                onClick={() => {
                  setTemplate(template)
                }}
              />
            )
          })}
        </>
      )}
    </div>
  )
}

export default App
