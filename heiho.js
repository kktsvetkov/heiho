/**
* Heihō: simple spreadsheet viewer
* @link https://github.com/kktsvetkov/heiho
*/

var heiho = {
	options: {
		title: 'Preview',
		max: 35
	},

	id: 'heiho-view',

	elements: [],

	load: function()
	{
		var el = heiho.elements;
		if (el.length > 0)
		{
			return el;
		}

		el[0] = document.createElement('div');
		el[0].setAttribute('id', heiho.id);
		el[0].style.display = 'none';

		el[1] = document.createElement('div');
		el[1].setAttribute('id', heiho.id + '-header');
		el[0].appendChild(el[1]);

		el[2] = document.createElement('div');
		el[2].setAttribute('id', heiho.id + '-scroll');
		el[0].appendChild(el[2]);

		el[3] = document.createElement('table');
		el[3].setAttribute('id', heiho.id + '-table');
		el[2].appendChild(el[3]);

		el[4] = document.createElement('tr');
		el[4].setAttribute('id', heiho.id + '-thead');
		el[3].appendChild(el[4]);

		el[5] = document.createElement('tbody');
		el[5].setAttribute('id', heiho.id + '-tbody');
		el[3].appendChild(el[5]);

		el[6] = document.createElement('div');
		el[6].setAttribute('id', heiho.id + '-truncated');
		el[6].style.display = 'none';
		el[0].appendChild(el[6]);

		document.body.appendChild(el[0]);
		return el;
	},

	width: function(data)
	{
		var cols = 0;
		for (var i in data)
		{
			var l = 0;
			if ('object' == typeof data[i])
			{
				if (Array.isArray(data[i]))
				{
					l = data[i].length;
				} else
				{
					l = Object.keys( data[i] ).length;
				}
			}

			if (l > cols)
			{
				cols = l;
			}
		}

		return cols;
	},

	/**
	* Return column title based on integer index, e.g. "B" for 2, "AA" for 27
	*
	* @param {Integer} i
	* @retun {String}
	*/
	col: function(i)
	{
		i = parseInt(i);
		if (!i)
		{
			return '';
		}

		var h = '', j = i, k = 0;
		while (j > 26)
		{
			k = j % 26;
			j = Math.floor(j / 26);
			h = String.fromCharCode(64 + k) + h;
		}

		h = String.fromCharCode(64 + j) + h;
		return h;
	},

	view: function(data, o)
	{
		var el = heiho.load();

		var opts = heiho.options;
		o = o || opts;

		// header title
		//
		o.title = o.title || opts.title;
		el[1].innerText = o.title;

		var cols = heiho.width(data);

		// grid header
		//
		el[4].innerHTML = '';
		for (var i = 0; i <= cols; i++)
		{
			var th = document.createElement('th');
			th.innerHTML = heiho.col(i);
			el[4].appendChild(th);
		}

		// grid rows
		//
		el[5].innerHTML = '';
		var rows = 0;

		el[6].innerHTML = '';
		o.max = o.max || opts.max;

		for (var i in data)
		{
			if (++rows > o.max)
			{
				el[6].innerHTML = 'Showing only first ' + o.max + ' rows, ' + heiho.width(data) + ' in total';
				el[6].style.display = '';
				break;
			}

			var tr = document.createElement('tr');

			var td = document.createElement('td');
			td.innerHTML = 1 + parseInt(i);
			tr.appendChild(td);

			for (var j in data[i])
			{
				td = document.createElement('td');
				td.innerHTML = data[i][j];
				tr.appendChild(td);
			}

			el[5].appendChild(tr);
		}

		// final formatting
		//
		document.body.classList.add('heiho-body');
		el[0].style.display = '';
		if (el[0].offsetWidth > el[3].offsetWidth)
		{
			el[3].className += ' width100';
		}

		el[2].style.height = ''; /* adjust height */
		var height = el[0].offsetHeight
			- 2 /* bottom offset */
			- el[1].offsetHeight /* title */
			- el[6].offsetHeight; /* truncated */
		if (height < el[3].offsetHeight)
		{
			el[2].style.height = height + 'px';
		}
	}
}

var data = [
	['a', 'b', 'c'],
	[1,2,3],
	[4,5,6],
];
// var data = {
// 	a: { a1: 1, a2: 2, a3: 3 },
// 	b: { b1: 4, b2: 5, b3: 6},
// 	c: { c1: null, c2: 10}
// }

data = []; d = 50;
for (var i = 0; i < d; i++)
{
	data[i] = [];
	for (var l = 0; l < d; l++)
	{
		data[i][l] = 'proba na probata ' + (i * d + l);
	}
}
