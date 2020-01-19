const fs = require("fs");
const util = require("util");
const axios = require("axios");
const inquirer = require("inquirer");
const puppeteer = require("puppeteer");

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

// Prompt user's GitHub username and store name, location, reops, etc.,
function promptUser() {
return inquirer
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
  ]);
}

// Generate html markup using interpolated data and template literals
function createHTMLFile(inputData, gitHubData, gitHubStarsData) {
    // Save specific user data
    const userColor = inputData.color;
    const userPic = gitHubData.data.avatar_url;
    const userName = gitHubData.data.name;
    const userBio = gitHubData.data.bio;
    const userCompany = gitHubData.data.company;
    const userLocation = gitHubData.data.location;
    const userGitHub = gitHubData.data.html_url;
    const userBlog = gitHubData.data.blog;
    const userRepos = gitHubData.data.public_repos;
    const userFollowers = gitHubData.data.followers;
    const userFollowing = gitHubData.data.following;
    const userStars = gitHubStarsData.data.length;
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Developer Profile</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <style>
            * {
                box-sizing: border-box;
            }
            ul a {
              color: #ffffff;
              padding: .5em;
              border: thin solid #ffffff;
              border-radius: 10px;
              text-decoration: none!important;
            }
            body {
                background-color: #eeeeee;
            }
            .hero {
                z-index: -1;
                margin-top: 150px;
                background-color: ${userColor};
            }
            .hero img {
                width: 30%;
                margin: auto;
                border-radius: 50%;
                margin-bottom: 2em;
                margin-top: -106px!important;
                background: white;
            }
            .company {
              font-weight: bold;
            }
            .about{
                height: 1em;
                margin-top: -130px!important;
            }
            .info-links ul {
                list-style-type: none;
                margin-bottom: 150px!important;
            }
            .info-links ul li {
              color: ${userColor};
          }
            .stats div {
                width: 45%;
                margin-bottom: 2em;
                padding: 1em;
                background-color: ${userColor};
            }
            .stat {
                margin-bottom: 0;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <main class="text-center">
        <div class="hero card">
            <img id="profileImg" src="${userPic}" class="mx-auto my-5 shadow-lg">
            <h1 class="text-white">My name is <span id="userName">${userName}</span></h1>
            <h5 class="text-white">Currently @ <span id="companyName class="company">${userCompany}</span></h5>
            <div class="info-links mt-3">
                <ul class="p-0 d-flex justify-content-around w-50 mx-auto">
                    <li id="location"><a href="https://www.google.com/maps/place/${userLocation}" target="_blank" id="locationLink"><i style="font-size:24px" class="fa mr-1">&#xf124;</i>${userLocation}</a></li>
                    <li id="gitHubProfile"><a href="${userGitHub}" target="_blank" id="gitHubProfileLink"><i style="font-size:24px" class="fa mr-1">&#xf09b;</i>GitHub</a></li>
                    <li id="blog"><a href="${userBlog}" target="_blank" id="blogLink"><i style="font-size:24px" class="fa mr-1">&#xf0c6;</i>Blog</a></li>
                </ul>
            </div>
        </div>
        <div class="about my-5">
            <h3 id="userBio" class="mb-5 p-5 card shadow-lg bg-white mx-auto my-4 w-75">${userBio}</h3>
            <div class="stats d-flex justify-content-around flex-wrap text-white">
                <div class="repos card">
                    <h3>Public Repositories</h3>
                    <h5 id="reposNum" class="stat">${userRepos}</h5>
                </div>
                <div class="followers card">
                    <h3>Followers</h3>
                    <h5 id="followersNum" class="stat">${userFollowers}</h5>
                </div>
                <div class="stars card">
                    <h3>GitHub Stars</h3>
                    <h5 id="starsNum" class="stat">${userStars}</h5>
                </div>
                <div class="following card">
                    <h3>Following</h3>
                    <h5 id="followingNum" class="stat">${userFollowing}</h5>
                </div>
            </div>
        </div>
        </main>
    </body>
    </html>
    `;
};

// Function that creates 3 sec timeout to delay conversion to PDF so font-awesome library has time to load
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Once all data comes back from prompts and axios requests, write the html file with all gathered data and then convert into a PDF.
(async function() {
    try {
      const inputData = await promptUser();
      const userUserName = inputData.username;
      const gitHubData = await axios.get(
        `https://api.github.com/users/${userUserName}`
      );
      const gitHubStarsData = await axios.get(
        `https://api.github.com/users/${userUserName}/starred`
      );

      // Store template literal HTML
      const html = createHTMLFile(inputData, gitHubData, gitHubStarsData);
  
      // Write this html into an actual html file with a unique name from the username - this way the generated PDF will register libraries like fonts and icons properly!
      await writeFileAsync(`developer_profile_${userUserName}.html`, html);
      console.log(`Generated profile_${userUserName}.html`);
      console.log(`Please wait 3 seconds for PDF conversion...`);

      // Read generated HTML file and store data
      const generatedHTML = await readFileAsync(`developer_profile_${userUserName}.html`, "utf8");
  
      // Once puppeteer is up and running, convert actual HTML file into a pdf with the unique name from the username
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
  
      await page.setContent(generatedHTML);
      await page.emulateMediaFeatures("screen");

      await timeout(3000);

      await page.pdf({
        path: `developer_profile_${userUserName}.pdf`,
        format: "A4",
        printBackground: true
      });
  
      console.log(`Converted profile_${userUserName}.html to profile_${userUserName}.pdf`);
      await browser.close();
      process.exit();
    } catch (err) {
      console.log(err);
    }
  })();
  
