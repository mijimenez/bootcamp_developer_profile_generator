# Developer Profile Generator

This is a command-line application that dynamically generates a PDF profile from a GitHub username.

## Demo of Application

![Demo](./assets/img/developer_profile_demo.gif)

## Instructions

Initialize with required npm packages using this command:

```sh
npm install
```

The application will be invoked with the following command:

```sh
node index.js
```

The user will be prompted for a favorite color, which will be used as the background color for cards.

The PDF will be populated with the following:

* Profile image
* User name
* Links to the following:
  * User location via Google Maps
  * User GitHub profile
  * User blog
* User bio
* Number of public repositories
* Number of followers
* Number of GitHub stars
* Number of users following

## User Story

```
AS A product manager

I WANT a developer profile generator

SO THAT I can easily prepare reports for stakeholders
```

## Business Context

When preparing a report for stakeholders, it is important to have up-to-date information about members of the development team. Rather than navigating to each team member's GitHub profile, a command-line application will allow for quick and easy generation of profiles in PDF format.

## Acceptance Criteria

```
GIVEN the developer has a GitHub profile

WHEN prompted for the developer's GitHub username and favorite color

THEN a PDF profile is generated
```

- - -
© 2019 [Madeline Jimenez](https://github.com/mijimenez)