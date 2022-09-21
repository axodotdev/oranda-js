const MESSAGES = {
  deploy_error: 'There was an error publishing your site 😢',
  deploy_success: 'Website Published 🎉',
  deploy_needs_build: (dist) =>
    `Seems there is no ${dist} folder. Building it...`,

  lint_errors: 'We found some errors 😢',
  lint_success: 'All clear ✅',

  no_file_found:
    'No default file ("readme.md", "Readme.md", or "README.md") can be found. Please use the "file" option if using a differing filename.',
  additional_file_not_found: (file) =>
    `Cannot find file "${file}". Please ensure file exists.`,
  creation_error: 'Oh no, there has been an error making your file',
  file_generated: (dist) => `Generated your static files at ${dist}/`,
  ready_to_deploy: (dist) =>
    `🎉  You can deploy the ${dist} folder to a static server   🎉`,
  watching_files: 'Watching your files',
}

module.exports = { MESSAGES }
