# lynda-copy-course
A utility for copying downloaded Lynda.com courses from one machine to another.

![Example usage](./Screenshot.png)

## Installation

Install via `npm` with 

```
npm install -g lynda-copy-course
```
If npm installations are unfamiliar, Lynda.com's <a href="https://www.lynda.com/Web-Development-tutorials/Up-Running-NPM-Node-Package-Manager/409274-2.html">Learning NPM the Node Package Manager</a> course may be a good place to start.

## Usage

From the command line:

```
lynda-copy-course D:\path\to\source\Lynda\directory C:\path\to\destination\lynda\directory [-a]
```

Source and destination directories are required.

Input directories should be the folders which contain Lynda's sqlite database file, `db.sqlite`. On Windows, this folder is located at `"~\AppData\Local\lynda.com\Lynda.com Desktop App"` by default.

If the optional `-a` or `--all` flags are passed, all eligible courses (ones present in the source directory but not present in the destination directory) will be copied. Otherwise, users will be prompted to select courses for copying, as in the above screenshot.


## Why?
My primary machine is an offline-first desktop with bandwidth restrictions. This utility lets me transfer Lynda.com courses downloaded with a laptop at my local library to my primary machine.

## Warning!

This software is a rough cut, and has been 'tested' on a single windows machine. It's probably a good idea to create a backup copy of your 'destination' folder before use.

## A note to Lynda.com developers:

It would be handy if the Lynda.com Desktop app checked the local disk before downloading video files. That way, users could move course files manually, and the app would only have to download meta-data and thumbnails.