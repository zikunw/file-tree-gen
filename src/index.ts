import { readdir, readFile, writeFile } from "fs/promises";

async function main() {
    if (process.argv.length < 3) {
        console.log("Usage: node src/index.js <input path>");
        return;
    };

    let inputPath = process.argv[2];

    // if the input path contains '/' at the end, remove it
    if (inputPath[inputPath.length - 1] === "/") {
        inputPath = inputPath.slice(0, inputPath.length - 1);
    };

    const result = parser(await readPath(inputPath));
    // save the result to a file named "result.txt"
    await writeFile("result.txt", result);

};

type DirOrFile = MyDir | MyFile;

type MyDir = {
    type: "dir";
    name: string;
    children: DirOrFile[];
};

type MyFile = {
    type: "file";
    name: string;
};

async function isFile(path: string): Promise<boolean> {
    try {
        const _ = await readFile(path);
    } catch (e) {
        return false;
    }
    return true;
};

async function readPath(path: string): Promise<DirOrFile> {
    const isFileResult = await isFile(path);
    if (isFileResult) {
        return {
            type: "file",
            name: getName(path),
        };
    } else {
        const files = await readdir(path);
        const children = await Promise.all(files.map(async (file) => {
            const childPath = `${path}/${file}`;
            return await readPath(childPath);
        }));
        return {
            type: "dir",
            name: getName(path),
            children,
        };
    };
};

function parser(dirOrFile: DirOrFile): string {
    return parserRec(dirOrFile, 1, true, "");
};

function getName(path: string): string {
    const splitted = path.split("/");
    return splitted[splitted.length - 1];
}

function parserRec(dirOrFile: DirOrFile, depth: number, isLast: boolean, prevPadding: string): string {

    let curPadding: string = "";
    if (isLast) {
        curPadding = prevPadding + "    ";
    } else {
        curPadding = prevPadding + "│   ";
    }

    if (dirOrFile.type === "file") {
        return `${prevPadding}${isLast ? "└── " : "├── " } ${dirOrFile.name}`;
    } else {
        // if the directory is empty
        if (dirOrFile.children.length === 0) {
            return `${prevPadding}└── ${dirOrFile.name}`;
        }
        // sort the children so that directories come first, then files
        const sortedChildren = dirOrFile.children.sort((a, b) => {
            if (a.type === "dir" && b.type === "file") {
                return -1;
            } else if (a.type === "file" && b.type === "dir") {
                return 1;
            } else {
                return 0;
            };
        });
        // parse the children
        let result = `${prevPadding}${isLast ? "└── ": "├── " }${dirOrFile.name}\n`;
        for (let i = 0; i < sortedChildren.length; i++) {
            const child = sortedChildren[i];
            result += parserRec(child, depth + 1, i === sortedChildren.length - 1, curPadding);
            result += i === sortedChildren.length - 1 ? "" : "\n";
        };

        return result;

    };
}

main();