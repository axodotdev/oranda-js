const axios = require('axios')

const getRemoteStyles = async () => {
  const { data: normalize } = await axios.get(
    'https://unpkg.com/normalize.css@8.0.1/normalize.css'
  )
  const { data: inter } = await axios.get(
    'https://fonts.googleapis.com/css?family=Inter'
  )
  const { data: comfortaa } = await axios.get(
    'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;700'
  )

  return normalize.concat(inter).concat(comfortaa)
}

module.exports = getRemoteStyles
