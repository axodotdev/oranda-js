const OsOptions = ['Windows', 'Mac', 'Linux']

const detectOS = /*js*/ `(() => {
  const navigator = window.navigator.userAgent
  let OSName = 'Unknown'
  if (navigator.includes('Windows')) OSName = 'Windows'
  if (navigator.includes('Mac')) OSName = 'Mac'
  if (navigator.includes('Linux') || navigator.includes("X11")) OSName = 'Linux'

  window.os = OSName

  document.getElementById(OSName.toLocaleLowerCase()).checked = "checked"
})()`

module.exports = { detectOS, OsOptions }
