# Street View Manager

See the live application at https://streetviewmanager.com

There are numerous problems with Google's current Street View client offering from a management perspective:

* There is only one official client that allows personal Street View photo management and it is a mobile-only app
* Some basic functionality is simply easier with a PC than a mobile device (e.g. modifying lat/long coordinates for a photo)
* Basic functionality is missing from the official app (e.g. modifying lat/long coordinates for a photo)

This project aims to overcome these issues by providing a browser-based application that supports all functionality offered by [the Street View Publish API](https://developers.google.com/streetview/publish/reference/rest).

# Usage

## Development

This is a React application built on top of `create-react-app`. As such, you generally will run `yarn start` to test local changes and `yarn build` to build the client files to host on a server. My assumption is that if you are reading this then you know about these things already.

## Deployment

A deployment process has been set up for deploying to an Amazon Web Services Lambda function. I make no claim that this is the most efficient or cost-effective way to host the application.

To deploy, first set the configuration variables in `lambda.config.json`, then run `Invoke-UploadStreetViewManager.ps1`. The PowerShell script leverages the AWS CLI and assumes that you are logged in to an AWS account. The new deployment should take effect immediately, assuming you don't have any weird caching rules set up.
