# v0.2.2 (Fri Apr 19 2024)

#### 🐛 Bug Fixes

- [FIX] Hotfix for handling responses from n-API [#139](https://github.com/neurobagel/query-tool/pull/139) ([@surchs](https://github.com/surchs))

#### 🏠 Internal

- [MNT] Add plausible [#135](https://github.com/neurobagel/query-tool/pull/135) ([@surchs](https://github.com/surchs))

#### Authors: 1

- Sebastian Urchs ([@surchs](https://github.com/surchs))

---

# v0.2.1 (Mon Apr 15 2024)

:tada: This release contains work from a new contributor! :tada:

Thank you, Alyssa Dai ([@alyssadai](https://github.com/alyssadai)), for all your work!

#### 🐛 Bug Fixes

- [FIX] Fixed the condition for when federation API's `nodes_response_status` is `fail` [#126](https://github.com/neurobagel/query-tool/pull/126) ([@rmanaem](https://github.com/rmanaem))
- [FIX] Remove attributes with a NULL label [#124](https://github.com/neurobagel/query-tool/pull/124) ([@surchs](https://github.com/surchs))

#### 🏠 Internal

- [CI] Add .github to .prettierignore [#127](https://github.com/neurobagel/query-tool/pull/127) ([@alyssadai](https://github.com/alyssadai))

#### Authors: 3

- Alyssa Dai ([@alyssadai](https://github.com/alyssadai))
- Arman Jahanpour ([@rmanaem](https://github.com/rmanaem))
- Sebastian Urchs ([@surchs](https://github.com/surchs))

---

# v0.2.0 (Thu Apr 11 2024)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Sauradip Ghosh ([@Sauradip07](https://github.com/Sauradip07))

:heart: Yaroslav Halchenko ([@yarikoptic](https://github.com/yarikoptic))

### Release Notes

#### [MNT] Release new data model ([#118](https://github.com/neurobagel/query-tool/pull/118))

We have updated the Neurobagel data model to allow users to specify phenotypic information at the session level (https://github.com/neurobagel/planning/issues/83). This release updates the query tool so it can understand the new response from APIs.

---

#### 💥 Breaking Changes

- [ENH] Enabled pheno level session for response and query [#112](https://github.com/neurobagel/query-tool/pull/112) ([@rmanaem](https://github.com/rmanaem))
- [REF] Enable handling of partial node response success [#97](https://github.com/neurobagel/query-tool/pull/97) ([@rmanaem](https://github.com/rmanaem) [@surchs](https://github.com/surchs))

#### 🚀 Enhancements

- [MNT] Release new data model [#118](https://github.com/neurobagel/query-tool/pull/118) ([@rmanaem](https://github.com/rmanaem))
- [FIX] Reverted back to installing devdependencies along with dependencies [#117](https://github.com/neurobagel/query-tool/pull/117) ([@rmanaem](https://github.com/rmanaem))

#### 🐛 Bug Fixes

- [FIX] Fixed parsing of `NB_IS_FEDERATION_API` [#88](https://github.com/neurobagel/query-tool/pull/88) ([@rmanaem](https://github.com/rmanaem))

#### 🏠 Internal

- [CI] Set up docker nightly build [#114](https://github.com/neurobagel/query-tool/pull/114) ([@rmanaem](https://github.com/rmanaem))
- [MNT] Add dependabot.yml [#94](https://github.com/neurobagel/query-tool/pull/94) ([@Sauradip07](https://github.com/Sauradip07) [@rmanaem](https://github.com/rmanaem))
- [MNT] Removed `corePlugins` option from `prettier` config file [#87](https://github.com/neurobagel/query-tool/pull/87) ([@rmanaem](https://github.com/rmanaem))
- [CI] adding codespell: fixing one typo [#86](https://github.com/neurobagel/query-tool/pull/86) ([@yarikoptic](https://github.com/yarikoptic) [@rmanaem](https://github.com/rmanaem))
- [CI] Remove GH variable dependence for tests [#80](https://github.com/neurobagel/query-tool/pull/80) ([@surchs](https://github.com/surchs))
- [MNT] Add .prettierignore for CHANGELOG [#83](https://github.com/neurobagel/query-tool/pull/83) ([@surchs](https://github.com/surchs))

#### 📝 Documentation

- [DOC] Updated README.md [#89](https://github.com/neurobagel/query-tool/pull/89) ([@rmanaem](https://github.com/rmanaem))

#### Authors: 4

- Arman Jahanpour ([@rmanaem](https://github.com/rmanaem))
- Sauradip Ghosh ([@Sauradip07](https://github.com/Sauradip07))
- Sebastian Urchs ([@surchs](https://github.com/surchs))
- Yaroslav Halchenko ([@yarikoptic](https://github.com/yarikoptic))

---

# v0.1.0 (Thu Mar 07 2024)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Arman Jahanpour ([@rmanaem](https://github.com/rmanaem))

:heart: Sauradip Ghosh ([@Sauradip07](https://github.com/Sauradip07))

:heart: Abdul Samad Siddiqui ([@samadpls](https://github.com/samadpls))

:heart: Sebastian Urchs ([@surchs](https://github.com/surchs))

:heart: Deleted user ([@ghost](https://github.com/ghost))

### Release Notes

#### [MNT] Set the app version to `0.1.0` in package.json ([#53](https://github.com/neurobagel/query-tool/pull/53))

The first release of the tool refactored and reimplemented in React and TypeScript.

---

#### 💥 Breaking Changes

- [ENH] Implemented UI improvements [#16](https://github.com/neurobagel/query-tool/pull/16) ([@rmanaem](https://github.com/rmanaem) [@surchs](https://github.com/surchs))
- [ENH] Implemented logic for downloading result [#13](https://github.com/neurobagel/query-tool/pull/13) ([@rmanaem](https://github.com/rmanaem))
- [ENH] Implemented logic for parsing selection from the url search parameters [#12](https://github.com/neurobagel/query-tool/pull/12) ([@rmanaem](https://github.com/rmanaem))
- [ENH] Implemented logic for node selection [#10](https://github.com/neurobagel/query-tool/pull/10) ([@rmanaem](https://github.com/rmanaem))
- [ENH] Implemented query fields [#9](https://github.com/neurobagel/query-tool/pull/9) ([@rmanaem](https://github.com/rmanaem))
- [ENH] Created query prototype [#7](https://github.com/neurobagel/query-tool/pull/7) ([@rmanaem](https://github.com/rmanaem))

#### 🚀 Enhancements

- [ENH] Added Appzi widget [#32](https://github.com/neurobagel/query-tool/pull/32) ([@rmanaem](https://github.com/rmanaem))
- [MNT] Removed `CodeSee` workflow [#33](https://github.com/neurobagel/query-tool/pull/33) ([@rmanaem](https://github.com/rmanaem))
- [DOC] Update Copyright holders [#30](https://github.com/neurobagel/query-tool/pull/30) ([@surchs](https://github.com/surchs))
- Install the CodeSee workflow. [#23](https://github.com/neurobagel/query-tool/pull/23) (86324825+codesee-maps[bot]@users.noreply.github.com [@ghost](https://github.com/ghost))

#### 🐛 Bug Fixes

- [FIX] Fixed the performance issues caused by re-rendering [#39](https://github.com/neurobagel/query-tool/pull/39) ([@rmanaem](https://github.com/rmanaem))
- [FIX] Refactored syncing of the `URLSearchParams` and selected nodes [#25](https://github.com/neurobagel/query-tool/pull/25) ([@rmanaem](https://github.com/rmanaem))

#### 🏠 Internal

- [MNT] Set the app version to `0.1.0` in package.json [#53](https://github.com/neurobagel/query-tool/pull/53) ([@rmanaem](https://github.com/rmanaem))
- [MNT] Dockerized the app [#51](https://github.com/neurobagel/query-tool/pull/51) ([@rmanaem](https://github.com/rmanaem))
- [MNT] Added post-merge hook and updated scripts [#38](https://github.com/neurobagel/query-tool/pull/38) ([@Sauradip07](https://github.com/Sauradip07))
- [CI] Set up GitHub pages deployment CI [#50](https://github.com/neurobagel/query-tool/pull/50) ([@rmanaem](https://github.com/rmanaem))
- [CI] Set up ESLint CI [#47](https://github.com/neurobagel/query-tool/pull/47) ([@rmanaem](https://github.com/rmanaem))
- [CI]  Implement Prettier CI Check for Code Consistency [#44](https://github.com/neurobagel/query-tool/pull/44) ([@samadpls](https://github.com/samadpls))
- [MNT] Added `prettier` support [#35](https://github.com/neurobagel/query-tool/pull/35) ([@samadpls](https://github.com/samadpls))

#### ⚠️ Pushed to `main`

- Setup vitest ([@surchs](https://github.com/surchs))
- Setup Cypress ([@surchs](https://github.com/surchs))
- Setup Tailwind ([@surchs](https://github.com/surchs))
- Setup pre-commit for husky ([@surchs](https://github.com/surchs))
- Setup husky and lintstaged ([@surchs](https://github.com/surchs))
- Setup MUI component library ([@surchs](https://github.com/surchs))
- Setup airbnb eslint ([@surchs](https://github.com/surchs))
- Setup prettier ([@surchs](https://github.com/surchs))
- Vite setup ([@surchs](https://github.com/surchs))

####  🧪 Tests

- [MNT] Implemented component tests [#31](https://github.com/neurobagel/query-tool/pull/31) ([@rmanaem](https://github.com/rmanaem))
- [TST] Implemented e2e tests [#19](https://github.com/neurobagel/query-tool/pull/19) ([@rmanaem](https://github.com/rmanaem))

#### Authors: 6

- Abdul Samad Siddiqui ([@samadpls](https://github.com/samadpls))
- Arman Jahanpour ([@rmanaem](https://github.com/rmanaem))
- codesee-maps[bot] (86324825+codesee-maps[bot]@users.noreply.github.com)
- Deleted user ([@ghost](https://github.com/ghost))
- Sauradip Ghosh ([@Sauradip07](https://github.com/Sauradip07))
- Sebastian Urchs ([@surchs](https://github.com/surchs))
