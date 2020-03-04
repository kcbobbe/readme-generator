const inquirer = require("inquirer");
const fs = require('fs');
const axios = require("axios");

let username = "";
let picture = "";
let email = "";

axios
  .get("https://api.github.com/users/kcbobbe")
  .then(function(res) {
    // console.log(res.data);
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
    type: "editor",
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
  }
]).then(function(data) {
  console.log(data.title)
  var readmeText = 
  `# ${data.title}
  ## By ${username} | ${email}
  ![Katie's Pic](${picture})
  ## Description

  ${data.description}

  ## Table Of Contents
  1.
  ## Installation
  ## Usage
  ## Credits `

    

  fs.writeFile("README.md", readmeText, (err) => {

    if (err) {
      return console.log(err);
    }

    console.log("Success!");

  });
});
