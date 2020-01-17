const fs = require("fs");
const util = require("util");
const axios = require("axios");
const inquirer = require("inquirer");
const puppeteer = require("puppeteer");

const writeFileAsync = util.promisify(fs.writeFile);

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
    const userStars = gitHubStarsData.data.following;
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Developer Profile</title>
        </head>
        <body>
            <main>
            <div class="hero" style="background-color: ${userColor}">
                <img id="profileImg" src="${userPic}">
                <h1>Hi!</h1>
                <h1>My name is <span id="userName">${userName}</span></h1>
                <h2>Currently @ <span id="companyName">${userCompany}</span></h2>
                <div class="info-links">
                    <ul>
                        <li id="location"><a href="https://www.google.com/maps/place/${userLocation}" target="_blank" id="locationLink">${userLocation}</a></li>
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
                        <p id="starsNum">${userStars}</p>
                    </div>
                    <div class="following">
                        <h4>Following</h4>
                        <p id="followingNum">${userFollowing}</p>
                    </div>
                </div>
            </div>
            </main>
        </body>
        </html>
    `;
};

// Once all data comes back from prompts and axios requests, write the html file with all gathered data and then convert into a PDF.
(async function() {
    try {
      const inputData = await promptUser();
      const userUserName = inputData.username;
      const gitHubData = await axios.get(
        `https://api.github.com/users/${userUserName}`
      );
    //   console.log(gitHubData.data);
      const gitHubStarsData = await axios.get(
        `https://api.github.com/users/${userUserName}/starred`
      );
    //   console.log(gitHubStarsData.data);
      const html = createHTMLFile(inputData, gitHubData, gitHubStarsData);
  
      // Write the html into a html file with a unique name from the username
  
      await writeFileAsync(`developer_profile_${userUserName}.html`, html);
      console.log(`Generated profile_${userUserName}.html`);
  
      // Convert the html file into a pdf with a unique name from the username
  
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
  
      await page.setContent(html);
      await page.emulateMediaFeatures("screen");
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
  
