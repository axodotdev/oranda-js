const { system, filesystem } = require('gluegun')
const src = filesystem.path(__dirname, '..')
const success = 'Generated your static files at public/'

const cli = async (cmd) =>
  system.run('node ' + filesystem.path(src, 'bin', 'oranda') + ` ${cmd}`)
const parentDir = process.cwd()

afterEach(() => {
  filesystem.remove('public')
  process.chdir(parentDir)
})

test('generates html', async () => {
  const output = await cli()

  expect(output).toContain(success)
  expect(filesystem.exists('public/index.html')).toBeTruthy()

  filesystem.remove('public')
})

test('generates css', async () => {
  const output = await cli()
  expect(output).toContain(success)

  expect(filesystem.exists('public/style.css')).toBeTruthy()

  filesystem.remove('public')
})

test('generates dark', async () => {
  process.chdir('./__tests__/test-readme/dark/')

  const output = await cli()

  expect(output).toContain(success)
  const html = filesystem.read('public/index.html')

  expect(html).toContain('<div class="body dark">')
})
test('generates light', async () => {
  process.chdir('./__tests__/test-readme/light/')

  const output = await cli()

  expect(output).toContain(success)
  const html = filesystem.read('public/index.html')

  expect(html).toContain('<div class="body light">')
})

test('reads config from package.json', async () => {
  process.chdir('./__tests__/test-readme/package-json')

  const output = await cli()

  expect(output).toContain(success.replace('public', 'testoutput'))
  const css = filesystem.read('testoutput/style.css')

  expect(css).toContain('font-size:18em')
  filesystem.remove('testoutput')
})

test('reads config from cargo', async () => {
  process.chdir('./__tests__/test-readme/cargo')

  const output = await cli()

  expect(output).toContain(success.replace('public', 'sup'))
  const html = filesystem.read('sup/index.html')

  expect(html).toContain('A CLI for the letsplayretro.games website')
  expect(html).toContain('class="body dark"')
  filesystem.remove('sup')
})

test('generates several files', async () => {
  process.chdir('./__tests__/test-readme/several-files')

  const output = await cli()

  expect(output).toContain(success)

  expect(filesystem.exists('public/index.html')).toBeTruthy()
  expect(filesystem.exists('public/one.html')).toBeTruthy()
})

test('spectrum test', async () => {
  process.chdir('./__tests__/test-readme/spectrum')

  const output = await cli()

  expect(output).toContain(success)
  const html = filesystem.read('public/index.html')

  expect(html).toContain('Simple, powerful online communities')

  expect(filesystem.exists('public/index.html')).toBeTruthy()
})

test('noHeader test', async () => {
  process.chdir('./__tests__/test-readme/noHeader')

  const output = await cli()

  expect(output).toContain(success)

  const html = filesystem.read('public/index.html')

  expect(html).not.toContain('<header')

  expect(filesystem.exists('public/index.html')).toBeTruthy()
})

test('logo test', async () => {
  process.chdir('./__tests__/test-readme/logo')

  const output = await cli()

  expect(output).toContain(success)

  expect(filesystem.exists('public/logo.png')).toBeTruthy()
})

test('Image test', async () => {
  process.chdir('./__tests__/test-readme/duplicate-images')

  const output = await cli()

  expect(output).toContain(success)

  expect(filesystem.exists('public/logo.png')).toBeTruthy()
})

test('Prefixes logo and additional file paths', async () => {
  process.chdir('./__tests__/test-readme/path-prefix')

  const output = await cli()

  expect(output).toContain(success)
  expect(filesystem.exists('public/index.html')).toBeTruthy()
  const html = filesystem.read('public/index.html')

  expect(html).toContain('href="/fiddly-rocks/one.html"')
  expect(html).toContain('src="/fiddly-rocks/logo.png"')
})

test('Adds meta tags', async () => {
  process.chdir('./__tests__/test-readme/meta-tags')

  const output = await cli()

  expect(output).toContain(success)
  expect(filesystem.exists('public/index.html')).toBeTruthy()
  const html = filesystem.read('public/index.html')

  expect(html).toContain(
    // prettier-ignore
    // eslint-disable-next-line no-useless-escape
    '<meta name=\"description\" content=\"Helmet application\" />'
  )

  // prettier-ignore
  // eslint-disable-next-line no-useless-escape
  expect(html).toContain('<meta property=\"robots\" content=\"robots.txt\" />')
})
