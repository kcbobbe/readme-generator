const inquirer = require("inquirer");
const fs = require('fs');
const axios = require("axios");

let username = "";
let picture = "";
let email = "";

// for the editor questions, the default editor will be launched. For my machine, it is Vim.
// press i to start typing, press esc key then :x enter to save your answer.

axios
  .get("https://api.github.com/users/kcbobbe")
  .then(function(res) {
    username = res.data.name;
    picture = res.data.avatar_url;
    email = res.data.email;
  });

inquirer.prompt([
  {
    type: "input",
    name: "title",
    message: "What is your project's title?"
  },
  {
    type: "input",
    name: "description",
    message: "Write a brief description of your application."
  },

  {
    type: "checkbox",
    message: "What languages did you use to build this application?",
    name: "stack",
    choices: [
      "HTML", 
      "CSS",
      "Python",
      "JavaScript"
    ]
  },
  {
    type: "editor",
    message: "What are the steps to install the application?",
    name: "installation",
  },
  {
    type: "editor",
    message: "Describe the usage of the application.",
    name: "usage",
  },
  {
    type: "editor",
    message: "Add credits",
    name: "credits",
  },
  {
    type: "editor",
    message: "Add contributors",
    name: "contributors",
  },
  {
    type: "editor",
    message: "Any questions?",
    name: "questions",
  },
  {
    type: "list",
    message: "Which license would you like to use?",
    default: "MIT",
    name: "license",
    choices: [
      "MIT", 
      "Apache 2.0",
      "GNU GPL v3.0"
    ]
  }
]).then(function(data) {
  console.log(data.title)
  console.log(data.stack)

  let licenseBadge = "";
  if (data.license === "MIT"){
    licenseBadge = `\r[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)`;
  } else if (data.license === "Apache 2.0"){
    licenseBadge = `\r[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)`
  } else if (data.license === "GNU GPL v3.0"){
    licenseBadge= `\r[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)`
  }

  var stackList = "";
  data.stack.forEach(stack => {
    stackList = stackList + 
    `\r* ${stack}
    `
    console.log(stackList)
  })
  
  let readmeText = 
`
# ${data.title}
${licenseBadge}
## By ${username} | ${email}
![Katie's Pic](${picture})

## Table Of Contents
1. Description
2. Technologies Used
3. Installation
4. Usage
5. Contributors
6. Questions
7. Credits

## Description
${data.description}
## Technologies Used
${stackList}
## Installation
${data.installation}
## Usage
${data.usage}
## Contributors
${data.contributors}
## Questions
${data.questions}
## Credits 
${data.credits}
`

    

  fs.writeFile("README.md", readmeText, (err) => {

    if (err) {
      return console.log(err);
    }

    console.log("Success!");

  });
});
