/**
* Heihō: simple spreadsheet viewer
* @link https://github.com/kktsvetkov/heiho
*/

;(function(root, factory)
{
	if (typeof exports === 'object')
	{
		module.exports = factory(window, document)
	} else
	{
		root.Heiho = factory(window, document)
  	}
})(this, function(w, d)
{
	/**
	* Count number of columns in array or object
	*
	* @param {Array|Object} data
	* @return {Integer}
	*/
	function cols(data)
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
	}

	/**
	* Creates the DOM elements of the preview
	*
	* @param {String} id common prefix for ids of DOM elements
	* @return {Object} collection of elements
	*/
	function load(id)
	{
		var el = {};

		/* outter preview shell */
		el.shell = document.createElement('div');
		el.shell.setAttribute('id', id);
		el.shell.style.display = 'none';

		/* preview header */
		el.header = document.createElement('div');
		el.header.setAttribute('id', id + '-header');
		el.shell.appendChild(el.header);

		/* preview header close button */
		el.close = document.createElement('div');
		el.close.setAttribute('id', id + '-close');
		el.header.appendChild(el.close);

		/* preview header title caption */
		el.title = document.createElement('div');
		el.title.setAttribute('id', id + '-title');
		el.header.appendChild(el.title);

		/* scrollable wrap of the preview grid  */
		el.scroll = document.createElement('div');
		el.scroll.setAttribute('id', id + '-scroll');
		el.shell.appendChild(el.scroll);

		/* preview table grid */
		el.table = document.createElement('table');
		el.table.setAttribute('id', id + '-table');
		el.scroll.appendChild(el.table);

		/* preview grid thead */
		el.thead = document.createElement('tr');
		el.thead.setAttribute('id', id + '-thead');
		el.table.appendChild(el.thead);

		/* preview grid tbody */
		el.tbody = document.createElement('tbody');
		el.tbody.setAttribute('id', id + '-tbody');
		el.table.appendChild(el.tbody);

		/* preview truncate warning */
		el.truncate = document.createElement('div');
		el.truncate.setAttribute('id', id + '-truncated');
		el.truncate.style.display = 'none';
		el.shell.appendChild(el.truncate);

		/*
		* shell
		*  |
		*  + header
		*  |  |
		*  |  + close
		*  |  |
		*  |  + title
		*  |
		*  + scroll
		*  |  |
		*  |  + table
		*  |     |
		*  |     + thead
		*  |     |
		*  |     + tbody
		*  |
		*  + truncate
		*/

		document.body.appendChild(el.shell);
		return el;
	}

	/**
	* Return TH column title based on integer index
	*
	* Column titles are only alphabet letters, using the 26 ascii
	* uppercase chars, e.g. "B" for 2, "AA" for 27
	*
	* @param {Integer} i
	* @retun {String}
	*/
	function label(i)
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
	}

	/**
	* Resise the preview
	*
	* @param {Array} el collection of preview elements
	*/
	function resize(el)
	{
		/* span the grid to full page width */
		if (el.shell.offsetWidth > el.table.offsetWidth)
		{
			el.table.className += ' width100';
		}

		/* adjust height */
		el.scroll.style.height = '';
		var height = el.shell.offsetHeight
			- 2 /* bottom offset */
			- el.header.offsetHeight
			- el.truncate.offsetHeight;
		if (height < el.table.offsetHeight)
		{
			el.scroll.style.height = height + 'px';
		}
	}

	/**
	* @var {Object} default options
	*/
	var options = {

		/**
		* @var {String} prefix for all HTML ids used in the preview
		*/
		id: 'heiho-view',

		/**
		* @var {Integer} max number of rows to preview
		*/
		max: 100,

		/**
		* @var {Bool} whether to use first row as header or not
		*/
		header: null,

		/**
		* @var {Function} renders the preview title contents
		* @param {DomElement} el the preview element
		* @param {Object} o extra options
		*/
		title: function(el, o)
		{
			var title = 'Preview';
			if ('title' in o)
			{
				title = o.title;
			}

			el.innerHTML = title;
		},

		/**
		* @var {Function} renders the truncate warning contents
		* @param {DomElement} el the truncate element
		* @param {Integer} max
		* @param {Array|Object} data
		* @param {Object} o extra options
		*/
		truncate: function(el, max, data, o)
		{
			el.innerHTML = 'Showing only first ' + max + ' rows, ' + cols(data) + ' in total';
			el.style.display = '';
		}
	}

	/**
	* Constructor
	*
	* @param {Array|Object} data
	* @param {Object} o extra options
	*/
	function hh(data, o)
	{
		/* read options */
		o = o || {}
		for (var i in options)
		{
			if (i in o)
			{
				continue;
			}

			o[i] = options[i];
		}

		/* get the preview elements */
		var el = load(o.id);

		/* header title */
		var t = o; delete t.title;
		(typeof o.title === 'function')
			? o.title(el.title, t)
			: options.title(el.title, t);

		/* resize preview */
		var windowResize = function(event)
		{
			resize(el);
		}
		window.addEventListener('resize', windowResize);

		/* close button */
		const scrollReset = {top: 0, left: 0, behavior: 'auto'};
		var scrollTo = scrollReset;
		el.close.addEventListener('click', function (event)
		{
			document.body.classList.remove('heiho-body');
			document.body.removeChild(el.shell);
			window.removeEventListener('resize', windowResize);

			document.body.scrollTo( scrollTo );
			scrollTo = scrollReset;
		});

		var columns = cols(data);

		/* preview thead */
		el.thead.innerHTML = '';
		for (var i = 0; i <= columns; i++)
		{
			var th = document.createElement('th');
			th.innerHTML = label(i);
			el.thead.appendChild(th);
		}

		/* preview grid rows */
		el.tbody.innerHTML = '';
		el.truncate.innerHTML = '';

		var rows = 0;
		var header = [];
		for (var i in data)
		{
			if (o.max > 0 && ++rows > o.max)
			{
				(typeof o.truncate === 'function')
					? o.truncate(el.truncate, o.max, data, o)
					: options.truncate(el.truncate, o.max, data, o);
				break;
			}

			if (1 === rows)
			{
				header = data[i];
			}

			var tr = document.createElement('tr');

			var td = document.createElement('td');
			td.innerHTML = rows;
			tr.appendChild(td);

			for (var j in data[i])
			{
				td = document.createElement('td');
				td.innerHTML = data[i][j];
				tr.appendChild(td);
			}

			/* pad missing columns */
			if (columns > tr.childNodes.length)
			{
				while (tr.childNodes.length <= columns)
				{
					td = document.createElement('td');
					tr.appendChild(td);
				}
			}

			el.tbody.appendChild(tr);
		}

		/* first row is a header or not */
		if (null === o.header)
		{
			o.header = true;

			var j = 0;
			for (var i in header)
			{
				j++;

				if (!header[i])
				{
					o.header = false; /* empty header column */
					break;
				}

				if (!isNaN( parseFloat(header[i]) ))
				{
					o.header = false; /* number in header */
					break;
				}
			}

			if (false !== o.header)
			{
				if (j < columns)
				{
					o.header = false; /* too short  header row */
				}
			}
		}
		if (o.header)
		{
			el.tbody.firstChild.classList.add('heiho-header');
		}

		/* finally show the preview and hive everything else in the body */
		scrollTo.top = document.body.scrollTop;
		scrollTo.left = document.body.scrollLeft;
		document.body.classList.add('heiho-body');
		el.shell.style.display = '';
		resize(el);
	}

	var Heiho = hh;
	return Heiho;
});
