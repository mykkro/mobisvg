/**
 *  Returns a random point from region [x1,x2]x[y1,y2].
 */
var randomPoint = function(x1, x2, y1, y2) {
    return {
        x: x1 + Math.random()*(x2-x1),
        y: y1 + Math.random()*(y2-y1)
    }
};

/**
 *  Returns random number from range <0, n-1>
 */
var randomInt = function(max) {
	return Math.floor(Math.random()*max);
};

/**
 *  Returns random number from range <0, n-1>
 */
var randomIntVector = function(len, max) {
  var vec = makeZeroes(len);
  for(var i=0; i<len; i++) {
    vec[i] = randomInt(max);
  }
  return vec;
};

/**
 *  Returns random number from range <0, n-1>, except 
 */
var randomIntExcept = function(max, except) {
    var index = 0;
    if(max>1) {
      do {
        index = randomInt(max);
      }
      while(index == except);
      return index;
    }
};

/**
 *  Returns random item from an array.
 */
var pickRandom = function(arr) {
    return arr[randomInt(arr.length)];
};

/**
 *  Returns random item from an array.
 */
var pickRandomExcludeIndex = function(arr, excludeIndex) {
    var index = 0;
    if(arr.length>1) {
      do {
        index = randomInt(arr.length);
      }
      while(index == excludeIndex);
      return arr[index];
    }
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

// creates array [0 0 0 .. 0] of length n
var makeZeroes = function(n) {
    var indices = [];
    for(var i=0; i<n; i++) {
        indices[i] = 0;
    }
    return indices;
}

var makeFilled = function(n, val) {
    var indices = [];
    for(var i=0; i<n; i++) {
        indices[i] = val;
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


if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
}


function basename(str)
{
   var base = new String(str).substring(str.lastIndexOf('/') + 1); 
    if(base.lastIndexOf(".") != -1)       
        base = base.substring(0, base.lastIndexOf("."));
   return base;
}

function dirname (path) {
  //  discuss at: http://locutus.io/php/dirname/
  // original by: Ozh
  // improved by: XoraX (http://www.xorax.info)
  //   example 1: dirname('/etc/passwd')
  //   returns 1: '/etc'
  //   example 2: dirname('c:/Temp/x')
  //   returns 2: 'c:/Temp'
  //   example 3: dirname('/dir/test/')
  //   returns 3: '/dir'
  return path.replace(/\\/g, '/')
    .replace(/\/[^/]*\/?$/, '')
}