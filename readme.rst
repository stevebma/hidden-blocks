** Hidden Blocks **
Typescript PIXI.js MVC demo game


**Install dependencies**
------------------------

To install the required build tools run:

`npm install`

(this uses package.json)

Gulp/closure

**GULP instructions**
---------------------

default task is debug build + copy:

`gulp`

release build, minified with closure:

`gulp release-build`

chained:

`gulp && gulp release-build && gulp beautify`

copy files to target dist folder:

`gulp copy-debug-build`
`gulp copy-release-build`

**Manual build instructions**
-----------------------------

* note: requires tsc

to compile the typescript project run:

`tsc`

or for continuous compilation on file change:

`tsc --watch`
