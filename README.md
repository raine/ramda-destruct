# ramda-destruct [![npm version](https://badge.fury.io/js/ramda-destruct.svg)](https://www.npmjs.com/package/ramda-destruct)

![demo](https://raw.githubusercontent.com/raine/ramda-destruct/media/demo.gif)

- Cleans up required or imported [Ramda](http://ramdajs.com) functions when
  using destructing assignment.
- Reads functions from local Ramda instance based on the current working
  directory.

## install

```sh
npm install -g ramda-destruct
```

## usage

Prints the modified file contents to stdout.

#### file as argument

```sh
ramda-destruct path/to/file.js
```

#### stdin

```sh
cat path/to/file.js | ramda-destruct
```

#### vim

```
%!ramda-destruct
```

Or use [Preserve function](https://technotales.wordpress.com/2010/03/31/preserve-a-vim-function-that-keeps-your-state/)
that restores cursor position after:

```
:call Preserve("%!ramda-destruct")
```
