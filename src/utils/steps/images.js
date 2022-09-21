const imageminJpegtran = require('imagemin-jpegtran')
const { default: imageminPngquant } = require('imagemin-pngquant')

const imageManipulation = ({ filesystem, distFolder, markdown }) => {
  // Get all images that are not from the internet ™️
  const images = (markdown.match(/(?:!\[(.*?)\]\((?!http)(.*?)\))/gim) || [])
    .filter((i) => !i.includes('https'))
    .map((image) => (image.split('./')[1] || '').split(')')[0])

  // Map through them and if that file exists minify it and copy it
  images.map(async (i) => {
    const imagemin = (await import('imagemin')).default
    if (filesystem.exists(`${process.cwd()}/${i}`)) {
      await imagemin([`${process.cwd()}/${i}`], {
        destination: `${distFolder}/${i.substring(0, i.lastIndexOf('/'))}/`,
        plugins: [
          imageminJpegtran(),
          imageminPngquant({ quality: [0.65, 0.8] }),
        ],
      })
    }
  })
}

module.exports = { imageManipulation }
