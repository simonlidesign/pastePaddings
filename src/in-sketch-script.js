const sketch = require('sketch');

var newPaddings = { top: 3, bottom: 12, left: 10, right: 12 };
var currentPaddings = {
	top: false,
	bottom: false,
	left: false,
	right: false
};

var computeCog = function (frame){
	return {
		cx: frame.x + frame.width/2,
		cy: frame.y + frame.height/2
	};
};

var selectedFrame = sketch.Document.getSelectedDocument().selectedLayers.layers[0].frame;

var cogSelected = computeCog(selectedFrame);

var siblings = sketch.Document.getSelectedDocument().selectedLayers.layers[0].parent.layers;

siblings.map((e)=>{
	var cogE = computeCog(e.frame);

	// compute current top padding
	if (cogE.cy <= cogSelected.cy){
		var tp = selectedFrame.y - e.frame.y - e.frame.height;
		if (tp>=0 && (currentPaddings.top === false || tp < currentPaddings.top) ){
			currentPaddings.top = tp;
		}
	}

	// compute current bottom padding
	if (cogE.cy >= cogSelected.cy){
		var bp = e.frame.y - selectedFrame.y - selectedFrame.height;
		if (bp>=0 && (currentPaddings.bottom === false || bp < currentPaddings.bottom) ){
			currentPaddings.bottom = bp;
		}
	}

	// compute current left padding
	if (cogE.cx <= cogSelected.cx){
		var lp = selectedFrame.x - e.frame.x - e.frame.width;
		if (lp>=0 && (currentPaddings.left === false || lp < currentPaddings.left) ){
			currentPaddings.left = lp;
		}
	}

	// compute current right padding
	if (cogE.cx >= cogSelected.cx){
		var rp = e.frame.x - selectedFrame.x - selectedFrame.width;
		if (rp>=0 && (currentPaddings.right === false || rp < currentPaddings.right) ){
			currentPaddings.right = rp;
		}
	}
});

// apply new paddings
siblings.map((e)=>{
	var cogE = computeCog(e.frame);

	// apply top
	if (currentPaddings.top !== false && newPaddings.top !== false){
		var delta = newPaddings.top - currentPaddings.top;

		if (cogE.cy <= cogSelected.cy){
			var tp = selectedFrame.y - e.frame.y - e.frame.height;
			if (tp>=0){
				e.frame.y -= delta; // move e
			}
		}
	}


	// apply bottom
	if (currentPaddings.bottom !== false && newPaddings.bottom !== false){
		var delta = newPaddings.bottom - currentPaddings.bottom;

		if (cogE.cy >= cogSelected.cy){
			var bp = e.frame.y - selectedFrame.y - selectedFrame.height;
			if (bp>=0){
				e.frame.y += delta; // move e
				console.log(e.frame.y, delta);
			}
		}
	}

	// apply left
	if (currentPaddings.left !== false && newPaddings.left !== false){
		var delta = newPaddings.left - currentPaddings.left;

		if (cogE.cx <= cogSelected.cx){
			var lp = selectedFrame.x - e.frame.x - e.frame.width;
			if (lp>=0){
				e.frame.x -= delta; // move e
				console.log(e.frame.x, delta);
			}
		}
	}

	// apply right
	if (currentPaddings.right !== false && newPaddings.right !== false){
		var delta = newPaddings.right - currentPaddings.right;

		if (cogE.cx >= cogSelected.cx){
			var rp = e.frame.x - selectedFrame.x - selectedFrame.width;
			if (rp>=0){
				e.frame.x += delta; // move e
				console.log(e.frame.x, delta);
			}
		}
	}
});