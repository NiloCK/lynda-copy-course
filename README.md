# lynda-copy-course
A utility for copying downloaded Lynda.com courses from one machine to another

## Installation

Install via `npm` with 

```
npm install -g lynda-copy-course
```
If npm installations are unfamiliar, Lynda.com's <a href="https://www.lynda.com/Web-Development-tutorials/Up-Running-NPM-Node-Package-Manager/409274-2.html">Learning NPM the Node Package Manager</a> course may be a good place to start.

## Usage

From the command line:

```
lynda-copy-course D:\path\to\source\Lynda\directory C:\path\to\destination\lynda\directory
```

The input directories should be the folders which contain Lynda's sqlite database file, `db.sqlite`. On Windows, this folder is located at `"~\AppData\Local\lynda.com\Lynda.com Desktop App"` by default.

All courses in the source folder will be copied to the destination folder, and the destination folder's original courses will remain.

## Why?
My primary machine is an offline-first desktop with bandwidth restrictions. This utility lets me transfer Lynda.com courses downloaded with a laptop at my local library to my primary machine.