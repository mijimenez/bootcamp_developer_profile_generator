const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
// const cheerio = require("cheerio");
// const HTMLToPDF = require('convert-html-to-pdf');
 

// HELP: Practice converting html to pdf - error: "HTMLToPDF is not a constructor"
// const htmlToPDF = new HTMLToPDF(`
//   <div>Hello world</div>
// `);

// htmlToPDF.convert()
//   .then((buffer) => {
//     // do something with the PDF file buffer
//   })
//   .catch((err) => {
//     // do something on error
//   });




// Prompt user's GitHub username and store name, location, reops, etc., and then append these results to the html file
inquirer
  .prompt([
    {
    type: "input",
    message: "Enter your GitHub username:",
    name: "username"
    }, 
    {
    type: "input",
    message: "Enter a color for your profile:",
    name: "color"
    }
  ])
  .then(function({ username, color}) {
    const queryUrl = `https://api.github.com/users/${username}`;

    axios.get(queryUrl).then(function(res) {
    console.log(res.data);

      // Save specific user data
      const userPic = res.data.avatar_url;
      const userName = res.data.name;
      const userBio = res.data.bio;
      const userCompany = res.data.company;
      const userLocation = res.data.location;
      const userGitHub = res.data.html_url;
      const userBlog = res.data.blog;
      const userRepos = res.data.public_repos;
      const userFollowers = res.data.followers;
      const userFollowing = res.data.following;


      // Append interpolated body with GitHub user data content to html file using "Regex"
      fs.readFile('./template.html', 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        const toPrepand = `
        <main>
        <div class="hero" style="background-color: ${color}">
            <img id="profileImg" src="${userPic}">
            <h1>Hi!</h1>
            <h1>My name is <span id="userName">${userName}</span></h1>
            <h2>Currently @ <span id="companyName">${userCompany}</span></h2>
            <div class="info-links">
                <ul>
                    <li id="location"><a href="#" target="_blank" id="locationLink">${userLocation}</a></li>
                    <li id="gitHubProfile"><a href="${userGitHub}" target="_blank" id="gitHubProfileLink">GitHub</a></li>
                    <li id="blog"><a href="${userBlog}" target="_blank" id="blogLink">Blog</a></li>
                </ul>
            </div>
        </div>
        <div class="about">
            <h3 id="userBio">${userBio}</h3>
            <div class="stats">
                <div class="repos">
                    <h4>Public Repositories</h4>
                    <p id="reposNum">${userRepos}</p>
                </div>
                <div class="followers">
                    <h4>Followers</h4>
                    <p id="followersNum">${userFollowers}</p>
                </div>
                <div class="stars">
                    <h4>GitHub Stars</h4>
                    <p id="starsNum">##</p>
                </div>
                <div class="following">
                    <h4>Following</h4>
                    <p id="followingNum">${userFollowing}</p>
                </div>
            </div>
        </div>
        </main>
        `;
        data = data.replace(/\<\/body>/g, toPrepand + '</body>');
        // console.log(data);

        fs.writeFile("test.html", data,  function(err) {
          if (err) {
            throw err;
          }
          console.log(`Saved everything to html file!`);
        });

      });


    });
  });