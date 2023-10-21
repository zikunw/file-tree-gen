# File Tree Graph Generator

A small script that browse a directory and generate a tree graph in text that represents the structure of the directory.

## Usage

```
npm install
npm build
npm start {file_path}
```

Then by default the result will be save to `result.txt`:

```
├── example
│   ├── subfolder_1
│   │   └──  sub_text.txt
│   ├── subfolder_2
│   │   ├──  sub_text_1.txt
│   │   ├──  sub_text_2.txt
│   │   └──  sub_text_3.txt
│   ├──  example_text_1.txt
│   └──  example_text_2.txt
```

## Todo
- [ ] Limit max depth
- [ ] Ignore file by matching file name
- [ ] Allow only show directory
