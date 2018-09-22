# ramda-destruct [![npm version](https://badge.fury.io/js/ramda-destruct.svg)](https://www.npmjs.com/package/ramda-destruct) [![Build Status](https://travis-ci.org/raine/ramda-destruct.svg?branch=master)](https://travis-ci.org/raine/ramda-destruct)

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

#### emacs

https://gist.github.com/yrns/e9b0cf1c24a87812e1ecab9816823f4c

#### Sublime Text
Install the [FilterPipes plugin](https://packagecontrol.io/packages/FilterPipes) and add a key binding like
```
{ "keys": ["alt+shift+d"], "command": "filter_pipes_process", "args": {"command": "ramda-destruct"}}
```

#### Contributors

Big thanks to [Bijoy Thomas](https://github.com/bijoythomas) for his contributions.
