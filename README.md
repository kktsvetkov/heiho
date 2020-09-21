<link rel="stylesheet" href="heiho.css" />
<script src="heiho.js"></script>

# Heihō

Quick spreadsheet viewer in vanilla JS

![Heihō](https://user-images.githubusercontent.com/694812/93581130-62c3a680-f9a9-11ea-8302-f47f94d4bdf5.png)

# What it does ?

The `heiho.js` script is quick and simple spreadsheet viewer. It is meant to
preview the contents of **csv** files inside your browser without needing
any other tools. It uses plain vanilla javascript so it has no dependencies,
but for the applied styling from the css file.

This is not a spreadsheet editor, this is a preview tool only.

# How to use ?

Simply include both the [javascript file](https://github.com/kktsvetkov/heiho/blob/master/heiho.js) and the [css stylesheet](https://github.com/kktsvetkov/heiho/blob/master/heiho.css) in your HTML document.
It's best if you put them at the bottom, close to the closing `<\body>` tag.

```html
<link rel="stylesheet" href="/path/to/heiho.css" />
<script src="/path/to/heiho.js"></script>
```

Or include it via [jsDelivr CDN](https://www.jsdelivr.com/features#gh):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kktsvetkov/heiho@latest/heiho.css" />
<script src="https://cdn.jsdelivr.net/gh/kktsvetkov/heiho@latest/heiho.js"></script>
```

Once included in your document, simply call `Heiho()` and pass the data as argument

```js
var data = [ ['a', 'b', 'c'], [1,2,3], [4,5,6] ];
Heiho(data);
```
You can modify some of the output using a second argument that passes additional
options
```js
Heiho(data, {max:20}); // shows only 20 rows from data
```

Explore more cases in the examples section below.

# Options

There is a small set of options used to influence the output of the spreadsheet
preview.

* `options.header` is boolean value whether to style the first row in the  
preview differently; this meant to be used with CSV files, where the first
row holds the column titles; default value is `null` which triggers an attempt
to auto-detect whether the first row is header or not.

* `options.max` is an integer value that restricts how many rows to be included
in the preview; you can use `0` to disable it, and its' default value is 100.

* `options.title` this is used to output the header title; you can use a string
to just pass a text to be inserted there, or you can use a function that manipulates
the HTML element that is the header title (look in the examples below)

* `options.truncate` is a function used to render the output in the "truncate"
element of the preview; this element appears if the rows of the data previewed
are more than `options.max` as an acknowledgement that the data was truncated
(look in the examples below to see how this work)

Options are passed as a second argument to `Heiho()` function.

```js
Heiho(data, { max: 20, title: 'proba.csv' });
```

You can add more elements to the options argument which you can later use in
some of the functions inside it such as `options.title` and `options.truncate`.

# Examples

Let's explore few examples of what you can do with **Heihō**

## Title

You can modify what is rendered in the header title of the preview. The basic
approach here is to just pass the title as a string in the options, like this:

```js
Heiho(data, { title: 'users.csv' });
```

You can also do more with it if you pass a function as the title. In that case
it will be executed to populate the contents of the header title will be. The
arguments are the header title element, and the options used.

```js
var file = {filename: 'Proba.csv', size: '123KB', created: '2009-08-21 14:01:36'}
Heiho(data, { title: function(el, o)
	{
		el.innerHTML = '<b>'
			+ file.filename + '<\/b> <code>'
			+ file.size + '<\/code> '
			+ file.created;
	}
});
```

## Truncate

Similar to how `options.title` is used as a function, `options.truncate` is
used to populate the contents of the "truncate" element (the warning shown when
there are more rows to preview than the `options.max` restriction). This
function gets more arguments:

```js
/**
* @param {DomElement} el the truncate element
* @param {Integer} max
* @param {Array|Object} data data previewed
* @param {Object} o options
*/
options.truncate = function(el, max, data, o)
{
	el.innerHTML = 'Showing only first ' + max + ' rows';
	el.style.display = '';
}
```

## Papa Parse

You can use the popular [Papa Parse](https://www.papaparse.com/) ([github](https://github.com/mholt/PapaParse)) library
to parse CSV data inside your browser. You can use it together with **Heihō** to
preview the result from the CSV parsing

```js
Papa.parse(file, {
	complete: function(results) {
		Heiho(results.data);
	}
});
```

Explore all the examples on [papaparse.com](https://www.papaparse.com/), they are a blast!

Here's an example of Papa Parse and Heiho previewing a remote csv file:
```js
Papa.parse("http://example.com/file.csv", {
	download: true,
	complete: function(results) {
		Heiho(results.data);
	}
});
```
# Demo 
Here's a quick and silly example with a list of all the members of Monty Python.

<script>var monty_python = [
	['first_name', 'last_name', 'year_of_birth', 'wiki_url'],
	['Graham', 'Chapman', 1941, 'https://en.wikipedia.org/wiki/Graham_Chapman'],
	['John', 'Cleese', 1939, 'https://en.wikipedia.org/wiki/John_Cleese'],
	['Terry', 'Gilliam', 1940, 'https://en.wikipedia.org/wiki/Terry_Gilliam'],
	['Terry', 'Jones', 1942, 'https://en.wikipedia.org/wiki/Terry_Jones'],
	['Eric', 'Idle', 1943, 'https://en.wikipedia.org/wiki/Eric_Idle'],
	['Michael', 'Palin', 1943, 'https://en.wikipedia.org/wiki/Michael_Palin'],
];</script>
<input type=button value="A very naughty button" onclick="Heiho(monty_python, {title:'Monty Python List'})" />

```html
<script>var monty_python = [
	['first_name', 'last_name', 'year_of_birth', 'wiki_url'],
	['Graham', 'Chapman', 1941, 'https://en.wikipedia.org/wiki/Graham_Chapman'],
	['John', 'Cleese', 1939, 'https://en.wikipedia.org/wiki/John_Cleese'],
	['Terry', 'Gilliam', 1940, 'https://en.wikipedia.org/wiki/Terry_Gilliam'],
	['Terry', 'Jones', 1942, 'https://en.wikipedia.org/wiki/Terry_Jones'],
	['Eric', 'Idle', 1943, 'https://en.wikipedia.org/wiki/Eric_Idle'],
	['Michael', 'Palin', 1943, 'https://en.wikipedia.org/wiki/Michael_Palin'],
];</script>
<input type=button value="A very naughty button" onclick="Heiho(monty_python, {title:'Monty Python List'})" />
```

Here's another demo using **Papa Parse** csv parsing library and a csv file: list of best pictures from [cs.uwaterloo.ca/~s255khan/oscars.html](https://cs.uwaterloo.ca/~s255khan/oscars.html)

<script src="//cdn.jsdelivr.net/gh/mholt/PapaParse@latest/papaparse.min.js"></script>
<input type=button value="Best Picture Oscar Winners" onclick="Papa.parse('pictures.csv', {download:true, complete:function(results){ Heiho(results.data, {title:'pictures.csv'}) }});  " />
