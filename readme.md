# impromptu coding challenge

## Problem 1

Included in this assignment is a file named `fileApi.ts. It contains the following functions:

```ts
function moveFile(source: string, destination: string): boolean;
function copyFile(source: string, destination: string): boolean;
function fileExists(path: string): boolean;
function deleteFile(path: string): boolean;
```

Your task is to use this API to write a function that creates backups for a file.
The backup should have the same name as the original file, but with a numeric suffix.
Eg. backing up the file `foo.txt` should create `foo.txt.1`.
However, if `foo.txt.1` already exists, it should create `foo.txt.2`, and so on.

The function should take the name of the file to backup as an argument, and return `true` if the backup was successful, `false` otherwise.

## Problem 2

Extend the function you wrote in problem 1 to take an optional argument that specifies the maximum number of backups to keep.

## Assessment Criteria (as suggested by copilot)

- Correctness
- Readability
- Maintainability
- Efficiency
- Testability
- Documentation
- Code style
