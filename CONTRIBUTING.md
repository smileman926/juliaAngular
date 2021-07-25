# Workflow

## Developing (*developer*)

### Starting or continuing a feature

* Tasks to select from: **To Do**
* Developer moves task to **Doing**
* Developer creates the feature branch
  * Naming scheme: feature/{task id}-{task name}, unless the task is labeled with **Hotfix**, in this case the prefix has to be hotfix/
  * Branch source is *develop*, unless the task is labeled with **Hotfix**, in this case *master*

> Tip: create the branch with GitLab's *Create merge request* feature with the dropdown in order to edit the default branch name (almost always adding the prefix will be enough). This will not just create the branch, but also creates a draft merge request and connects them.

### Finishing a sub-feature
* A sub-feature is a checkbox in the task
* Developer checks the checkbox
* Preferably developer makes a commit with the changes referring the actual checkbox in the merge commit (bug number or short description)

### Feature or sub-feature is not doable

* Developer adds a comment or extends the description with the reason why it's not doable
* If the whole feature is not doable, then developer moves the task to **Done**
* If sub-feature is not doable, then developer continues working on the feature, and if every sub-feature is ready or marked as not doable, then moves the task to **Done**

### Finishing a feature

* Developer moves task to **Done**
* Developer creates the merge request or in case it's already created as draft, marks it ready
  * Merge request must be connected to the task: add the task id to the description of it with a leading #, eg: #123
  * Existing draft merge requests already have this connection

## Code reviewing (*project owner*)

### Accepting a feature

* Project owner prepares the merge request to accept
  * Checks the *Delete source branch* checkbox
  * Checks the *Squash commits* checkbox if available
* Project owner merges the changes to *develop*
  * This will release it to the test server automatically
* Project owner moves the task to **Test/Review**

### Not accepting a feature

* Project owner leaves comments in the merge request
* Project owner moves the task back to **To Do**

## Testing (*tester*)

### Accepting a feature

* Tester moves the task to **Tested**

### Not accepting a feature

* Tester leaves comments in the task or extends the description
* Tester moves the task back to **To Do**

## Preparing for release (*project owner*)

### Feature is for the next release

* Project owner creates a new branch from *staging*
  * Naming scheme: release/{task id}
* Project owner cherry-picks the merge commits where the feature or fixes of it were merged to develop and commits them to the branch
  * There can be multiple merge commits, because of fixed issues found by the tester
* Project owner creates a merge request
  * Naming scheme: Merge feature {task id} to staging
  * Description has to be just the link of the task: #{task id}
  * Checks the *Delete source branch* checkbox
  * Checks the *Squash commits* checkbox if available
* Project owner merges the feature to *staging*
  * This will releases it to the staging server automatically
* Project owner moves the task to **Release collection for PROD**

> Tip: all merge requests related to the feature will be listed in the task in the "Related merge requests" section. Opening them will have a section where the merge status is accepted, there will be a button to cherry-pick the merge commit. Here selecting the release branch and un-checking the "Start a new merge request with these changes" will merge these changes into the branch immediately.

### Feature is not for the next release

* Leaves the task in **Tested**

## Releasing (*project owner*)

### Releasing features

* Project owner creates a merge request
  * Naming scheme: Release to production {version number}
* Project owner merges the feature to master
  * This will release it to the production servers automatically
* Project owner moves the tasks from **Release collection for PROD** to **Released to production**

### Releasing hotfixes

* The task is in **Tested** and it has **Hotfix** label
* Project owner prepares the merge request to accept
  * Renames the merge request, naming scheme: Merge hotfix {task id} to production
  * Checks the *Delete source branch* checkbox
  * Checks the *Squash commits* checkbox if available
  * Makes sure the target branch is *master*
* Project owner merges the merge request
* Project owner creates a new branch from *develop*
  * Naming scheme: hotfix/develop/{task id}
* Protect owner cherry picks the merge commit from the hotfix
* Project owner creates a merge request
  * Target: *develop*
  * Naming scheme: Merge hotfix {task id} to develop
  * Adds link to original task in the description
  * Checks the *Delete source branch*
* Project owner merges the merge request
* Project owner creates a new branch from *staging*
  * Naming scheme: hotfix/staging/{task id}
* Protect owner cherry picks the merge commit from the hotfix
* Project owner creates a merge request
  * Target: *staging*
  * Naming scheme: Merge hotfix {task id} to staging
  * Adds link to original task in the description
  * Checks the *Delete source branch*
* Project owner merges the merge request

### After release routine (project owner)

## Increasing version number

* Project owner changes the version number in src/version.json to the next version and merges it to *develop*
* Project owner cherry-picks the version number commit and merges it to *staging*

> Tip: the easiest way to change the version number is to go to Repository/Files in GitLab and select the src/version.json in *develop*. Then editing it makes a new merge request. After accepting the merge request, there is a "Cherry-pick" button showing up, with that it's possible to merge it to *staging* with another merge request.

# Coding guidelines

## Reuse existing components/pipes/services

Find a doc for the required functionality by keywords in all `README.md` files in this repository
Or find domain-independent components in `src/ui-kit` (date picker, list view, loading indicator, modal, tabs, etc.)

## Recommended sizes of component (script, template, style)

Less than: 200 lines for the script, 100 lines for the template and 100 lines for the style files

## Prevent memory leak

Use `untilDestroyed` from `ngx-take-until-destroy` for observer subscriptions

## Templating

Use `.pug` instead of `.html` (except componets in `/src/ui-kit`).  Avoid direct changing of DOM (`document.querySelector*`, etc)

## CSS and methodologies

SMACSS is more preferred. Don't use BEM :)

Try to keep component styles empty, only use them for unique styles what are only used in the current component. Put every other styles in the global stylesheet (/src/styles/*)

Always prefer variables over direct values.

If possible don't use utility classes (like md-3, pt-2, etc).

## Dependencies

There are common dependencies that are already choosed to solve a specific problems:

- Auto size an input: `ngx-autosize-input`
- Format and parse date: `dayjs`
- Drag and resize elements: `angular2-draggable`
- WYSIWYG editor: `ngx-quill`
- Icons: `mdi`
- Parse and stringify query parameters: `query-string`
- Tooltip: `@ng-bootstrap/ng-bootstrap`
- Date picker, modal windows: `easybooking-ui-kit` (built in package)
- Save file: `file-saver`
- I18N: `'@ngx-translate/core`

## Typescript

Always type everything, don't use type 'any'. Even methods/functions returning nothing should have ':void' as type declaration.

Always use public/protected/private for methods and fields in every class/component.

Avoid using functions in templates, they can get fired on every change (even on mousemove), use pipes instead. If there's no pipe for the function, create one. The custom made pipes are stored in app/shared/pipes.

Don't use model classes, use interfaces. Classes adds a lot of unnecessary javascript code, and slow down compiling and affects performance.

Use cached data from CacheService if needed.

Execute all Angular CLI commands from npm instead of your global Angular CLI installation. E.g. `npm run ng new myComponent` instead of `ng new myComponent` or `npm run ng serve -- --port 4201` instead of `ng serve --port 4201`

For code-style always apply to [https://angular.io/guide/styleguide](Angular Style Guide) and `tslint`

Order variables alphabetically
  1. `@Input()`
  2. `@Output()`
  3. `ViewChild()` etc
  4. Public variables
  5. Private variables
  
Order functions alphabetically
  1. Public functions
  2. Private functions
  3. Angular hooks

## I18N

Find the translations in `/src/assets/i18n/<lang>.json` and use them wherever possible

Never update the files directly. Use the Translation Tool (see `/src/assets/i18n/README.md`)

## Naming conventions

Coming soon...

Additional
---

- https://angular.io/guide/styleguide



