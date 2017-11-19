# Myach Game

## Goal

Balance a ball to get to the next level! Fight the elements and use physics to survive.

## Description

This is a multiplayer game. You can set up an account, choose a ball, and click PLAY NOW to start. This game will be hosted on Firebase. We will be using Babylon.js.

## Contribution guide

The contribution process is...

1. Make an issue (or multiple issues)
2. Merge master into the branch before PR to make sure that there are NO conflicts
3. Make a PR that references that issue
4. Get it code reviewed by someone on the team, address any comments
5. Merge into master (with merge commit)
6. Code style guide

## Style

- Pay attention to the linter!
- Use semicolons
- Two spaces
- Trailing commas where possible
- const or let over var
- Use require and module.exports in .js files
- Use import and export in .jsx files, unless require makes for cleaner code
- Put import statements at top
- Put the default export at bottom
- Consider splitting up any file larger than 50 lines
- Define container components and presentational components in separate files
- Use the "ducks" pattern for redux
- Name files using lowercase-and-dashes instead of camelCase or PascalCase, except for when the default export is a class, then use PascalCase
- Define react components as pure functions (instead of classes) whenever possible
