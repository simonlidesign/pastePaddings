import sketch from 'sketch'
// documentation: https://developer.sketchapp.com/reference/api/

var Settings = require('sketch/settings');

var currentPaddings = {
	top: false,
	bottom: false,
	left: false,
	right: false
};

var newPaddings = {
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

function computePaddings(paddings) {
	var selectedFrame = sketch.Document.getSelectedDocument().selectedLayers.layers[0].frame;
	var cogSelected = computeCog(selectedFrame);
	var siblings = sketch.Document.getSelectedDocument().selectedLayers.layers[0].parent.layers;

	siblings.map((e)=>{
		var cogE = computeCog(e.frame);

		// compute current top padding
		if (cogE.cy <= cogSelected.cy){
			var tp = selectedFrame.y - e.frame.y - e.frame.height;
			if (tp>=0 && (paddings.top === false || tp < paddings.top) ){
				paddings.top = tp;
			}
		}

		// compute current bottom padding
		if (cogE.cy >= cogSelected.cy){
			var bp = e.frame.y - selectedFrame.y - selectedFrame.height;
			if (bp>=0 && (paddings.bottom === false || bp < paddings.bottom) ){
				paddings.bottom = bp;
			}
		}

		// compute current left padding
		if (cogE.cx <= cogSelected.cx){
			var lp = selectedFrame.x - e.frame.x - e.frame.width;
			if (lp>=0 && (paddings.left === false || lp < paddings.left) ){
				paddings.left = lp;
			}
		}

		// compute current right padding
		if (cogE.cx >= cogSelected.cx){
			var rp = e.frame.x - selectedFrame.x - selectedFrame.width;
			if (rp>=0 && (paddings.right === false || rp < paddings.right) ){
				paddings.right = rp;
			}
		}
	});
}

export function copyPaddings(context) {
	computePaddings(newPaddings);
	context.api().setSettingForKey('newPaddings', newPaddings);

	sketch.UI.message(`left: ${newPaddings.left}, right: ${newPaddings.right}, top: ${newPaddings.top}, bottom: ${newPaddings.bottom}`);
}

export function pastePaddings(context) {
	newPaddings = context.api().settingForKey('newPaddings');
	computePaddings(currentPaddings);
	console.log(newPaddings, currentPaddings);
	
	var selectedFrame = sketch.Document.getSelectedDocument().selectedLayers.layers[0].frame;
	var cogSelected = computeCog(selectedFrame);
	var siblings = sketch.Document.getSelectedDocument().selectedLayers.layers[0].parent.layers;

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
}