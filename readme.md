# impromptu coding challenge

## Setup

Download or clone this repository and run `yarn install` to install the dependencies.

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
However, if `foo.txt.1` already exists, it should be moved to `foo.txt.2`.
If `foo.txt.2` exists it should also renamed to `foo.txt.3`, and so on.

The function should take the name of the file to backup as an argument, and return `true` if the backup was successful, `false` otherwise.

Start by editing `yourCode.ts` and writing your function in the space provided.

You can test your code by running `yarn test` from the command line.

<!-- ## Problem 2

Extend the function you wrote in problem 1 to take an optional argument that specifies the maximum number of backups to keep. -->

## Assessment Criteria (as suggested by copilot)

-   Correctness
-   Readability
-   Maintainability
-   Efficiency
-   Testability
-   Documentation
-   Code style
