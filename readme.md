![Polly website logo](/assignments/opd-3/polly.png)

# Polly

Create polls, share polls, join and vote!

[**Go to the website >**](https://polly-y.herokuapp.com/)

## Content

* [Dependencies](#dependencies)
* [Installation](#installation)
* [Functionalities](#functionalities)
* [Wireflow](#wireflow)
* [Testing](#testing)
* [Miscellaneous](#miscellaneous)

## Dependencies

* Express
* Express-handlebars

For other dependencies see [**`package.json`**](package.json)

## Installation

1. Clone the repository and navigate to the directory.

2. **Install dependencies:**

	```bash
	npm install
	```

### Run application

```bash
# To run the server
npm run start

# To run the development environment
npm run dev
```

## Functionalities

The main functionalities of Polly consists of:

1. **Creating a poll** with the option to add up to 5 questions, and for each question up to 5 answers. The creator can choose the order of the questions being asked. Each question has a set time for users to vote.
2. **Joining a poll and vote**. The creator of the poll can control when the result will be shown.
3. **Joining a group with polls only for members**. Polls created by the creator of the group are only accessible to members, and members will immediately be notified when a new poll has been started.

## Wireflow

![Wireflow of the website showing the first five screens with descriptions below each screen.](assignments/opd-3/wireflow/polly-wireflow-1.jpg)

![Wireflow of the website showing the last five screens with descriptions below each screen.](assignments/opd-3/wireflow/polly-wireflow-2.jpg)

This wireflow shows the *Creator*-flow (or admin-flow) of the website.

## Testing

List of devices and browsers used for testing:

* [Browsers](#browsers)
	* [Firefox 86.0.1](#firefox)
	* [Brave 1.22.67 (Chromium 89)](#brave)
* [Mobile](#mobile)
	* [iOS Safari 9 (iPod Touch)](#ios-safari-9)
	* [Mobile Firefox (LG)](#mobile-firefox)

## Miscellaneous

The results of the assingments about *Progressive Enhancement* and feature testing is located in the [**assignments**](/assignments) folder.

### License

[**MIT**](LICENSE)
