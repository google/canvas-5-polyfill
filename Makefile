tests: canvas.js
	node ./node_modules/karma/bin/karma start

debug: canvas.js
	node ./node_modules/karma/bin/karma start --no-single-run --browsers=Firefox

canvas.js: canvasv5.js svgpath.pegjs
	node ./node_modules/pegjs/bin/pegjs --export-var parser svgpath.pegjs
	node ./node_modules/rigger/bin/rig canvasv5.js > canvas.js

