# ramda-destruct

![demo](https://raw.githubusercontent.com/raine/ramda-destruct/media/demo.gif)

Cleans up required or imported [ramda](http://ramdajs.com) functions when
using destructing assignment.

## install

```sh
npm install -g ramda-destruct
```

## usage

### file as argument

```sh
ramda-destruct path/to/file.js
```

### stdin

```sh
cat path/to/file.js | ramda-destruct
```

### vim

```
%!ramda-destruct
```

Or use [Preserve function](https://technotales.wordpress.com/2010/03/31/preserve-a-vim-function-that-keeps-your-state/)
that restores cursor position after:

```
:call Preserve("%!ramda-destruct")
```
