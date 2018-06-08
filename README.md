# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 1

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a mobile-ready web application. In **Stage One**, you will take a static design that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. You will also add a service worker to begin the process of creating a seamless offline experience for your users.

### Specification

You have been provided the code for a restaurant reviews website. The code has a lot of issues. It’s barely usable on a desktop browser, much less a mobile device. It also doesn’t include any standard accessibility features, and it doesn’t work offline at all. Your job is to update the code to resolve these issues while still maintaining the included functionality. 

### Getting Started

1. In this folder, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer. 

In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

2. With your server running, visit the site: `http://localhost:8000`, and see the site with the updates for **Stage One**.


### Stage One Updates

## Responsive Design

* UI compatible with a range of display sizes: The initially provided code was not formated to work well on all device size. Using media queries and flexbox, I approached the project from a mobile first perspective to make sure that the homepage and detail pages worked on all size screens.

* Responsive Images: I created 1x and 2x versions of each photo and included these in the `src-set` attribute so that the user would see the best version of the photo that their device would support.

## Accessibility

* Skip Link: A skip link is included at the top of the header and is offscreen until a user presses the tab. When selected the user is brought down to the restaurant filters and does not have to tab through the map

* Accessibile Images: I added a new key value pair to each restaurant in `restaurants.json` to be used as the alt text for each of the images. Inside of `dbhelper.js` I created a new function that retreives and returns this text.

* Focus: There is a notication toast that will appear at the bottom right hand side of the screen when a new service worker is available. When this happens, we record the element that had focus in case that's needed later and apply the focus to the text within the toast. Focus is temporarily trapped to prevent the user from tabbing outside of the toast unless the click one of the buttons or press escape.

* ARIA: The maps on the homepage and detail page were given an ARIA role of application along with an ARIA label to describe what that section is. There is a service worker notication toast at the bottom of the page that has an attribute of aria-hidden to prevent it from being reached unless it becomes active.

## Offline Availablility

* Website Available Offline: When the page is visited a service worker is installed and the website content is cached for offline use.





