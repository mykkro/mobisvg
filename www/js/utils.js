/**
 *  Returns a random point from region [x1,x2]x[y1,y2].
 */
var randomPoint = function(x1, x2, y1, y2) {
    return {
        x: x1 + Math.random()*(x2-x1),
        y: y1 + Math.random()*(y2-y1)
    }
};


var randomInt = function(max) {
	return Math.floor(Math.random()*max);
};

/**
 *  Returns random item from an array.
 */
var pickRandom = function(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
};


/**
 *  Shuffles an array in place.
 */
var shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// creates array [0 1 2 3... n-1]
var makeRange = function(n) {
    var indices = [];
    for(var i=0; i<n; i++) {
        indices[i] = i;
    }
    return indices;
}


// from: http://stackoverflow.com/questions/3954438/remove-item-from-array-by-value
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Array.prototype.shuffle = function() {
  var o = this;
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return this;
};
