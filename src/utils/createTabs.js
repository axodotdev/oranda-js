const createTabs = ({ options }) => {
  if (!options.downloads) return
  return /*html*/ `
    <h2 class="text-center">Download for your platform</h2>
    <div class="tabs">
      ${Object.keys(options.downloads)
        .map((option) => {
          const currentOption = options.downloads[option.toLowerCase()]
          return /*html*/ `<input type="radio" name="tabs" id="${option.toLocaleLowerCase()}">
            <label for="${option.toLocaleLowerCase()}">${option}</label>
            ${
              currentOption.link
                ? `<div class="tab">
            v${options.version}
            ${
              currentOption.changelog
                ? ` - <a href=${currentOption.changelog} target="_blank">Changelog</a>`
                : ''
            } - <a href="${currentOption.link}">Download for ${option}</a>
                  ${
                    currentOption.description
                      ? ` <p class="description">${currentOption.description}</p>`
                      : ''
                  }
            </div>`
                : `<div class="tab">${currentOption.text}</div>`
            }`
        })
        .join('')}
    </div>`
}

module.exports = { createTabs }
